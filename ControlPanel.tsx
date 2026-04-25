import { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_STATE, PRESETS,
  type OverlayState, type Scene, type Transition, type ColorTheme,
} from '../types';
import { broadcastState } from '../broadcast';
import {
  Radio, Tv2, AlertTriangle, AlignLeft, Timer, User, BarChart2, Quote,
  Share2, Cloud, Trophy, Megaphone, Maximize2, Settings, Sliders,
  Play, Square, RotateCcw, Eye, EyeOff, Palette, Zap,
} from 'lucide-react';

const THEMES: { id: ColorTheme; label: string; color: string }[] = [
  { id: 'red',   label: 'أحمر',  color: '#e63946' },
  { id: 'blue',  label: 'أزرق',  color: '#1d7ed8' },
  { id: 'gold',  label: 'ذهبي',  color: '#d4a017' },
  { id: 'green', label: 'أخضر',  color: '#16a34a' },
  { id: 'dark',  label: 'داكن',  color: '#374151' },
  { id: 'white', label: 'رمادي', color: '#64748b' },
];

const TRANSITIONS: { id: Transition; label: string }[] = [
  { id: 'fade',        label: 'تلاشي' },
  { id: 'slide-up',    label: 'من أسفل' },
  { id: 'slide-down',  label: 'من أعلى' },
  { id: 'slide-left',  label: 'من اليمين' },
  { id: 'slide-right', label: 'من اليسار' },
  { id: 'zoom',        label: 'تكبير' },
  { id: 'wipe',        label: 'مسح' },
];

const SCENE_ICONS: Record<string, React.ReactNode> = {
  'lower-third':     <AlignLeft size={15} />,
  'breaking-news':   <AlertTriangle size={15} />,
  'topic-card':      <Tv2 size={15} />,
  'ticker':          <Radio size={15} />,
  'countdown':       <Timer size={15} />,
  'speaker-bio':     <User size={15} />,
  'poll':            <BarChart2 size={15} />,
  'quote':           <Quote size={15} />,
  'social':          <Share2 size={15} />,
  'weather':         <Cloud size={15} />,
  'sports':          <Trophy size={15} />,
  'promo':           <Megaphone size={15} />,
  'full-screen-title':<Maximize2 size={15} />,
};

function useOverlay() {
  const [state, setState] = useState<OverlayState>(DEFAULT_STATE);

  const update = useCallback((patch: Partial<OverlayState> | ((s: OverlayState) => OverlayState)) => {
    setState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      broadcastState(next);
      return next;
    });
  }, []);

  return { state, update };
}

/* ── Small reusable components ── */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-gray-400 mb-1">{children}</label>;
}
function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <input
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
function NumberInput({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <input
        type="number"
        min={min}
        max={max}
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-700'} relative`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
function VisBtn({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
        visible ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      {visible ? <Eye size={13} /> : <EyeOff size={13} />}
      {visible ? 'ظاهر' : 'مخفي'}
    </button>
  );
}
function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      {title && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
          {icon && <span className="text-gray-400">{icon}</span>}
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Panel sections ── */
function LowerThirdPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const lt = state.lowerThird;
  const set = (patch: Partial<typeof lt>) => update((s) => ({ ...s, lowerThird: { ...s.lowerThird, ...patch } }));
  return (
    <SectionCard title="شريط أسفل الشاشة" icon={<AlignLeft size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={lt.visible} onToggle={() => set({ visible: !lt.visible })} />
      </div>
      <Input label="الاسم / العنوان" value={lt.title} onChange={(v) => set({ title: v })} />
      <Input label="المسمى / التفاصيل" value={lt.subtitle} onChange={(v) => set({ subtitle: v })} />
    </SectionCard>
  );
}

function BreakingNewsPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const bn = state.breakingNews;
  const set = (patch: Partial<typeof bn>) => update((s) => ({ ...s, breakingNews: { ...s.breakingNews, ...patch } }));
  return (
    <SectionCard title="خبر عاجل" icon={<AlertTriangle size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={bn.visible} onToggle={() => set({ visible: !bn.visible })} />
      </div>
      <Input label="العنوان الرئيسي" value={bn.headline} onChange={(v) => set({ headline: v })} />
      <Input label="التفاصيل (شريط متحرك)" value={bn.subline} onChange={(v) => set({ subline: v })} />
    </SectionCard>
  );
}

function TopicCardPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const tc = state.topicCard;
  const set = (patch: Partial<typeof tc>) => update((s) => ({ ...s, topicCard: { ...s.topicCard, ...patch } }));
  return (
    <SectionCard title="بطاقة الموضوع" icon={<Tv2 size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={tc.visible} onToggle={() => set({ visible: !tc.visible })} />
      </div>
      <Input label="عنوان الموضوع" value={tc.title} onChange={(v) => set({ title: v })} />
      <Input label="وصف الموضوع" value={tc.description} onChange={(v) => set({ description: v })} />
      <Input label="التصنيف" value={tc.category} onChange={(v) => set({ category: v })} />
      <Input label="الأيقونة (رمز)" value={tc.icon} onChange={(v) => set({ icon: v })} />
    </SectionCard>
  );
}

function TickerPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const tk = state.ticker;
  const set = (patch: Partial<typeof tk>) => update((s) => ({ ...s, ticker: { ...s.ticker, ...patch } }));
  const [newItem, setNewItem] = useState('');
  return (
    <SectionCard title="الشريط المتحرك" icon={<Radio size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={tk.visible} onToggle={() => set({ visible: !tk.visible })} />
      </div>
      <Input label="تسمية الشريط" value={tk.label} onChange={(v) => set({ label: v })} />
      <div className="mb-3">
        <Label>سرعة الشريط ({tk.speed})</Label>
        <input type="range" min={10} max={100} value={tk.speed} onChange={(e) => set({ speed: +e.target.value })}
          className="w-full accent-blue-500" />
      </div>
      <div className="mb-3">
        <Label>الأخبار</Label>
        <div className="space-y-1 mb-2">
          {tk.items.map((item, i) => (
            <div key={i} className="flex gap-1">
              <input className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                value={item}
                onChange={(e) => {
                  const items = [...tk.items];
                  items[i] = e.target.value;
                  set({ items });
                }}
              />
              <button onClick={() => set({ items: tk.items.filter((_, j) => j !== i) })}
                className="px-2 py-1 bg-red-900 hover:bg-red-800 rounded text-xs text-red-300">✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          <input className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="خبر جديد..." value={newItem} onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newItem.trim()) {
                set({ items: [...tk.items, newItem.trim()] });
                setNewItem('');
              }
            }}
          />
          <button onClick={() => { if (newItem.trim()) { set({ items: [...tk.items, newItem.trim()] }); setNewItem(''); } }}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs text-white">إضافة</button>
        </div>
      </div>
    </SectionCard>
  );
}

function CountdownPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const cd = state.countdown;
  const set = (patch: Partial<typeof cd>) => update((s) => ({ ...s, countdown: { ...s.countdown, ...patch } }));
  return (
    <SectionCard title="العداد التنازلي" icon={<Timer size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={cd.visible} onToggle={() => set({ visible: !cd.visible })} />
      </div>
      <Input label="النص التوضيحي" value={cd.label} onChange={(v) => set({ label: v })} />
      <NumberInput label="المدة (ثانية)" value={cd.seconds} onChange={(v) => set({ seconds: v, running: false })} min={5} max={3600} />
      <div className="flex gap-2">
        <button onClick={() => set({ running: true })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded text-xs text-white font-semibold">
          <Play size={12} /> تشغيل
        </button>
        <button onClick={() => set({ running: false })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white font-semibold">
          <Square size={12} /> إيقاف
        </button>
        <button onClick={() => set({ running: false, seconds: state.countdown.seconds })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white font-semibold">
          <RotateCcw size={12} /> إعادة
        </button>
      </div>
    </SectionCard>
  );
}

function SpeakerBioPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const sb = state.speakerBio;
  const set = (patch: Partial<typeof sb>) => update((s) => ({ ...s, speakerBio: { ...s.speakerBio, ...patch } }));
  return (
    <SectionCard title="بيانات المتحدث" icon={<User size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={sb.visible} onToggle={() => set({ visible: !sb.visible })} />
      </div>
      <Input label="الاسم" value={sb.name} onChange={(v) => set({ name: v })} />
      <Input label="المسمى الوظيفي" value={sb.title} onChange={(v) => set({ title: v })} />
      <Input label="المؤسسة / الجهة" value={sb.org} onChange={(v) => set({ org: v })} />
    </SectionCard>
  );
}

function PollPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const pl = state.poll;
  const set = (patch: Partial<typeof pl>) => update((s) => ({ ...s, poll: { ...s.poll, ...patch } }));
  return (
    <SectionCard title="استطلاع الرأي" icon={<BarChart2 size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={pl.visible} onToggle={() => set({ visible: !pl.visible })} />
      </div>
      <Input label="السؤال" value={pl.question} onChange={(v) => set({ question: v })} />
      {pl.options.map((opt, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            value={opt.text} onChange={(e) => {
              const opts = pl.options.map((o, j) => j === i ? { ...o, text: e.target.value } : o);
              set({ options: opts });
            }} placeholder="نص الخيار" />
          <input type="number" min={0} max={100} value={opt.pct}
            className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              const opts = pl.options.map((o, j) => j === i ? { ...o, pct: +e.target.value } : o);
              set({ options: opts });
            }} />
          <span className="text-xs text-gray-500 self-center">%</span>
        </div>
      ))}
      <button onClick={() => set({ options: [...pl.options, { text: 'خيار جديد', pct: 0 }] })}
        className="text-xs text-blue-400 hover:text-blue-300 mt-1">+ إضافة خيار</button>
    </SectionCard>
  );
}

function QuotePanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const qt = state.quote;
  const set = (patch: Partial<typeof qt>) => update((s) => ({ ...s, quote: { ...s.quote, ...patch } }));
  return (
    <SectionCard title="الاقتباس" icon={<Quote size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={qt.visible} onToggle={() => set({ visible: !qt.visible })} />
      </div>
      <Input label="نص الاقتباس" value={qt.text} onChange={(v) => set({ text: v })} />
      <Input label="المصدر / القائل" value={qt.author} onChange={(v) => set({ author: v })} />
    </SectionCard>
  );
}

function SocialPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const sc = state.social;
  const set = (patch: Partial<typeof sc>) => update((s) => ({ ...s, social: { ...s.social, ...patch } }));
  return (
    <SectionCard title="التواصل الاجتماعي" icon={<Share2 size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={sc.visible} onToggle={() => set({ visible: !sc.visible })} />
      </div>
      <Input label="المنصة" value={sc.platform} onChange={(v) => set({ platform: v })} />
      <Input label="الحساب" value={sc.handle} onChange={(v) => set({ handle: v })} />
      <Input label="الهاشتاق" value={sc.hashtag} onChange={(v) => set({ hashtag: v })} />
    </SectionCard>
  );
}

function WeatherPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const wt = state.weather;
  const set = (patch: Partial<typeof wt>) => update((s) => ({ ...s, weather: { ...s.weather, ...patch } }));
  return (
    <SectionCard title="الطقس" icon={<Cloud size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={wt.visible} onToggle={() => set({ visible: !wt.visible })} />
      </div>
      <Input label="المدينة" value={wt.city} onChange={(v) => set({ city: v })} />
      <Input label="درجة الحرارة" value={wt.temp} onChange={(v) => set({ temp: v })} />
      <Input label="الحالة" value={wt.condition} onChange={(v) => set({ condition: v })} />
    </SectionCard>
  );
}

function SportsPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const sp = state.sports;
  const set = (patch: Partial<typeof sp>) => update((s) => ({ ...s, sports: { ...s.sports, ...patch } }));
  return (
    <SectionCard title="النتيجة الرياضية" icon={<Trophy size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={sp.visible} onToggle={() => set({ visible: !sp.visible })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input label="الفريق الأول" value={sp.team1} onChange={(v) => set({ team1: v })} />
        <Input label="الفريق الثاني" value={sp.team2} onChange={(v) => set({ team2: v })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberInput label="هدف الفريق الأول" value={sp.score1} onChange={(v) => set({ score1: v })} min={0} />
        <NumberInput label="هدف الفريق الثاني" value={sp.score2} onChange={(v) => set({ score2: v })} min={0} />
      </div>
      <Input label="الفترة / الوقت" value={sp.period} onChange={(v) => set({ period: v })} />
    </SectionCard>
  );
}

function PromoPanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const pr = state.promo;
  const set = (patch: Partial<typeof pr>) => update((s) => ({ ...s, promo: { ...s.promo, ...patch } }));
  return (
    <SectionCard title="البروموشن" icon={<Megaphone size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={pr.visible} onToggle={() => set({ visible: !pr.visible })} />
      </div>
      <Input label="العنوان" value={pr.title} onChange={(v) => set({ title: v })} />
      <Input label="النص" value={pr.text} onChange={(v) => set({ text: v })} />
      <Input label="الرابط" value={pr.url} onChange={(v) => set({ url: v })} />
    </SectionCard>
  );
}

function FullScreenTitlePanel({ state, update }: { state: OverlayState; update: ReturnType<typeof useOverlay>['update'] }) {
  const fst = state.fullScreenTitle;
  const set = (patch: Partial<typeof fst>) => update((s) => ({ ...s, fullScreenTitle: { ...s.fullScreenTitle, ...patch } }));
  return (
    <SectionCard title="عنوان ملء الشاشة" icon={<Maximize2 size={14} />}>
      <div className="flex justify-end mb-3">
        <VisBtn visible={fst.visible} onToggle={() => set({ visible: !fst.visible })} />
      </div>
      <Input label="العنوان الرئيسي" value={fst.title} onChange={(v) => set({ title: v })} />
      <Input label="العنوان الفرعي" value={fst.subtitle} onChange={(v) => set({ subtitle: v })} />
      <Input label="التصنيف" value={fst.category} onChange={(v) => set({ category: v })} />
    </SectionCard>
  );
}

/* ── Tab system ── */
type Tab = 'presets' | 'lower-third' | 'breaking-news' | 'topic-card' | 'ticker' | 'countdown' | 'speaker-bio' | 'poll' | 'quote' | 'social' | 'weather' | 'sports' | 'promo' | 'full-screen-title' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'presets',           label: 'البريسيتات', icon: <Zap size={14} /> },
  { id: 'lower-third',      label: 'شريط أسفل',  icon: <AlignLeft size={14} /> },
  { id: 'breaking-news',    label: 'عاجل',        icon: <AlertTriangle size={14} /> },
  { id: 'topic-card',       label: 'موضوع',       icon: <Tv2 size={14} /> },
  { id: 'ticker',           label: 'شريط متحرك',  icon: <Radio size={14} /> },
  { id: 'countdown',        label: 'عداد',        icon: <Timer size={14} /> },
  { id: 'speaker-bio',      label: 'ضيف',         icon: <User size={14} /> },
  { id: 'poll',             label: 'استطلاع',     icon: <BarChart2 size={14} /> },
  { id: 'quote',            label: 'اقتباس',      icon: <Quote size={14} /> },
  { id: 'social',           label: 'سوشيال',      icon: <Share2 size={14} /> },
  { id: 'weather',          label: 'طقس',         icon: <Cloud size={14} /> },
  { id: 'sports',           label: 'رياضة',       icon: <Trophy size={14} /> },
  { id: 'promo',            label: 'ترويج',       icon: <Megaphone size={14} /> },
  { id: 'full-screen-title',label: 'عنوان كامل',  icon: <Maximize2 size={14} /> },
  { id: 'settings',         label: 'الإعدادات',   icon: <Settings size={14} /> },
];

export default function ControlPanel() {
  const { state, update } = useOverlay();
  const [tab, setTab] = useState<Tab>('presets');

  // Broadcast initial state on mount
  useEffect(() => { broadcastState(state); }, []);

  const hideAll = () => update((s) => ({
    ...s,
    lowerThird: { ...s.lowerThird, visible: false },
    breakingNews: { ...s.breakingNews, visible: false },
    topicCard: { ...s.topicCard, visible: false },
    ticker: { ...s.ticker, visible: false },
    countdown: { ...s.countdown, visible: false, running: false },
    speakerBio: { ...s.speakerBio, visible: false },
    poll: { ...s.poll, visible: false },
    quote: { ...s.quote, visible: false },
    social: { ...s.social, visible: false },
    weather: { ...s.weather, visible: false },
    sports: { ...s.sports, visible: false },
    promo: { ...s.promo, visible: false },
    fullScreenTitle: { ...s.fullScreenTitle, visible: false },
  }));

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    hideAll();
    setTimeout(() => {
      update((s) => {
        const next = { ...s };
        const ps = preset.state as Partial<OverlayState>;
        if (ps.scene) next.scene = ps.scene;
        if (ps.lowerThird) next.lowerThird = { ...s.lowerThird, ...ps.lowerThird };
        if (ps.breakingNews) next.breakingNews = { ...s.breakingNews, ...ps.breakingNews };
        if (ps.topicCard) next.topicCard = { ...s.topicCard, ...ps.topicCard };
        if (ps.countdown) next.countdown = { ...s.countdown, ...ps.countdown };
        if (ps.poll) next.poll = { ...s.poll, ...ps.poll };
        if (ps.sports) next.sports = { ...s.sports, ...ps.sports };
        if (ps.fullScreenTitle) next.fullScreenTitle = { ...s.fullScreenTitle, ...ps.fullScreenTitle };
        return next;
      });
    }, 350);
  };

  const activeCount = [
    state.lowerThird.visible, state.breakingNews.visible, state.topicCard.visible,
    state.ticker.visible, state.countdown.visible, state.speakerBio.visible,
    state.poll.visible, state.quote.visible, state.social.visible,
    state.weather.visible, state.sports.visible, state.promo.visible,
    state.fullScreenTitle.visible,
  ].filter(Boolean).length;

  return (
    <div className="cp-root">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-950 border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-sm tracking-wide">{state.programName} — لوحة التحكم</span>
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <span className="text-xs bg-green-800 text-green-200 px-2 py-0.5 rounded-full">
              {activeCount} نشط
            </span>
          )}
          <button onClick={hideAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900 hover:bg-red-800 rounded text-xs text-red-200 font-semibold transition-colors">
            <EyeOff size={12} /> إخفاء الكل
          </button>
          <a href="/overlay" target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 font-semibold transition-colors">
            <Eye size={12} /> معاينة
          </a>
        </div>
      </div>

      <div className="flex h-[calc(100vh-52px)]">
        {/* Sidebar tabs */}
        <div className="w-36 flex-shrink-0 bg-gray-950 border-l border-gray-800 overflow-y-auto py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors ${
                tab === t.id
                  ? 'bg-gray-800 text-white border-r-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
              }`}
            >
              {t.icon}
              <span className="text-center leading-tight">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'presets' && (
            <div>
              <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <Zap size={14} className="text-yellow-400" /> البريسيتات السريعة
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center transition-all text-sm font-semibold text-gray-200 hover:text-white active:scale-95"
                  >
                    <div className="text-blue-400 mb-1">{SCENE_ICONS[PRESETS.find(x => x.id === p.id)?.state.scene as string ?? ''] ?? <Tv2 size={18} className="mx-auto" />}</div>
                    {p.label}
                  </button>
                ))}
              </div>
              {/* Quick hide all */}
              <div className="mt-6">
                <SectionCard title="تحكم سريع" icon={<Sliders size={14} />}>
                  <Toggle label="إظهار الشعار (LIVE)" value={state.showLogo} onChange={(v) => update({ showLogo: v })} />
                  <Toggle label="إظهار الساعة" value={state.showClock} onChange={(v) => update({ showClock: v })} />
                  <Input label="نص الشعار" value={state.logoText} onChange={(v) => update({ logoText: v })} />
                  <Input label="اسم البرنامج" value={state.programName} onChange={(v) => update({ programName: v })} />
                </SectionCard>
              </div>
            </div>
          )}
          {tab === 'lower-third'      && <LowerThirdPanel state={state} update={update} />}
          {tab === 'breaking-news'    && <BreakingNewsPanel state={state} update={update} />}
          {tab === 'topic-card'       && <TopicCardPanel state={state} update={update} />}
          {tab === 'ticker'           && <TickerPanel state={state} update={update} />}
          {tab === 'countdown'        && <CountdownPanel state={state} update={update} />}
          {tab === 'speaker-bio'      && <SpeakerBioPanel state={state} update={update} />}
          {tab === 'poll'             && <PollPanel state={state} update={update} />}
          {tab === 'quote'            && <QuotePanel state={state} update={update} />}
          {tab === 'social'           && <SocialPanel state={state} update={update} />}
          {tab === 'weather'          && <WeatherPanel state={state} update={update} />}
          {tab === 'sports'           && <SportsPanel state={state} update={update} />}
          {tab === 'promo'            && <PromoPanel state={state} update={update} />}
          {tab === 'full-screen-title'&& <FullScreenTitlePanel state={state} update={update} />}
          {tab === 'settings' && (
            <div>
              <SectionCard title="الثيم (اللون الرئيسي)" icon={<Palette size={14} />}>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update({ theme: t.id })}
                      className={`flex items-center gap-2 p-2 rounded border transition-all text-xs font-semibold ${
                        state.theme === t.id ? 'border-white text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: t.color }} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="نوع الانتقال" icon={<Zap size={14} />}>
                <div className="grid grid-cols-2 gap-2">
                  {TRANSITIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update({ transition: t.id })}
                      className={`p-2 rounded border text-xs font-semibold transition-all ${
                        state.transition === t.id ? 'border-blue-500 bg-blue-900 text-blue-200' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="معلومات الاستخدام" icon={<Settings size={14} />}>
                <p className="text-xs text-gray-500 leading-relaxed">
                  افتح صفحة <strong className="text-gray-300">/overlay</strong> في مصدر المتصفح داخل OBS.
                  اضبط الأبعاد على <strong className="text-gray-300">1920×1080</strong>.
                  يمكن التحكم بجميع العناصر من هذه اللوحة في الوقت الفعلي.
                </p>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
