"use client";
import { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Plus, Trash2, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function MovementsModal({
  isOpen,
  onClose,
  userId,
  movements = [],
  cuentasBroker = [],
  trades = []
}) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    cuentaId: '',
    fromCuentaId: '',
    toCuentaId: '',
    tipoCambio: '',
    notas: ''
  });

  const labels = {
    es: {
      title: 'Movimientos de Capital',
      deposit: 'Deposito',
      withdrawal: 'Retiro',
      transfer: 'Transferencia',
      amount: 'Monto',
      date: 'Fecha',
      time: 'Hora (opcional)',
      account: 'Cuenta',
      fromAccount: 'Desde cuenta',
      toAccount: 'Hacia cuenta',
      notes: 'Notas (opcional)',
      notesPlaceholder: 'Ej: Fondos adicionales, retiro parcial...',
      add: 'Agregar Movimiento',
      save: 'Guardar',
      cancel: 'Cancelar',
      noMovements: 'No hay movimientos registrados',
      totalDeposits: 'Total Depositos',
      totalWithdrawals: 'Total Retiros',
      netChange: 'Cambio Neto',
      confirmDelete: 'Eliminar este movimiento?',
      selectAccount: 'Selecciona cuenta',
      noAccount: 'Sin cuenta especifica',
      close: 'Cerrar',
      exchangeRate: 'Tipo de cambio',
      convertedAmount: 'Monto convertido',
      differentCurrencies: 'Divisas diferentes'
    },
    en: {
      title: 'Capital Movements',
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      transfer: 'Transfer',
      amount: 'Amount',
      date: 'Date',
      time: 'Time (optional)',
      account: 'Account',
      fromAccount: 'From account',
      toAccount: 'To account',
      notes: 'Notes (optional)',
      notesPlaceholder: 'E.g: Additional funds, partial withdrawal...',
      add: 'Add Movement',
      save: 'Save',
      cancel: 'Cancel',
      noMovements: 'No movements recorded',
      totalDeposits: 'Total Deposits',
      totalWithdrawals: 'Total Withdrawals',
      netChange: 'Net Change',
      confirmDelete: 'Delete this movement?',
      selectAccount: 'Select account',
      noAccount: 'No specific account',
      close: 'Close',
      exchangeRate: 'Exchange rate',
      convertedAmount: 'Converted amount',
      differentCurrencies: 'Different currencies'
    }
  };
  const t = labels[language] || labels.es;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      type: 'deposit',
      amount: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: '',
      cuentaId: '',
      fromCuentaId: '',
      toCuentaId: '',
      tipoCambio: '',
      notas: ''
    });
  };

  // Helper to get account currency
  const getAccountCurrency = (cuentaId) => {
    const cuenta = cuentasBroker.find(c => c.id === cuentaId);
    return cuenta?.divisa || 'USD';
  };

  // Check if transfer is between different currencies
  const isDifferentCurrency = () => {
    if (formData.type !== 'transfer') return false;
    if (!formData.fromCuentaId || !formData.toCuentaId) return false;
    const fromCurrency = getAccountCurrency(formData.fromCuentaId);
    const toCurrency = getAccountCurrency(formData.toCuentaId);
    return fromCurrency !== toCurrency;
  };

  // Calculate converted amount
  const getConvertedAmount = () => {
    if (!isDifferentCurrency()) return parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.tipoCambio) || 1;
    return (parseFloat(formData.amount) || 0) * rate;
  };

  // Calculate account balance
  const getAccountBalance = (cuentaId) => {
    if (!cuentaId) return 0;
    const cuenta = cuentasBroker.find(c => c.id === cuentaId);
    const saldoInicial = cuenta?.saldoInicial || 0;

    const tradesPnL = trades
      .filter(t => t.cuentaId === cuentaId)
      .reduce((sum, t) => sum + (parseFloat(t.res) || 0) - (parseFloat(t.swap) || 0), 0);

    const deposits = movements
      .filter(m => m.type === 'deposit' && m.cuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    const withdrawals = movements
      .filter(m => m.type === 'withdrawal' && m.cuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    const transfersIn = movements
      .filter(m => m.type === 'transfer' && m.toCuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amountConverted || m.amount || 0), 0);

    const transfersOut = movements
      .filter(m => m.type === 'transfer' && m.fromCuentaId === cuentaId)
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    return saldoInicial + tradesPnL + deposits - withdrawals + transfersIn - transfersOut;
  };

  // Get currency symbol
  const getCurrencySymbol = (divisa) => {
    const symbols = { USD: '$', MXN: 'MX$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', CHF: 'CHF ' };
    return symbols[divisa] || '$';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    setIsSubmitting(true);

    try {
      // Get account details for denormalization
      const getCuentaInfo = (cuentaId) => {
        const cuenta = cuentasBroker.find(c => c.id === cuentaId);
        return cuenta ? { broker: cuenta.broker, numeroCuenta: cuenta.numero } : { broker: null, numeroCuenta: null };
      };

      const movementData = {
        uid: userId,
        type: formData.type,
        amount: parseFloat(formData.amount),
        fecha: formData.fecha,
        hora: formData.hora || null,
        notas: formData.notas || '',
        createdAt: serverTimestamp()
      };

      if (formData.type === 'transfer') {
        // Transfer between accounts
        const fromInfo = getCuentaInfo(formData.fromCuentaId);
        const toInfo = getCuentaInfo(formData.toCuentaId);
        const fromCurrency = getAccountCurrency(formData.fromCuentaId);
        const toCurrency = getAccountCurrency(formData.toCuentaId);

        movementData.fromCuentaId = formData.fromCuentaId || null;
        movementData.fromBroker = fromInfo.broker;
        movementData.fromNumeroCuenta = fromInfo.numeroCuenta;
        movementData.fromDivisa = fromCurrency;
        movementData.toCuentaId = formData.toCuentaId || null;
        movementData.toBroker = toInfo.broker;
        movementData.toNumeroCuenta = toInfo.numeroCuenta;
        movementData.toDivisa = toCurrency;
        movementData.cuentaId = null;
        movementData.broker = null;
        movementData.numeroCuenta = null;

        // If different currencies, store exchange rate and converted amount
        if (fromCurrency !== toCurrency && formData.tipoCambio) {
          movementData.tipoCambio = parseFloat(formData.tipoCambio);
          movementData.amountConverted = getConvertedAmount();
        }
      } else {
        // Deposit or withdrawal
        const cuentaInfo = getCuentaInfo(formData.cuentaId);
        movementData.cuentaId = formData.cuentaId || null;
        movementData.broker = cuentaInfo.broker;
        movementData.numeroCuenta = cuentaInfo.numeroCuenta;
        movementData.fromCuentaId = null;
        movementData.toCuentaId = null;
      }

      await addDoc(collection(db, 'movements'), movementData);

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding movement:', error);
      alert(language === 'es' ? 'Error al guardar el movimiento' : 'Error saving movement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (movementId) => {
    if (!window.confirm(t.confirmDelete)) return;

    try {
      await deleteDoc(doc(db, 'movements', movementId));
    } catch (error) {
      console.error('Error deleting movement:', error);
    }
  };

  // Calculate totals
  const totals = movements.reduce((acc, m) => {
    if (m.type === 'deposit') {
      acc.deposits += m.amount;
    } else if (m.type === 'withdrawal') {
      acc.withdrawals += m.amount;
    }
    // Transfers don't affect totals (money moves but stays in the system)
    return acc;
  }, { deposits: 0, withdrawals: 0 });

  const netChange = totals.deposits - totals.withdrawals;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = language === 'en' ? monthsEn : monthsEs;
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={16} className="text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight size={16} className="text-red-500" />;
      case 'transfer':
        return <ArrowLeftRight size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'deposit': return t.deposit;
      case 'withdrawal': return t.withdrawal;
      case 'transfer': return t.transfer;
      default: return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <DollarSign size={20} className="text-emerald-500" />
            </div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Add Movement Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
              }`}
            >
              <Plus size={18} />
              {t.add}
            </button>
          )}

          {/* Add Movement Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className={`p-4 rounded-xl border space-y-4 ${
              isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* Type Selector */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-2 block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Tipo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'deposit' }))}
                    className={`p-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-all ${
                      formData.type === 'deposit'
                        ? 'bg-green-500 text-white'
                        : isDark ? 'bg-slate-600 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowDownLeft size={14} />
                    {t.deposit}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'withdrawal' }))}
                    className={`p-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-all ${
                      formData.type === 'withdrawal'
                        ? 'bg-red-500 text-white'
                        : isDark ? 'bg-slate-600 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowUpRight size={14} />
                    {t.withdrawal}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'transfer' }))}
                    className={`p-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-all ${
                      formData.type === 'transfer'
                        ? 'bg-blue-500 text-white'
                        : isDark ? 'bg-slate-600 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowLeftRight size={14} />
                    {t.transfer}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-1 block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t.amount}
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className={`w-full p-3 pl-8 border rounded-xl text-lg font-bold outline-none focus:border-emerald-500 ${
                      isDark
                        ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {t.date}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-emerald-500 ${
                      isDark
                        ? 'bg-slate-600 border-slate-500 text-white'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {t.time}
                  </label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-emerald-500 ${
                      isDark
                        ? 'bg-slate-600 border-slate-500 text-white'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              {/* Account Selection */}
              {formData.type === 'transfer' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-[10px] font-bold uppercase mb-1 block ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {t.fromAccount}
                    </label>
                    <select
                      value={formData.fromCuentaId}
                      onChange={(e) => setFormData(prev => ({ ...prev, fromCuentaId: e.target.value }))}
                      className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-slate-600 border-slate-500 text-white'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="">{t.selectAccount}</option>
                      {cuentasBroker.map(c => (
                        <option key={c.id} value={c.id}>{c.broker} - #{c.numero} ({c.divisa || 'USD'})</option>
                      ))}
                    </select>
                    {formData.fromCuentaId && (
                      <div className={`mt-1 text-xs text-right font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'es' ? 'Saldo' : 'Balance'}: <span className={getAccountBalance(formData.fromCuentaId) >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {getCurrencySymbol(getAccountCurrency(formData.fromCuentaId))}{getAccountBalance(formData.fromCuentaId).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold uppercase mb-1 block ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {t.toAccount}
                    </label>
                    <select
                      value={formData.toCuentaId}
                      onChange={(e) => setFormData(prev => ({ ...prev, toCuentaId: e.target.value }))}
                      className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-slate-600 border-slate-500 text-white'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="">{t.selectAccount}</option>
                      {cuentasBroker.map(c => (
                        <option key={c.id} value={c.id}>{c.broker} - #{c.numero} ({c.divisa || 'USD'})</option>
                      ))}
                    </select>
                    {formData.toCuentaId && (
                      <div className={`mt-1 text-xs text-right font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'es' ? 'Saldo' : 'Balance'}: <span className={getAccountBalance(formData.toCuentaId) >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {getCurrencySymbol(getAccountCurrency(formData.toCuentaId))}{getAccountBalance(formData.toCuentaId).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className={`text-[10px] font-bold uppercase mb-1 block ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {t.account}
                  </label>
                  <select
                    value={formData.cuentaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, cuentaId: e.target.value }))}
                    className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-emerald-500 ${
                      isDark
                        ? 'bg-slate-600 border-slate-500 text-white'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="">{t.noAccount}</option>
                    {cuentasBroker.map(c => (
                      <option key={c.id} value={c.id}>{c.broker} - #{c.numero} ({c.divisa || 'USD'})</option>
                    ))}
                  </select>
                  {formData.cuentaId && (
                    <div className={`mt-1 text-xs text-right font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'es' ? 'Saldo actual' : 'Current balance'}: <span className={getAccountBalance(formData.cuentaId) >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {getCurrencySymbol(getAccountCurrency(formData.cuentaId))}{getAccountBalance(formData.cuentaId).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Exchange Rate - only for transfers between different currencies */}
              {isDifferentCurrency() && (
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {t.differentCurrencies}: {getAccountCurrency(formData.fromCuentaId)} → {getAccountCurrency(formData.toCuentaId)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t.exchangeRate}
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="Ej: 17.50"
                        value={formData.tipoCambio}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipoCambio: e.target.value }))}
                        className={`w-full p-2 border rounded-xl text-sm font-bold outline-none focus:border-amber-500 ${
                          isDark
                            ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-[10px] font-bold uppercase mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t.convertedAmount}
                      </label>
                      <div className={`p-2 border rounded-xl text-sm font-bold ${
                        isDark ? 'bg-slate-700 border-slate-600 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
                      }`}>
                        {getAccountCurrency(formData.toCuentaId) === 'EUR' ? '€' :
                         getAccountCurrency(formData.toCuentaId) === 'GBP' ? '£' :
                         getAccountCurrency(formData.toCuentaId) === 'JPY' ? '¥' : '$'}
                        {getConvertedAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className={`text-[10px] font-bold uppercase mb-1 block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t.notes}
                </label>
                <input
                  type="text"
                  placeholder={t.notesPlaceholder}
                  value={formData.notas}
                  onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                  className={`w-full p-2 border rounded-xl text-sm outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                    isDark
                      ? 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.amount}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? '...' : t.save}
                </button>
              </div>
            </form>
          )}

          {/* Movements List */}
          {movements.length > 0 ? (
            <div className="space-y-2">
              {[...movements].sort((a, b) => {
                // Sort by date descending, then by createdAt descending
                const dateCompare = b.fecha.localeCompare(a.fecha);
                if (dateCompare !== 0) return dateCompare;
                return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
              }).map((movement) => (
                <div
                  key={movement.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      movement.type === 'deposit' ? 'bg-green-500/20' :
                      movement.type === 'withdrawal' ? 'bg-red-500/20' : 'bg-blue-500/20'
                    }`}>
                      {getTypeIcon(movement.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${
                          movement.type === 'deposit' ? 'text-green-500' :
                          movement.type === 'withdrawal' ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {movement.type === 'withdrawal' ? '-' : movement.type === 'deposit' ? '+' : ''}
                          ${movement.amount.toFixed(2)}
                        </span>
                        <span className={`text-[10px] uppercase font-bold ${
                          isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {getTypeLabel(movement.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {formatDate(movement.fecha)}
                        </span>
                        {movement.broker && (
                          <span className={`text-[10px] flex items-center gap-1 ${
                            isDark ? 'text-purple-400' : 'text-purple-500'
                          }`}>
                            <Briefcase size={10} />
                            {movement.broker}
                          </span>
                        )}
                        {movement.type === 'transfer' && movement.fromBroker && movement.toBroker && (
                          <span className={`text-[10px] flex items-center gap-1 ${
                            isDark ? 'text-blue-400' : 'text-blue-500'
                          }`}>
                            {movement.fromBroker} → {movement.toBroker}
                          </span>
                        )}
                      </div>
                      {movement.notas && (
                        <p className={`text-xs mt-1 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {movement.notas}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(movement.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <DollarSign size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t.noMovements}</p>
            </div>
          )}

          {/* Totals Summary */}
          {movements.length > 0 && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.totalDeposits}
                </span>
                <span className="font-bold text-green-500">+${totals.deposits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.totalWithdrawals}
                </span>
                <span className="font-bold text-red-500">-${totals.withdrawals.toFixed(2)}</span>
              </div>
              <div className={`pt-2 border-t flex justify-between items-center ${
                isDark ? 'border-slate-600' : 'border-slate-300'
              }`}>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                  {t.netChange}
                </span>
                <span className={`font-black text-lg ${
                  netChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {netChange >= 0 ? '+' : ''}{netChange.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold transition-colors ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
