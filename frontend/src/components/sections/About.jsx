import { ShieldCheck, Wallet, Sparkles, Compass } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';

const PILLARS = [
  { num: '01', icon: ShieldCheck, title: 'Quality', desc: 'Consistent taste and premium ingredients in every dish, every time.' },
  { num: '02', icon: Wallet, title: 'Affordability', desc: 'Great South Indian food served at accessible, value-for-money prices.' },
  { num: '03', icon: Sparkles, title: 'Hygiene', desc: 'Clean, organized, and standardized food operations — always.' },
];

export default function About() {
  useScrollReveal();

  return (
    <section id="about" className="py-28 bg-cream overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text side — LEFT (opposite of the bento/gallery vibe) */}
          <div className="reveal order-2 lg:order-1">

            {/* Large decorative number behind heading */}
            <div className="relative mb-8">
              <span
                className="absolute -top-6 -left-4 font-display font-black text-[8rem] leading-none text-spice/5 select-none pointer-events-none hidden lg:block"
                aria-hidden="true"
              >
                02
              </span>
              <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-spice mb-3 relative">About Us</p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal leading-tight relative">
                Built Around<br />
                <span className="italic text-spice">One Simple Idea</span>
              </h2>
            </div>

            <p className="font-body text-charcoal/70 text-sm sm:text-base leading-relaxed mb-4">
              Idli Junction is a South Indian food brand built around one simple idea — serve delicious, hygienic and affordable food with the speed and consistency of a modern quick-service restaurant.
            </p>
            <p className="font-body text-charcoal/70 text-sm sm:text-base leading-relaxed mb-10">
              From idli and dosa to filter coffee, we want every customer to enjoy familiar flavours in a clean, reliable brand environment — at a price that's always fair.
            </p>

            {/* Numbered pillars — horizontal list, not cards */}
            <div className="space-y-5 mb-10">
              {PILLARS.map(({ num, icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-5 group">
                  <span className="font-display font-black text-3xl text-spice/20 leading-none flex-shrink-0 group-hover:text-spice/40 transition-colors duration-300">{num}</span>
                  <div className="flex-1 border-b border-gray-100 pb-5 group-hover:border-spice/20 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={15} className="text-spice" />
                      <h4 className="font-body font-bold text-sm text-charcoal uppercase tracking-wider">{title}</h4>
                    </div>
                    <p className="font-body text-xs text-charcoal/50 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vision — compact inline strip */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-spice/15">
              <div className="w-8 h-8 rounded-full bg-spice text-white flex items-center justify-center flex-shrink-0">
                <Compass size={15} />
              </div>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                <span className="font-bold text-charcoal">Vision:</span> Build a trusted South Indian QSR brand reaching customers across India — maintaining quality, hygiene and affordability at scale.
              </p>
            </div>
          </div>

          {/* Image side — RIGHT */}
          <div className="relative reveal order-1 lg:order-2" style={{ transitionDelay: '150ms' }}>
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-spice/6 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

            {/* Offset image stack */}
            <div className="relative">
              {/* Main image */}
              <div className="h-[460px] rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  id="about-img-main"
                  src="/images/Idli junction.jpeg"
                  alt="Idli Junction Restaurant"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating inset card — bottom left */}
              <div className="absolute -bottom-6 -left-6 w-44 h-44 rounded-2xl overflow-hidden shadow-float border-4 border-cream hidden md:block">
                <img
                  id="about-img-secondary"
                  src="/images/idli_platter.png"
                  alt="Fresh Idli Platter"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Brand label — top right corner */}
              <div className="absolute -top-5 -right-5 bg-spice text-white px-5 py-3 rounded-xl shadow-float text-center hidden md:block">
                <p className="font-display text-lg font-bold leading-none">QSR</p>
                <p className="font-body text-[10px] font-medium text-white/80 mt-0.5 tracking-wider">Since 2023</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
