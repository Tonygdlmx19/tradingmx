"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { db, auth } from '../firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, where, setDoc, updateDoc, getDoc
} from 'firebase/firestore';

import {
  LoginPage,
  LandingPage,
  Header,
  SettingsModal,
  TradeDetailModal,
  TradeForm,
  StatsCards,
  AdvancedStats,
  ViewSelector,
  EquityChart,
  DrawdownChart,
  TradesTable,
  EconomicCalendar,
  CalendarView,
  useTheme
} from './components';
import UnauthorizedScreen from './components/UnauthorizedScreen';
import AdminPanel from './components/AdminPanel';
import { FundingSimulator } from './components/funding';

const ADMIN_EMAIL = 'tonytrader19@gmail.com';

export default function TradingJournalPRO() {
  const { isDark } = useTheme();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFundingSimulator, setShowFundingSimulator] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking' | 'active' | 'expired' | 'unauthorized'
  const [config, setConfig] = useState({ capitalInicial: 10000, metaDiaria: 200 });
  const [trades, setTrades] = useState([]);
  const [viewMode, setViewMode] = useState('global');
  const [displayMode, setDisplayMode] = useState('tabla'); // 'tabla' | 'calendario'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showTradeDetail, setShowTradeDetail] = useState(false);
  
  const [form, setForm] = useState({
    res: '',
    esGanancia: true,
    emo: 'Neutral',
    activo: 'MNQ',
    dir: 'Long',
    lotes: '1',
    entrada: '',
    salida: '',
    seguiPlan: false,
    respetoRiesgo: false,
    notas: '',
    imagen: null,
  });

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[AUTH] Estado:', currentUser?.email || 'sin usuario');

      if (currentUser) {
        // Verificar autorización ANTES de actualizar el estado del usuario
        try {
          const email = currentUser.email?.toLowerCase();
          const authDocRef = doc(db, "authorized_users", email);
          const authDoc = await getDoc(authDocRef);

          if (authDoc.exists()) {
            const data = authDoc.data();
            const userType = data.type || 'paid'; // backwards compat

            if (data.status === 'active') {
              if (userType === 'trial') {
                const now = new Date();
                const trialEnd = data.trialEnd?.toDate?.() || new Date(data.trialEnd);
                if (now > trialEnd) {
                  await updateDoc(authDocRef, { status: 'expired' });
                  setIsAuthorized(false);
                  setAuthStatus('expired');
                } else {
                  setIsAuthorized(true);
                  setAuthStatus('active');
                }
              } else {
                setIsAuthorized(true);
                setAuthStatus('active');
              }
            } else {
              setIsAuthorized(false);
              setAuthStatus(data.status === 'expired' ? 'expired' : 'unauthorized');
            }
          } else {
            setIsAuthorized(false);
            setAuthStatus('unauthorized');
          }

          console.log('[AUTH] Autorizado:', authDoc.exists() && authDoc.data()?.status === 'active');
          setUser(currentUser);
        } catch (error) {
          console.error('[AUTH] Error auth:', error);
          setIsAuthorized(false);
          setAuthStatus('unauthorized');
          setUser(currentUser);
        }
      } else {
        setUser(null);
        setIsAuthorized(false);
        setAuthStatus('checking');
      }
      setCheckingAuth(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Actualizar activo por defecto cuando cambien los favoritos
  useEffect(() => {
    if (config.activosFavoritos && config.activosFavoritos.length > 0) {
      // Solo actualizar si el activo actual no está en favoritos
      if (!config.activosFavoritos.includes(form.activo)) {
        setForm(prev => ({ ...prev, activo: config.activosFavoritos[0] }));
      }
    }
  }, [config.activosFavoritos]);

  useEffect(() => {
    if (!user || !isAuthorized) return;

    const unsubConfig = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.config) setConfig(data.config);
      } else {
        setDoc(doc(db, "users", user.uid), {
          config: { capitalInicial: 10000, metaDiaria: 200 }
        }, { merge: true });
      }
    });

    const q = query(
      collection(db, "trades"), 
      where("uid", "==", user.uid), 
      orderBy("fecha", "asc")
    );
    const unsubTrades = onSnapshot(q, (snapshot) => {
      const tradesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrades(tradesData);
      setLoading(false);
    });

    return () => { unsubConfig(); unsubTrades(); };
  }, [user, isAuthorized]);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const saveSettingsToCloud = useCallback(async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { config }, { merge: true });
  }, [user, config]);

  const addTrade = useCallback(async (e) => {
    e.preventDefault();
    if (!form.res || form.res === '') {
      alert("Debes ingresar el resultado del trade.");
      return;
    }
    
    // Aplicar signo según el toggle WIN/LOSS
    const resultadoFinal = form.esGanancia !== false 
      ? Math.abs(parseFloat(form.res)) 
      : -Math.abs(parseFloat(form.res));
    
    const tradeData = {
      uid: user.uid,
      fecha: new Date().toISOString().split('T')[0],
      activo: form.activo,
      dir: form.dir,
      res: resultadoFinal,
      lotes: form.lotes ? parseFloat(form.lotes) : 1,
      entrada: form.entrada ? parseFloat(form.entrada) : null,
      salida: form.salida ? parseFloat(form.salida) : null,
      emo: form.emo,
      seguiPlan: form.seguiPlan,
      respetoRiesgo: form.respetoRiesgo,
      notas: form.notas || '',
      imagenes: form.imagenes || [],
      checklist: form.checklist || null,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, "trades"), tradeData);
    
    setForm({
      ...form,
      res: '',
      esGanancia: true,
      lotes: '1',
      entrada: '',
      salida: '',
      emo: 'Neutral',
      seguiPlan: false,
      respetoRiesgo: false,
      notas: '',
      imagenes: [],
      checklist: null,
    });
  }, [form, user]);

  const deleteTrade = useCallback(async (id) => {
    await deleteDoc(doc(db, "trades", id));
  }, []);

  const updateTrade = useCallback(async (id, updates) => {
    await updateDoc(doc(db, "trades", id), updates);
    if (selectedTrade && selectedTrade.id === id) {
      setSelectedTrade({ ...selectedTrade, ...updates });
    }
  }, [selectedTrade]);

  const handleTradeClick = useCallback((trade) => {
    setSelectedTrade(trade);
    setShowTradeDetail(true);
  }, []);

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const [y, m] = t.fecha.split('-').map(Number);
      if (viewMode === 'global') return y === selectedYear;
      return y === selectedYear && (m - 1) === selectedMonth;
    });
  }, [trades, viewMode, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const tradesPrevios = trades.filter(t => {
      const [y, m] = t.fecha.split('-').map(Number);
      if (viewMode === 'global') return y < selectedYear;
      return (y < selectedYear) || (y === selectedYear && (m - 1) < selectedMonth);
    });
    
    const pnlPrevio = tradesPrevios.reduce((acc, t) => acc + parseFloat(t.res), 0);
    const startBalance = config.capitalInicial + pnlPrevio;
    
    let currentBalance = startBalance;
    let maxBal = startBalance;
    let grossWin = 0, grossLoss = 0;
    let winCount = 0;
    
    const data = [{ name: 'Inicio', bal: startBalance, dd: 0 }];
    const sortedTrades = [...filteredTrades].sort((a, b) => {
      const dateCompare = new Date(a.fecha) - new Date(b.fecha);
      if (dateCompare !== 0) return dateCompare;
      // Si la fecha es igual, ordenar por hora de creación
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return aTime - bTime;
    });
    
    sortedTrades.forEach((t, i) => {
      const r = parseFloat(t.res);
      currentBalance += r;
      if (r > 0) { grossWin += r; winCount++; }
      else { grossLoss += Math.abs(r); }
      if (currentBalance > maxBal) maxBal = currentBalance;
      const dd = maxBal > 0 ? ((maxBal - currentBalance) / maxBal) * 100 : 0;
      data.push({ name: `T${i + 1}`, bal: currentBalance, dd: -parseFloat(dd.toFixed(2)), rawDD: dd });
    });
    
    const totalPnl = currentBalance - startBalance;
    const winRate = sortedTrades.length ? ((winCount / sortedTrades.length) * 100) : 0;
    const maxDD = Math.max(...data.map(d => d.rawDD || 0));
    const profitFactor = grossLoss === 0 ? grossWin : (grossWin / grossLoss);
    
    return {
      balance: currentBalance,
      startBalance,
      totalPnl,
      winRate,
      maxDD,
      profitFactor,
      data,
      tradeCount: sortedTrades.length
    };
  }, [filteredTrades, trades, config, viewMode, selectedMonth, selectedYear]);

  const todayStr = new Date().toISOString().split('T')[0];
  const pnlHoy = trades.filter(t => t.fecha === todayStr).reduce((acc, t) => acc + t.res, 0);
  const progresoMeta = Math.min((pnlHoy / config.metaDiaria) * 100, 100);
  const metaDiariaPct = config.capitalInicial > 0
    ? ((config.metaDiaria / config.capitalInicial) * 100).toFixed(1)
    : 0;

  if (loading || checkingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return <LoginPage onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  // Usuario logueado pero no autorizado
  if (!isAuthorized) {
    return <UnauthorizedScreen user={user} onLogout={handleLogout} authStatus={authStatus} />;
  }

  // Mostrar panel de admin
  if (showAdminPanel && isAdmin) {
    return <AdminPanel user={user} onClose={() => setShowAdminPanel(false)} />;
  }

  // Mostrar simulador de fondeo
  if (showFundingSimulator) {
    return (
      <FundingSimulator
        user={user}
        onClose={() => setShowFundingSimulator(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-slate-100'
    }`}>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        setConfig={setConfig}
        onSaveToCloud={saveSettingsToCloud}
      />
      
      <TradeDetailModal
        trade={selectedTrade}
        isOpen={showTradeDetail}
        onClose={() => {
          setShowTradeDetail(false);
          setSelectedTrade(null);
        }}
        onUpdate={updateTrade}
        onDelete={deleteTrade}
      />

      <Header
        user={user}
        config={config}
        pnlHoy={pnlHoy}
        metaDiaria={config.metaDiaria}
        metaDiariaPct={metaDiariaPct}
        progresoMeta={progresoMeta}
        onSettings={() => setShowSettings(true)}
        onCalendar={() => setShowCalendar(true)}
        onFundingSimulator={() => setShowFundingSimulator(true)}
        isAdmin={isAdmin}
        onAdmin={() => setShowAdminPanel(true)}
        onLogout={handleLogout}
      />

      <EconomicCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-9 space-y-6 lg:space-y-8 order-2 lg:order-1">
            <StatsCards stats={stats} />
            <AdvancedStats trades={filteredTrades} capitalInicial={config.capitalInicial} balance={stats.balance} />
            <div className="space-y-6">
              <EquityChart data={stats.data} startBalance={stats.startBalance} />
              <DrawdownChart data={stats.data} />
            </div>
            <ViewSelector
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              tradeCount={stats.tradeCount}
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
            />
            {displayMode === 'tabla' ? (
              <TradesTable
                trades={filteredTrades}
                onTradeClick={handleTradeClick}
              />
            ) : (
              <CalendarView
                trades={filteredTrades}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onTradeClick={handleTradeClick}
              />
            )}
          </div>

          <div className="lg:col-span-3 space-y-6 order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <TradeForm onSubmit={addTrade} form={form} setForm={setForm} activosFavoritos={config.activosFavoritos} reglasSetup={config.reglasSetup || []} />
          </div>
        </div>
      </main>
    </div>
  );
}