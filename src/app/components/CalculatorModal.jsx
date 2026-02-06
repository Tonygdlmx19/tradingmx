"use client";
import { useState } from 'react';
import { X, Calculator, Delete } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function CalculatorModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const title = language === 'en' ? 'Calculator' : 'Calculadora';
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  if (!isOpen) return null;

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteDigit = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = currentValue / inputValue;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result;

    switch (operation) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '×':
        result = previousValue * inputValue;
        break;
      case '÷':
        result = previousValue / inputValue;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const Button = ({ onClick, children, className = '', wide = false }) => (
    <button
      onClick={onClick}
      className={`${wide ? 'col-span-2' : ''} p-4 text-lg font-bold rounded-xl transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl border w-full max-w-xs ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Calculator size={20} className="text-blue-500" /> {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Display */}
        <div className={`p-4 mx-4 mt-4 rounded-xl text-right ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <div className={`text-xs h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {previousValue !== null && `${previousValue} ${operation || ''}`}
          </div>
          <div className={`text-3xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 p-4">
          <Button
            onClick={clear}
            className={isDark ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'}
          >
            AC
          </Button>
          <Button
            onClick={toggleSign}
            className={isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
          >
            ±
          </Button>
          <Button
            onClick={percentage}
            className={isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
          >
            %
          </Button>
          <Button
            onClick={() => performOperation('÷')}
            className={`${operation === '÷' ? 'bg-blue-600 text-white' : isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
          >
            ÷
          </Button>

          {['7', '8', '9'].map(d => (
            <Button
              key={d}
              onClick={() => inputDigit(d)}
              className={isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}
            >
              {d}
            </Button>
          ))}
          <Button
            onClick={() => performOperation('×')}
            className={`${operation === '×' ? 'bg-blue-600 text-white' : isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
          >
            ×
          </Button>

          {['4', '5', '6'].map(d => (
            <Button
              key={d}
              onClick={() => inputDigit(d)}
              className={isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}
            >
              {d}
            </Button>
          ))}
          <Button
            onClick={() => performOperation('-')}
            className={`${operation === '-' ? 'bg-blue-600 text-white' : isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
          >
            −
          </Button>

          {['1', '2', '3'].map(d => (
            <Button
              key={d}
              onClick={() => inputDigit(d)}
              className={isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}
            >
              {d}
            </Button>
          ))}
          <Button
            onClick={() => performOperation('+')}
            className={`${operation === '+' ? 'bg-blue-600 text-white' : isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
          >
            +
          </Button>

          <Button
            onClick={() => inputDigit('0')}
            className={isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className={isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}
          >
            .
          </Button>
          <Button
            onClick={deleteDigit}
            className={isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
          >
            <Delete size={20} className="mx-auto" />
          </Button>
          <Button
            onClick={calculate}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
}
