"use client";
import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Valor por defecto si no hay provider
    return { isDark: false, toggleTheme: () => {} };
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Leer preferencia guardada
    const saved = localStorage.getItem('trading-dark-mode');
    if (saved !== null) {
      setIsDark(saved === 'true');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('trading-dark-mode', isDark.toString());
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Evitar flash de contenido
  if (!mounted) {
    return <div className="min-h-screen bg-slate-100" />;
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
