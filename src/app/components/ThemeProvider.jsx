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
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Leer preferencia guardada
    const saved = localStorage.getItem('trading-dark-mode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Detectar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trading-dark-mode', isDark.toString());
    }
  }, [isDark]);

    const toggleTheme = () => {
      setIsDark(prev => !prev);
    };
  
    return (
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }
