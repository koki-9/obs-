export type Scene =
  | 'off'
  | 'lower-third'
  | 'breaking-news'
  | 'topic-card'
  | 'ticker'
  | 'countdown'
  | 'speaker-bio'
  | 'poll'
  | 'quote'
  | 'social'
  | 'weather'
  | 'sports'
  | 'promo'
  | 'full-screen-title';

export type Transition = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'wipe';
export type ColorTheme = 'red' | 'blue' | 'gold' | 'green' | 'dark' | 'white';

export interface OverlayState {
  scene: Scene;
  transition: Transition;
  theme: ColorTheme;

  lowerThird: {
    title: string;
    subtitle: string;
    visible: boolean;
  };

  breakingNews: {
    headline: string;
    subline: string;
    visible: boolean;
  };

  ticker: {
    items: string[];
    speed: number;
    visible: boolean;
    label: string;
  };

  topicCard: {
    title: string;
    description: string;
    category: string;
    icon: string;
    visible: boolean;
  };

  countdown: {
    seconds: number;
    running: boolean;
    visible: boolean;
    label: string;
  };

  speakerBio: {
    name: string;
    title: string;
    org: string;
    visible: boolean;
  };

  poll: {
    question: string;
    options: { text: string; pct: number }[];
    visible: boolean;
  };

  quote: {
    text: string;
    author: string;
    visible: boolean;
  };

  social: {
    platform: string;
    handle: string;
    hashtag: string;
    visible: boolean;
  };

  weather: {
    city: string;
    temp: string;
    condition: string;
    visible: boolean;
  };

  sports: {
    team1: string;
    score1: number;
    team2: string;
    score2: number;
    period: string;
    visible: boolean;
  };

  promo: {
    title: string;
    text: string;
    url: string;
    visible: boolean;
  };

  fullScreenTitle: {
    title: string;
    subtitle: string;
    category: string;
    visible: boolean;
  };

  showClock: boolean;
  showLogo: boolean;
  logoText: string;
  programName: string;
}

export const DEFAULT_STATE: OverlayState = {
  scene: 'off',
  transition: 'fade',
  theme: 'red',

  lowerThird: { title: 'اسم الضيف', subtitle: 'المسمى الوظيفي', visible: false },
  breakingNews: { headline: 'خبر عاجل: عنوان الخبر هنا', subline: 'تفاصيل إضافية عن الخبر', visible: false },
  ticker: { items: ['عنوان الخبر الأول', 'عنوان الخبر الثاني', 'عنوان الخبر الثالث'], speed: 60, visible: false, label: 'أخبار' },
  topicCard: { title: 'عنوان الموضوع', description: 'وصف مختصر للموضوع المطروح', category: 'تقنية', icon: '💡', visible: false },
  countdown: { seconds: 60, running: false, visible: false, label: 'يبدأ البث بعد' },
  speakerBio: { name: 'د. محمد أحمد', title: 'خبير اقتصادي', org: 'مركز الدراسات', visible: false },
  poll: { question: 'ما رأيك في الموضوع؟', options: [{ text: 'أوافق', pct: 65 }, { text: 'لا أوافق', pct: 35 }], visible: false },
  quote: { text: 'العلم نور والجهل ظلام', author: '', visible: false },
  social: { platform: 'X', handle: '@handle', hashtag: '#هاشتاق', visible: false },
  weather: { city: 'الرياض', temp: '35°', condition: 'مشمس', visible: false },
  sports: { team1: 'الهلال', score1: 2, team2: 'النصر', score2: 1, period: 'الشوط الثاني', visible: false },
  promo: { title: 'تابعونا', text: 'على جميع المنصات', url: 'www.channel.tv', visible: false },
  fullScreenTitle: { title: 'عنوان البرنامج', subtitle: 'وصف الحلقة', category: 'حوار', visible: false },

  showClock: true,
  showLogo: true,
  logoText: 'LIVE',
  programName: 'البرنامج',
};

export const PRESETS: { id: string; label: string; state: Partial<OverlayState> }[] = [
  {
    id: 'guest-intro',
    label: 'تعريف ضيف',
    state: {
      scene: 'lower-third',
      lowerThird: { title: 'اسم الضيف', subtitle: 'المسمى الوظيفي', visible: true },
    },
  },
  {
    id: 'breaking',
    label: 'خبر عاجل',
    state: {
      scene: 'breaking-news',
      breakingNews: { headline: 'خبر عاجل', subline: 'التفاصيل هنا', visible: true },
    },
  },
  {
    id: 'topic-tech',
    label: 'موضوع تقني',
    state: {
      scene: 'topic-card',
      topicCard: { title: 'الذكاء الاصطناعي', description: 'مناقشة مستجدات تقنية الذكاء الاصطناعي', category: 'تقنية', icon: '🤖', visible: true },
    },
  },
  {
    id: 'topic-economy',
    label: 'موضوع اقتصادي',
    state: {
      scene: 'topic-card',
      topicCard: { title: 'الاقتصاد الرقمي', description: 'مستقبل الاقتصاد في عصر الرقمنة', category: 'اقتصاد', icon: '📈', visible: true },
    },
  },
  {
    id: 'topic-politics',
    label: 'موضوع سياسي',
    state: {
      scene: 'topic-card',
      topicCard: { title: 'المشهد السياسي', description: 'آخر المستجدات والتحليلات', category: 'سياسة', icon: '🏛️', visible: true },
    },
  },
  {
    id: 'countdown',
    label: 'عداد تنازلي',
    state: {
      scene: 'countdown',
      countdown: { seconds: 60, running: false, visible: true, label: 'يبدأ البث بعد' },
    },
  },
  {
    id: 'poll',
    label: 'استطلاع رأي',
    state: {
      scene: 'poll',
      poll: { question: 'ما رأيك؟', options: [{ text: 'أوافق', pct: 65 }, { text: 'لا أوافق', pct: 35 }], visible: true },
    },
  },
  {
    id: 'sports',
    label: 'نتيجة رياضية',
    state: {
      scene: 'sports',
      sports: { team1: 'الهلال', score1: 2, team2: 'النصر', score2: 1, period: 'الشوط الثاني', visible: true },
    },
  },
  {
    id: 'full-title',
    label: 'عنوان كامل',
    state: {
      scene: 'full-screen-title',
      fullScreenTitle: { title: 'عنوان البرنامج', subtitle: 'وصف الحلقة', category: 'حوار', visible: true },
    },
  },
];
