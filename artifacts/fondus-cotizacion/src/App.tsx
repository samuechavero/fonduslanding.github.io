import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Facebook,
  FileDown,
  FileText,
  HelpCircle,
  Instagram,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  Zap,
} from 'lucide-react';

import SocialProof from './components/SocialProof';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type Plan = {
  id: string;
  title: string;
  target: string;
  quota1to4: number;
  quota5on: number;
  tag?: string;
  benefits: string[];
};

const commonBenefits = [
  'Sorteos mensuales desde cuota 1',
  'Si ganás no pagás más',
  'Disponibilidad de fondos desde cuota 18',
  'Telemedicina 24/7',
  'Seguro de vida',
];

const plans: Plan[] = [
  {
    id: '7.5m',
    title: 'O. de compra $7.500.000 - Ideal para empezar',
    target: '$ 7.500.000',
    quota1to4: 43800,
    quota5on: 25875,
    benefits: commonBenefits,
  },
  {
    id: '10m',
    title: 'O. de compra $10.000.000',
    target: '$ 10.000.000',
    quota1to4: 58400,
    quota5on: 34500,
    tag: 'Más Elegido',
    benefits: commonBenefits,
  },
  {
    id: '20m',
    title: 'O. de compra $20.000.000',
    target: '$ 20.000.000',
    quota1to4: 116800,
    quota5on: 69000,
    benefits: commonBenefits,
  },
];

function formatMoney(value: number) {
  return `$ ${new Intl.NumberFormat('es-AR').format(value)}`;
}

// Lógica Oficial de Fechas para Contador de Adjudicación (Fondus)
const getNextDrawDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // 1. Encontrar el último sábado del mes actual
  const lastSaturday = new Date(year, month + 1, 0);
  while (lastSaturday.getDay() !== 6) {
    lastSaturday.setDate(lastSaturday.getDate() - 1);
  }
  lastSaturday.setHours(21, 0, 0, 0);

  // 2. El límite de adhesión es exactamente 3 días antes (Miércoles) a las 23:59:59
  const cutOffWednesday = new Date(lastSaturday);
  cutOffWednesday.setDate(lastSaturday.getDate() - 3);
  cutOffWednesday.setHours(23, 59, 59, 999);

  // 3. Si la fecha actual supera el límite de ese miércoles, pasamos al último sábado del mes siguiente
  if (now.getTime() > cutOffWednesday.getTime()) {
    const nextMonthSaturday = new Date(year, month + 2, 0);
    while (nextMonthSaturday.getDay() !== 6) {
      nextMonthSaturday.setDate(nextMonthSaturday.getDate() - 1);
    }
    nextMonthSaturday.setHours(21, 0, 0, 0);
    return nextMonthSaturday;
  }

  return lastSaturday;
};

function getProximoSorteoInfo() {
  const sorteoDate = getNextDrawDate();

  const prevMonthDate = new Date(sorteoDate.getFullYear(), sorteoDate.getMonth() - 1, 1);
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const mesSorteoName = meses[sorteoDate.getMonth()];
  const mesPrevName = meses[prevMonthDate.getMonth()];

  const diaSorteo = sorteoDate.getDate();
  const fechaTexto = `Sábado ${diaSorteo} de ${mesSorteoName} · 21:00 hs`;
  const ultimoSorteoTexto = `Sorteo ${mesPrevName} ${prevMonthDate.getFullYear()}`;

  return { sorteoDate, fechaTexto, ultimoSorteoTexto };
}

// Componente Modal reutilizable con Framer Motion para lectura rápida de normativas
function LegalModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[650px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
          >
            {/* Header barra gris oscuro/antracita matching el diseño de Fondus */}
            <div className="flex items-center justify-between bg-[#383838] px-5 py-4 text-white">
              <h2 className="text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wider text-slate-100">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/15 hover:text-white transition cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido scrolleable con padding y tipografía cuidada */}
            <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-7 text-left text-slate-700">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Bloque Oficial de Certificación IGJ (Inspección General de Justicia)
function IgjCertificationBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center bg-gray-100 rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/80 ${className}`}
    >
      {/* 2. Bloque Izquierdo (Identidad Gubernamental) */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        {/* Parte superior: Texto IGJ + Logotipo circular azul */}
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-black tracking-tight leading-none">
            IGJ
          </span>
          <img
            src={`${import.meta.env.BASE_URL}igj-logo.png`}
            alt="Logotipo circular IGJ"
            className="h-11 w-11 object-contain shrink-0"
          />
        </div>

        {/* Parte inferior: Escudo argentino + Ministerio de Justicia */}
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}escudo-argentina.png`}
            alt="Escudo Argentino"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div className="text-[10px] leading-tight text-black border-b border-black/80 pb-0.5">
            <p>Ministerio de</p>
            <p>Justicia y Derechos Humanos</p>
            <p className="font-semibold">Presidencia de la Nación</p>
          </div>
        </div>
      </div>

      {/* 3. Divisor Vertical Central (responsivo) */}
      <div className="h-1 w-20 md:h-16 md:w-1.5 bg-black my-4 md:my-0 md:mx-6 shrink-0 rounded-full" />

      {/* 4. Bloque Derecho (Resolución y Atención) */}
      <div className="flex flex-col text-center md:text-left text-black">
        <span className="text-xs font-bold leading-tight">Planes Aprobados</span>
        <span className="text-sm font-normal leading-snug">RES 000289/11</span>
        <span className="text-sm font-normal leading-snug">0800-3333-445</span>
      </div>
    </div>
  );
}

// 1. Logo con subtítulo "Agencia Digital" estrictamente debajo del logo
function Logo({ light = false }: { light?: boolean }) {
  const logoUrl = `${import.meta.env.BASE_URL}fondus-logo.png`;
  return (
    <div className="flex flex-col items-start leading-none group">
      <div className={`flex items-center gap-2.5 ${light ? 'text-white' : 'text-[#1d497f]'}`}>
        <img
          src={logoUrl}
          alt="Fondus Logo"
          className="h-9 w-9 rounded-xl object-contain shadow-xs border border-white/20"
        />
        <span className="font-display text-[26px] font-extrabold tracking-[-0.06em]">fondus</span>
      </div>
      <span
        className={`text-[8.5px] sm:text-[9px] font-extrabold tracking-[.25em] uppercase pl-11.5 -mt-1 ${
          light ? 'text-[#93c46d]' : 'text-[#1d497f]/70'
        }`}
      >
        Agencia Digital
      </span>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  className = '',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.09em] text-[#1d497f]">
          {label}
        </span>
      )}
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1d497f]/60">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[14px] text-[#1d497f] outline-none transition placeholder:text-slate-400 focus:border-[#1d497f] focus:ring-4 focus:ring-[#1d497f]/10 ${
            icon ? 'pl-10' : ''
          }`}
        />
      </span>
    </label>
  );
}

function SectionHeading({
  number,
  title,
  caption,
  icon,
}: {
  number: string;
  title: string;
  caption: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1d497f]/10 text-[#1d497f] border border-[#1d497f]/20">
        {icon}
      </span>
      <div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="font-mono-ui text-[10px] font-bold tracking-[.1em] text-[#93c46d]">
            {number}
          </span>
          <h2 className="font-display text-[18px] font-extrabold tracking-[-.03em] text-[#1d497f]">
            {title}
          </h2>
        </div>
        <p className="text-[13px] text-slate-500">{caption}</p>
      </div>
    </div>
  );
}

function Countdown({ targetTime }: { targetTime?: number }) {
  // Estado inicial del contador alimentado de getNextDrawDate()
  const [time, setTime] = useState(() => {
    const target = targetTime ? new Date(targetTime) : getNextDrawDate();
    const distance = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  });

  useEffect(() => {
    const tick = () => {
      // El setInterval compara la fecha actual contra la variable actualizada de getNextDrawDate()
      const target = getNextDrawDate();
      const distance = Math.max(0, target.getTime() - Date.now());

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="mt-4 grid max-w-[330px] grid-cols-4 gap-2">
      {[
        ['DÍAS', time.days],
        ['HORAS', time.hours],
        ['MIN', time.minutes],
        ['SEG', time.seconds],
      ].map(([label, value]) => (
        <div
          key={label}
          className="rounded-lg border border-white/15 bg-[#153760] px-2 py-2 text-center"
        >
          <div className="font-mono-ui text-[18px] font-bold leading-none text-white">
            {String(value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[9px] font-bold tracking-[.13em] text-white/70">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdjudicationBanner({
  sorteoInfo: initialSorteoInfo,
}: {
  sorteoInfo?: { sorteoDate: Date; fechaTexto: string; ultimoSorteoTexto: string };
}) {
  const [currentSorteoInfo, setCurrentSorteoInfo] = useState(
    () => initialSorteoInfo || getProximoSorteoInfo()
  );

  useEffect(() => {
    const checkUpdate = () => {
      setCurrentSorteoInfo(getProximoSorteoInfo());
    };
    const interval = setInterval(checkUpdate, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#1d497f]/15 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-7">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">
            Último número adjudicado
          </p>
          <p className="text-[13px] font-semibold text-[#1d497f]">
            {currentSorteoInfo.ultimoSorteoTexto}
          </p>
        </div>
        <span className="font-mono-ui text-[40px] font-bold leading-none tracking-[-.08em] text-[#1d497f]">
          390
        </span>
      </div>
      <div className="relative overflow-hidden bg-[#1d497f] px-5 py-5 sm:px-7 text-white">
        <div className="absolute -right-12 -top-20 h-44 w-44 rounded-full border-[22px] border-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.11em] text-[#93c46d]">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#93c46d]" />
            Próxima adjudicación
          </div>
          <p className="mt-1 text-[14px] font-semibold text-white">
            {currentSorteoInfo.fechaTexto}
          </p>
          <Countdown targetTime={currentSorteoInfo.sorteoDate.getTime()} />
        </div>
      </div>
    </section>
  );
}

function Stepper({ step, setStep }: { step: number; setStep: (step: number) => void }) {
  const steps = ['1. Elegí tu plan', '2. Datos Personales', '3. Revisión y Checkout'];
  return (
    <div className="mb-8 w-full max-w-full flex items-center gap-1.5 overflow-x-auto whitespace-nowrap snap-x hide-scrollbar rounded-2xl border border-[#1d497f]/15 bg-white p-1.5 shadow-xs">
      {steps.map((name, index) => {
        const active = step === index;
        const done = step > index;
        return (
          <button
            key={name}
            type="button"
            onClick={() => (index < step ? setStep(index) : undefined)}
            className={`flex shrink-0 snap-start sm:flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px] font-bold transition select-none ${
              active
                ? 'bg-[#1d497f] text-white shadow-xs'
                : done
                ? 'text-[#1d497f] bg-[#93c46d]/20 hover:bg-[#93c46d]/30 cursor-pointer'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                active
                  ? 'bg-white text-[#1d497f] font-extrabold'
                  : done
                  ? 'bg-[#93c46d] text-[#1d497f] font-extrabold'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {done ? <Check size={12} strokeWidth={3} /> : index + 1}
            </span>
            <span className="whitespace-nowrap">{name}</span>
          </button>
        );
      })}
    </div>
  );
}

// 3 TARJETAS CUADRADAS INDEPENDIENTES (Sección 1)
function PlanCardSquare({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}) {
  const isFeatured = !!plan.tag;

  return (
    <div
      onClick={onSelect}
      className={`relative w-full flex flex-col justify-between rounded-2xl border-2 p-4 sm:p-5 text-left cursor-pointer transition-all duration-200 ${
        selected
          ? 'border-[#1d497f] bg-[#1d497f]/5 shadow-md ring-2 ring-[#1d497f]/20'
          : isFeatured
          ? 'border-[#93c46d] bg-white hover:border-[#1d497f] shadow-xs'
          : 'border-slate-200 bg-white hover:border-[#1d497f]/50 hover:bg-slate-50/60'
      }`}
    >
      {/* Badge Destacada / Más Elegido */}
      {plan.tag && (
        <span className="absolute -top-3 right-4 rounded-full bg-[#93c46d] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#1d497f] shadow-xs">
          {plan.tag}
        </span>
      )}

      <div>
        {/* Selector radial */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
              selected ? 'border-[#1d497f]' : 'border-slate-300'
            }`}
          >
            {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#1d497f]" />}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Plan Oficial
          </span>
        </div>

        {/* Nombre del plan y etiqueta de precio/objetivo */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-[15px] font-extrabold text-[#1d497f] leading-snug">
            {plan.title}
          </h3>
          <span className="inline-block shrink-0 self-start md:self-auto rounded-md bg-[#1d497f]/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#1d497f] whitespace-nowrap">
            {plan.target}
          </span>
        </div>

        {/* Progresión de cuotas */}
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cuotas 1 a 4:
            </span>
            <span className="font-mono-ui text-[16px] font-extrabold text-[#1d497f]">
              {formatMoney(plan.quota1to4)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-t border-slate-100 pt-1.5 gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#93c46d]">
              Desde cuota 5:
            </span>
            <span className="font-mono-ui text-[16px] font-extrabold text-[#1d497f]">
              {formatMoney(plan.quota5on)}
            </span>
          </div>
        </div>

        {/* Beneficios en las 3 tarjetas */}
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] font-medium text-[#1d497f]">
          <p className="flex items-center gap-1.5 font-semibold text-[#1d497f]">
            <Check size={13} strokeWidth={3} className="shrink-0 text-[#93c46d]" /> Sorteos mensuales desde cuota 1
          </p>
          <p className="flex items-center gap-1.5">
            <Check size={13} strokeWidth={3} className="shrink-0 text-[#93c46d]" /> Si ganás no pagás más
          </p>
          <p className="flex items-center gap-1.5">
            <Check size={13} strokeWidth={3} className="shrink-0 text-[#93c46d]" /> Disponibilidad de fondos desde cuota 18
          </p>
          <p className="flex items-center gap-1.5 font-semibold">
            <Sparkles size={12} className="shrink-0 text-[#93c46d]" /> Telemedicina 24/7 y Seguro de vida
          </p>
        </div>
      </div>

      <div className="mt-5 pt-2">
        <button
          type="button"
          className={`w-full py-2.5 px-3 rounded-xl text-[12px] font-bold transition text-center ${
            selected
              ? 'bg-[#1d497f] text-white shadow-xs'
              : 'border-2 border-[#93c46d] bg-[#93c46d]/10 text-[#1d497f] hover:bg-[#93c46d]'
          }`}
        >
          {selected ? 'Plan Seleccionado' : 'Elegir este Plan'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Plan 10M destacado por defecto
  const [mobileMenu, setMobileMenu] = useState(false);

  // 4. Números de 3 cifras generados dinámicamente
  const [dynamicNumbers] = useState<string[]>(() => {
    const nums: string[] = [];
    while (nums.length < 3) {
      const n = String(Math.floor(100 + Math.random() * 900));
      if (!nums.includes(n)) nums.push(n);
    }
    return nums;
  });
  const [selectedNumber, setSelectedNumber] = useState<string>(dynamicNumbers[0]);

  // Checkboxes obligatorios en checkout
  const [checkCapitalizacion, setCheckCapitalizacion] = useState(false);
  const [checkBasesCondiciones, setCheckBasesCondiciones] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  // Modales
  const [retentionModalOpen, setRetentionModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [arrepentimientoModalOpen, setArrepentimientoModalOpen] = useState(false);
  const [arrepentimientoSent, setArrepentimientoSent] = useState(false);

  // Modales Legales del Footer (Lectura Rápida)
  const [sorteoModalOpen, setSorteoModalOpen] = useState(false);
  const [rendimientosModalOpen, setRendimientosModalOpen] = useState(false);

  // Modal Bases y Condiciones con lógica de scroll obligatorio
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);

  // Visor Multimedia en Modal Interno (PDF e Imágenes)
  const [activeDocument, setActiveDocument] = useState<string | null>(null);

  const getDocumentTitle = (url: string | null) => {
    if (!url) return 'Documento Legal';
    if (url.includes('condiciones')) return 'Condiciones Generales';
    if (url.includes('titulo')) return 'Título de Capitalización';
    if (url.includes('rescate')) return 'Tabla de Rescate y Endoso';
    if (url.includes('sorteo')) return 'Sorteo';
    if (url.includes('participacion')) return 'Participación y Rendimientos';
    return 'Documento Legal';
  };

  const getDocumentSrc = (url: string | null) => {
    if (!url) return '';
    const clean = url.startsWith('/') ? url.slice(1) : url;
    return `${import.meta.env.BASE_URL}${clean}`;
  };

  // Auto-avance inmediato al seleccionar un plan
  const handleSelectPlan = (planItem: Plan) => {
    setSelectedPlan(planItem);
    setStep(1); // Inmediatamente cambia al Paso 2
  };

  // Acordeón FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Información del próximo sorteo calculada dinámicamente
  const sorteoInfo = useMemo(() => getProximoSorteoInfo(), []);

  // Bloqueo de scroll en el body cuando un modal interactivo está abierto
  useEffect(() => {
    const isAnyModalActive =
      Boolean(activeDocument) ||
      sorteoModalOpen ||
      rendimientosModalOpen ||
      retentionModalOpen ||
      successModalOpen ||
      arrepentimientoModalOpen ||
      termsModalOpen;

    if (isAnyModalActive) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [
    activeDocument,
    sorteoModalOpen,
    rendimientosModalOpen,
    retentionModalOpen,
    successModalOpen,
    arrepentimientoModalOpen,
    termsModalOpen,
  ]);

  // 3. Formulario de datos personales: Nombre, Apellido, DNI, Fecha Nacimiento, Estado Civil, WhatsApp, Email
  const [form, setFormState] = useState<Record<string, string>>({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    estadoCivil: 'Soltero',
    whatsapp: '',
    email: '',
  });

  const [formError, setFormError] = useState(false);

  const setForm = (key: string, value: string) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  // Formulario de arrepentimiento para email a Fondus
  const [arrepentimientoForm, setArrepentimientoForm] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    email: '',
    motivo: '',
  });

  const progress = useMemo(() => `${((step + 1) / 3) * 100}%`, [step]);

  // 2. Manejo de avance y retroceso del stepper
  const handleNext = () => {
    if (step === 0) {
      // Paso 1 -> Paso 2 (Datos Personales)
      setStep(1);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } else if (step === 1) {
      // Paso 2 -> Pop-up de Retención antes del Checkout
      if (
        !form.nombre.trim() ||
        !form.apellido.trim() ||
        !form.dni.trim() ||
        !form.whatsapp.trim() ||
        !form.email.trim()
      ) {
        setFormError(true);
        return;
      }
      setFormError(false);
      // Muestra el Pop-up de Retención obligatorio
      setRetentionModalOpen(true);
    } else if (step === 2) {
      // Paso 3: Validación de Checkboxes Obligatorios
      if (!checkCapitalizacion || !checkBasesCondiciones) {
        setCheckoutError(true);
        return;
      }
      setCheckoutError(false);
      setSuccessModalOpen(true);
    }
  };

  // 2. Botón "Atrás": cambia correctamente el estado a currentStep - 1
  const handlePrev = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  // Al aceptar en el Pop-up de Retención, avanza directamente a la Sección 3 (Checkout)
  const handleProceedFromRetention = () => {
    setRetentionModalOpen(false);
    setStep(2);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Aceptación de Bases y Condiciones tras scroll
  const handleAcceptTerms = () => {
    setCheckBasesCondiciones(true);
    setTermsModalOpen(false);
  };

  // Envío del Formulario de Arrepentimiento a casilla de Fondus
  const handleSendArrepentimiento = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Solicitud de Arrepentimiento - ${arrepentimientoForm.nombre} - DNI ${arrepentimientoForm.dni}`
    );
    const body = encodeURIComponent(
      `SOLICITUD DE ARREPENTIMIENTO (LEY DE DEFENSA DEL CONSUMIDOR)\n\n` +
        `Nombre y Apellido: ${arrepentimientoForm.nombre}\n` +
        `DNI: ${arrepentimientoForm.dni}\n` +
        `Teléfono: ${arrepentimientoForm.telefono}\n` +
        `Email: ${arrepentimientoForm.email}\n` +
        `Plan de referencia: ${selectedPlan.title}\n\n` +
        `Detalle / Motivo:\n${
          arrepentimientoForm.motivo || 'Solicitud de revocación contractual en término legal.'
        }\n\n` +
        `Fecha y hora: ${new Date().toLocaleString('es-AR')}`
    );
    window.location.href = `mailto:agenciadigital@fondus.com.ar?subject=${subject}&body=${body}`;
    setArrepentimientoSent(true);
  };

  // 6. Preguntas Frecuentes
  const faqs = [
    {
      q: '¿Qué es un sistema de capitalización y ahorro y quién lo regula?',
      a: 'Es un sistema que te permite ahorrar en cuotas mensuales a través de un título que, a su vencimiento, te garantiza la devolución de lo que aportaste más un interés capitalizable y una participación en las utilidades o rendimientos de las inversiones. Además, todos los meses participás de un sorteo garantizado por el monto de tu título. Fondus está regulado por la IGJ (Inspección General de Justicia), el organismo que autoriza y controla a las empresas de capitalización y ahorro en Argentina.',
    },
    {
      q: '¿Puedo retirar mi dinero antes de terminar el plan?',
      a: 'Sí. El plan tiene una duración de 300 cuotas y, a partir de la cuota 18, podés pedir el rescate y cobrar el monto que figura en la tabla de rescates incluida en tu título.',
    },
    {
      q: '¿Cómo funciona el sorteo de adjudicación?',
      a: 'El sorteo se realiza el último sábado de cada mes a través de LOTBA (Lotería de la Ciudad de Buenos Aires). Participás con tu cuota del mes paga y tu número de suscripción de 3 cifras. Si salís adjudicado, no pagás más y te llevás tu plan.',
    },
    {
      q: '¿Qué pasa después de suscribirme?',
      a: 'Dentro de las 24 hs posteriores a tu suscripción, te vamos a estar contactando para darte la bienvenida, contarte todo sobre tu plan y darte acceso a tu panel de autogestión, donde vas a poder ver el detalle completo de tu plan.',
    },
    {
      q: '¿Tengo beneficios adicionales?',
      a: 'Sí, además del sorteo de adjudicación tenés:',
      items: [
        'Bonificación de cuota: si pagás antes del día 10, participás por la bonificación del 100% de la cuota del mes siguiente.',
        'Seguro de vida y telemedicina 24 hs de Caruso Seguros.',
        'Sorteo por derecho de ingreso: si pagás el 100% de la suscripción en un único pago, participás por una moto 0 km.',
        'Sorteo con Naranja: si te adherís a tu plan con tarjeta de crédito Naranja, a fin de año participás por una moto 0 km.',
      ],
    },
  ];

  return (
    <div className="fondus-page min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-50 text-[#1d497f]">
      {/* Header Institucional con padding horizontal uniforme */}
      <header className="sticky top-0 z-20 w-full border-b border-[#1d497f]/10 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between gap-4">
          <a href="#inicio" aria-label="Fondus inicio">
            <Logo />
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {['Nosotros', 'Planes', 'Productos', 'Preguntas frecuentes'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replaceAll(' ', '-')}`}
                className="text-[11px] font-bold uppercase tracking-[.08em] text-[#1d497f] transition hover:text-[#93c46d]"
              >
                {link}
              </a>
            ))}
            <a
              href="#ingresar"
              className="border-l border-slate-200 pl-6 text-[11px] font-bold uppercase tracking-[.08em] text-[#1d497f] transition hover:text-[#93c46d]"
            >
              Ingresar
            </a>
          </nav>
          <div className="hidden items-center gap-3 text-[#1d497f] sm:flex">
            <a href="#facebook" aria-label="Facebook" className="transition hover:text-[#93c46d]">
              <Facebook size={16} />
            </a>
            <a href="#instagram" aria-label="Instagram" className="transition hover:text-[#93c46d]">
              <Instagram size={16} />
            </a>
            <a href="#whatsapp" aria-label="WhatsApp" className="transition hover:text-[#93c46d]">
              <MessageCircle size={16} />
            </a>
            <a href="#tiktok" aria-label="TikTok" className="transition hover:text-[#93c46d]">
              <Music2 size={16} />
            </a>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#1d497f] lg:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Abrir menú"
          >
            {mobileMenu ? (
              <X size={18} />
            ) : (
              <span className="space-y-1.5">
                <i className="block h-0.5 w-5 bg-current" />
                <i className="block h-0.5 w-3.5 bg-current" />
              </span>
            )}
          </button>
        </div>
        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white py-4 px-4 lg:hidden">
            <div className="grid gap-3 text-[12px] font-bold uppercase tracking-[.08em] text-[#1d497f]">
              {['Nosotros', 'Planes', 'Productos', 'Preguntas frecuentes', 'Ingresar'].map(
                (link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replaceAll(' ', '-')}`}
                    onClick={() => setMobileMenu(false)}
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Container con overflow-x-hidden preventivo */}
      <main id="inicio" className="w-full max-w-full overflow-x-hidden bg-grid">
        <div className="mx-auto w-full max-w-[1380px] px-4 pb-16 pt-8 sm:px-6 sm:pt-14 lg:px-10 lg:pt-20">
          {/* Encabezado: Badge "Adhesión digital" y Título "Sumate a Fondus" */}
          <div className="mb-10 max-w-[740px] animate-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1d497f]/30 bg-[#1d497f]/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#1d497f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#93c46d]" /> Adhesión digital
            </div>
            <h1 className="font-display text-[clamp(36px,6vw,76px)] font-extrabold leading-[.98] tracking-[-.075em] text-[#1d497f]">
              Sumate a <span className="text-[#93c46d]">Fondus.</span>
            </h1>
            {/* 3. Texto introductorio requerido */}
            <p className="mt-5 max-w-[580px] text-[15px] sm:text-[17px] leading-relaxed text-[#1d497f]/85 font-medium">
              Completá tus datos para sumarte a nuestro sistema de capitalización y ahorro.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#93c46d]" /> Proceso 100% online
              </span>
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={14} className="text-[#1d497f]" /> Datos protegidos
              </span>
            </div>
          </div>

          <AdjudicationBanner sorteoInfo={sorteoInfo} />

          {/* 2. Cajas Laterales (Limpieza):
              ELIMINA el cuadro de 'Resumen' de los pasos 1 y 2.
              La caja de 'Resumen' SÓLO debe ser visible en el Paso 3 (Revisión y Checkout).
              ELIMINA por completo el cuadro lateral de 'Dudas sobre el plan'. */}
          <div id="cotizar" className="mt-12 w-full max-w-full">
            {step < 2 ? (
              /* Pasos 1 y 2: Formulario centrado limpio sin caja lateral de resumen */
              <div className="max-w-4xl mx-auto">
                <Stepper step={step} setStep={setStep} />

                <div className="mb-6 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#93c46d] transition-[width] duration-500"
                      style={{ width: progress }}
                    />
                  </div>
                  <span className="font-mono-ui text-[11px] font-bold text-[#1d497f]">
                    0{step + 1} / 03
                  </span>
                </div>

                {/* SECCIÓN 1: ELEGÍ TU PLAN (3 Tarjetas Cuadradas Independientes) */}
                {step === 0 && (
                  <div className="animate-rise space-y-6 w-full max-w-full">
                    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6 lg:p-7">
                      <SectionHeading
                        number="01"
                        title="Elegí tu plan"
                        caption="Seleccioná la orden de compra que mejor se adapta a tus metas de capitalización."
                        icon={<CreditCard size={18} />}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        {plans.map((planItem) => (
                          <PlanCardSquare
                            key={planItem.id}
                            plan={planItem}
                            selected={planItem.id === selectedPlan.id}
                            onSelect={() => handleSelectPlan(planItem)}
                          />
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* SECCIÓN 2: DATOS PERSONALES */}
                {step === 1 && (
                  <div className="animate-rise space-y-6 w-full max-w-full">
                    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6 lg:p-7">
                      <SectionHeading
                        number="02"
                        title="Datos Personales"
                        caption="Completá tus datos de contacto para registrar tu adhesión digital."
                        icon={<UserRound size={18} />}
                      />

                      {/* 3. Inputs requeridos: Nombre y Apellido separados, Fecha de Nacimiento, Estado Civil */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Nombre"
                          placeholder="Ej: Juan"
                          value={form.nombre}
                          onChange={(value) => setForm('nombre', value)}
                        />
                        <Field
                          label="Apellido"
                          placeholder="Ej: Pérez"
                          value={form.apellido}
                          onChange={(value) => setForm('apellido', value)}
                        />
                        <Field
                          label="DNI"
                          placeholder="Ej: 34.567.890"
                          value={form.dni}
                          onChange={(value) => setForm('dni', value)}
                        />
                        <Field
                          label="Fecha de Nacimiento"
                          placeholder="dd/mm/aaaa"
                          type="date"
                          value={form.fechaNacimiento}
                          onChange={(value) => setForm('fechaNacimiento', value)}
                        />
                        <label className="block">
                          <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.09em] text-[#1d497f]">
                            Estado Civil
                          </span>
                          <select
                            value={form.estadoCivil}
                            onChange={(e) => setForm('estadoCivil', e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[14px] text-[#1d497f] outline-none transition focus:border-[#1d497f] focus:ring-4 focus:ring-[#1d497f]/10 cursor-pointer"
                          >
                            <option value="Soltero">Soltero/a</option>
                            <option value="Casado">Casado/a</option>
                            <option value="Divorciado">Divorciado/a</option>
                            <option value="Viudo">Viudo/a</option>
                          </select>
                        </label>
                        <Field
                          label="WhatsApp"
                          placeholder="Ej: 351 6123456"
                          type="tel"
                          value={form.whatsapp}
                          onChange={(value) => setForm('whatsapp', value)}
                          icon={<MessageCircle size={16} />}
                        />
                        <Field
                          label="Email"
                          placeholder="tu@email.com"
                          type="email"
                          value={form.email}
                          onChange={(value) => setForm('email', value)}
                          icon={<Mail size={16} />}
                          className="sm:col-span-2"
                        />
                      </div>

                      {formError && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] font-semibold text-amber-800">
                          <AlertCircle size={16} className="text-amber-600 shrink-0" />
                          <span>Por favor, completá todos tus datos personales para continuar.</span>
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {/* 2. Botones de Navegación del Stepper (SÓLO visible en Paso 2: Datos Personales) */}
                {step === 1 && (
                  <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center gap-2 rounded-xl border-2 border-[#1d497f]/30 px-5 py-3 text-[13px] font-bold text-[#1d497f] transition hover:bg-[#1d497f]/10 cursor-pointer"
                    >
                      <ArrowLeft size={16} /> Volver
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="group flex items-center gap-2 rounded-xl bg-[#93c46d] hover:bg-[#82b35c] px-7 py-3 text-[14px] font-bold text-[#1d497f] shadow-md transition hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Continuar</span>
                      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                    </button>
                  </div>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                  <Clock3 size={13} /> Proceso 100% digital · Menos de 2 minutos
                </p>
              </div>
            ) : (
              /* Paso 3: Revisión y Checkout con 2 columnas (Resumen en columna derecha) */
              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(315px,.85fr)] lg:gap-10">
                <section className="w-full min-w-0">
                  <Stepper step={step} setStep={setStep} />

                  <div className="mb-6 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[#93c46d] transition-[width] duration-500"
                        style={{ width: progress }}
                      />
                    </div>
                    <span className="font-mono-ui text-[11px] font-bold text-[#1d497f]">
                      03 / 03
                    </span>
                  </div>

                  {/* SECCIÓN 3: REVISIÓN Y CHECKOUT */}
                  <div className="animate-rise space-y-6 w-full max-w-full">
                    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6 lg:p-7">
                      <SectionHeading
                        number="03"
                        title="Revisión y Checkout"
                        caption="Confirmá tu adhesión con suscripción bonificada."
                        icon={<ShieldCheck size={18} />}
                      />

                      {/* Resumen de plan y cuotas */}
                      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px]">
                          <span className="text-slate-500 font-medium">Plan seleccionado</span>
                          <strong className="text-right font-bold text-[#1d497f]">
                            {selectedPlan.title}
                          </strong>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px]">
                          <span className="text-slate-500 font-medium">
                            Valor primera cuota (Cuotas 1 a 4)
                          </span>
                          <strong className="text-right font-bold text-[#1d497f] text-[15px]">
                            {formatMoney(selectedPlan.quota1to4)} / mes
                          </strong>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px]">
                          <span className="text-slate-500 font-medium">
                            Cuota reducida (Desde cuota 5)
                          </span>
                          <strong className="text-right font-bold text-[#93c46d]">
                            {formatMoney(selectedPlan.quota5on)} / mes
                          </strong>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px] bg-[#93c46d]/10">
                          <span className="font-bold text-[#1d497f]">
                            Adjudicación desde cuota 1, adjudicado no paga más
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[#1d497f] shrink-0">
                            <Check size={16} strokeWidth={2.5} className="text-[#93c46d]" /> Sí
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px] bg-[#93c46d]/10">
                          <span className="font-bold text-[#1d497f]">
                            Disponibilidad de retiro desde la cuota 18
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[#1d497f] shrink-0">
                            <Check size={16} strokeWidth={2.5} className="text-[#93c46d]" /> Sí
                          </span>
                        </div>
                      </div>

                      {/* 4. Selector de número de participación (3 cifras dinámicas) */}
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4.5">
                        <label className="block text-[13px] font-bold text-[#1d497f] mb-3">
                          Elegí tu número para participar del sorteo de la adjudicación:
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {dynamicNumbers.map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setSelectedNumber(num)}
                              className={`py-3.5 rounded-xl border-2 font-mono text-[22px] font-extrabold transition cursor-pointer ${
                                selectedNumber === num
                                  ? 'border-[#93c46d] bg-[#93c46d]/20 text-[#1d497f] shadow-sm'
                                  : 'border-slate-200 bg-slate-50/60 text-slate-500 hover:border-[#93c46d]/60 hover:text-[#1d497f]'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 4. CHECKBOXES OBLIGATORIOS CON MODAL DE SCROLL */}
                      <div className="mt-5 space-y-3">
                        <label
                          className={`flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition select-none ${
                            checkCapitalizacion
                              ? 'border-[#93c46d] bg-[#93c46d]/10'
                              : 'border-slate-200 bg-white hover:border-[#1d497f]/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checkCapitalizacion}
                            onChange={(e) => setCheckCapitalizacion(e.target.checked)}
                            className="mt-0.5 h-5 w-5 rounded border-slate-300 text-[#93c46d] focus:ring-[#93c46d] shrink-0 cursor-pointer accent-[#93c46d]"
                            required
                          />
                          <span className="text-[13px] font-semibold text-[#1d497f] leading-snug">
                            Entiendo que me estoy suscribiendo a un sistema de capitalización y ahorro.
                          </span>
                        </label>

                        <div
                          onClick={() => setTermsModalOpen(true)}
                          className={`flex items-start gap-3 rounded-2xl border-2 p-4 transition select-none cursor-pointer ${
                            checkBasesCondiciones
                              ? 'border-[#93c46d] bg-[#93c46d]/10'
                              : 'border-slate-200 bg-white hover:border-[#1d497f]/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checkBasesCondiciones}
                            onChange={(e) => e.preventDefault()}
                            readOnly
                            tabIndex={-1}
                            className="mt-0.5 h-5 w-5 rounded border-slate-300 text-[#93c46d] focus:ring-[#93c46d] shrink-0 pointer-events-none accent-[#93c46d]"
                          />
                          <span className="text-[13px] font-semibold text-[#1d497f] leading-snug">
                            Acepto{' '}
                            <span className="font-bold underline text-[#1d497f] hover:text-[#93c46d] transition">
                              bases y condiciones
                            </span>{' '}
                            del título de capitalización y ahorro emitido por Fondus.
                          </span>
                        </div>
                      </div>

                      {checkoutError && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] font-semibold text-amber-800 animate-shake">
                          <AlertCircle size={16} className="text-amber-600 shrink-0" />
                          <span>Debés marcar ambos checkboxes obligatorios antes de finalizar tu adhesión.</span>
                        </div>
                      )}
                    </section>
                  </div>

                  {/* Botones de Navegación del Stepper (Paso 3) */}
                  <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center gap-2 rounded-xl border-2 border-[#1d497f]/30 px-5 py-3 text-[13px] font-bold text-[#1d497f] transition hover:bg-[#1d497f]/10 cursor-pointer"
                    >
                      <ArrowLeft size={16} /> Volver
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="group flex items-center gap-2 rounded-xl bg-[#93c46d] hover:bg-[#82b35c] px-7 py-3 text-[14px] font-bold text-[#1d497f] shadow-md transition hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Finalizar adhesion</span>
                      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                    <Clock3 size={13} /> Proceso 100% digital · Menos de 2 minutos
                  </p>
                </section>

                {/* 2. Columna Derecha: SÓLO visible en el Paso 3 (Revisión y Checkout). SIN "Dudas sobre el plan". */}
                <aside className="sticky top-24 space-y-4">
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50 px-5 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-[16px] font-extrabold text-[#1d497f] flex items-center gap-2">
                          <img
                            src={`${import.meta.env.BASE_URL}fondus-logo.png`}
                            alt="Fondus"
                            className="h-5 w-5 rounded-md object-contain"
                          />
                          Resumen
                        </h2>
                        <span className="flex items-center gap-1.5 rounded-full bg-[#93c46d]/20 px-2.5 py-1 text-[10px] font-bold text-[#1d497f] border border-[#93c46d]/30">
                          <LockKeyhole size={11} /> Seguro
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-slate-500">Adhesión digital inmediata.</p>
                    </div>

                    <div className="space-y-4 px-5 py-5 sm:px-6">
                      {/* Plan Elegido */}
                      <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                          Plan elegido
                        </p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                          <span className="block text-[13px] font-extrabold text-[#1d497f]">
                            {selectedPlan.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] font-bold text-[#93c46d]">
                            Capital objetivo: {selectedPlan.target}
                          </span>
                        </div>
                      </div>

                      {/* Valor cuotas */}
                      <div className="border-t border-dashed border-slate-200 pt-3.5 space-y-2">
                        <div className="flex justify-between text-[13px] text-slate-600">
                          <span className="font-medium">Valor primera cuota:</span>
                          <strong className="text-[#1d497f] font-bold">
                            {formatMoney(selectedPlan.quota1to4)} / mes
                          </strong>
                        </div>
                        <div className="flex justify-between text-[13px] text-slate-600">
                          <span className="font-medium">Desde cuota 5 (reducida):</span>
                          <strong className="text-[#93c46d] font-bold">
                            {formatMoney(selectedPlan.quota5on)} / mes
                          </strong>
                        </div>
                        <div className="flex justify-between text-[13px] text-slate-600">
                          <span className="font-medium">Suscripción digital:</span>
                          <strong className="text-[#93c46d] font-bold uppercase">
                            $ 0 (Bonificada)
                          </strong>
                        </div>
                      </div>

                      {/* Total primer pago */}
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <span className="text-[13px] font-bold text-[#1d497f]">Total primer pago</span>
                            <p className="text-[11px] font-bold text-[#93c46d]">
                              ¡Suscripción 100% bonificada!
                            </p>
                          </div>
                          <span className="font-mono-ui text-[22px] font-bold tracking-[-.05em] text-[#1d497f]">
                            {formatMoney(selectedPlan.quota1to4)}
                          </span>
                        </div>
                        <p className="mt-1 text-right text-[11px] text-slate-400">
                          Sin costos de cobrador a domicilio
                        </p>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 6. Preguntas Frecuentes (Acordeón de 5 preguntas) */}
      <section id="preguntas-frecuentes" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#93c46d]">
              Transparencia Total
            </p>
            <h2 className="mt-2 font-display text-[30px] font-extrabold leading-tight tracking-[-.05em] text-[#1d497f]">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-[14px] sm:text-[15px] font-bold text-[#1d497f] transition hover:bg-slate-100/70 cursor-pointer"
                  >
                    <span className="text-[#1d497f]">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-[#93c46d] transition-transform duration-300 shrink-0 ml-3 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-[13.5px] leading-relaxed text-gray-700 border-t border-slate-200/60 pt-3">
                          <p>{faq.a}</p>
                          {faq.items && faq.items.length > 0 && (
                            <ul className="list-disc pl-5 space-y-2 mt-3 text-gray-700">
                              {faq.items.map((item, itemIdx) => (
                                <li key={itemIdx}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* 6. Enlace visible: "Ver Condiciones Generales" */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setActiveDocument('/condiciones.pdf')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1d497f]/10 border border-[#1d497f]/20 px-6 py-3 text-[13px] font-bold text-[#1d497f] transition hover:bg-[#1d497f] hover:text-white cursor-pointer"
            >
              <FileText size={16} />
              <span>Ver Condiciones Generales</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER INSTITUCIONAL Y LEGAL */}
      <footer className="bg-[#1d497f] text-white">
        <div className="mx-auto max-w-[1220px] px-5 py-14 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr] lg:gap-8">
            <div>
              <Logo light />
              <p className="mt-5 max-w-[240px] text-[13px] leading-relaxed text-white/70">
                Capitalización clara, con el respaldo que necesitás para proyectar lo que sigue.
              </p>
              <div className="mt-5 space-y-2 text-[12px] text-white/75">
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#93c46d]" /> Córdoba, Argentina
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-[#93c46d]" /> 0810 345 6638
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#93c46d]">
                Navegación
              </h3>
              <div className="space-y-3 text-[13px] text-white/70">
                <a href="#inicio" className="block transition hover:text-white">
                  Inicio
                </a>
                <a href="#planes" className="block transition hover:text-white">
                  Planes
                </a>
                <a href="#preguntas-frecuentes" className="block transition hover:text-white">
                  Preguntas frecuentes
                </a>
                <a href="#cotizar" className="block transition hover:text-white">
                  Cotizá ahora
                </a>
              </div>
            </div>

            {/* CONDICIONES GENERALES (5 Botones con Visor Modal Interno) */}
            <div>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#93c46d]">
                Condiciones Generales
              </h3>
              <div className="space-y-2">
                {/* 1. Botón CONDICIONES GENERALES */}
                <button
                  type="button"
                  onClick={() => setActiveDocument('/condiciones.pdf')}
                  className="flex items-center gap-2.5 w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-left text-[11px] font-bold text-white transition hover:bg-white/20 hover:text-[#93c46d] border border-white/5 cursor-pointer"
                  title="Documento que detalla el objeto del contrato, cálculo de cuotas y normativas de la IGJ"
                >
                  <FileText size={15} className="text-[#93c46d] shrink-0" />
                  <span className="truncate">CONDICIONES GENERALES</span>
                </button>

                {/* 2. Botón TÍTULO DE CAPITALIZACIÓN */}
                <button
                  type="button"
                  onClick={() => setActiveDocument('/titulo.pdf')}
                  className="flex items-center gap-2.5 w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-left text-[11px] font-bold text-white transition hover:bg-white/20 hover:text-[#93c46d] border border-white/5 cursor-pointer"
                  title="Documento que muestra el modelo del título, vigencia y capital nominal"
                >
                  <FileText size={15} className="text-[#93c46d] shrink-0" />
                  <span className="truncate">TÍTULO DE CAPITALIZACIÓN</span>
                </button>

                {/* 3. Botón TABLA DE RESCATE Y ENDOSO */}
                <button
                  type="button"
                  onClick={() => setActiveDocument('/rescate.pdf')}
                  className="flex items-center gap-2.5 w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-left text-[11px] font-bold text-white transition hover:bg-white/20 hover:text-[#93c46d] border border-white/5 cursor-pointer"
                  title="Documento con la tabla de valores de rescate para planes de 300 meses"
                >
                  <FileText size={15} className="text-[#93c46d] shrink-0" />
                  <span className="truncate">TABLA DE RESCATE Y ENDOSO</span>
                </button>

                {/* 4. Botón SORTEO */}
                <button
                  type="button"
                  onClick={() => setActiveDocument('/sorteo.jpg')}
                  className="flex items-center gap-2.5 w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-left text-[11px] font-bold text-white transition hover:bg-white/20 hover:text-[#93c46d] border border-white/5 cursor-pointer"
                  title="Información oficial sobre sorteos mensuales de Quiniela LOTBA S.E."
                >
                  <FileText size={15} className="text-[#93c46d] shrink-0" />
                  <span className="truncate">SORTEO</span>
                </button>

                {/* 5. Botón PARTICIPACIÓN Y RENDIMIENTOS */}
                <button
                  type="button"
                  onClick={() => setActiveDocument('/participaciondelosresultados.jpg')}
                  className="flex items-center gap-2.5 w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-left text-[11px] font-bold text-white transition hover:bg-white/20 hover:text-[#93c46d] border border-white/5 cursor-pointer"
                  title="Participación de los Titulares en los resultados de las reservas matemáticas"
                >
                  <FileText size={15} className="text-[#93c46d] shrink-0" />
                  <span className="truncate">PARTICIPACIÓN Y RENDIMIENTOS</span>
                </button>
              </div>
            </div>

            {/* 7. Columna "Atención al suscriptor" (SOLO Botón de arrepentimiento) */}
            <div>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#93c46d]">
                Atención al suscriptor
              </h3>
              <p className="mb-4 text-[13px] leading-relaxed text-white/70">
                Respaldo y transparencia en todo el ciclo de tu plan.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setArrepentimientoModalOpen(true);
                    setArrepentimientoSent(false);
                  }}
                  className="w-full rounded-xl bg-white px-4 py-3 text-left text-[12px] font-bold text-[#1d497f] transition hover:bg-[#93c46d]/20 flex items-center justify-between cursor-pointer"
                >
                  <span>Botón de Arrepentimiento</span>
                  <Mail size={15} className="text-[#1d497f]" />
                </button>
              </div>
            </div>
          </div>

          {/* Bloque Oficial IGJ */}
          <div className="mt-10 flex justify-center">
            <IgjCertificationBlock className="w-full max-w-[540px]" />
          </div>

          {/* TEXTOS FIJOS OBLIGATORIOS EN FOOTER */}
          <div className="mt-8 pt-8 border-t border-white/15">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:text-left">
              <div className="grid gap-2 text-[12px] font-semibold text-white/85 sm:grid-cols-3">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#93c46d] shrink-0" />
                  <span>Planes de Capitalización Aprobados por la I.G.J. Nº de resolución: 000289/11</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#93c46d] shrink-0" />
                  <span>Plazo de duración del plan hasta 300 meses</span>
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2 text-[#93c46d] font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#93c46d] shrink-0" />
                  <span>NO CONTAMOS CON COBRADORES A DOMICILIO</span>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center text-[11px] text-white/40">
              © 2026 Fondus · Todos los derechos reservados
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* POP-UP DE RETENCIÓN OBLIGATORIO                                           */}
      {/* ========================================================================= */}
      {retentionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-rise">
          <div className="relative w-full max-w-[480px] rounded-3xl bg-white p-7 text-center shadow-2xl border border-slate-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-sm mb-4 border border-slate-200 bg-white">
              <img
                src={`${import.meta.env.BASE_URL}fondus-logo.png`}
                alt="Fondus"
                className="h-full w-full object-contain"
              />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#93c46d]/20 border border-[#93c46d] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#1d497f]">
              <Sparkles size={13} className="text-[#93c46d]" /> Beneficio Exclusivo
            </span>

            <h2 className="mt-4 font-display text-[22px] sm:text-[24px] font-extrabold text-[#1d497f] leading-snug">
              Si completás el proceso de adhesión de manera automática, tenés la suscripción bonificada.
            </h2>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceedFromRetention}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#93c46d] hover:bg-[#82b35c] py-3.5 px-5 text-[14px] font-bold text-[#1d497f] shadow-md transition hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap size={16} /> Continuar con suscripción bonificada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PANTALLA FINAL DE ÉXITO                                                */}
      {/* ========================================================================= */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-rise">
          <div className="relative w-full max-w-[520px] rounded-3xl bg-white p-7 sm:p-9 text-center shadow-2xl border-2 border-[#93c46d]">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm overflow-hidden border border-[#93c46d]/40 bg-white">
              <img
                src={`${import.meta.env.BASE_URL}fondus-logo.png`}
                alt="Fondus"
                className="h-full w-full object-contain"
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#93c46d] text-[#1d497f] shadow-xs">
                <Check size={14} strokeWidth={3} />
              </span>
            </div>

            <div className="mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#93c46d]/20 border border-[#93c46d] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#1d497f]">
                <Sparkles size={13} className="text-[#93c46d]" /> Adhesión Exitosa
              </span>
            </div>

            {/* 5. Mensaje central exacto */}
            <h2 className="mt-4 font-display text-[22px] sm:text-[25px] font-extrabold tracking-tight text-[#1d497f]">
              Registramos correctamente tu adhesión.
            </h2>

            <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-700 font-medium">
              Te informaremos a la brevedad el resultado del pago de tu cuota número 1 para que participes del próximo sorteo.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Titular:</span>
                  <strong className="text-[#1d497f]">
                    {form.nombre} {form.apellido}
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Plan seleccionado:</span>
                  <strong className="text-[#1d497f]">{selectedPlan.title}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Número para el sorteo:</span>
                  <strong className="font-mono text-[#1d497f] font-bold text-[15px]">
                    {selectedNumber}
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Cuota número 1:</span>
                  <strong className="text-[#1d497f] font-bold">
                    {formatMoney(selectedPlan.quota1to4)}
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Suscripción digital:</span>
                  <strong className="text-[#93c46d] font-bold uppercase">
                    $ 0 (100% Bonificada)
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setActiveDocument('/titulo.pdf')}
                className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-[#1d497f] bg-white py-2.5 px-4 text-[13px] font-bold text-[#1d497f] transition hover:bg-[#1d497f]/5 cursor-pointer"
              >
                <FileText size={16} /> Ver Modelo de Título de Capitalización (PDF)
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessModalOpen(false);
                  setStep(0);
                  setCheckCapitalizacion(false);
                  setCheckBasesCondiciones(false);
                }}
                className="w-full rounded-xl bg-[#93c46d] hover:bg-[#82b35c] py-3 px-4 text-[13px] font-bold text-[#1d497f] shadow-md transition cursor-pointer"
              >
                Entendido, ir al inicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: BASES Y CONDICIONES (Scroll obligatorio hasta el final)          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {termsModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setTermsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[680px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-[#383838] px-5 py-4 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#93c46d]" />
                  <h2 className="text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wider text-slate-100">
                    Bases y Condiciones - Débito Automático
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/15 hover:text-white transition cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Container con detección de scroll al final */}
              <div
                onScroll={(e) => {
                  const target = e.currentTarget;
                  const diff = target.scrollHeight - target.scrollTop - target.clientHeight;
                  if (diff < 30) {
                    setTermsScrolled(true);
                  }
                }}
                className="overflow-y-auto p-5 sm:p-7 text-left text-[12.5px] leading-relaxed text-slate-700 space-y-4 flex-1"
              >
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[12px] font-semibold mb-4">
                  ⚠️ Para habilitar la aceptación de los Términos y Condiciones, debés deslizar la barra de desplazamiento hasta el final del documento.
                </div>

                <h3 className="font-bold text-[#1d497f] text-[15px] sm:text-[16px] uppercase border-b pb-2 mb-4">
                  Términos y Condiciones - Autorización de débito automático
                </h3>

                <p className="mb-4">
                  Fondus S.A. de Capitalización y Ahorro<br />
                  Presente<br />
                  De mi mayor consideración:
                </p>

                <p className="mb-4">
                  Por la presente les solicito que los importes correspondientes al servicio de pagos mensuales del plan de capitalización contratado a vuestra empresa sean facturados y cobrados a través de mi tarjeta de crédito/débito.
                </p>

                <p className="mb-4">
                  En tal sentido, autorizo expresamente a Fondus S.A. de Capitalización y Ahorro a realizar el cobro de las cuotas mencionadas a través de mi tarjeta de crédito/débito.
                </p>

                <p className="mb-4">
                  La presente continuará vigente hasta tanto medie comunicación fehaciente de mi parte para revocarla. Reconozco expresamente que tanto la presentación del servicio por parte de vuestra entidad como los importes que autorizo a debitar de mi resumen tiene como causa exclusiva la relación contractual existente entre Fondus S.A. de Capitalización y Ahorro y el suscriptor. Es de mi conocimiento que el abono mensual se facturará por mes calendario adelantado, como asimismo debe ser cancelado de la misma manera.
                </p>

                <p className="mb-4">
                  A su vez, declaro que he completado esta autorización de manera electrónica a través de la plataforma de vuestra empresa, proveyendo libremente de datos necesarios a los fines del débito. Expreso que a los efectos de la autorización otorgada, proveo de datos imprescindibles para la efectivización del débito aquí autorizado, razón por la cual asumo la exclusiva responsabilidad por la información correcta y precisa de tales datos para la realización de los débitos autorizados, motivo por el cual libero a vuestra empresa por incorrecta, imprecisa y/o errónea información que he brindado.
                </p>

                <p className="mb-4">
                  Por otro lado, informo que no se me ha solicitado clave o información confidencial que no sea necesaria para la ejecución de las tareas relativas a los débitos que les permito efectuar, como por ejemplo claves de banca electrónica, homebanking, token, o similares con las mismas características.
                </p>

                <p className="mb-4">
                  Por último, declaro que comprendo el contenido íntegro de la presente por haberme sido explicado de manera completa, suficiente y eficaz por vuestra entidad para el otorgamiento de esta autorización.
                </p>

                <div className="pt-2 text-center text-xs font-bold text-slate-500">
                  --- Fin de la Autorización de Débito Automático ---
                </div>
              </div>

              {/* Footer con botón condicional */}
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] font-medium text-slate-500">
                  {termsScrolled
                    ? '✓ Has llegado al final del documento.'
                    : 'Deslizá hasta el final para habilitar el botón.'}
                </span>

                <button
                  type="button"
                  onClick={handleAcceptTerms}
                  disabled={!termsScrolled}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-[13px] font-bold transition cursor-pointer ${
                    termsScrolled
                      ? 'bg-[#93c46d] hover:bg-[#82b35c] text-[#1d497f] shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  Aceptar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: VISOR MULTIMEDIA EN MODAL INTERNO (PDF e Imágenes con Zoom Táctil) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeDocument && (
          <div
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setActiveDocument(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Cabecera con estética idéntica al modal de Bases y Condiciones */}
              <div className="flex items-center justify-between bg-[#383838] px-5 py-4 text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-[#93c46d]" />
                  <h2 className="text-[13px] sm:text-[14px] font-extrabold uppercase tracking-wider text-slate-100">
                    {getDocumentTitle(activeDocument)}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDocument(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/15 hover:text-white transition cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenedor principal del modal con desbloqueo de gestos táctiles y pinch-zoom */}
              <div className="w-full h-full overflow-auto touch-pan-x touch-pan-y pinch-zoom bg-slate-100/60 flex flex-col">
                {activeDocument.endsWith('.jpg') || activeDocument.endsWith('.jpeg') || activeDocument.endsWith('.png') ? (
                  <div className="w-full h-full flex-grow flex items-center justify-center overflow-hidden">
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.8}
                      maxScale={6}
                      centerOnInit
                      wheel={{ step: 0.1 }}
                      pinch={{ step: 5 }}
                      doubleClick={{ mode: 'toggle' }}
                    >
                      <TransformComponent
                        wrapperClass="!w-full !h-full flex items-center justify-center"
                        contentClass="!w-full flex items-center justify-center"
                      >
                        <img
                          src={getDocumentSrc(activeDocument)}
                          alt="Documento Legal Fondus"
                          className="w-full h-auto object-contain cursor-zoom-in max-w-none"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  </div>
                ) : (
                  <div className="w-full h-full overflow-auto touch-auto [-webkit-overflow-scrolling:touch]">
                    <iframe
                      src={getDocumentSrc(activeDocument)}
                      className="w-full min-h-[85vh] border-none"
                      title="Documento Legal Fondus"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: BOTÓN DE ARREPENTIMIENTO (Directo al mail de Fondus)                */}
      {/* ========================================================================= */}
      {arrepentimientoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-rise">
          <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setArrepentimientoModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-[#1d497f] transition cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {!arrepentimientoSent ? (
              <form onSubmit={handleSendArrepentimiento} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white">
                    <img
                      src={`${import.meta.env.BASE_URL}fondus-logo.png`}
                      alt="Fondus"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-[20px] font-extrabold text-[#1d497f]">
                      Botón de Arrepentimiento
                    </h2>
                    <p className="text-[12px] text-slate-500">
                      Envío directo a <strong className="text-[#1d497f]">agenciadigital@fondus.com.ar</strong>
                    </p>
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed text-slate-600">
                  Conforme a la Ley de Defensa del Consumidor, completá el formulario para enviar tu solicitud formal de baja y arrepentimiento directamente a <strong className="text-[#1d497f]">agenciadigital@fondus.com.ar</strong>:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#1d497f]">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={arrepentimientoForm.nombre}
                      onChange={(e) =>
                        setArrepentimientoForm({ ...arrepentimientoForm, nombre: e.target.value })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-[13px] text-[#1d497f] outline-none focus:border-[#1d497f]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#1d497f]">
                        DNI
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 34567890"
                        value={arrepentimientoForm.dni}
                        onChange={(e) =>
                          setArrepentimientoForm({ ...arrepentimientoForm, dni: e.target.value })
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-[13px] text-[#1d497f] outline-none focus:border-[#1d497f]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#1d497f]">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 351 1234567"
                        value={arrepentimientoForm.telefono}
                        onChange={(e) =>
                          setArrepentimientoForm({ ...arrepentimientoForm, telefono: e.target.value })
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-[13px] text-[#1d497f] outline-none focus:border-[#1d497f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#1d497f]">
                      Tu Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={arrepentimientoForm.email}
                      onChange={(e) =>
                        setArrepentimientoForm({ ...arrepentimientoForm, email: e.target.value })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-[13px] text-[#1d497f] outline-none focus:border-[#1d497f]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#1d497f]">
                      Motivo / Detalle (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ingresá detalles sobre tu solicitud de arrepentimiento..."
                      value={arrepentimientoForm.motivo}
                      onChange={(e) =>
                        setArrepentimientoForm({ ...arrepentimientoForm, motivo: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-3 text-[13px] text-[#1d497f] outline-none focus:border-[#1d497f]"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#93c46d] hover:bg-[#82b35c] py-3 px-4 text-[13px] font-bold text-[#1d497f] shadow-md transition cursor-pointer"
                  >
                    <Send size={15} /> Enviar Solicitud a Fondus
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Se abrirá tu cliente de correo con los datos precompletados dirigidos a agenciadigital@fondus.com.ar
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#93c46d]/20 text-[#1d497f]">
                  <BadgeCheck size={32} className="text-[#93c46d]" />
                </div>
                <h3 className="font-display text-[20px] font-extrabold text-[#1d497f]">
                  ¡Solicitud Enviada a Fondus!
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Tu solicitud de baja fue dirigida a <strong>agenciadigital@fondus.com.ar</strong>. Nuestro equipo responderá formalmente según los plazos legales.
                </p>
                <button
                  type="button"
                  onClick={() => setArrepentimientoModalOpen(false)}
                  className="w-full rounded-xl bg-[#93c46d] hover:bg-[#82b35c] py-3 text-[13px] font-bold text-[#1d497f] transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SORTEO (Lectura Rápida)                                          */}
      {/* ========================================================================= */}
      <LegalModal
        isOpen={sorteoModalOpen}
        onClose={() => setSorteoModalOpen(false)}
        title="SORTEO"
      >
        <div className="space-y-4 text-[13.5px] sm:text-[14px] leading-relaxed text-slate-700">
          <p>
            El sorteo mensual se realiza a través de Quiniela de la Lotería de la Ciudad de Buenos Aires (LOTBA S.E.), el último sábado de cada mes, última jugada.
          </p>
          <p>
            En caso de que Lotería de la Ciudad de Buenos Aires (LOTBA S.E.) no efectuase el último sábado "sorteos de lotería" se tomará para la adjudicación el que realice Lotería de la Ciudad de Buenos Aires (LOTBA S.E.) para sí el último sábado de cada mes como última jugada de Quiniela. Si Lotería de la Ciudad de Buenos Aires (LOTBA S.E.) no realizará para sí, el último sábado de cada mes sorteos de Lotería o Quiniela, se tomará para la adjudicación, el primer sorteo de Quiniela que realice para sí Lotería de la Ciudad de Buenos Aires (LOTBA S.E.) con posterioridad al último sábado sin sorteo.
          </p>

          {/* Bloque Oficial IGJ */}
          <div className="mt-6">
            <IgjCertificationBlock className="w-full" />
          </div>
        </div>
      </LegalModal>

      {/* ========================================================================= */}
      {/* MODAL 2: PARTICIPACIÓN Y RENDIMIENTOS (Lectura Rápida)                    */}
      {/* ========================================================================= */}
      <LegalModal
        isOpen={rendimientosModalOpen}
        onClose={() => setRendimientosModalOpen(false)}
        title="PARTICIPACIÓN Y RENDIMIENTOS"
      >
        <div className="space-y-4">
          <h3 className="font-display text-[15px] sm:text-[16px] font-extrabold text-[#1d497f] tracking-wide uppercase">
            PARTICIPACION EN LOS RESULTADOS FINANCIEROS
          </h3>
          <p className="text-[13.5px] sm:text-[14px] text-slate-700 font-medium leading-relaxed">
            Los Titulares participarán en los resultados de las inversiones de sus Reservas Matemáticas de acuerdo al siguiente esquema:
          </p>

          <div className="space-y-3.5 text-[12px] sm:text-[13px] leading-relaxed text-slate-600">
            <p>
              <strong className="text-[#1d497f] font-bold">a-</strong> Mensualmente se calculará la tasa de rendimiento promedio de las inversiones que respaldan a la Reserva Matemática. A tales efectos se tomarán los intereses devengados de los Títulos Públicos, los Alquileres, los Intereses de las Prendas e Hipotecas y todo otro rendimiento proveniente de las inversiones permitidas por el Decreto N° 142.277/43, sus modificaciones y de toda otra disposición futura sobre inversiones, dictada por el Organismo competente. La tasa de rendimiento promedio se obtiene dividiendo el total de la rentabilidad obtenida por el total de la Reserva Matemática invertida.
            </p>
            <p>
              <strong className="text-[#1d497f] font-bold">b-</strong> La unidad más el rendimiento determinado en (a) se lo dividirá por 1,00371 (uno más la tasa de interés técnico).
            </p>
            <p>
              <strong className="text-[#1d497f] font-bold">c-</strong> El cociente determinado en (b) -que nunca podrá ser inferior a 1- menos la unidad será la tasa de rendimiento promedio mensual de las inversiones netas de la tasa técnica.
            </p>
            <p>
              <strong className="text-[#1d497f] font-bold">d-</strong> De esta tasa se participará el 50 % a los Titulares, lo que constituirá el coeficiente de participación.
            </p>
            <p>
              <strong className="text-[#1d497f] font-bold">e-</strong> El coeficiente de participación determinado en (d) se aplicará a las Reservas Matemáticas que dieron lugar a la rentabilidad, determinando de ese modo la participación en el resultado de las operaciones financieras de cada Titular.
            </p>
            <p>
              <strong className="text-[#1d497f] font-bold">f-</strong> La participación determinada en (e) se adicionará mensualmente a la Reserva Matemática del Titular, pero se contabilizará en forma separada a efectos de su mejor individualización. La participación en los resultados financieros determinada mediante el procedimiento indicado en el presente artículo, será invertida conjuntamente con la Reserva Matemática de cada Titular y participará de los rendimientos mensuales de las inversiones en los meses sucesivos. Al formar parte de la Reserva Matemática esta participación se cobrará: 1- en el momento en que el Titular solicite el Rescate, según el artículo octavo; ó 2- cuando salga favorecido por sorteo en la proporción correspondiente a la Reserva Matemática alcanzada ó 3- al final del vencimiento del plazo del contrato, según el artículo cuarto.
            </p>
          </div>

          {/* Bloque Oficial IGJ */}
          <div className="mt-6">
            <IgjCertificationBlock className="w-full" />
          </div>
        </div>
      </LegalModal>

      {/* 2. Pop-ups dinámicos de prueba social (oculto en pantalla final de éxito) */}
      <SocialProof hidden={successModalOpen} />
    </div>
  );
}

export default App;
