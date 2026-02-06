"use client";
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { db } from '../../firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ShieldCheck,
  Users,
  Ticket,
  Search,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
  Plus,
  UserPlus,
  Ban,
  Clock,
  CreditCard,
  Zap,
  Star,
  Crown,
  Infinity,
} from 'lucide-react';

// Plan definitions for activation
const SUBSCRIPTION_PLANS = [
  { id: '1month', name: '1 Mes', months: 1, icon: Zap, color: 'blue' },
  { id: '3months', name: '3 Meses', months: 3, icon: Star, color: 'purple' },
  { id: '1year', name: '1 Año', months: 12, icon: Crown, color: 'amber' },
  { id: 'lifetime', name: 'Lifetime', months: null, icon: Infinity, color: 'green' },
];

// Generar código alfanumérico legible (sin I, O, 0, 1)
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function AdminPanel({ user, onClose }) {
  const { isDark } = useTheme();
  const [tab, setTab] = useState('users'); // 'users' | 'codes'
  const [users, setUsers] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activateEmail, setActivateEmail] = useState('');
  const [activating, setActivating] = useState(false);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Load users in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'authorized_users'),
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => {
          const dateA = a.authorizedAt?.toDate?.() || new Date(0);
          const dateB = b.authorizedAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        setUsers(data);
        setLoadingUsers(false);
      },
      (error) => {
        console.error('Error loading users:', error);
        setLoadingUsers(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Load codes in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'trial_codes'),
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        setCodes(data);
        setLoadingCodes(false);
      },
      (error) => {
        console.error('Error loading codes:', error);
        setLoadingCodes(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Activate user as trial (15 days)
  const activateTrial = async (email) => {
    const emailLower = email.toLowerCase().trim();
    if (!emailLower) return;
    setActivating(true);
    try {
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
      await setDoc(doc(db, 'authorized_users', emailLower), {
        email: emailLower,
        status: 'active',
        type: 'trial',
        trialStart: serverTimestamp(),
        trialEnd: trialEnd,
        authorizedAt: serverTimestamp(),
      }, { merge: true });
      setActivateEmail('');
    } catch (err) {
      console.error('Error activating trial:', err);
      alert('Error al activar trial: ' + err.message);
    }
    setActivating(false);
  };

  // Activate user with specific subscription plan
  const activateSubscription = async (email, planId) => {
    const emailLower = email.toLowerCase().trim();
    if (!emailLower) return;

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setActivating(true);
    try {
      const now = new Date();
      let subscriptionEnd = null;

      if (plan.months !== null) {
        // Calculate end date based on months
        subscriptionEnd = new Date(now);
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + plan.months);
      }

      await setDoc(doc(db, 'authorized_users', emailLower), {
        email: emailLower,
        status: 'active',
        type: plan.months === null ? 'lifetime' : 'subscription',
        subscriptionPlan: plan.id,
        subscriptionStart: serverTimestamp(),
        subscriptionEnd: subscriptionEnd,
        trialStart: null,
        trialEnd: null,
        authorizedAt: serverTimestamp(),
      }, { merge: true });
      setActivateEmail('');
    } catch (err) {
      console.error('Error activating subscription:', err);
      alert('Error al activar: ' + err.message);
    }
    setActivating(false);
  };

  // Activate user as paid (permanent) - legacy, now uses lifetime
  const activatePaid = async (email) => {
    await activateSubscription(email, 'lifetime');
  };

  // Deactivate user
  const deactivateUser = async (email) => {
    if (!confirm(`¿Desactivar acceso para ${email}?`)) return;
    try {
      await updateDoc(doc(db, 'authorized_users', email), {
        status: 'inactive',
      });
    } catch (err) {
      console.error('Error deactivating:', err);
    }
  };

  // Generate codes
  const generateCodes = async (count) => {
    setGeneratingCodes(true);
    try {
      for (let i = 0; i < count; i++) {
        const code = generateCode();
        await setDoc(doc(db, 'trial_codes', code), {
          code,
          createdAt: serverTimestamp(),
          createdBy: user.email,
          used: false,
          usedBy: null,
          usedAt: null,
        });
      }
    } catch (err) {
      console.error('Error generating codes:', err);
      alert('Error al generar códigos: ' + err.message);
    }
    setGeneratingCodes(false);
  };

  // Copy code to clipboard
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // Filter users
  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Code stats
  const availableCodes = codes.filter(c => !c.used).length;
  const usedCodes = codes.filter(c => c.used).length;

  // Days remaining helper
  const getDaysRemaining = (u) => {
    let endDate = null;
    if (u.type === 'trial' && u.trialEnd) {
      endDate = u.trialEnd?.toDate?.() || new Date(u.trialEnd);
    } else if (u.type === 'subscription' && u.subscriptionEnd) {
      endDate = u.subscriptionEnd?.toDate?.() || new Date(u.subscriptionEnd);
    }
    if (!endDate) return null;
    const now = new Date();
    const days = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Get plan name
  const getPlanName = (u) => {
    if (u.subscriptionPlan) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === u.subscriptionPlan);
      return plan?.name || u.subscriptionPlan;
    }
    return null;
  };

  // Status badge
  const StatusBadge = ({ u }) => {
    const type = u.type || 'paid';
    const daysLeft = getDaysRemaining(u);
    const planName = getPlanName(u);

    if (u.status === 'active' && type === 'trial') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          <Clock size={12} />
          Trial {daysLeft !== null ? `(${daysLeft}d)` : ''}
        </span>
      );
    }
    if (u.status === 'active' && type === 'subscription') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          <Star size={12} />
          {planName || 'Suscripción'} {daysLeft !== null ? `(${daysLeft}d)` : ''}
        </span>
      );
    }
    if (u.status === 'active' && (type === 'lifetime' || type === 'paid')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          <Infinity size={12} />
          Lifetime
        </span>
      );
    }
    if (u.status === 'expired') {
      return (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
          Expirado
        </span>
      );
    }
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
        Inactivo
      </span>
    );
  };

  const bg = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white';
  const border = isDark ? 'border-slate-700' : 'border-slate-200';
  const text = isDark ? 'text-white' : 'text-slate-800';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${cardBg} ${border}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-purple-500" />
            <h1 className={`font-bold ${text}`}>Panel de Admin</h1>
          </div>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
              isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className={`flex rounded-xl p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <button
            onClick={() => setTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              tab === 'users'
                ? `${cardBg} ${text} shadow-sm`
                : `${textMuted} hover:${text}`
            }`}
          >
            <Users size={16} />
            Usuarios ({users.length})
          </button>
          <button
            onClick={() => setTab('codes')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              tab === 'codes'
                ? `${cardBg} ${text} shadow-sm`
                : `${textMuted} hover:${text}`
            }`}
          >
            <Ticket size={16} />
            Códigos ({codes.length})
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="space-y-4">
            {/* Activate user section */}
            <div className={`p-4 rounded-xl border ${cardBg} ${border}`}>
              <h3 className={`text-sm font-bold mb-3 ${text}`}>Activar usuario</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                <input
                  type="email"
                  value={activateEmail}
                  onChange={e => setActivateEmail(e.target.value)}
                  placeholder="email@ejemplo.com"
                  className={`flex-1 min-w-[200px] px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                  } focus:outline-none focus:ring-2 focus:ring-purple-400`}
                />
                <button
                  onClick={() => activateTrial(activateEmail)}
                  disabled={activating || !activateEmail.trim()}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-1"
                >
                  {activating ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
                  Trial 15d
                </button>
              </div>
              {/* Subscription plan buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const Icon = plan.icon;
                  const colorClasses = {
                    blue: 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300',
                    purple: 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300',
                    amber: 'bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300',
                    green: 'bg-green-500 hover:bg-green-600 disabled:bg-green-300',
                  };
                  return (
                    <button
                      key={plan.id}
                      onClick={() => activateSubscription(activateEmail, plan.id)}
                      disabled={activating || !activateEmail.trim()}
                      className={`px-3 py-2 ${colorClasses[plan.color]} text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1`}
                    >
                      {activating ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
                      {plan.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por email..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-400`}
              />
            </div>

            {/* Users list */}
            {loadingUsers ? (
              <div className="text-center py-8">
                <Loader2 size={24} className="animate-spin text-purple-500 mx-auto" />
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map(u => (
                  <div key={u.id} className={`p-3 rounded-xl border ${cardBg} ${border}`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate ${text}`}>{u.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StatusBadge u={u} />
                          {u.authorizedAt && (
                            <span className={`text-xs ${textMuted}`}>
                              {(u.authorizedAt?.toDate?.() || new Date(u.authorizedAt)).toLocaleDateString('es-MX')}
                            </span>
                          )}
                          {u.codeUsed && (
                            <span className={`text-xs font-mono ${textMuted}`}>
                              Código: {u.codeUsed}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => activateTrial(u.email)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Trial 15 días"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => activateSubscription(u.email, '1month')}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="1 Mes"
                        >
                          <Zap size={16} />
                        </button>
                        <button
                          onClick={() => activateSubscription(u.email, '3months')}
                          className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors"
                          title="3 Meses"
                        >
                          <Star size={16} />
                        </button>
                        <button
                          onClick={() => activateSubscription(u.email, '1year')}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
                          title="1 Año"
                        >
                          <Crown size={16} />
                        </button>
                        <button
                          onClick={() => activateSubscription(u.email, 'lifetime')}
                          className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                          title="Lifetime"
                        >
                          <Infinity size={16} />
                        </button>
                        <button
                          onClick={() => deactivateUser(u.email)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Desactivar"
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className={`text-center py-6 text-sm ${textMuted}`}>
                    {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* CODES TAB */}
        {tab === 'codes' && (
          <div className="space-y-4">
            {/* Generate codes */}
            <div className={`p-4 rounded-xl border ${cardBg} ${border}`}>
              <h3 className={`text-sm font-bold mb-3 ${text}`}>Generar códigos de prueba</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => generateCodes(1)}
                  disabled={generatingCodes}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                >
                  {generatingCodes ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Generar 1 código
                </button>
                <button
                  onClick={() => generateCodes(5)}
                  disabled={generatingCodes}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                >
                  {generatingCodes ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Generar 5 códigos
                </button>
              </div>
              <div className="flex gap-4 mt-3">
                <span className={`text-xs ${textMuted}`}>
                  Disponibles: <span className="font-bold text-green-500">{availableCodes}</span>
                </span>
                <span className={`text-xs ${textMuted}`}>
                  Usados: <span className="font-bold text-slate-500">{usedCodes}</span>
                </span>
              </div>
            </div>

            {/* Codes list */}
            {loadingCodes ? (
              <div className="text-center py-8">
                <Loader2 size={24} className="animate-spin text-purple-500 mx-auto" />
              </div>
            ) : (
              <div className="space-y-2">
                {codes.map(c => (
                  <div key={c.id} className={`p-3 rounded-xl border ${cardBg} ${border}`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-sm tracking-widest ${text}`}>
                            {c.code}
                          </span>
                          {c.used ? (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                              Usado
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              Disponible
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {c.createdAt && (
                            <span className={`text-xs ${textMuted}`}>
                              Creado: {(c.createdAt?.toDate?.() || new Date(c.createdAt)).toLocaleDateString('es-MX')}
                            </span>
                          )}
                          {c.used && c.usedBy && (
                            <span className={`text-xs ${textMuted}`}>
                              Usado por: {c.usedBy}
                            </span>
                          )}
                        </div>
                      </div>
                      {!c.used && (
                        <button
                          onClick={() => copyCode(c.code)}
                          className={`p-2 rounded-lg transition-colors ${
                            copiedCode === c.code
                              ? 'text-green-500 bg-green-50'
                              : `${textMuted} hover:bg-slate-100`
                          }`}
                          title="Copiar código"
                        >
                          {copiedCode === c.code ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {codes.length === 0 && (
                  <p className={`text-center py-6 text-sm ${textMuted}`}>
                    No hay códigos generados. Usa el botón de arriba para crear nuevos.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
