import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import { submitContactMessage } from '../../api/client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
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
    try {
      await submitContactMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setForm({ name: '', phone: '', email: '', message: '' });
      setStatus('sent');
    } catch {
      setError('Could not send your message. Please call or WhatsApp us directly.');
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="bg-white overflow-hidden">

      {/* ── Top info bar — full width charcoal band ── */}
      <div className="bg-charcoal text-white">
        <div className="section-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">

            <div className="col-span-2 md:col-span-1">
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-spice mb-2">Find Us</p>
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Shop no G-3, Shivpuja Apt,<br />
                Subhash Nagar, Nagpur<br />
                Maharashtra 440022
              </p>
            </div>

            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-spice mb-2">Call / WhatsApp</p>
              <a href="tel:+919209521933" className="font-body text-sm text-white/70 hover:text-white transition-colors block mb-1">
                +91 92095 21933
              </a>
              <a href="https://wa.me/919209521933" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-spice/80 hover:text-spice transition-colors">
                Chat on WhatsApp →
              </a>
            </div>

            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-spice mb-2">Opening Hours</p>
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Mon: 7:00 AM – 11:00 PM<br />
                Tue–Thu & Sun: 7:00 AM – 10:30 PM<br />
                Fri–Sat: 7:00 AM – 10:00 PM
              </p>
            </div>

            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-spice mb-2">Follow Us</p>
              <a
                href="https://www.instagram.com/idli.junction/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-white/70 hover:text-white transition-colors block mb-1"
              >
                @idli.junction
              </a>
              <div className="flex items-center gap-1.5 mt-2">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= 4 ? '#E8621A' : 'none'} stroke="#E8621A" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
                <span className="font-body text-xs text-white/40 ml-1">4.5 · 129 reviews</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Main content: map + form side by side ── */}
      <div className="section-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Map */}
          <div className="reveal rounded-2xl overflow-hidden h-[460px] lg:h-[520px]" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
            <iframe
              title="Idli Junction Nagpur Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.946115984249!2d79.04011397503417!3d21.114721080556133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4bf6d5ca7885b%3A0x1e16b215d71c6917!2sIDLI%20JUNCTION!5e0!3m2!1sen!2sin!4v1714455075678!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'saturate(1.05) contrast(0.95)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Dark form card */}
          <div className="reveal bg-charcoal rounded-2xl p-8 lg:p-10" style={{ transitionDelay: '150ms' }}>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-spice mb-2">Get In Touch</p>
            <h2 className="font-display text-3xl font-bold text-white mb-6 leading-tight">
              Send Us a Message
            </h2>

            {status === 'sent' ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>
                <p className="font-display text-xl font-bold text-white">Message Received!</p>
                <p className="font-body text-sm text-white/50">We'll get back to you soon.</p>
                <button onClick={() => setStatus('idle')} className="font-body text-xs text-spice hover:text-spice/80 transition-colors mt-3">
                  Send another →
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    id="contact-name" name="name" type="text" required
                    placeholder="Your Name"
                    value={form.name} onChange={handleChange}
                    className="input-dark"
                  />
                  <input
                    id="contact-phone" name="phone" type="tel"
                    placeholder="Phone Number"
                    value={form.phone} onChange={handleChange}
                    className="input-dark"
                  />
                </div>
                <input
                  id="contact-email" name="email" type="email"
                  placeholder="Email Address"
                  value={form.email} onChange={handleChange}
                  className="input-dark"
                />
                <textarea
                  id="contact-message" name="message" rows="4"
                  placeholder="Your message…"
                  required
                  value={form.message} onChange={handleChange}
                  className="input-dark resize-none"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full btn-primary justify-center disabled:opacity-60 py-3.5"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
