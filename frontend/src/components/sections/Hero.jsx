import { useState, useEffect } from 'react';

const HERO_BG = '/images/hero_bg.png';

const TICKER_ITEMS = [
  'Your Perfect Idli Destination',
  'Authentic South Indian',
  'Founded 2023 · Nagpur',
  'Quality · Affordability · Hygiene',
  'Quick Service · Great Taste',
  'Fresh Every Morning',
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen min-h-[680px] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1C1C1E' }}
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          transform: `translateY(${scrollY * 0.28}px)`,
          willChange: 'transform',
        }}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(28,28,30,0.88) 0%, rgba(28,28,30,0.65) 50%, rgba(28,28,30,0.45) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,0.85) 0%, transparent 55%)' }} />

      {/* ── Hero Content ── */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">

        {/* Est. tag — small, honest, not badge-y */}
        <p
          className="font-body text-xs font-semibold uppercase tracking-[0.22em] mb-6"
          style={{ color: '#F4894E', animation: 'fadeUp 0.5s ease 0.1s both' }}
        >
          Est. 2023 · Nagpur, Maharashtra
        </p>

        {/* Headline */}
        <h1
          id="hero-headline"
          className="font-display font-bold text-white leading-[1.02] mb-7"
          style={{ fontSize: 'clamp(3rem, 8.5vw, 6rem)', animation: 'fadeUp 0.7s ease 0.2s both' }}
        >
          Your Perfect<br />
          <span
            style={{ backgroundImage: 'linear-gradient(135deg, #F4894E 0%, #E8621A 50%, #D4A853 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            Idli Destination
          </span>
        </h1>

        {/* Three pillars inline — not a separate card */}
        <div
          className="flex items-center justify-center gap-6 mb-10"
          style={{ animation: 'fadeUp 0.6s ease 0.35s both' }}
        >
          {['Quality', 'Affordability', 'Hygiene'].map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />}
              <span className="font-body text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em' }}>{p}</span>
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: 'fadeUp 0.7s ease 0.5s both' }}
        >
          <a id="hero-cta-franchise" href="#franchise" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.9rem 2rem' }}>
            Book Franchise
          </a>
          <a id="hero-cta-menu" href="#menu" className="btn-outline" style={{ fontSize: '0.95rem', padding: '0.9rem 2rem' }}>
            Explore Menu
          </a>
        </div>
      </div>

      {/* ── Ticker Strip at bottom ── */}
      <div
        className="absolute left-0 right-0 bottom-0 z-20 overflow-hidden py-3"
        style={{ background: 'rgba(232,98,26,0.92)', backdropFilter: 'blur(8px)', animation: 'fadeIn 1s ease 0.8s both' }}
      >
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: 'ticker 22s linear infinite' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center font-body font-semibold text-white text-xs uppercase tracking-widest px-8">
              {item}
              <span className="ml-8 text-white/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#menu"
        aria-label="Scroll to menu"
        className="absolute left-1/2 z-10 flex flex-col items-center gap-2 no-underline group"
        style={{ bottom: '3.5rem', transform: 'translateX(-50%)', animation: 'fadeIn 1s ease 1.2s both' }}
      >
        <div className="scroll-indicator-mouse">
          <div className="scroll-indicator-wheel" />
        </div>
      </a>
    </section>
  );
}
