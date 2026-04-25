import { useEffect, useState, useRef } from 'react';
import { DEFAULT_STATE, type OverlayState, type Transition } from '../types';
import { readState, onStateChange } from '../broadcast';

function getAnimClass(t: Transition) {
  switch (t) {
    case 'slide-up':    return 'anim-slide-up';
    case 'slide-down':  return 'anim-slide-dn';
    case 'slide-left':  return 'anim-slide-l';
    case 'slide-right': return 'anim-slide-r';
    case 'zoom':        return 'anim-zoom';
    case 'wipe':        return 'anim-wipe';
    default:            return 'anim-fade';
  }
}

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <div className="clock">{time}</div>;
}

function TickerInner({ items, sep, speed }: { items: string[]; sep: string; speed: number }) {
  const dur = `${Math.max(10, 100 - speed / 2)}s`;
  return (
    <span className="ticker-bar__inner" style={{ animationDuration: dur }}>
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && <span className="ticker-bar__sep">{sep}</span>}
        </span>
      ))}
    </span>
  );
}

function BreakingScroll({ text, speed }: { text: string; speed: number }) {
  const dur = `${Math.max(8, 80 - speed / 2)}s`;
  return (
    <span className="breaking-news__scroll" style={{ animationDuration: dur }}>
      {text}
    </span>
  );
}

function PollBar({ pct }: { pct: number }) {
  return (
    <div className="poll-card__track">
      <div className="poll-card__fill" style={{ '--w': `${pct}%` } as React.CSSProperties} />
    </div>
  );
}

export default function Overlay() {
  const [state, setState] = useState<OverlayState>(() => readState() ?? DEFAULT_STATE);
  const animKey = useRef(0);
  const prevScene = useRef(state.scene);

  useEffect(() => {
    const unsub = onStateChange((s) => {
      if (s.scene !== prevScene.current) animKey.current++;
      prevScene.current = s.scene;
      setState(s);
    });
    return unsub;
  }, []);

  const ac = getAnimClass(state.transition);
  const themeClass = `theme-${state.theme}`;
  const key = `${state.scene}-${animKey.current}`;

  return (
    <div className={`overlay-root ${themeClass}`}>
      {/* Clock or Logo top-right */}
      {state.showLogo && <div className="logo">{state.logoText}</div>}
      {state.showClock && !state.showLogo && <Clock />}

      {/* Lower Third */}
      {state.lowerThird.visible && (
        <div key={`lt-${key}`} className={`lower-third ${ac}`}>
          <div className="lower-third__bar" style={{ width: '100%' }} />
          <div className="lower-third__title">{state.lowerThird.title}</div>
          <div className="lower-third__subtitle">{state.lowerThird.subtitle}</div>
        </div>
      )}

      {/* Breaking News */}
      {state.breakingNews.visible && (
        <div key={`bn-${key}`} className={`breaking-news ${ac}`}>
          <div className="breaking-news__band">
            <span className="breaking-news__label">عاجل</span>
            <span>{state.breakingNews.headline}</span>
          </div>
          <div className="breaking-news__ticker">
            <BreakingScroll text={state.breakingNews.subline} speed={state.ticker.speed} />
          </div>
        </div>
      )}

      {/* Topic Card */}
      {state.topicCard.visible && (
        <div key={`tc-${key}`} className={`topic-card ${ac}`}>
          <div className="topic-card__icon">{state.topicCard.icon}</div>
          <div className="topic-card__cat">{state.topicCard.category}</div>
          <div className="topic-card__title">{state.topicCard.title}</div>
          <div className="topic-card__desc">{state.topicCard.description}</div>
        </div>
      )}

      {/* Ticker */}
      {state.ticker.visible && (
        <div key={`tk-${key}`} className={`ticker-bar ${ac}`}>
          <div className="ticker-bar__label">{state.ticker.label}</div>
          <div className="ticker-bar__track">
            <TickerInner items={state.ticker.items} sep=" • " speed={state.ticker.speed} />
          </div>
        </div>
      )}

      {/* Countdown */}
      {state.countdown.visible && (
        <CountdownDisplay key={`cd-${key}`} state={state} ac={ac} />
      )}

      {/* Speaker Bio */}
      {state.speakerBio.visible && (
        <div key={`sb-${key}`} className={`speaker-bio ${ac}`}>
          <div className="speaker-bio__name">{state.speakerBio.name}</div>
          <div className="speaker-bio__title">{state.speakerBio.title}</div>
          <div className="speaker-bio__org">{state.speakerBio.org}</div>
        </div>
      )}

      {/* Poll */}
      {state.poll.visible && (
        <div key={`pl-${key}`} className={`poll-card ${ac}`}>
          <div className="poll-card__q">{state.poll.question}</div>
          {state.poll.options.map((opt, i) => (
            <div key={i} className="poll-card__opt">
              <div className="poll-card__text">
                <span>{opt.text}</span>
                <span>{opt.pct}%</span>
              </div>
              <PollBar pct={opt.pct} />
            </div>
          ))}
        </div>
      )}

      {/* Quote */}
      {state.quote.visible && (
        <div key={`qt-${key}`} className={`quote-card ${ac}`}>
          <div className="quote-card__text">"{state.quote.text}"</div>
          {state.quote.author && <div className="quote-card__author">— {state.quote.author}</div>}
        </div>
      )}

      {/* Social */}
      {state.social.visible && (
        <div key={`sc-${key}`} className={`social-card ${ac}`}>
          <span className="social-card__platform">{state.social.platform}</span>
          <span className="social-card__handle">{state.social.handle}</span>
          <span className="social-card__hashtag">{state.social.hashtag}</span>
        </div>
      )}

      {/* Weather */}
      {state.weather.visible && (
        <div key={`wt-${key}`} className={`weather-card ${ac}`}>
          <div>
            <div className="weather-card__city">{state.weather.city}</div>
            <div className="weather-card__cond">{state.weather.condition}</div>
          </div>
          <div className="weather-card__temp">{state.weather.temp}</div>
        </div>
      )}

      {/* Sports */}
      {state.sports.visible && (
        <div key={`sp-${key}`} className={`sports-card ${ac}`}>
          <div>
            <div className="sports-card__team">{state.sports.team1}</div>
          </div>
          <div className="sports-card__score">{state.sports.score1}</div>
          <div className="sports-card__sep">—</div>
          <div className="sports-card__score">{state.sports.score2}</div>
          <div>
            <div className="sports-card__team">{state.sports.team2}</div>
            <div className="sports-card__period">{state.sports.period}</div>
          </div>
        </div>
      )}

      {/* Promo */}
      {state.promo.visible && (
        <div key={`pr-${key}`} className={`promo-card ${ac}`}>
          <div className="promo-card__title">{state.promo.title}</div>
          <div className="promo-card__text">{state.promo.text}</div>
          <div className="promo-card__url">{state.promo.url}</div>
        </div>
      )}

      {/* Full Screen Title */}
      {state.fullScreenTitle.visible && (
        <div key={`fst-${key}`} className={`fst ${ac}`}>
          <div className="fst__cat">{state.fullScreenTitle.category}</div>
          <div className="fst__title">{state.fullScreenTitle.title}</div>
          {state.fullScreenTitle.subtitle && (
            <div className="fst__sub">{state.fullScreenTitle.subtitle}</div>
          )}
          <div className="fst__line" />
        </div>
      )}
    </div>
  );
}

function CountdownDisplay({ state, ac }: { state: OverlayState; ac: string }) {
  const [secs, setSecs] = useState(state.countdown.seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSecs(state.countdown.seconds);
  }, [state.countdown.seconds]);

  useEffect(() => {
    if (ref.current) clearInterval(ref.current);
    if (state.countdown.running && secs > 0) {
      ref.current = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [state.countdown.running]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <div className={`countdown-ol ${ac}`}>
      <div className="countdown-ol__label">{state.countdown.label}</div>
      <div className="countdown-ol__num">{secs >= 60 ? `${mm}:${ss}` : String(secs)}</div>
    </div>
  );
}
