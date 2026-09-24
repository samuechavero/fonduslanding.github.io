import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const nombres = [
  'Martín G.',
  'Valeria R.',
  'Lucas T.',
  'Camila M.',
  'Facundo S.',
  'Sofía L.',
  'Joaquín P.',
];

const ubicaciones = [
  'Córdoba',
  'Buenos Aires',
  'Rosario',
  'Mendoza',
  'Neuquén',
  'Tucumán',
];

const planes = [
  'O. de compra $7.500.000',
  'O. de compra $10.000.000',
  'O. de compra $20.000.000',
  'Moto 0KM',
  'Auto 0KM',
];

export default function SocialProof({ hidden = false }) {
  const [toast, setToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hidden) {
      setIsVisible(false);
      setToast(null);
      return;
    }

    let hideTimeout;

    const triggerToast = () => {
      const randomName = nombres[Math.floor(Math.random() * nombres.length)];
      const randomLocation = ubicaciones[Math.floor(Math.random() * ubicaciones.length)];
      const randomPlan = planes[Math.floor(Math.random() * planes.length)];
      
      const position = Math.random() > 0.5 ? 'left' : 'right';

      setToast({
        id: Date.now(),
        name: randomName,
        location: randomLocation,
        plan: randomPlan,
        position,
      });
      setIsVisible(true);

      // Permanece en pantalla 4.5 segundos antes de desvanecerse
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 4500);
    };

    // Primer disparo a los 2 segundos
    const initialTimeout = setTimeout(triggerToast, 2000);

    // Intervalo exacto de 10000ms (10 segundos)
    const interval = setInterval(triggerToast, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      clearTimeout(hideTimeout);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {isVisible && toast && (
        <div
          key={toast.id}
          className={`fixed bottom-4 z-50 pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-[370px] w-auto ${
            toast.position === 'left' ? 'left-4 right-auto' : 'right-4 left-auto'
          }`}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#1d497f]/15 border-l-4 border-l-[#93c46d] p-3.5 shadow-xl"
          >
            {/* Ícono de validación en verde Fondus */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#93c46d]/20 text-[#1d497f] shadow-inner">
              <CheckCircle2 size={22} strokeWidth={2.4} className="text-[#1d497f]" />
            </div>

            {/* Contenido con copy estructurado */}
            <div className="min-w-0 flex-1">
              {/* Título: "[Nombre] de [Ubicación]" */}
              <h4 className="text-[13px] font-bold text-[#1d497f] leading-tight truncate">
                {toast.name} de {toast.location}
              </h4>

              {/* Cuerpo: "Se acaba de adherir al plan de [Plan]" */}
              <p className="mt-0.5 text-[12px] text-slate-700 leading-snug">
                Se acaba de adherir al plan de{' '}
                <span className="font-bold text-[#1d497f]">{toast.plan}</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
