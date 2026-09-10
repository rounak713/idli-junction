import { Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function FloatingActions() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <div className="relative flex items-center justify-end gap-3">
        {hovered === 'wa' && (
          <span
            className="bg-charcoal text-white font-body text-xs font-medium px-3 py-1.5 rounded-lg shadow-float whitespace-nowrap"
            style={{ animation: 'slideRight 0.2s ease' }}
          >
            Chat on WhatsApp
          </span>
        )}
        <a
          href="https://wa.me/919209521933"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          onMouseEnter={() => setHovered('wa')}
          onMouseLeave={() => setHovered(null)}
          className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-[#25D366] flex items-center justify-center shadow-float 
                     hover:scale-110 hover:shadow-[0_8px_32px_rgba(37,211,102,0.4)] 
                     active:scale-95 transition-all duration-250"
        >
          <MessageCircle size={22} className="text-white" fill="white" />
        </a>
      </div>

      {/* Call */}
      <div className="relative flex items-center justify-end gap-3">
        {hovered === 'call' && (
          <span
            className="bg-charcoal text-white font-body text-xs font-medium px-3 py-1.5 rounded-lg shadow-float whitespace-nowrap"
            style={{ animation: 'slideRight 0.2s ease' }}
          >
            Call Now
          </span>
        )}
        <a
          href="tel:+919209521933"
          aria-label="Call Now"
          onMouseEnter={() => setHovered('call')}
          onMouseLeave={() => setHovered(null)}
          className="w-[52px] h-[52px] rounded-full bg-spice flex items-center justify-center shadow-glow
                     hover:scale-110 hover:bg-spice-dark hover:shadow-[0_8px_32px_rgba(232,98,26,0.4)]
                     active:scale-95 transition-all duration-250"
        >
          <Phone size={20} className="text-white" />
        </a>
      </div>
    </div>
  );
}
