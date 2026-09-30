"use client";
import { useEffect } from 'react';

// Cierra un modal con la tecla Escape. `active` permite desactivarlo cuando
// el modal está cerrado o cuando hay otro modal encima.
export default function useEscapeKey(onClose, active = true) {
  useEffect(() => {
    if (!active || typeof onClose !== 'function') return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, active]);
}
