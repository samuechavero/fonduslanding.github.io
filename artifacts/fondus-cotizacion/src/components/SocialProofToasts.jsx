import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Gift, X } from 'lucide-react';

const names = [
  'Facundo G.',
  'Valentina M.',
  'Martín T.',
  'Camila S.',
  'Lucas R.',
  'Agustín B.',
  'Sofía L.',
  'Nicolás P.',
  'Florencia D.',
  'Joaquín M.',
  'Mateo V.',
  'Lucía R.',
];

const locations = [
  'de Córdoba',
  'de Rosario',
  'de CABA',
  'de Mendoza',
  'de Santa Fe',
  'de La Plata',
  'de Tucumán',
  'de Salta',
];

const plans = [
  'Orden de compra $7.500.000',
  'Orden de compra $10.000.000',
  'Orden de compra $20.000.000',
  'Moto 0KM',
  'Auto 0KM',
];

export default function SocialProofToasts() {
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    let hideTimer;
    let nextToastTimer;

    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];

      setCurrentNotification({
        id: Date.now(),
        name: randomName,
        location: randomLocation,
        plan: randomPlan,
      });

      // Cada notificación permanece visible en la pantalla exactamente durante 5 segundos
      hideTimer = setTimeout(() => {
        setCurrentNotification(null);

        // Intervalo aleatorio de entre 10 y 25 segundos para la próxima notificación
        const nextInterval = Math.floor(Math.random() * (25000 - 10000 + 1)) + 10000;
        nextToastTimer = setTimeout(showNotification, nextInterval);
      }, 5000);
    };

    // Primera notificación tras un breve lapso inicial (3.5 segundos)
    const initialTimer = setTimeout(showNotification, 3500);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextToastTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none max-w-[380px] w-[calc(100vw-3rem)]">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            key={currentNotification.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto flex items-start gap-3.5 rounded-2xl border border-sky-200 bg-white p-4 shadow-2xl backdrop-blur-md"
          >
            {/* Ícono de regalo / verificación en verde institucional */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 shadow-inner">
              <Gift size={22} className="text-green-600" />
              <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-green-600 text-white shadow-xs">
                <Check size={11} strokeWidth={3} />
              </span>
            </div>

            {/* Contenido textual */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[12px] font-semibold text-slate-600 truncate">
                  <span className="font-bold text-blue-900">{currentNotification.name}</span>{' '}
                  <span className="text-slate-500">{currentNotification.location}</span>
                </p>
              </div>

              <p className="mt-1 text-[13px] leading-snug text-blue-900 font-bold">
                Se suscribió al plan:{' '}
                <span className="text-sky-600">{currentNotification.plan}</span>
              </p>

              <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                <span>hace unos instantes</span>
                <span>•</span>
                <span className="text-green-600 font-semibold flex items-center gap-0.5">
                  ✓ Verificada
                </span>
              </div>
            </div>

            {/* Botón opcional de cerrar */}
            <button
              type="button"
              onClick={() => setCurrentNotification(null)}
              className="text-slate-300 hover:text-slate-600 transition p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Cerrar notificación"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
