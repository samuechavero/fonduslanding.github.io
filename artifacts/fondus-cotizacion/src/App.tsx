import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  CreditCard,
  Download,
  Facebook,
  FileDown,
  FileText,
  Gift,
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
import SocialProofToasts from './components/SocialProofToasts';
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
  'Si ganas no pagas más',
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

// 3 opciones de números para participar en el sorteo mensual
const availableNumbers = ['13', '46', '83'];

function formatMoney(value: number) {
  return `$ ${new Intl.NumberFormat('es-AR').format(value)}`;
}

// Generador de PDF en cliente para documentos legales individuales
function generatePdfDownload(title: string, filename: string, lines: string[]) {
  const streamLines = lines.map((line) => `0 -20 Td\n(${line.replace(/[()]/g, '')}) Tj`).join('\n');
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 750 >> stream
BT
/F1 15 Tf
50 720 Td
(${title.replace(/[()]/g, '')}) Tj
/F1 11 Tf
${streamLines}
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000210 00000 n 
trailer << /Root 1 0 R /Size 5 >>
startxref
680
%%EOF`;

  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 4 Documentos de Condiciones Generales requeridos en el Footer
function downloadDocumentoLegal(nombreDoc: string) {
  const fileSafe = nombreDoc.toLowerCase().replace(/\s+/g, '-');
  generatePdfDownload(
    `FONDUS - ${nombreDoc.toUpperCase()}`,
    `Fondus-${fileSafe}.pdf`,
    [
      `Documento Oficial: ${nombreDoc}`,
      `Fecha de actualizacion: ${new Date().toLocaleDateString('es-AR')}`,
      'Aprobado por I.G.J. Resolucion Nº 000289/11',
      'Plazo de duracion del plan: hasta 300 meses.',
      '--------------------------------------------------------------',
      'CONDICIONES CONTRACTUALES REGULADAS:',
      '1. Adjudicacion mensual mediante sorteo oficial desde cuota 1.',
      '2. Adjudicado no paga mas: exencion total de cuotas futuras.',
      '3. Disponibilidad y rescate de fondos a partir de cuota 18.',
      '4. Cobertura médica Telemedicina 24/7 y Seguro de Vida incluidos.',
      '5. Sistema 100% digitalizado sin intermediarios a domicilio.',
      '--------------------------------------------------------------',
      'Fondus Fondo de Capitalizacion y Ahorro - Todos los derechos reservados.'
    ]
  );
}

function Logo({ light = false }: { light?: boolean }) {
  const logoUrl = `${import.meta.env.BASE_URL}fondus-logo.png`;
  return (
    <div className={`flex items-center gap-2.5 ${light ? 'text-white' : 'text-blue-900'}`}>
      <img
        src={logoUrl}
        alt="Fondus Logo"
        className="h-9 w-9 rounded-xl object-contain shadow-xs border border-white/20"
      />
      <span className="font-display text-[25px] font-extrabold tracking-[-0.06em]">fondus</span>
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
      {label && <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.09em] text-blue-900">{label}</span>}
      <span className="relative block">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500">{icon}</span>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 w-full rounded-xl border border-sky-200 bg-white px-4 text-[14px] text-blue-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 ${icon ? 'pl-10' : ''}`}
        />
      </span>
    </label>
  );
}

function SectionHeading({ number, title, caption, icon }: { number: string; title: string; caption: string; icon: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-500 border border-sky-200">{icon}</span>
      <div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="font-mono-ui text-[10px] font-bold tracking-[.1em] text-sky-500">{number}</span>
          <h2 className="font-display text-[18px] font-extrabold tracking-[-.03em] text-blue-900">{title}</h2>
        </div>
        <p className="text-[13px] text-slate-500">{caption}</p>
      </div>
    </div>
  );
}

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date('2026-09-26T21:00:00-03:00').getTime();
    const tick = () => {
      const distance = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);
  return (
    <div className="mt-4 grid max-w-[330px] grid-cols-4 gap-2">
      {[
        ['DÍAS', time.days],
        ['HORAS', time.hours],
        ['MIN', time.minutes],
        ['SEG', time.seconds],
      ].map(([label, value]) => (
        <div key={label} className="rounded-lg border border-white/15 bg-green-700 px-2 py-2.5 text-center">
          <div className="font-mono-ui text-[18px] font-bold leading-none text-white">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-[9px] font-bold tracking-[.13em] text-white/70">{label}</div>
        </div>
      ))}
    </div>
  );
}

function AdjudicationBanner() {
  return (
    <section className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-7">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">Último número adjudicado</p>
          <p className="text-[13px] font-semibold text-blue-900">Sorteo Agosto 2026</p>
        </div>
        <span className="font-mono-ui text-[40px] font-bold leading-none tracking-[-.08em] text-sky-500">390</span>
      </div>
      <div className="relative overflow-hidden bg-green-600 px-5 py-5 sm:px-7 text-white">
        <div className="absolute -right-12 -top-20 h-44 w-44 rounded-full border-[22px] border-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.11em] text-white/80">
            <span className="pulse-dot h-2 w-2 rounded-full bg-green-300" />
            Próxima adjudicación
          </div>
          <p className="mt-1 text-[14px] font-semibold text-white">Sábado 26 de septiembre · 21:00 hs</p>
          <Countdown />
        </div>
      </div>
    </section>
  );
}

function Stepper({ step, setStep }: { step: number; setStep: (step: number) => void }) {
  const steps = ['1. Elegí tu plan', '2. Datos Personales', '3. Revisión y Checkout'];
  return (
    <div className="mb-8 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-sky-100 bg-white p-1.5 shadow-xs">
      {steps.map((name, index) => {
        const active = step === index;
        const done = step > index;
        return (
          <button
            key={name}
            type="button"
            onClick={() => (index <= step ? setStep(index) : undefined)}
            className={`flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-bold transition ${active ? 'bg-sky-50 text-blue-900 border border-sky-300 shadow-xs' : done ? 'text-green-700' : 'text-slate-400'}`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${active ? 'bg-sky-500 text-white' : done ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {done ? <Check size={12} strokeWidth={3} /> : index + 1}
            </span>
            {name}
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
      className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left cursor-pointer transition-all duration-200 ${
        selected
          ? 'border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20'
          : isFeatured
          ? 'border-sky-300 bg-white hover:border-sky-500 shadow-xs'
          : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/60'
      }`}
    >
      {/* Badge Destacada / Más Elegido */}
      {plan.tag && (
        <span className="absolute -top-3 right-4 rounded-full bg-green-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
          {plan.tag}
        </span>
      )}

      <div>
        {/* Selector radial */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-sky-500' : 'border-slate-300'}`}>
            {selected && <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-100/70 px-2 py-0.5 rounded-md">
            {plan.target}
          </span>
        </div>

        {/* Título de la tarjeta */}
        <h3 className="font-display text-[15px] font-extrabold text-blue-900 leading-snug">
          {plan.title}
        </h3>

        {/* Progresión de cuotas */}
        <div className="mt-4 space-y-2 rounded-xl border border-sky-100 bg-white p-3 shadow-xs">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cuotas 1 a 4:</span>
            <span className="font-mono-ui text-[16px] font-extrabold text-sky-500">
              {formatMoney(plan.quota1to4)}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-slate-100 pt-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-green-700">Desde cuota 5:</span>
            <span className="font-mono-ui text-[16px] font-extrabold text-green-700">
              {formatMoney(plan.quota5on)}
            </span>
          </div>
        </div>

        {/* Beneficios en las 3 tarjetas */}
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] font-medium text-blue-900">
          <p className="flex items-center gap-1.5 font-semibold text-green-700">
            <Check size={13} strokeWidth={3} className="shrink-0" /> Sorteos mensuales desde cuota 1
          </p>
          <p className="flex items-center gap-1.5">
            <Check size={13} strokeWidth={3} className="shrink-0 text-green-700" /> Si ganas no pagas más
          </p>
          <p className="flex items-center gap-1.5">
            <Check size={13} strokeWidth={3} className="shrink-0 text-green-700" /> Disponibilidad de fondos desde cuota 18
          </p>
          <p className="flex items-center gap-1.5 text-sky-600 font-semibold">
            <Sparkles size={12} className="shrink-0 text-sky-500" /> Telemedicina 24/7 y Seguro de vida
          </p>
        </div>
      </div>

      <div className="mt-5 pt-2">
        <button
          type="button"
          className={`w-full py-2 px-3 rounded-xl text-[12px] font-bold transition text-center ${
            selected
              ? 'bg-sky-500 text-white'
              : 'border border-sky-300 text-sky-600 hover:bg-sky-50'
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
  const [selectedNumber, setSelectedNumber] = useState<string>('13');
  const [mobileMenu, setMobileMenu] = useState(false);

  // Checkboxes obligatorios en checkout
  const [checkCapitalizacion, setCheckCapitalizacion] = useState(false);
  const [checkBasesCondiciones, setCheckBasesCondiciones] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  // Modales
  const [retentionModalOpen, setRetentionModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [arrepentimientoModalOpen, setArrepentimientoModalOpen] = useState(false);
  const [arrepentimientoSent, setArrepentimientoSent] = useState(false);

  // Formulario de datos personales (Sin ningún campo de domicilio)
  const [form, setFormState] = useState<Record<string, string>>({
    name: '',
    dni: '',
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

  // Manejo del avance en el stepper
  const handleNext = () => {
    if (step === 0) {
      // Paso 1 -> Paso 2 (Datos Personales)
      setStep(1);
    } else if (step === 1) {
      // Paso 2 -> Pop-up de Retención antes del Checkout
      if (!form.name || !form.dni || !form.whatsapp || !form.email) {
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

  // Al aceptar en el Pop-up de Retención, avanza directamente a la Sección 3 (Checkout)
  const handleProceedFromRetention = () => {
    setRetentionModalOpen(false);
    setStep(2);
  };

  // Envío del Formulario de Arrepentimiento a casilla de Fondus
  const handleSendArrepentimiento = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Solicitud de Arrepentimiento - ${arrepentimientoForm.nombre} - DNI ${arrepentimientoForm.dni}`);
    const body = encodeURIComponent(
      `SOLICITUD DE ARREPENTIMIENTO (LEY DE DEFENSA DEL CONSUMIDOR)\n\n` +
      `Nombre y Apellido: ${arrepentimientoForm.nombre}\n` +
      `DNI: ${arrepentimientoForm.dni}\n` +
      `Teléfono: ${arrepentimientoForm.telefono}\n` +
      `Email: ${arrepentimientoForm.email}\n` +
      `Plan de referencia: ${selectedPlan.title}\n\n` +
      `Detalle / Motivo:\n${arrepentimientoForm.motivo || 'Solicitud de revocación contractual en término legal.'}\n\n` +
      `Fecha y hora: ${new Date().toLocaleString('es-AR')}`
    );
    window.location.href = `mailto:atencion@fondus.com.ar?subject=${subject}&body=${body}`;
    setArrepentimientoSent(true);
  };

  return (
    <div className="fondus-page min-h-[100dvh] bg-slate-50 text-blue-900">
      {/* Header Institucional */}
      <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <a href="#inicio" aria-label="Fondus inicio"><Logo /></a>
          <nav className="hidden items-center gap-6 lg:flex">
            {['Nosotros', 'Planes', 'Productos', 'Preguntas frecuentes'].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} className="text-[11px] font-bold uppercase tracking-[.08em] text-blue-900 transition hover:text-sky-500">{link}</a>
            ))}
            <a href="#ingresar" className="border-l border-sky-100 pl-6 text-[11px] font-bold uppercase tracking-[.08em] text-sky-500 transition hover:text-blue-900">Ingresar</a>
          </nav>
          <div className="hidden items-center gap-3 text-sky-500 sm:flex">
            <a href="#facebook" aria-label="Facebook" className="transition hover:text-blue-900"><Facebook size={16} /></a>
            <a href="#instagram" aria-label="Instagram" className="transition hover:text-blue-900"><Instagram size={16} /></a>
            <a href="#whatsapp" aria-label="WhatsApp" className="transition hover:text-blue-900"><MessageCircle size={16} /></a>
            <a href="#tiktok" aria-label="TikTok" className="transition hover:text-blue-900"><Music2 size={16} /></a>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 text-blue-900 lg:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Abrir menú"
          >
            {mobileMenu ? <X size={18} /> : <span className="space-y-1.5"><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-3.5 bg-current" /></span>}
          </button>
        </div>
        {mobileMenu && (
          <div className="border-t border-sky-100 bg-white px-5 py-4 lg:hidden">
            <div className="grid gap-3 text-[12px] font-bold uppercase tracking-[.08em] text-blue-900">
              {['Nosotros', 'Planes', 'Productos', 'Preguntas frecuentes', 'Ingresar'].map((link) => (
                <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMobileMenu(false)}>{link}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main id="inicio" className="bg-grid">
        <div className="mx-auto max-w-[1380px] px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
          
          {/* Encabezado: Badge "Adhesión digital" y Título "Sumate a Fondus" */}
          <div className="mb-10 max-w-[740px] animate-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-sky-500">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Adhesión digital
            </div>
            <h1 className="font-display text-[clamp(42px,6vw,76px)] font-extrabold leading-[.98] tracking-[-.075em] text-sky-500">
              Sumate a <span className="text-blue-900">Fondus.</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-blue-900/80 font-medium">
              Completá tus datos para sumarte a nuestro fondo de capitalización y ahorro.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-green-600" /> Proceso 100% online</span>
              <span className="flex items-center gap-1.5"><LockKeyhole size={14} className="text-sky-500" /> Datos protegidos</span>
            </div>
          </div>

          <AdjudicationBanner />

          {/* 2 Column Layout (Izquierda 65% / Derecha 35% en Desktop) */}
          <div id="cotizar" className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(315px,.85fr)] lg:gap-12">
            
            {/* Columna Izquierda: Contenido y Stepper */}
            <section>
              <Stepper step={step} setStep={setStep} />
              
              <div className="mb-5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sky-100">
                  <div className="h-full rounded-full bg-sky-500 transition-[width] duration-500" style={{ width: progress }} />
                </div>
                <span className="font-mono-ui text-[10px] font-bold text-sky-600">0{step + 1} / 03</span>
              </div>

              {/* SECCIÓN 1: ELEGÍ TU PLAN (3 Tarjetas Cuadradas Independientes) */}
              {step === 0 && (
                <div className="animate-rise space-y-6">
                  <section className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs sm:p-7">
                    <SectionHeading
                      number="01"
                      title="Elegí tu plan"
                      caption="Seleccioná la orden de compra que mejor se adapta a tus metas de capitalización."
                      icon={<CreditCard size={18} />}
                    />
                    
                    {/* Renderiza 3 tarjetas cuadradas independientes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map((planItem) => (
                        <PlanCardSquare
                          key={planItem.id}
                          plan={planItem}
                          selected={planItem.id === selectedPlan.id}
                          onSelect={() => setSelectedPlan(planItem)}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* SECCIÓN 2: DATOS PERSONALES (Nombre, DNI, WhatsApp, Email) */}
              {step === 1 && (
                <div className="animate-rise space-y-6">
                  <section className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs sm:p-7">
                    <SectionHeading
                      number="02"
                      title="Datos Personales"
                      caption="Completá tus datos de contacto para registrar tu adhesión digital."
                      icon={<UserRound size={18} />}
                    />
                    
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Nombre completo"
                        placeholder="Ej: Juan Martín Pérez"
                        value={form.name}
                        onChange={(value) => setForm('name', value)}
                        className="sm:col-span-2"
                      />
                      <Field
                        label="DNI"
                        placeholder="Ej: 34.567.890"
                        value={form.dni}
                        onChange={(value) => setForm('dni', value)}
                      />
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

              {/* SECCIÓN 3: REVISIÓN Y CHECKOUT */}
              {step === 2 && (
                <div className="animate-rise space-y-6">
                  <section className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs sm:p-7">
                    <SectionHeading
                      number="03"
                      title="Revisión y Checkout"
                      caption="Confirmá tu adhesión con suscripción bonificada."
                      icon={<ShieldCheck size={18} />}
                    />

                    {/* Resumen de plan y cuotas */}
                    <div className="divide-y divide-sky-100 rounded-2xl border border-sky-200 bg-white overflow-hidden shadow-xs">
                      <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px]">
                        <span className="text-slate-500 font-medium">Plan seleccionado</span>
                        <strong className="text-right font-bold text-blue-900">{selectedPlan.title}</strong>
                      </div>

                      <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px]">
                        <span className="text-slate-500 font-medium">Valor primera cuota (Cuotas 1 a 4)</span>
                        <strong className="text-right font-bold text-sky-500 text-[15px]">
                          {formatMoney(selectedPlan.quota1to4)} / mes
                        </strong>
                      </div>

                      <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px]">
                        <span className="text-slate-500 font-medium">Cuota reducida (Desde cuota 5)</span>
                        <strong className="text-right font-bold text-green-700">
                          {formatMoney(selectedPlan.quota5on)} / mes
                        </strong>
                      </div>

                      {/* TEXTOS OBLIGATORIOS REQUERIDOS */}
                      <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px] bg-sky-50/50">
                        <span className="font-bold text-blue-900">
                          Adjudicación desde cuota 1, adjudicado no paga más
                        </span>
                        <span className="flex items-center gap-1 font-bold text-green-700 shrink-0">
                          <Check size={16} strokeWidth={2.5} /> Sí
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 px-5 py-4 text-[13px] bg-sky-50/50">
                        <span className="font-bold text-blue-900">
                          Disponibilidad de retiro desde la cuota 18
                        </span>
                        <span className="flex items-center gap-1 font-bold text-green-700 shrink-0">
                          <Check size={16} strokeWidth={2.5} /> Sí
                        </span>
                      </div>
                    </div>

                    {/* Selector de número de participación (3 opciones) */}
                    <div className="mt-5 rounded-2xl border border-sky-200 bg-white p-4.5">
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-blue-900 mb-2">
                        Elegí tu número para el sorteo mensual:
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {availableNumbers.map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSelectedNumber(num)}
                            className={`py-3 rounded-xl border-2 font-mono text-[20px] font-extrabold transition ${
                              selectedNumber === num
                                ? 'border-sky-500 bg-sky-50 text-sky-600 shadow-xs'
                                : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-sky-300'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CHECKBOXES OBLIGATORIOS ANTES DE PAGAR */}
                    <div className="mt-5 space-y-3">
                      <label className={`flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition select-none ${
                        checkCapitalizacion ? 'border-sky-500 bg-sky-50/60' : 'border-slate-200 bg-white hover:border-sky-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={checkCapitalizacion}
                          onChange={(e) => setCheckCapitalizacion(e.target.checked)}
                          className="mt-0.5 h-5 w-5 rounded border-sky-300 text-sky-500 focus:ring-sky-500 shrink-0 cursor-pointer accent-sky-500"
                          required
                        />
                        <span className="text-[13px] font-semibold text-blue-900 leading-snug">
                          Entiendo que me estoy suscribiendo a un plan de capitalización y ahorro.
                        </span>
                      </label>

                      <label className={`flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition select-none ${
                        checkBasesCondiciones ? 'border-sky-500 bg-sky-50/60' : 'border-slate-200 bg-white hover:border-sky-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={checkBasesCondiciones}
                          onChange={(e) => setCheckBasesCondiciones(e.target.checked)}
                          className="mt-0.5 h-5 w-5 rounded border-sky-300 text-sky-500 focus:ring-sky-500 shrink-0 cursor-pointer accent-sky-500"
                          required
                        />
                        <span className="text-[13px] font-semibold text-blue-900 leading-snug">
                          Acepto bases y condiciones del título de capitalización y ahorro emitido por Fondus.
                        </span>
                      </label>
                    </div>

                    {checkoutError && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] font-semibold text-amber-800 animate-shake">
                        <AlertCircle size={16} className="text-amber-600 shrink-0" />
                        <span>Debés marcar ambos checkboxes obligatorios antes de finalizar tu adhesión.</span>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* Botones de Navegación del Stepper */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="flex items-center gap-2 rounded-xl border border-sky-300 px-5 py-3 text-[12px] font-bold text-sky-600 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                >
                  <ArrowLeft size={15} /> Volver
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="group flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-7 py-3 text-[13px] font-bold text-white shadow-md transition hover:-translate-y-0.5"
                >
                  {step === 2 ? 'Finalizar adhesión bonificada' : 'Continuar'} <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                </button>
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                <Clock3 size={13} /> Proceso 100% digital · Menos de 2 minutos
              </p>
            </section>

            {/* Columna Derecha: Resumen Sticky (SIN CUPÓN DE DESCUENTO) */}
            <aside className="sticky top-24 space-y-4">
              <section className="overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
                <div className="border-b border-sky-100 bg-sky-50/50 px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[16px] font-extrabold text-blue-900 flex items-center gap-2">
                      <img src={`${import.meta.env.BASE_URL}fondus-logo.png`} alt="Fondus" className="h-5 w-5 rounded-md object-contain" />
                      Resumen
                    </h2>
                    <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700 border border-green-200">
                      <LockKeyhole size={11} /> Seguro
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-slate-500">Adhesión digital inmediata.</p>
                </div>
                
                <div className="space-y-4 px-5 py-5 sm:px-6">
                  {/* Plan Elegido */}
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">Plan elegido</p>
                    <div className="rounded-xl border border-sky-100 bg-slate-50 p-3.5">
                      <span className="block text-[13px] font-extrabold text-blue-900">{selectedPlan.title}</span>
                      <span className="mt-0.5 block text-[11px] font-bold text-sky-500">Capital objetivo: {selectedPlan.target}</span>
                    </div>
                  </div>

                  {/* Valor primera cuota */}
                  <div className="border-t border-dashed border-slate-200 pt-3.5 space-y-2">
                    <div className="flex justify-between text-[13px] text-slate-600">
                      <span className="font-medium">Valor primera cuota:</span>
                      <strong className="text-sky-500 font-bold">{formatMoney(selectedPlan.quota1to4)} / mes</strong>
                    </div>
                    <div className="flex justify-between text-[13px] text-slate-600">
                      <span className="font-medium">Desde cuota 5 (reducida):</span>
                      <strong className="text-green-700 font-bold">{formatMoney(selectedPlan.quota5on)} / mes</strong>
                    </div>
                    <div className="flex justify-between text-[13px] text-slate-600">
                      <span className="font-medium">Suscripción digital:</span>
                      <strong className="text-green-700 font-bold uppercase">$ 0 (Bonificada)</strong>
                    </div>
                  </div>

                  {/* Total primer pago */}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[13px] font-bold text-blue-900">Total primer pago</span>
                        <p className="text-[11px] font-bold text-green-700">¡Suscripción 100% bonificada!</p>
                      </div>
                      <span className="font-mono-ui text-[22px] font-bold tracking-[-.05em] text-blue-900">
                        {formatMoney(selectedPlan.quota1to4)}
                      </span>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-slate-400">Sin costos de cobrador a domicilio</p>
                  </div>
                </div>
              </section>

              {/* Caja de ayuda */}
              <section className="rounded-2xl bg-blue-900 p-5 text-white shadow-md sm:p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sky-400">
                  <MessageCircle size={20} />
                </div>
                <h3 className="font-display text-[16px] font-bold">¿Dudas sobre el plan?</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/75">
                  Estamos a tu disposición de lunes a viernes para brindarte información transparente.
                </p>
                <button
                  type="button"
                  onClick={() => window.alert('Nuestro equipo de atención Fondus está listo para asistirte.')}
                  className="mt-4 flex items-center gap-2 text-[12px] font-bold text-sky-400 transition hover:text-white"
                >
                  Consultar a Fondus <ArrowRight size={14} />
                </button>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* Preguntas Frecuentes */}
      <section id="preguntas" className="border-t border-sky-100 bg-white">
        <div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-[.9fr_1.5fr] lg:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-sky-500">Transparencia Total</p>
            <h2 className="mt-2 font-display text-[30px] font-extrabold leading-tight tracking-[-.05em] text-blue-900">Claridad en cada paso.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              '¿Qué es un fondo de capitalización?',
              '¿Cómo se realiza la adjudicación mensual?',
              '¿Puedo cambiar mi número de sorteo?',
              '¿Qué pasa después de suscribirme?',
            ].map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => window.alert('Estamos preparando la respuesta para vos.')}
                className="flex items-center justify-between rounded-xl border border-sky-100 bg-slate-50 px-4 py-4 text-left text-[13px] font-semibold text-blue-900 transition hover:border-sky-300 hover:bg-sky-50/50"
              >
                <span>{question}</span>
                <HelpCircle size={16} className="shrink-0 text-sky-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOOTER INSTITUCIONAL Y LEGAL */}
      <footer className="mt-16 bg-blue-900 text-white">
        <div className="mx-auto max-w-[1220px] px-5 py-14 sm:px-8">
          
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr] lg:gap-8">
            <div>
              <Logo light />
              <p className="mt-5 max-w-[240px] text-[13px] leading-relaxed text-white/70">
                Capitalización clara, con el respaldo que necesitás para proyectar lo que sigue.
              </p>
              <div className="mt-5 space-y-2 text-[12px] text-white/75">
                <p className="flex items-center gap-2"><MapPin size={14} className="text-sky-400" /> Córdoba, Argentina</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-sky-400" /> 0810 345 6638</p>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-sky-400">Navegación</h3>
              <div className="space-y-3 text-[13px] text-white/70">
                <a href="#inicio" className="block transition hover:text-white">Inicio</a>
                <a href="#planes" className="block transition hover:text-white">Planes</a>
                <a href="#preguntas" className="block transition hover:text-white">Preguntas frecuentes</a>
                <a href="#cotizar" className="block transition hover:text-white">Cotizá ahora</a>
              </div>
            </div>

            {/* BOTONERA CON 4 BOTONES DE DESCARGA DE PDF INDIVIDUALES */}
            <div>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-sky-400">Condiciones Generales</h3>
              <div className="space-y-2">
                {[
                  'TITULO DE CAPITALIZACIÓN',
                  'TABLA DE RESCATE Y ENDOSO',
                  'SORTEO',
                  'PARTICIPACIÓN Y RENDIMIENTOS',
                ].map((docName) => (
                  <button
                    key={docName}
                    type="button"
                    onClick={() => downloadDocumentoLegal(docName)}
                    className="flex items-center gap-2 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-[11px] font-bold text-white transition hover:bg-white/20 hover:text-sky-300"
                  >
                    <FileDown size={14} className="text-sky-400 shrink-0" />
                    <span className="truncate">{docName} (PDF)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* BOTÓN DE ARREPENTIMIENTO */}
            <div>
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-sky-400">Atención al Asociado</h3>
              <p className="mb-4 text-[13px] leading-relaxed text-white/70">
                Respaldo y transparencia en todo el ciclo de tu plan.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => { setArrepentimientoModalOpen(true); setArrepentimientoSent(false); }}
                  className="w-full rounded-xl bg-white px-4 py-3 text-left text-[12px] font-bold text-blue-900 transition hover:bg-sky-50 flex items-center justify-between"
                >
                  <span>Botón de Arrepentimiento</span>
                  <Mail size={15} className="text-sky-500" />
                </button>
                <button
                  type="button"
                  onClick={() => window.alert('Para consultas de baja formal, nuestro equipo te asiste en atencion@fondus.com.ar.')}
                  className="w-full rounded-xl border border-white/25 px-4 py-2.5 text-left text-[12px] font-bold text-white transition hover:border-white/60"
                >
                  Baja de Servicio
                </button>
              </div>
            </div>
          </div>

          {/* TEXTOS FIJOS OBLIGATORIOS EN FOOTER */}
          <div className="mt-12 pt-8 border-t border-white/15">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:text-left">
              <div className="grid gap-2 text-[12px] font-semibold text-white/85 sm:grid-cols-3">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0" />
                  <span>Planes de Capitalización Aprobados por la I.G.J. Nº de resolución: 000289/11</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                  <span>Plazo de duración del plan hasta 300 meses</span>
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2 text-amber-300 font-bold">
                  <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
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
      {/* POP-UP DE RETENCIÓN OBLIGATORIO (Al avanzar sin pedir asesor)              */}
      {/* ========================================================================= */}
      {retentionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/60 p-4 backdrop-blur-sm animate-rise">
          <div className="relative w-full max-w-[480px] rounded-3xl bg-white p-7 text-center shadow-2xl border border-sky-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-sm mb-4 border border-sky-200 bg-white">
              <img src={`${import.meta.env.BASE_URL}fondus-logo.png`} alt="Fondus" className="h-full w-full object-contain" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-300 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-green-800">
              <Sparkles size={13} className="text-green-600" /> Beneficio Exclusivo
            </span>

            {/* Texto exacto requerido */}
            <h2 className="mt-4 font-display text-[22px] sm:text-[24px] font-extrabold text-blue-900 leading-snug">
              Si completás el proceso de adhesión de manera automática, tenés la suscripción bonificada.
            </h2>

            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Avanzando de forma 100% digital accedés a tu plan <strong className="text-blue-900">{selectedPlan.title}</strong> con cuota de ingreso $0.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceedFromRetention}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-600 hover:bg-green-700 py-3.5 px-5 text-[14px] font-bold text-white shadow-md transition hover:-translate-y-0.5"
              >
                <Zap size={16} /> Continuar con Suscripción Bonificada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-UP DE ÉXITO DE ADHESIÓN                                               */}
      {/* ========================================================================= */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/60 p-4 backdrop-blur-sm animate-rise">
          <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-green-300">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm overflow-hidden border border-green-300 bg-white">
              <img src={`${import.meta.env.BASE_URL}fondus-logo.png`} alt="Fondus" className="h-full w-full object-contain" />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow-xs">
                <Check size={14} strokeWidth={3} />
              </span>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-300 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-green-800">
                <Sparkles size={13} className="text-green-600" /> Suscripción 100% Bonificada
              </span>
            </div>

            <h2 className="mt-3 font-display text-[24px] sm:text-[26px] font-extrabold tracking-tight text-blue-900">
              ¡Adhesión Digital Confirmada!
            </h2>
            
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              ¡Felicitaciones {form.name ? <strong>{form.name}</strong> : 'asociado/a'}! Tu trámite para el <strong className="text-blue-900">{selectedPlan.title}</strong> ha sido completado con éxito con costo de suscripción bonificado ($0).
            </p>

            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50/50 p-4 text-left">
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between py-1 border-b border-green-100">
                  <span className="text-slate-500 font-medium">Plan:</span>
                  <strong className="text-blue-900">{selectedPlan.title}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <span className="text-slate-500 font-medium">Valor primera cuota:</span>
                  <strong className="text-sky-500 font-bold">{formatMoney(selectedPlan.quota1to4)} / mes</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <span className="text-slate-500 font-medium">Desde cuota 5 (reducida):</span>
                  <strong className="text-green-700 font-bold">{formatMoney(selectedPlan.quota5on)} / mes</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-green-100">
                  <span className="text-slate-500 font-medium">Costo de suscripción:</span>
                  <strong className="text-green-700 font-bold uppercase">$ 0 (100% Bonificada)</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Número para el sorteo:</span>
                  <strong className="font-mono text-sky-500 font-bold text-[14px]">{selectedNumber}</strong>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-green-200 space-y-1 text-[11px] font-bold text-green-800">
                <p className="flex items-center gap-1.5"><Check size={12} className="text-green-600" strokeWidth={3} /> Adjudicación desde cuota 1, adjudicado no paga más</p>
                <p className="flex items-center gap-1.5"><Check size={12} className="text-green-600" strokeWidth={3} /> Disponibilidad de retiro desde la cuota 18</p>
                <p className="flex items-center gap-1.5"><Check size={12} className="text-green-600" strokeWidth={3} /> Telemedicina 24/7 y Seguro de vida</p>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => downloadDocumentoLegal('TITULO DE CAPITALIZACIÓN')}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-green-600 bg-white py-2.5 px-4 text-[12px] font-bold text-green-700 transition hover:bg-green-50"
              >
                <Download size={15} /> Descargar Título de Capitalización (PDF)
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setSuccessModalOpen(false);
                  setStep(0);
                  setCheckCapitalizacion(false);
                  setCheckBasesCondiciones(false);
                }}
                className="w-full rounded-xl bg-green-600 hover:bg-green-700 py-3 px-4 text-[13px] font-bold text-white shadow-md transition"
              >
                Entendido, ir al inicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FORMULARIO DE BOTÓN DE ARREPENTIMIENTO (Directo al mail de Fondus) */}
      {/* ========================================================================= */}
      {arrepentimientoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/60 p-4 backdrop-blur-sm animate-rise">
          <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl border border-sky-200">
            <button
              type="button"
              onClick={() => setArrepentimientoModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-blue-900 transition"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {!arrepentimientoSent ? (
              <form onSubmit={handleSendArrepentimiento} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-xs border border-sky-100 bg-white">
                    <img src={`${import.meta.env.BASE_URL}fondus-logo.png`} alt="Fondus" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-display text-[20px] font-extrabold text-blue-900">
                      Botón de Arrepentimiento
                    </h2>
                    <p className="text-[12px] text-slate-500">
                      Envío directo a <strong className="text-blue-900">atencion@fondus.com.ar</strong>
                    </p>
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed text-slate-600">
                  Conforme a la Ley de Defensa del Consumidor, completá el formulario para enviar tu solicitud formal de revocación directamente al correo oficial de Fondus:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-blue-900">Nombre y Apellido</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={arrepentimientoForm.nombre}
                      onChange={(e) => setArrepentimientoForm({ ...arrepentimientoForm, nombre: e.target.value })}
                      className="h-11 w-full rounded-xl border border-sky-200 px-3 text-[13px] text-blue-900 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-blue-900">DNI</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 30.123.456"
                        value={arrepentimientoForm.dni}
                        onChange={(e) => setArrepentimientoForm({ ...arrepentimientoForm, dni: e.target.value })}
                        className="h-11 w-full rounded-xl border border-sky-200 px-3 text-[13px] text-blue-900 outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-blue-900">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 351 1234567"
                        value={arrepentimientoForm.telefono}
                        onChange={(e) => setArrepentimientoForm({ ...arrepentimientoForm, telefono: e.target.value })}
                        className="h-11 w-full rounded-xl border border-sky-200 px-3 text-[13px] text-blue-900 outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-blue-900">Tu Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={arrepentimientoForm.email}
                      onChange={(e) => setArrepentimientoForm({ ...arrepentimientoForm, email: e.target.value })}
                      className="h-11 w-full rounded-xl border border-sky-200 px-3 text-[13px] text-blue-900 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-blue-900">Motivo / Detalle (Opcional)</label>
                    <textarea
                      rows={2}
                      placeholder="Ingresá detalles sobre tu solicitud de arrepentimiento..."
                      value={arrepentimientoForm.motivo}
                      onChange={(e) => setArrepentimientoForm({ ...arrepentimientoForm, motivo: e.target.value })}
                      className="w-full rounded-xl border border-sky-200 p-3 text-[13px] text-blue-900 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-sky-500 hover:bg-sky-600 py-3 px-4 text-[13px] font-bold text-white shadow-md transition"
                  >
                    <Send size={15} /> Enviar Correo a Fondus
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Se abrirá tu cliente de correo con los datos precompletados a atencion@fondus.com.ar
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <BadgeCheck size={32} />
                </div>
                <h3 className="font-display text-[20px] font-extrabold text-blue-900">
                  ¡Solicitud Enviada a Fondus!
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Tu solicitud de arrepentimiento fue enviada a <strong>atencion@fondus.com.ar</strong>. Nuestro equipo responderá formalmente según los plazos legales.
                </p>
                <button
                  type="button"
                  onClick={() => setArrepentimientoModalOpen(false)}
                  className="w-full rounded-xl bg-green-600 hover:bg-green-700 py-3 text-[13px] font-bold text-white transition"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toasts dinámicos de prueba social */}
      <SocialProofToasts />
    </div>
  );
}

export default App;