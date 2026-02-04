"use client";
import { useState, useEffect, useMemo } from 'react';
import { Trophy, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { db } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { verificarEstadoChallenge } from '../../utils/fundingCalculations';
import FundingSetupModal from './FundingSetupModal';
import FundingDashboard from './FundingDashboard';

export default function FundingSimulator({ user, onClose }) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [trades, setTrades] = useState([]);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Cargar challenge activo del usuario
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    console.log('[FUNDING] Init, uid:', user.uid);
    let resolved = false;

    const q = query(
      collection(db, 'funding_challenges'),
      where('uid', '==', user.uid)
    );

    const processSnapshot = (docs) => {
      resolved = true;
      const activeDocs = docs.filter(d => d.estado === 'activo');
      console.log('[FUNDING] Active:', activeDocs.length, 'of', docs.length, 'total');
      if (activeDocs.length === 0) {
        setChallenge(null);
        setTrades([]);
      } else {
        const sorted = activeDocs.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        setChallenge(sorted[0]);
      }
      setLoading(false);
    };

    // Timeout: si después de 5s no hay respuesta, algo está mal
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.error('[FUNDING] TIMEOUT: Firestore no respondió en 5s. Posible problema de permisos.');
        setLoading(false);
      }
    }, 5000);

    // Listener para cambios en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      clearTimeout(timeout);
      console.log('[FUNDING] Snapshot:', snapshot.size, 'docs');
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      processSnapshot(docs);
    }, (error) => {
      clearTimeout(timeout);
      console.error('[FUNDING] Error:', error.code, error.message);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [user?.uid]);

  // Cargar trades del challenge activo
  useEffect(() => {
    if (!challenge?.id || !user?.uid) {
      setTrades([]);
      return;
    }

    const q = query(
      collection(db, 'funding_trades'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(t => t.challengeId === challenge.id);
      // Ordenar en el cliente
      tradesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateA - dateB;
      });
      setTrades(tradesData);
    }, (error) => {
      console.error('Error loading trades:', error);
      setTrades([]);
    });

    return () => unsubscribe();
  }, [challenge?.id, user?.uid]);

  // Calcular estado del challenge
  const estadoChallenge = useMemo(() => {
    if (!challenge) return null;
    return verificarEstadoChallenge(challenge, trades);
  }, [challenge, trades]);

  // Actualizar estado del challenge si cambió
  useEffect(() => {
    if (!challenge?.id || !estadoChallenge) return;
    // No actualizar si fechaInicio aún no se resolvió (serverTimestamp pendiente)
    if (!challenge.fechaInicio) return;
    if (challenge.estado !== estadoChallenge.estado) {
      const challengeRef = doc(db, 'funding_challenges', challenge.id);
      updateDoc(challengeRef, {
        estado: estadoChallenge.estado,
        motivoFallo: estadoChallenge.motivoFallo || null,
        updatedAt: serverTimestamp(),
      }).catch(console.error);
    }
  }, [challenge?.id, challenge?.estado, challenge?.fechaInicio, estadoChallenge?.estado, estadoChallenge?.motivoFallo]);

  // Crear nuevo challenge
  const handleCreateChallenge = async (challengeData) => {
    console.log('[FUNDING] handleCreateChallenge called, uid:', user?.uid);
    if (!user?.uid) throw new Error('Usuario no autenticado');

    // Si hay un challenge activo, marcarlo como abandonado
    if (challenge?.id) {
      console.log('[FUNDING] Abandoning current challenge:', challenge.id);
      await updateDoc(doc(db, 'funding_challenges', challenge.id), {
        estado: 'abandonado',
        updatedAt: serverTimestamp(),
      });
    }

    // Crear nuevo challenge
    console.log('[FUNDING] Creating new challenge...');
    const docRef = await addDoc(collection(db, 'funding_challenges'), {
      uid: user.uid,
      empresa: challengeData.empresa,
      nombreChallenge: challengeData.nombreChallenge,
      reglas: challengeData.reglas,
      estado: 'activo',
      fechaInicio: serverTimestamp(),
      motivoFallo: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('[FUNDING] Challenge created with id:', docRef.id);

    setShowSetupModal(false);
  };

  // Agregar trade
  const handleAddTrade = async (tradeData) => {
    if (!challenge?.id || !user?.uid) return;

    try {
      await addDoc(collection(db, 'funding_trades'), {
        ...tradeData,
        uid: user.uid,
        challengeId: challenge.id,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };

  // Eliminar trade
  const handleDeleteTrade = async (tradeId) => {
    if (!tradeId) return;

    try {
      await deleteDoc(doc(db, 'funding_trades', tradeId));
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  // Reiniciar challenge (crear uno nuevo con las mismas reglas)
  const handleResetChallenge = async () => {
    if (!challenge) {
      setShowSetupModal(true);
      return;
    }

    const confirmReset = window.confirm(
      '¿Estás seguro de reiniciar el challenge? Se creará uno nuevo con las mismas reglas.'
    );

    if (!confirmReset) return;

    // Marcar el actual como abandonado y crear uno nuevo
    await handleCreateChallenge({
      empresa: challenge.empresa,
      nombreChallenge: challenge.nombreChallenge,
      reglas: challenge.reglas,
    });
  };

  // Abandonar challenge (volver a la pantalla de selección)
  const handleAbandonChallenge = async () => {
    if (!challenge?.id) return;

    const confirmAbandon = window.confirm(
      '¿Estás seguro de abandonar este challenge? Podrás crear uno nuevo con diferentes reglas.'
    );

    if (!confirmAbandon) return;

    try {
      await updateDoc(doc(db, 'funding_challenges', challenge.id), {
        estado: 'abandonado',
        updatedAt: serverTimestamp(),
      });
      setChallenge(null);
      setTrades([]);
    } catch (error) {
      console.error('Error abandoning challenge:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-amber-500 mx-auto mb-3"/>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cargando simulador...</p>
        </div>
      </div>
    );
  }

  // Sin challenge activo - mostrar pantalla de bienvenida
  if (!challenge) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={24} className="text-amber-500"/>
              <h1 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Simulador de Fondeo
              </h1>
            </div>
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Volver al Journal
            </button>
          </div>
        </div>

        {/* Welcome */}
        <div className="max-w-md mx-auto p-6 mt-20 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isDark ? 'bg-amber-500/20' : 'bg-amber-100'
          }`}>
            <Trophy size={40} className="text-amber-500"/>
          </div>

          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Practica para tu Challenge
          </h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Simula un challenge de fondeo con reglas reales. Registra tus trades y ve si lo pasarias antes de arriesgar tu dinero.
          </p>

          <button
            onClick={() => setShowSetupModal(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus size={18} className="inline mr-2"/>
            Crear Challenge
          </button>

          <div className={`mt-8 p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-700'}`}>
              Empresas disponibles:
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {['FTMO', 'MyForexFunds', 'Funded Next', 'E8', 'TFF'].map(emp => (
                <span
                  key={emp}
                  className={`text-xs px-3 py-1 rounded-full ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {emp}
                </span>
              ))}
              <span className={`text-xs px-3 py-1 rounded-full ${
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
              }`}>
                + Personalizado
              </span>
            </div>
          </div>
        </div>

        {/* Setup Modal */}
        <FundingSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onCreateChallenge={handleCreateChallenge}
        />
      </div>
    );
  }

  // Challenge activo - mostrar dashboard
  return (
    <>
      <FundingDashboard
        challenge={challenge}
        trades={trades}
        estadoChallenge={estadoChallenge}
        onAddTrade={handleAddTrade}
        onDeleteTrade={handleDeleteTrade}
        onResetChallenge={handleResetChallenge}
        onAbandonChallenge={handleAbandonChallenge}
        onClose={onClose}
      />

      {/* Setup Modal para nuevo challenge */}
      <FundingSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onCreateChallenge={handleCreateChallenge}
      />
    </>
  );
}
