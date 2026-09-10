import { useState } from 'react';
import { Store, Zap, ShieldCheck, PieChart, CheckCircle2, Send, Building2, MapPin, Award, Layers, TrendingUp } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import { submitContactMessage } from '../../api/client';

const SCALE_DRIVERS = [
  {
    icon: Store,
    title: 'Affordable Everyday Food',
    desc: 'South Indian favourites serve a broad, everyday customer base with high repeat frequency.',
  },
  {
    icon: Zap,
    title: 'Quick-Service Format',
    desc: 'A focused QSR menu supports faster preparation, rapid order assembly, and quick table turnaround.',
  },
  {
    icon: ShieldCheck,
    title: 'Operational Discipline',
    desc: 'Standardized recipes, portions, and automated processes help control food cost and wastage.',
  },
  {
    icon: Award,
    title: 'Strong Value Proposition',
    desc: 'Quality + Hygiene + Affordability creates a trusted and memorable brand promise.',
  },
  {
    icon: Layers,
    title: 'Expansion-Ready Concept',
    desc: 'A repeatable, modular outlet model designed to support seamless expansion across cities.',
  },
];

export default function Franchise() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useScrollReveal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const formattedMessage = `[FRANCHISE PROFITABILITY DECK REQUEST]
City/Location: ${form.city}
Investment Budget: ${form.budget}
User Message: ${form.message}`;

    try {
      await submitContactMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: formattedMessage,
        city: form.city.trim(),
        budget: form.budget,
        type: 'franchise',
      });
      setForm({ name: '', phone: '', email: '', city: '', budget: '', message: '' });
      setStatus('sent');
    } catch (err) {
      setError('Unable to submit inquiry right now. Please call or WhatsApp us directly at +91 92095 21933.');
      setStatus('idle');
    }
  };

  return (
    <section id="franchise" className="py-28 bg-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-spice/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative">
        {/* Section Header */}
        {/* Left-aligned header — breaks the centered pattern */}
        <div className="relative mb-16 reveal">
          <span
            className="absolute -top-6 -left-4 font-display font-black text-[8rem] leading-none text-spice/5 select-none pointer-events-none hidden lg:block"
            aria-hidden="true"
          >
            03
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 relative">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-spice mb-2">Your Perfect Idli Destination</p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
                Franchise & Business Model
              </h2>
            </div>
            <p className="font-body text-sm text-charcoal/50 max-w-xs leading-relaxed md:text-right">
              Partner with a South Indian food brand built for speed, quality, and high operational efficiency.
            </p>
          </div>
        </div>


        {/* Basic Model Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 reveal">
          <div className="bg-cream/60 p-7 rounded-2xl border border-gray-100 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-spice-muted flex items-center justify-center mb-4">
              <PieChart size={22} className="text-spice" />
            </div>
            <h3 className="font-body font-bold text-lg text-charcoal mb-2">35% Raw Material Model</h3>
            <p className="font-body text-xs text-charcoal/60 leading-relaxed">
              Optimized inventory and portion control leave a healthy ~65% contribution margin to cover fixed costs and operating profit.
            </p>
          </div>

          <div className="bg-cream/60 p-7 rounded-2xl border border-gray-100 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-spice-muted flex items-center justify-center mb-4">
              <TrendingUp size={22} className="text-spice" />
            </div>
            <h3 className="font-body font-bold text-lg text-charcoal mb-2">Up to 40%+ Operating Margins</h3>
            <p className="font-body text-xs text-charcoal/60 leading-relaxed">
              Scalable profitability model engineered so operating margins increase steadily as monthly sales volume grows.
            </p>
          </div>

          <div className="bg-cream/60 p-7 rounded-2xl border border-gray-100 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-spice-muted flex items-center justify-center mb-4">
              <Zap size={22} className="text-spice" />
            </div>
            <h3 className="font-body font-bold text-lg text-charcoal mb-2">Controlled Fixed Expenses</h3>
            <p className="font-body text-xs text-charcoal/60 leading-relaxed">
              Lean operational design keeps monthly rent, electricity, and staff overheads strictly disciplined for fast payback.
            </p>
          </div>
        </div>

        {/* Why Idli Junction Can Scale (5 Pillars from PDF) */}
        <div className="mb-20 reveal">
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl font-bold text-charcoal">Why Idli Junction Can Scale</h3>
            <p className="font-body text-xs text-charcoal/50 mt-1">Key growth drivers behind our repeatable QSR outlet format</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCALE_DRIVERS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-card hover:shadow-card-hover hover:border-spice/40 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-spice/10 text-spice flex items-center justify-center mb-4 font-body font-bold text-sm">
                  <Icon size={20} />
                </div>
                <h4 className="font-body font-bold text-base text-charcoal mb-2">{title}</h4>
                <p className="font-body text-xs text-charcoal/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Inquiry Form Card */}
        <div id="franchise-inquiry-form" className="bg-cream/90 rounded-3xl p-8 lg:p-12 border border-spice/20 shadow-card reveal relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Form Intro Text */}
            <div className="lg:col-span-5 space-y-5">
              <span className="badge bg-spice/15 text-spice border border-spice/30">
                Franchise Partner Desk
              </span>
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
                Request Detailed Information
              </h3>
              <p className="font-body text-charcoal/70 text-sm leading-relaxed">
                Fill in your basic details to receive the detailed Profitability Overview, unit economics sheet, and territory availability information.
              </p>
              <div className="pt-2 space-y-3 font-body text-xs text-charcoal/65">
                <div className="flex items-center gap-3">
                  <Building2 size={16} className="text-spice flex-shrink-0" />
                  <span>Head Office: Nagpur, Maharashtra</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-spice flex-shrink-0" />
                  <span>Target Locations: Pan-India Cities & Highway Hubs</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white p-6 lg:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
              {status === 'sent' ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-charcoal">Inquiry Received!</h4>
                  <p className="font-body text-sm text-charcoal/65 max-w-sm mx-auto">
                    Thank you. Our franchise development manager will send the complete unmasked profitability PDF to your email/phone shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-ghost text-xs text-spice border-spice hover:bg-spice hover:text-white mt-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-charcoal/60 mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-charcoal/60 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 xxxxxxxxxx"
                        className="input-premium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-charcoal/60 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-charcoal/60 mb-1">Proposed City / Location *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Pune, Mumbai, Nagpur"
                        className="input-premium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-charcoal/60 mb-1">Investment Budget</label>
                    <select
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="input-premium"
                    >
                      <option value="">Select Budget Range…</option>
                      <option value="₹10 Lakhs - ₹15 Lakhs">₹10 Lakhs - ₹15 Lakhs</option>
                      <option value="₹15 Lakhs - ₹25 Lakhs">₹15 Lakhs - ₹25 Lakhs</option>
                      <option value="₹25 Lakhs+">₹25 Lakhs+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-body font-semibold uppercase tracking-wider text-charcoal/60 mb-1">Message / Questions</label>
                    <textarea
                      name="message"
                      rows="3"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your background or target city…"
                      className="input-premium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-primary justify-center py-3.5 rounded-xl shadow-glow text-sm font-semibold gap-2 disabled:opacity-50 mt-2"
                  >
                    {status === 'submitting' ? (
                      'Requesting PDF Deck…'
                    ) : (
                      <>
                        <Send size={16} /> Request Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
