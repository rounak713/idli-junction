import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Store } from 'lucide-react';

const navLinks = [
  { label: 'Home',      href: '#home' },
  { label: 'Menu',      href: '#menu' },
  { label: 'Gallery',   href: '#gallery' },
  { label: 'About',     href: '#about' },
  { label: 'Franchise', href: '#franchise' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.08)]'
            : 'bg-transparent'
          }`}
      >
        <nav className="section-container flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="Idli Junction Home">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-glow group-hover:scale-110 transition-transform duration-300 bg-white">
              <img 
                src="/images/logo.jpeg" 
                alt="Idli Junction Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`font-display text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-charcoal' : 'text-white'}`}>
              Idli Junction
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  id={`nav-link-${label.toLowerCase()}`}
                  className={`nav-link pb-0.5 ${scrolled ? 'text-charcoal/80' : 'text-white/90 hover:text-white after:bg-white'}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              id="nav-call-link"
              href="tel:+919209521933"
              className={`flex items-center gap-1.5 font-body text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-charcoal/70 hover:text-spice' : 'text-white/80 hover:text-white'}`}
            >
              <Phone size={15} strokeWidth={2.5} />
              +91 92095 21933
            </a>
            <a id="nav-franchise-btn" href="#franchise" className="btn-primary gap-2">
              <Store size={16} /> Book Franchise
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-charcoal' : 'text-white'}`}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-charcoal/95 backdrop-blur-sm flex flex-col justify-center items-center transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ul className="flex flex-col items-center gap-7">
          {navLinks.map(({ label, href }, i) => (
            <li key={label} style={{ transitionDelay: `${i * 50}ms` }} className={`transition-all duration-500 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl text-white hover:text-spice-light transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
          <li className={`mt-4 transition-all duration-500 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            <a href="#franchise" onClick={() => setMenuOpen(false)} className="btn-primary gap-2">
              <Store size={18} /> Book Franchise
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
