import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Facebook,
  HelpCircle,
  Home,
  Instagram,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  X,
} from 'lucide-react';

type Plan = {
  id: string;
  name: string;
  amount: number;
  target: string;
  tag?: string;
};

const plans: Plan[] = [
  { id: 'moto', name: 'Moto 0KM', amount: 28600, target: '$ 4.200.000', tag: 'Más elegido' },
  { id: 'auto', name: 'Auto 0KM', amount: 49800, target: '$ 18.000.000' },
  { id: 'millones', name: '20 Millones', amount: 74200, target: '$ 20.000.000' },
];

const provinces = ['Córdoba', 'Buenos Aires', 'Santa Fe', 'Mendoza', 'Tucumán'];
const availableNumbers = ['01', '04', '13', '22', '37', '46', '58', '71', '83', '96'];

function formatMoney(value: number) {
  return `$ ${new Intl.NumberFormat('es-AR').format(value)}`;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${light ? 'text-white' : 'text-[#12345a]'}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#1ba9dd] text-[25px] font-extrabold leading-none text-white shadow-[0_6px_14px_rgba(27,169,221,.25)]">
        f
        <span className="absolute -bottom-0.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#45bf73]" />
      </span>
      <span className="font-display text-[25px] font-extrabold tracking-[-0.07em]">fondus</span>
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
      <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.09em] text-[#42617c]">{label}</span>
      <span className="relative block">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d9ab1]">{icon}</span>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 w-full rounded-xl border border-[#d6e4ed] bg-white px-4 text-[14px] text-[#173b60] outline-none transition placeholder:text-[#9ab0c0] focus:border-[#1ba9dd] focus:ring-4 focus:ring-[#1ba9dd]/10 ${icon ? 'pl-10' : ''}`}
        />
      </span>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.09em] text-[#42617c]">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-[#d6e4ed] bg-white px-4 pr-10 text-[14px] text-[#173b60] outline-none transition focus:border-[#1ba9dd] focus:ring-4 focus:ring-[#1ba9dd]/10"
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7391a7]" />
      </span>
    </label>
  );
}

function SectionHeading({ number, title, caption, icon }: { number: string; title: string; caption: string; icon: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f7fc] text-[#159bcf]">{icon}</span>
      <div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="font-mono-ui text-[10px] font-bold tracking-[.1em] text-[#1ba9dd]">{number}</span>
          <h2 className="font-display text-[18px] font-extrabold tracking-[-.03em] text-[#12345a]">{title}</h2>
        </div>
        <p className="text-[13px] text-[#7790a2]">{caption}</p>
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
        <div key={label} className="rounded-lg border border-white/15 bg-[#208a55] px-2 py-2.5 text-center">
          <div className="font-mono-ui text-[18px] font-bold leading-none text-white">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-[9px] font-bold tracking-[.13em] text-white/65">{label}</div>
        </div>
      ))}
    </div>
  );
}

function AdjudicationBanner() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#cae4ee] bg-white shadow-[0_10px_28px_rgba(18,52,90,.06)]">
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-7">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#7790a2]">Último número adjudicado</p>
          <p className="text-[13px] font-medium text-[#557188]">Sorteo Agosto 2026</p>
        </div>
        <span className="font-mono-ui text-[40px] font-bold leading-none tracking-[-.08em] text-[#1ba9dd]">390</span>
      </div>
      <div className="relative overflow-hidden bg-[#25965c] px-5 py-5 sm:px-7">
        <div className="absolute -right-12 -top-20 h-44 w-44 rounded-full border-[22px] border-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.11em] text-white/75">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#9cf0bd]" />
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
  const steps = ['Datos personales', 'Elegí tus números', 'Aprobación'];
  return (
    <div className="mb-8 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#dceaf1] bg-[#f7fbfd] p-1.5">
      {steps.map((name, index) => {
        const active = step === index;
        const done = step > index;
        return (
          <button
            key={name}
            type="button"
            onClick={() => (index <= step ? setStep(index) : undefined)}
            className={`flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-bold transition ${active ? 'bg-white text-[#12345a] shadow-sm' : done ? 'text-[#218953]' : 'text-[#8aa1b1]'}`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${active ? 'bg-[#1ba9dd] text-white' : done ? 'bg-[#dff6e7] text-[#218953]' : 'bg-[#eaf2f6] text-[#7b97a9]'}`}>
              {done ? <Check size={12} strokeWidth={3} /> : index + 1}
            </span>
            {name}
          </button>
        );
      })}
    </div>
  );
}

function PlanCard({ plan, selected, onSelect }: { plan: Plan; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selected ? 'border-[#1ba9dd] bg-[#effaff] shadow-[0_5px_16px_rgba(27,169,221,.12)]' : 'border-[#d8e6ed] bg-white hover:border-[#88d5ed]'}`}
    >
      <span className="flex items-center gap-3">
        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? 'border-[#1ba9dd]' : 'border-[#c6d8e2]'}`}>
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#1ba9dd]" />}
        </span>
        <span>
          <span className="block text-[14px] font-bold text-[#173b60]">{plan.name}</span>
          <span className="block text-[11px] text-[#7e97a9]">Capital objetivo {plan.target}</span>
        </span>
      </span>
      <span className="text-right">
        {plan.tag && <span className="mb-1 block text-[9px] font-bold uppercase tracking-[.08em] text-[#269458]">{plan.tag}</span>}
        <span className="block text-[14px] font-bold text-[#173b60]">{formatMoney(plan.amount)} <span className="text-[11px] font-medium text-[#7e97a9]">/ mes</span></span>
      </span>
    </button>
  );
}

function FormStep({
  step,
  plan,
  setPlan,
  form,
  setForm,
  numbers,
  setNumbers,
}: {
  step: number;
  plan: Plan;
  setPlan: (plan: Plan) => void;
  form: Record<string, string>;
  setForm: (key: string, value: string) => void;
  numbers: string[];
  setNumbers: (numbers: string[]) => void;
}) {
  if (step === 1) {
    return (
      <section className="animate-rise rounded-2xl border border-[#d5e6ee] bg-white p-5 shadow-[0_12px_30px_rgba(18,52,90,.05)] sm:p-7">
        <SectionHeading number="02" title="Elegí tus números" caption="Seleccioná hasta dos números para participar del próximo sorteo." icon={<Sparkles size={18} />} />
        <div className="mb-5 rounded-xl bg-[#f2fbfe] p-4 text-[13px] leading-relaxed text-[#527086]">
          Podés elegir tus números favoritos. Si no seleccionás ninguno, te asignamos dos automáticamente antes del sorteo.
        </div>
        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-10">
          {availableNumbers.map((number) => {
            const selected = numbers.includes(number);
            return (
              <button
                key={number}
                type="button"
                onClick={() => setNumbers(selected ? numbers.filter((item) => item !== number) : numbers.length < 2 ? [...numbers, number] : numbers)}
                className={`aspect-square rounded-xl border font-mono-ui text-[14px] font-bold transition ${selected ? 'border-[#1ba9dd] bg-[#1ba9dd] text-white shadow-[0_5px_12px_rgba(27,169,221,.22)]' : 'border-[#d6e4ed] bg-white text-[#54738a] hover:border-[#1ba9dd] hover:text-[#1ba9dd]'}`}
              >
                {number}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[12px] text-[#8aa1b1]">{numbers.length}/2 números seleccionados</p>
        <div className="mt-8 rounded-xl border border-[#e0ecf1] bg-[#fbfdfe] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[.1em] text-[#7790a2]">Tu participación</span>
            <span className="rounded-full bg-[#e7f8ed] px-2.5 py-1 text-[10px] font-bold text-[#278d53]">{plan.name}</span>
          </div>
          <div className="flex justify-between text-[13px] text-[#526f85]"><span>Cuota mensual</span><strong className="text-[#173b60]">{formatMoney(plan.amount)}</strong></div>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="animate-rise rounded-2xl border border-[#d5e6ee] bg-white p-5 shadow-[0_12px_30px_rgba(18,52,90,.05)] sm:p-7">
        <SectionHeading number="03" title="Revisá y aprobá" caption="Un último vistazo antes de confirmar tu solicitud." icon={<ShieldCheck size={18} />} />
        <div className="divide-y divide-[#e5eef3] rounded-xl border border-[#dceaf1]">
          {[
            ['Plan elegido', plan.name],
            ['Capital objetivo', plan.target],
            ['Cuota mensual', formatMoney(plan.amount)],
            ['Números elegidos', numbers.length ? numbers.join(' · ') : 'Asignación automática'],
            ['Titular', form.name || 'A completar'],
            ['WhatsApp', form.whatsapp || 'A completar'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 px-4 py-3.5 text-[13px]">
              <span className="text-[#7790a2]">{label}</span>
              <strong className="text-right font-semibold text-[#173b60]">{value}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3 rounded-xl bg-[#f2fbfe] p-4 text-[12px] leading-relaxed text-[#527086]">
          <LockKeyhole size={16} className="mt-0.5 shrink-0 text-[#1ba9dd]" />
          Tus datos se usan únicamente para gestionar tu adhesión al fondo de capitalización.
        </div>
      </section>
    );
  }

  return (
    <div className="animate-rise space-y-5">
      <section className="rounded-2xl border border-[#d5e6ee] bg-white p-5 shadow-[0_12px_30px_rgba(18,52,90,.05)] sm:p-7">
        <SectionHeading number="01" title="Elegí tu participación" caption="Comenzá por el plan que mejor se adapta a vos." icon={<CreditCard size={18} />} />
        <div className="space-y-2.5">
          {plans.map((item) => <PlanCard key={item.id} plan={item} selected={item.id === plan.id} onSelect={() => setPlan(item)} />)}
        </div>
      </section>

      <section className="rounded-2xl border border-[#d5e6ee] bg-white p-5 shadow-[0_12px_30px_rgba(18,52,90,.05)] sm:p-7">
        <SectionHeading number="02" title="Datos personales" caption="Los necesitamos para validar tu solicitud." icon={<UserRound size={18} />} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre completo" placeholder="Ej: María Belén Gómez" value={form.name} onChange={(value) => setForm('name', value)} className="sm:col-span-2" />
          <Field label="DNI" placeholder="Ej: 32.456.789" value={form.dni} onChange={(value) => setForm('dni', value)} />
          <Field label="Email" placeholder="tu@email.com" type="email" value={form.email} onChange={(value) => setForm('email', value)} icon={<Mail size={16} />} />
          <div className="sm:col-span-2">
            <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.09em] text-[#42617c]">WhatsApp</span>
            <div className="grid grid-cols-[100px_1fr] gap-2.5">
              <Field label="" placeholder="351" value={form.area} onChange={(value) => setForm('area', value)} />
              <Field label="" placeholder="6 123 456" value={form.whatsapp} onChange={(value) => setForm('whatsapp', value)} icon={<MessageCircle size={16} />} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d5e6ee] bg-white p-5 shadow-[0_12px_30px_rgba(18,52,90,.05)] sm:p-7">
        <SectionHeading number="03" title="Domicilio" caption="Completá la dirección donde recibís tus notificaciones." icon={<Home size={18} />} />
        <div className="space-y-5">
          <Field label="Buscar dirección" placeholder="Empezá a escribir tu dirección" value={form.address} onChange={(value) => setForm('address', value)} icon={<MapPin size={16} />} />
          <div className="grid gap-5 sm:grid-cols-[1.5fr_.8fr_.6fr]">
            <Field label="Calle" placeholder="Ej: Av. Colón" value={form.street} onChange={(value) => setForm('street', value)} />
            <Field label="Altura" placeholder="1234" value={form.height} onChange={(value) => setForm('height', value)} />
            <Field label="Depto" placeholder="—" value={form.apartment} onChange={(value) => setForm('apartment', value)} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Barrio" placeholder="Ej: Nueva Córdoba" value={form.neighborhood} onChange={(value) => setForm('neighborhood', value)} />
            <Field label="Localidad" placeholder="Ej: Córdoba" value={form.city} onChange={(value) => setForm('city', value)} />
            <SelectField label="Provincia" value={form.province} onChange={(value) => setForm('province', value)}>
              {provinces.map((province) => <option key={province}>{province}</option>)}
            </SelectField>
          </div>
        </div>
      </section>
    </div>
  );
}

function Summary({ plan, coupon, setCoupon }: { plan: Plan; coupon: string; setCoupon: (value: string) => void }) {
  const [couponApplied, setCouponApplied] = useState(false);
  const discount = couponApplied ? Math.round(plan.amount * 0.1) : 0;
  const firstPayment = plan.amount - discount;
  return (
    <aside className="sticky top-6 space-y-4">
      <section className="overflow-hidden rounded-2xl border border-[#c8e1eb] bg-[#f6fcfe] shadow-[0_14px_36px_rgba(18,52,90,.08)]">
        <div className="border-b border-[#d8eaf1] px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-extrabold tracking-[.02em] text-[#12345a]">Resumen</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-[#e3f7ec] px-2.5 py-1 text-[10px] font-bold text-[#268b50]"><LockKeyhole size={11} /> Seguro</span>
          </div>
          <p className="mt-1 text-[12px] text-[#7790a2]">Tu cotización se actualiza en tiempo real.</p>
        </div>
        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#7b96a8]">Participación</p>
            <div className="flex items-center justify-between rounded-xl border border-[#d9eaf0] bg-white px-3.5 py-3">
              <span className="text-[13px] font-bold text-[#173b60]">{plan.name}</span>
              <span className="text-[12px] font-medium text-[#7893a5]">{plan.target}</span>
            </div>
          </div>
          <div className="border-t border-dashed border-[#d4e5ec] pt-4">
            <div className="flex justify-between text-[13px] text-[#668196]"><span>Pago mensual</span><strong className="text-[#173b60]">{formatMoney(plan.amount)}</strong></div>
            {couponApplied && <div className="mt-2 flex justify-between text-[13px] text-[#278d53]"><span>Descuento (10%)</span><strong>- {formatMoney(discount)}</strong></div>}
          </div>
          <div className="border-t border-[#d4e5ec] pt-4">
            <div className="flex items-end justify-between gap-3">
              <span className="text-[13px] font-bold text-[#42617c]">Total primer pago</span>
              <span className="font-mono-ui text-[22px] font-bold tracking-[-.05em] text-[#12345a]">{formatMoney(firstPayment)}</span>
            </div>
            <p className="mt-1 text-right text-[11px] text-[#8ba1af]">No incluye gastos administrativos</p>
          </div>
          <div className="rounded-xl border border-dashed border-[#aed7e6] bg-white p-3.5">
            <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-[#5a7b91]"><Ticket size={13} className="text-[#1ba9dd]" /> Cupón de descuento</label>
            <div className="flex gap-2">
              <input value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponApplied(false); }} placeholder="Ingresá tu cupón" className="h-10 min-w-0 flex-1 rounded-lg border border-[#d7e6ed] px-3 text-[12px] text-[#173b60] outline-none focus:border-[#1ba9dd]" />
              <button type="button" onClick={() => coupon.trim().length > 0 && setCouponApplied(true)} className="h-10 rounded-lg border border-[#1ba9dd] px-3.5 text-[12px] font-bold text-[#138fbe] transition hover:bg-[#e8f8fd]">Aplicar</button>
            </div>
            {couponApplied && <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#278d53]"><Check size={13} /> Cupón aplicado correctamente</p>}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-[#12345a] p-5 text-white shadow-[0_14px_30px_rgba(18,52,90,.14)] sm:p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#76daf8]"><MessageCircle size={20} /></div>
        <h3 className="font-display text-[16px] font-bold">¿Necesitás ayuda?</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">Escribinos por WhatsApp. Estamos para ayudarte de lunes a viernes.</p>
        <button type="button" onClick={() => window.alert('En un momento te contactamos por WhatsApp.')} className="mt-4 flex items-center gap-2 text-[12px] font-bold text-[#76daf8] transition hover:text-white">Hablar con Fondus <ArrowRight size={14} /></button>
      </section>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-[#102f51] text-white">
      <div className="mx-auto grid max-w-[1220px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.15fr] lg:gap-8">
        <div>
          <Logo light />
          <p className="mt-5 max-w-[240px] text-[13px] leading-relaxed text-white/60">Capitalización clara, con el respaldo que necesitás para proyectar lo que sigue.</p>
          <div className="mt-5 space-y-2 text-[12px] text-white/65"><p className="flex items-center gap-2"><MapPin size={14} className="text-[#64d3f2]" /> Córdoba, Argentina</p><p className="flex items-center gap-2"><Phone size={14} className="text-[#64d3f2]" /> 0810 345 6638</p></div>
        </div>
        <div><h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#66d5f4]">Navegación</h3><div className="space-y-3 text-[13px] text-white/65"><a href="#inicio" className="block transition hover:text-white">Inicio</a><a href="#planes" className="block transition hover:text-white">Planes</a><a href="#preguntas" className="block transition hover:text-white">Preguntas frecuentes</a><a href="#cotizar" className="block transition hover:text-white">Cotizá ahora</a></div></div>
        <div><h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#66d5f4]">Información legal</h3><div className="space-y-3 text-[13px] text-white/65"><a href="#terminos" className="block transition hover:text-white">Términos y condiciones</a><a href="#privacidad" className="block transition hover:text-white">Política de privacidad</a><a href="#asociado" className="block transition hover:text-white">Defensa del consumidor</a></div></div>
        <div><h3 className="mb-5 text-[11px] font-bold uppercase tracking-[.14em] text-[#66d5f4]">Atención al asociado</h3><p className="mb-4 text-[13px] leading-relaxed text-white/65">Estamos para acompañarte antes, durante y después de tu suscripción.</p><div className="grid gap-2"><button type="button" onClick={() => window.alert('Solicitud de arrepentimiento iniciada.')} className="rounded-xl bg-white px-4 py-3 text-left text-[12px] font-bold text-[#12345a] transition hover:bg-[#e8f8fd]">Botón de Arrepentimiento</button><button type="button" onClick={() => window.alert('Solicitud de baja iniciada.')} className="rounded-xl border border-white/25 px-4 py-3 text-left text-[12px] font-bold text-white transition hover:border-white/60">Baja de Servicio</button></div></div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-[11px] text-white/40">© 2026 Fondus · Todos los derechos reservados</div>
    </footer>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [coupon, setCoupon] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setFormState] = useState<Record<string, string>>({
    name: '', dni: '', email: '', area: '', whatsapp: '', address: '', street: '', height: '', apartment: '', neighborhood: '', city: '', province: 'Córdoba',
  });
  const setForm = (key: string, value: string) => setFormState((current) => ({ ...current, [key]: value }));
  const progress = useMemo(() => `${((step + 1) / 3) * 100}%`, [step]);

  const next = () => {
    if (step < 2) setStep(step + 1);
    else setSubmitted(true);
  };

  return (
    <div className="fondus-page min-h-[100dvh] bg-[#f5fafc] text-[#12345a]">
      <header className="sticky top-0 z-10 border-b border-[#dcebf1]/80 bg-[#f8fcfd]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <a href="#inicio" aria-label="Fondus inicio"><Logo /></a>
          <nav className="hidden items-center gap-6 lg:flex">
            {['Nosotros', 'Planes', 'Productos', 'Preguntas frecuentes'].map((link) => <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} className="text-[11px] font-bold uppercase tracking-[.08em] text-[#42617c] transition hover:text-[#1ba9dd]">{link}</a>)}
            <a href="#ingresar" className="border-l border-[#d7e5ec] pl-6 text-[11px] font-bold uppercase tracking-[.08em] text-[#12345a] transition hover:text-[#1ba9dd]">Ingresar</a>
          </nav>
          <div className="hidden items-center gap-3 text-[#1ba9dd] sm:flex">
            <a href="#facebook" aria-label="Facebook" className="transition hover:text-[#12345a]"><Facebook size={16} /></a>
            <a href="#instagram" aria-label="Instagram" className="transition hover:text-[#12345a]"><Instagram size={16} /></a>
            <a href="#whatsapp" aria-label="WhatsApp" className="transition hover:text-[#12345a]"><MessageCircle size={16} /></a>
            <a href="#tiktok" aria-label="TikTok" className="transition hover:text-[#12345a]"><Music2 size={16} /></a>
          </div>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7e5ec] text-[#12345a] lg:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menú">{mobileMenu ? <X size={18} /> : <span className="space-y-1.5"><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-3.5 bg-current" /></span>}</button>
        </div>
        {mobileMenu && <div className="border-t border-[#dcebf1] bg-white px-5 py-4 lg:hidden"><div className="grid gap-3 text-[12px] font-bold uppercase tracking-[.08em] text-[#42617c]">{['Nosotros', 'Planes', 'Productos', 'Preguntas frecuentes', 'Ingresar'].map((link) => <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMobileMenu(false)}>{link}</a>)}</div></div>}
      </header>

      <main id="inicio" className="bg-grid">
        <div className="mx-auto max-w-[1380px] px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
          <div className="mb-10 max-w-[740px] animate-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#9edff1] bg-[#effbfe] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#138fbe]"><span className="h-1.5 w-1.5 rounded-full bg-[#1ba9dd]" /> Alta online</div>
            <h1 className="font-display text-[clamp(42px,6vw,76px)] font-extrabold leading-[.98] tracking-[-.075em] text-[#1ba9dd]">Sumate a <span className="text-[#12345a]">Fondus.</span></h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-[#526f85]">Completá tus datos para sumarte a nuestro fondo de capitalización.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[#718b9d]"><span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-[#279257]" /> Proceso 100% online</span><span className="flex items-center gap-1.5"><LockKeyhole size={14} className="text-[#1ba9dd]" /> Datos protegidos</span></div>
          </div>

          <AdjudicationBanner />

          <div id="cotizar" className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(315px,.85fr)] lg:gap-12">
            <section>
              <Stepper step={step} setStep={setStep} />
              <div className="mb-5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dcecf2]"><div className="h-full rounded-full bg-[#1ba9dd] transition-[width] duration-500" style={{ width: progress }} /></div>
                <span className="font-mono-ui text-[10px] font-bold text-[#6e899d]">0{step + 1} / 03</span>
              </div>
              <FormStep step={step} plan={selectedPlan} setPlan={setSelectedPlan} form={form} setForm={setForm} numbers={numbers} setNumbers={setNumbers} />
              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-2 rounded-xl border border-[#9dd8e9] px-5 py-3 text-[12px] font-bold text-[#128dbb] transition hover:bg-[#ecfaff] disabled:cursor-not-allowed disabled:border-[#dce8ee] disabled:text-[#a4b6c1]"><ArrowLeft size={15} /> Volver</button>
                <button type="button" onClick={next} className="group flex items-center gap-2 rounded-xl bg-[#28965b] px-6 py-3 text-[12px] font-bold text-white shadow-[0_7px_16px_rgba(40,150,91,.2)] transition hover:-translate-y-0.5 hover:bg-[#218851]">{step === 2 ? 'Confirmar inscripción' : 'Continuar'} <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></button>
              </div>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#829aaa]"><Clock3 size={13} /> Te lleva menos de 3 minutos</p>
            </section>
            <Summary plan={selectedPlan} coupon={coupon} setCoupon={setCoupon} />
          </div>
        </div>
      </main>

      <section id="preguntas" className="border-t border-[#dcebf1] bg-white">
        <div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-[.9fr_1.5fr] lg:px-10">
          <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#1ba9dd]">Para que decidas tranquilo</p><h2 className="mt-2 font-display text-[30px] font-extrabold leading-tight tracking-[-.05em] text-[#12345a]">Claridad en cada paso.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['¿Qué es un fondo de capitalización?', '¿Cómo se realiza la adjudicación?', '¿Puedo cambiar mi número?', '¿Qué pasa después de suscribirme?'].map((question) => <button key={question} type="button" onClick={() => window.alert('Estamos preparando la respuesta para vos.')} className="flex items-center justify-between rounded-xl border border-[#dceaf1] bg-[#fbfdfe] px-4 py-4 text-left text-[13px] font-semibold text-[#31536e] transition hover:border-[#83d7ed] hover:bg-[#f2fbfe]"><span>{question}</span><HelpCircle size={16} className="shrink-0 text-[#1ba9dd]" /></button>)}
          </div>
        </div>
      </section>
      <Footer />

      {submitted && <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#12345a]/50 p-5 backdrop-blur-sm"><div className="w-full max-w-[440px] animate-rise rounded-2xl bg-white p-7 text-center shadow-[0_30px_70px_rgba(18,52,90,.25)]"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1f6e9] text-[#269458]"><Check size={27} strokeWidth={2.5} /></div><h2 className="mt-5 font-display text-[25px] font-extrabold tracking-[-.04em] text-[#12345a]">¡Solicitud recibida!</h2><p className="mt-3 text-[14px] leading-relaxed text-[#668196]">Gracias por elegir Fondus. Un asesor se va a contactar por WhatsApp para confirmar tu inscripción.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-6 w-full rounded-xl bg-[#28965b] px-5 py-3 text-[12px] font-bold text-white transition hover:bg-[#218851]">Volver a la cotización</button></div></div>}
    </div>
  );
}

export default App;