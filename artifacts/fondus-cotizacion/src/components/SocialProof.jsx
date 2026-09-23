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

export default function SocialProof() {
  const [toast, setToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let hideTimeout;

    const triggerToast = () => {
      const randomName = nombres[Math.floor(Math.random() * nombres.length)];
      const randomLocation = ubicaciones[Math.floor(Math.random() * ubicaciones.length)];
      const randomPlan = planes[Math.floor(Math.random() * planes.length)];
      
      // Alterna o elige aleatoriamente entre la esquina inferior izquierda y la derecha
      const position = Math.random() > 0.5 ? 'left' : 'right';

      setToast({
        id: Date.now(),
        name: randomName,
        location: randomLocation,
        plan: randomPlan,
        position,
      });
      setIsVisible(true);

      // Permanece en pantalla 2.5 segundos y se desvanece suavemente antes del intervalo de 3s
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    };

    // Primer disparo inmediato
    triggerToast();

    // Intervalo exacto de 3000ms (3 segundos)
    const interval = setInterval(triggerToast, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && toast && (
        <div
          key={toast.id}
          className={`fixed bottom-4 z-50 pointer-events-none max-w-[340px] sm:max-w-[370px] w-[calc(100vw-2rem)] ${
            toast.position === 'left' ? 'left-4' : 'right-4'
          }`}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-100 border-l-4 border-l-green-500 p-3.5 shadow-xl"
          >
            {/* Ícono de validación en verde institucional */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 shadow-inner">
              <CheckCircle2 size={22} strokeWidth={2.4} />
            </div>

            {/* Contenido con copy estructurado */}
            <div className="min-w-0 flex-1">
              {/* Título (Azul marino): "[Nombre] de [Ubicación]" */}
              <h4 className="text-[13px] font-bold text-blue-900 leading-tight truncate">
                {toast.name} de {toast.location}
              </h4>

              {/* Cuerpo (Gris oscuro): "Se acaba de adherir al plan de [Plan]" */}
              <p className="mt-0.5 text-[12px] text-gray-700 leading-snug">
                Se acaba de adherir al plan de{' '}
                <span className="font-bold text-blue-900">{toast.plan}</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
