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
  EquityChart,
  DrawdownChart,
  EconomicCalendar,
  CalendarView,
  useTheme,
  TradingAcademy
} from './components';
import MovementsModal from './components/MovementsModal';
import UnauthorizedScreen from './components/UnauthorizedScreen';
import AdminPanel from './components/AdminPanel';
import TrialExpiringAlert from './components/TrialExpiringAlert';
import OnboardingTour from './components/OnboardingTour';
import { celebrateWin, celebrateStreak, celebrateGoal, triggerFlash } from './utils/animations';
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
  const [showAcademy, setShowAcademy] = useState(false);
  const [showMovements, setShowMovements] = useState(false);
  const [movements, setMovements] = useState([]);
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking' | 'active' | 'expired' | 'unauthorized'
  const [userTrialEnd, setUserTrialEnd] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [config, setConfig] = useState({ capitalInicial: 10000, metaDiaria: 200 });
  const [trades, setTrades] = useState([]);
  const [viewMode] = useState('mensual'); // Siempre mensual para coincidir con el calendario
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showTradeDetail, setShowTradeDetail] = useState(false);
  const [forceTourStart, setForceTourStart] = useState(false);
  const [diasNoOperativos, setDiasNoOperativos] = useState([]); // Array de fechas 'YYYY-MM-DD'
  const [selectedAccountId, setSelectedAccountId] = useState(null); // Se auto-selecciona la primera cuenta
  const [goalCelebratedToday, setGoalCelebratedToday] = useState(false); // Track if goal was celebrated today

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
            const currentUserType = data.type || 'paid'; // backwards compat
            setUserType(currentUserType);
            setUserPlan(data.subscriptionPlan || null);

            if (data.status === 'active') {
              const now = new Date();
              let isExpired = false;

              // Check trial expiration
              if (currentUserType === 'trial' && data.trialEnd) {
                const trialEnd = data.trialEnd?.toDate?.() || new Date(data.trialEnd);
                setUserTrialEnd(data.trialEnd);
                if (now > trialEnd) {
                  isExpired = true;
                }
              }

              // Check subscription expiration
              if (currentUserType === 'subscription' && data.subscriptionEnd) {
                const subscriptionEnd = data.subscriptionEnd?.toDate?.() || new Date(data.subscriptionEnd);
                if (now > subscriptionEnd) {
                  isExpired = true;
                }
              }

              if (isExpired) {
                await updateDoc(authDocRef, { status: 'expired' });
                setIsAuthorized(false);
                setAuthStatus('expired');
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

  // Auto-seleccionar la primera cuenta si no hay ninguna seleccionada
  useEffect(() => {
    const cuentas = config.cuentasBroker || [];
    if (cuentas.length > 0 && !selectedAccountId) {
      setSelectedAccountId(cuentas[0].id);
    }
  }, [config.cuentasBroker, selectedAccountId]);

  useEffect(() => {
    if (!user || !isAuthorized) return;

    const unsubConfig = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.config) setConfig(data.config);
        if (data.diasNoOperativos) setDiasNoOperativos(data.diasNoOperativos);
      } else {
        setDoc(doc(db, "users", user.uid), {
          config: { capitalInicial: 10000, metaDiaria: 200 },
          diasNoOperativos: []
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

    // Suscripción a movimientos de capital (depósitos/retiros)
    const qMovements = query(
      collection(db, "movements"),
      where("uid", "==", user.uid),
      orderBy("fecha", "asc")
    );
    const unsubMovements = onSnapshot(qMovements, (snapshot) => {
      const movementsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovements(movementsData);
    });

    return () => { unsubConfig(); unsubTrades(); unsubMovements(); };
  }, [user, isAuthorized]);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const saveSettingsToCloud = useCallback(async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { config }, { merge: true });
  }, [user, config]);

  const addTrade = useCallback(async (e, opciones = {}) => {
    e.preventDefault();

    // Usar resultado calculado si viene de opciones binarias, sino usar form.res
    const resultado = opciones.resCalculado !== undefined ? opciones.resCalculado : form.res;

    if (resultado === '' || resultado === undefined || resultado === null) {
      alert("Debes ingresar el resultado del trade.");
      return;
    }

    // Aplicar signo según el toggle WIN/LOSS
    // El swap se guarda aparte y se descuenta del balance, NO del trade
    const resultadoFinal = form.esGanancia !== false
      ? Math.abs(parseFloat(resultado))
      : -Math.abs(parseFloat(resultado));

    const swapComision = parseFloat(form.swap) || 0;
    
    // Usar fechaSalida como fecha principal para compatibilidad
    const hoy = new Date().toISOString().split('T')[0];
    const fechaEntrada = form.fechaEntrada || hoy;
    const fechaSalida = form.fechaSalida || hoy;

    // Obtener info de la cuenta seleccionada
    const cuentaSeleccionada = form.cuentaId
      ? (config.cuentasBroker || []).find(c => c.id === form.cuentaId)
      : null;

    // Calcular puntos según dirección
    let puntos = null;
    if (form.entrada && form.salida) {
      const entrada = parseFloat(form.entrada);
      const salida = parseFloat(form.salida);
      puntos = form.dir === 'Long' ? salida - entrada : entrada - salida;
    }

    const tradeData = {
      uid: user.uid,
      fecha: fechaSalida, // Fecha principal (cierre)
      fechaEntrada: fechaEntrada,
      fechaSalida: fechaSalida,
      hora: form.hora || null,
      activo: form.activo,
      dir: form.dir,
      res: resultadoFinal,
      lotes: form.lotes ? parseFloat(form.lotes) : 1,
      entrada: form.entrada ? parseFloat(form.entrada) : null,
      salida: form.salida ? parseFloat(form.salida) : null,
      puntos: puntos,
      emo: form.emo,
      seguiPlan: form.seguiPlan,
      respetoRiesgo: form.respetoRiesgo,
      notas: form.notas || '',
      imagenes: form.imagenes || [],
      checklist: form.checklist || null,
      swap: swapComision,
      cuentaId: form.cuentaId || null,
      broker: cuentaSeleccionada?.broker || null,
      numeroCuenta: cuentaSeleccionada?.numero || null,
      preTradeAnalysis: form.preTradeAnalysis || null,
      preTradeImage: form.preTradeImage || null,
      preTradeDescription: form.preTradeDescription || null,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, "trades"), tradeData);

    // Trigger animations based on trade result
    if (resultadoFinal >= 0) {
      // Calculate current winning streak
      let currentStreak = 1;
      const sortedTrades = [...trades].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      for (const t of sortedTrades) {
        if (t.res >= 0) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Winning trade - celebrate!
      celebrateWin(Math.abs(resultadoFinal));
      triggerFlash('trade-form', 'success');

      // Extra celebration for streaks
      if (currentStreak >= 3) {
        setTimeout(() => {
          celebrateStreak(currentStreak);
        }, 1500);
      }
    } else {
      // Losing trade - subtle feedback
      triggerFlash('trade-form', 'error');
    }

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
      swap: '',
      preTradeAnalysis: null,
      preTradeImage: null,
      preTradeDescription: null,
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

  // Toggle día no operativo
  const toggleDiaNoOperativo = useCallback(async (fecha) => {
    if (!user) return;

    const newDias = diasNoOperativos.includes(fecha)
      ? diasNoOperativos.filter(d => d !== fecha)
      : [...diasNoOperativos, fecha];

    setDiasNoOperativos(newDias);

    // Guardar en Firestore
    try {
      await updateDoc(doc(db, "users", user.uid), {
        diasNoOperativos: newDias
      });
    } catch (error) {
      console.error('Error guardando día no operativo:', error);
    }
  }, [user, diasNoOperativos]);

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const exitDate = t.fechaSalida || t.fecha;
      const entryDate = t.fechaEntrada || t.fecha;

      const [exitY, exitM] = exitDate.split('-').map(Number);
      const [entryY, entryM] = entryDate.split('-').map(Number);

      if (viewMode === 'global') {
        // En vista global, incluir si cualquier parte del trade está en el año
        return exitY === selectedYear || entryY === selectedYear;
      }

      // En vista mensual, incluir si:
      // 1. El trade cierra en este mes
      // 2. El trade abre en este mes
      // 3. El trade cruza este mes (abre antes, cierra después)
      const isExitInMonth = exitY === selectedYear && (exitM - 1) === selectedMonth;
      const isEntryInMonth = entryY === selectedYear && (entryM - 1) === selectedMonth;

      // Para swing trades que cruzan el mes
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
      const tradeEntry = new Date(entryDate);
      const tradeExit = new Date(exitDate);
      const crossesMonth = tradeEntry <= monthEnd && tradeExit >= monthStart;

      return isExitInMonth || isEntryInMonth || crossesMonth;
    });
  }, [trades, viewMode, selectedMonth, selectedYear]);

  // Obtener cuenta seleccionada
  const selectedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    return (config.cuentasBroker || []).find(c => c.id === selectedAccountId) || null;
  }, [selectedAccountId, config.cuentasBroker]);

  // Símbolo de moneda de la cuenta seleccionada
  const currencySymbol = useMemo(() => {
    if (!selectedAccount) return '$';
    const divisa = selectedAccount.divisa || 'USD';
    const symbols = { USD: '$', MXN: 'MX$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', CHF: 'CHF ' };
    return symbols[divisa] || '$';
  }, [selectedAccount]);

  // Filtrar trades por cuenta seleccionada
  const accountFilteredTrades = useMemo(() => {
    if (!selectedAccountId) return filteredTrades; // Sin filtro = todos
    return filteredTrades.filter(t => t.cuentaId === selectedAccountId);
  }, [filteredTrades, selectedAccountId]);

  // Filtrar movimientos por cuenta seleccionada
  const accountFilteredMovements = useMemo(() => {
    if (!selectedAccountId) return movements; // Sin filtro = todos
    return movements.filter(m => {
      if (m.type === 'transfer') {
        return m.fromCuentaId === selectedAccountId || m.toCuentaId === selectedAccountId;
      }
      return m.cuentaId === selectedAccountId;
    });
  }, [movements, selectedAccountId]);

  // Calcular stats para la cuenta seleccionada
  const stats = useMemo(() => {
    // Verificar si la cuenta tiene depósitos o transferencias entrantes
    const hasIncomingMovements = selectedAccountId
      ? accountFilteredMovements.some(m =>
          m.type === 'deposit' ||
          (m.type === 'transfer' && m.toCuentaId === selectedAccountId)
        )
      : movements.some(m => m.type === 'deposit');

    // Capital inicial:
    // - Si hay depósitos/transferencias → usar 0 (los movimientos son el capital)
    // - Si NO hay movimientos → usar saldoInicial manual
    let capitalInicial = 0;
    if (selectedAccount) {
      if (hasIncomingMovements) {
        // La cuenta tiene depósitos/transferencias, esos son el capital inicial
        capitalInicial = 0;
      } else {
        // Sin movimientos, usar saldoInicial manual
        capitalInicial = parseFloat(selectedAccount.saldoInicial) || 0;
      }
    } else {
      // Sin cuenta seleccionada
      if (hasIncomingMovements) {
        capitalInicial = 0;
      } else {
        const sumaSaldos = (config.cuentasBroker || []).reduce((sum, c) => sum + (parseFloat(c.saldoInicial) || 0), 0);
        capitalInicial = sumaSaldos > 0 ? sumaSaldos : (config.capitalInicial || 0);
      }
    }

    // Trades para el periodo seleccionado (ya filtrados por cuenta)
    const allAccountTrades = selectedAccountId
      ? trades.filter(t => t.cuentaId === selectedAccountId)
      : trades;

    // Filtrar trades y movimientos de periodos anteriores
    const tradesPrevios = allAccountTrades.filter(t => {
      const [y, m] = t.fecha.split('-').map(Number);
      if (viewMode === 'global') return y < selectedYear;
      return (y < selectedYear) || (y === selectedYear && (m - 1) < selectedMonth);
    });

    const movementsPrevios = accountFilteredMovements.filter(m => {
      const [y, mo] = m.fecha.split('-').map(Number);
      if (viewMode === 'global') return y < selectedYear;
      return (y < selectedYear) || (y === selectedYear && (mo - 1) < selectedMonth);
    });

    // Filtrar movimientos del periodo actual
    const periodMovements = accountFilteredMovements.filter(m => {
      const [y, mo] = m.fecha.split('-').map(Number);
      if (viewMode === 'global') return y === selectedYear;
      return y === selectedYear && (mo - 1) === selectedMonth;
    });

    // Calcular impacto de periodos anteriores
    const pnlPrevio = tradesPrevios.reduce((acc, t) => acc + parseFloat(t.res), 0);

    let depositsPrevio = 0;
    let withdrawalsPrevio = 0;
    movementsPrevios.forEach(m => {
      if (m.type === 'deposit') {
        depositsPrevio += m.amount;
      } else if (m.type === 'withdrawal') {
        withdrawalsPrevio += m.amount;
      } else if (m.type === 'transfer') {
        if (m.fromCuentaId === selectedAccountId) {
          withdrawalsPrevio += m.amount;
        }
        if (m.toCuentaId === selectedAccountId) {
          depositsPrevio += m.amountConverted || m.amount;
        }
        // Si no hay cuenta seleccionada, las transferencias no afectan el total
      }
    });

    const startBalance = capitalInicial + pnlPrevio + depositsPrevio - withdrawalsPrevio;

    let currentBalance = startBalance;
    let maxBal = startBalance;
    let grossWin = 0, grossLoss = 0;
    let winCount = 0;

    const data = [{ name: 'Inicio', bal: startBalance, dd: 0 }];

    // Combinar trades y movimientos ordenados cronológicamente
    const sortedTrades = [...accountFilteredTrades].map(t => ({ ...t, eventType: 'trade' }));
    const sortedMovements = [...periodMovements].map(m => ({ ...m, eventType: m.type }));
    const allEvents = [...sortedTrades, ...sortedMovements].sort((a, b) => {
      const dateCompare = new Date(a.fecha) - new Date(b.fecha);
      if (dateCompare !== 0) return dateCompare;
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return aTime - bTime;
    });

    // Métricas
    let totalPuntos = 0, puntosGanadores = 0, puntosPerdedores = 0, tradesConPuntos = 0;
    let totalSwap = 0, tradeIndex = 0, depositIndex = 0, withdrawalIndex = 0;
    let depositsTotal = 0, withdrawalsTotal = 0;

    allEvents.forEach((event) => {
      if (event.eventType === 'trade') {
        const r = parseFloat(event.res);
        const swap = parseFloat(event.swap) || 0;
        totalSwap += swap;
        currentBalance += r - swap;
        if (r > 0) { grossWin += r; winCount++; }
        else { grossLoss += Math.abs(r); }
        if (currentBalance > maxBal) maxBal = currentBalance;
        const dd = maxBal > 0 ? ((maxBal - currentBalance) / maxBal) * 100 : 0;

        if (event.puntos !== null && event.puntos !== undefined) {
          totalPuntos += event.puntos;
          tradesConPuntos++;
          if (r > 0) puntosGanadores += event.puntos;
          else puntosPerdedores += event.puntos;
        }

        const tradeTime = event.createdAt?.toDate ? event.createdAt.toDate() : new Date(event.createdAt || event.fecha);
        const hora = tradeTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        tradeIndex++;
        data.push({
          name: `T${tradeIndex}`,
          bal: currentBalance,
          dd: -parseFloat(dd.toFixed(2)),
          rawDD: dd,
          fecha: event.fechaSalida || event.fecha,
          hora: hora
        });
      } else if (event.eventType === 'deposit') {
        currentBalance += event.amount;
        depositsTotal += event.amount;
        if (currentBalance > maxBal) maxBal = currentBalance;
        const dd = maxBal > 0 ? ((maxBal - currentBalance) / maxBal) * 100 : 0;
        depositIndex++;
        data.push({
          name: `D${depositIndex}`,
          bal: currentBalance,
          dd: -parseFloat(dd.toFixed(2)),
          rawDD: dd,
          fecha: event.fecha,
          hora: event.hora || '',
          isMovement: true,
          movementType: 'deposit',
          amount: event.amount
        });
      } else if (event.eventType === 'withdrawal') {
        currentBalance -= event.amount;
        withdrawalsTotal += event.amount;
        if (currentBalance > maxBal) maxBal = currentBalance;
        const dd = maxBal > 0 ? ((maxBal - currentBalance) / maxBal) * 100 : 0;
        withdrawalIndex++;
        data.push({
          name: `W${withdrawalIndex}`,
          bal: currentBalance,
          dd: -parseFloat(dd.toFixed(2)),
          rawDD: dd,
          fecha: event.fecha,
          hora: event.hora || '',
          isMovement: true,
          movementType: 'withdrawal',
          amount: event.amount
        });
      } else if (event.eventType === 'transfer' && selectedAccountId) {
        // Solo procesar transferencias si hay cuenta seleccionada
        let amountChange = 0;
        if (event.fromCuentaId === selectedAccountId) {
          amountChange -= event.amount;
          withdrawalsTotal += event.amount;
        }
        if (event.toCuentaId === selectedAccountId) {
          const incomingAmount = event.amountConverted || event.amount;
          amountChange += incomingAmount;
          depositsTotal += incomingAmount;
        }

        if (amountChange !== 0) {
          currentBalance += amountChange;
          if (currentBalance > maxBal) maxBal = currentBalance;
          const dd = maxBal > 0 ? ((maxBal - currentBalance) / maxBal) * 100 : 0;
          data.push({
            name: amountChange > 0 ? `TI${++depositIndex}` : `TO${++withdrawalIndex}`,
            bal: currentBalance,
            dd: -parseFloat(dd.toFixed(2)),
            rawDD: dd,
            fecha: event.fecha,
            hora: event.hora || '',
            isMovement: true,
            movementType: amountChange > 0 ? 'transfer_in' : 'transfer_out',
            amount: Math.abs(amountChange)
          });
        }
      }
    });

    const totalPnl = currentBalance - startBalance - depositsTotal + withdrawalsTotal;
    const winRate = tradeIndex > 0 ? ((winCount / tradeIndex) * 100) : 0;
    const maxDD = Math.max(...data.map(d => d.rawDD || 0), 0);
    const profitFactor = grossLoss === 0 ? grossWin : (grossWin / grossLoss);
    const promedioPuntos = tradesConPuntos > 0 ? totalPuntos / tradesConPuntos : 0;

    // Capital efectivo = saldo inicial + depósitos (el dinero disponible para operar)
    const effectiveCapital = startBalance + depositsTotal;

    return {
      balance: currentBalance,
      startBalance,
      effectiveCapital,
      totalPnl,
      winRate,
      maxDD,
      profitFactor,
      data,
      tradeCount: tradeIndex,
      totalPuntos,
      promedioPuntos,
      puntosGanadores,
      puntosPerdedores,
      tradesConPuntos,
      totalSwap,
      depositsTotal,
      withdrawalsTotal,
      netCapitalChange: depositsTotal - withdrawalsTotal
    };
  }, [accountFilteredTrades, trades, accountFilteredMovements, config, viewMode, selectedMonth, selectedYear, selectedAccountId, selectedAccount]);

  const todayStr = new Date().toISOString().split('T')[0];

  // P&L de hoy (filtrado por cuenta si está seleccionada)
  const pnlHoy = useMemo(() => {
    const todayTrades = selectedAccountId
      ? trades.filter(t => t.fecha === todayStr && t.cuentaId === selectedAccountId)
      : trades.filter(t => t.fecha === todayStr);
    return todayTrades.reduce((acc, t) => acc + parseFloat(t.res || 0), 0);
  }, [trades, todayStr, selectedAccountId]);

  // Meta diaria basada en el modo (porcentaje o monto fijo) y cuenta seleccionada
  const metaDiaria = useMemo(() => {
    // Modo porcentaje: calcular sobre el saldo de la cuenta
    if (config.metaDiariaMode === 'percentage') {
      const pct = config.metaDiariaPct || 2; // Default 2%
      if (selectedAccount) {
        // Usar saldo actual de la cuenta (saldoInicial + trades + movimientos)
        return (stats.balance * pct) / 100;
      }
      // Sin cuenta seleccionada, usar capital inicial global
      return (config.capitalInicial * pct) / 100;
    }

    // Modo monto fijo: usar el valor configurado
    return config.metaDiaria || 0;
  }, [config.metaDiariaMode, config.metaDiariaPct, config.metaDiaria, config.capitalInicial, selectedAccount, stats.balance]);

  const progresoMeta = metaDiaria > 0 ? Math.min((pnlHoy / metaDiaria) * 100, 100) : 0;

  // Calcular el porcentaje que representa la meta
  const metaDiariaPct = useMemo(() => {
    if (config.metaDiariaMode === 'percentage') {
      return config.metaDiariaPct || 2;
    }
    // Modo monto fijo: calcular el % sobre el balance actual
    if (selectedAccount) {
      return stats.balance > 0 ? ((metaDiaria / stats.balance) * 100).toFixed(1) : '0';
    }
    return config.capitalInicial > 0 ? ((config.metaDiaria / config.capitalInicial) * 100).toFixed(1) : '0';
  }, [config.metaDiariaMode, config.metaDiariaPct, config.metaDiaria, config.capitalInicial, selectedAccount, stats.balance, metaDiaria]);

  // Reset goal celebration flag when day changes
  useEffect(() => {
    setGoalCelebratedToday(false);
  }, [todayStr]);

  // Celebrate when daily goal is reached
  useEffect(() => {
    if (
      metaDiaria > 0 &&
      pnlHoy >= metaDiaria &&
      !goalCelebratedToday &&
      !loading
    ) {
      // Goal reached! Celebrate!
      setGoalCelebratedToday(true);
      celebrateGoal();
    }
  }, [pnlHoy, metaDiaria, goalCelebratedToday, loading]);

  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="flex items-end justify-center gap-1 mb-4 h-12">
            <div className="w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '60%', animationDelay: '0ms'}}></div>
            <div className="w-2 bg-red-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '40%', animationDelay: '100ms'}}></div>
            <div className="w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '80%', animationDelay: '200ms'}}></div>
            <div className="w-2 bg-red-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '50%', animationDelay: '300ms'}}></div>
            <div className="w-2 bg-emerald-500 rounded-sm animate-[pulse_0.8s_ease-in-out_infinite]" style={{height: '70%', animationDelay: '400ms'}}></div>
          </div>
          <p className="text-slate-400 text-sm">Cargando...</p>
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
        onRestartTour={() => setForceTourStart(true)}
        trades={trades}
        movements={movements}
        onMovements={() => setShowMovements(true)}
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
        cuentasBroker={config.cuentasBroker || []}
        userId={user?.uid}
        userEmail={user?.email}
        userType={userType}
        userPlan={userPlan}
      />

      <Header
        user={user}
        config={config}
        pnlHoy={pnlHoy}
        metaDiaria={metaDiaria}
        metaDiariaPct={metaDiariaPct}
        progresoMeta={progresoMeta}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        selectedAccount={selectedAccount}
        currencySymbol={currencySymbol}
        onSettings={() => setShowSettings(true)}
        onCalendar={() => setShowCalendar(true)}
        onFundingSimulator={() => setShowFundingSimulator(true)}
        onAcademy={() => setShowAcademy(true)}
        isAdmin={isAdmin}
        onAdmin={() => setShowAdminPanel(true)}
        onLogout={handleLogout}
        userType={userType}
      />

      <EconomicCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

      <TradingAcademy
        isOpen={showAcademy}
        onClose={() => setShowAcademy(false)}
        userId={user?.uid}
      />

      <MovementsModal
        isOpen={showMovements}
        onClose={() => setShowMovements(false)}
        userId={user?.uid}
        movements={movements}
        cuentasBroker={config.cuentasBroker || []}
        trades={trades}
      />

      {/* Alerta de prueba expirando */}
      {userType === 'trial' && userTrialEnd && (
        <TrialExpiringAlert
          trialEnd={userTrialEnd}
          userEmail={user?.email}
        />
      )}

      {/* Tour de onboarding para nuevos usuarios */}
      <OnboardingTour
        userEmail={user?.email}
        forceStart={forceTourStart}
        onForceStartHandled={() => setForceTourStart(false)}
      />

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-6 lg:space-y-8 order-2 lg:order-1">
            <StatsCards stats={stats} currencySymbol={currencySymbol} selectedAccount={selectedAccount} />
            <AdvancedStats trades={accountFilteredTrades} capitalInicial={stats.effectiveCapital} balance={stats.balance} currencySymbol={currencySymbol} />
            <div data-tour="charts">
              <EquityChart data={stats.data} startBalance={stats.startBalance} currencySymbol={currencySymbol} />
            </div>
            <div data-tour="drawdown">
              <DrawdownChart data={stats.data} />
            </div>
            <CalendarView
              trades={filteredTrades}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              onTradeClick={handleTradeClick}
              tradeCount={stats.tradeCount}
              diasNoOperativos={diasNoOperativos}
              onToggleDiaNoOperativo={toggleDiaNoOperativo}
            />
          </div>

          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <TradeForm
              onSubmit={addTrade}
              form={form}
              setForm={setForm}
              activosFavoritos={config.activosFavoritos}
              reglasSetup={config.reglasSetup || []}
              cuentasBroker={config.cuentasBroker || []}
              userId={user?.uid}
              userEmail={user?.email}
              userType={userType}
              userPlan={userPlan}
              trades={trades}
            />
          </div>
        </div>
      </main>
    </div>
  );
}