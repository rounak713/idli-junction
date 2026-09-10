import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/images/Idli junction.jpeg', alt: 'Idli Junction Restaurant', size: 'large' },
  { src: '/images/idli_platter.png', alt: 'Soft Idli with Sambar', size: 'tall' },
  { src: '/images/masala_dosa.png', alt: 'Masala Dosa', size: 'small' },
  { src: '/images/filter_coffee.png', alt: 'Filter Coffee', size: 'small' },
  { src: '/images/menu_original.jpeg', alt: 'Menu Board', size: 'wide' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="py-28 bg-white overflow-hidden">
      <div className="section-container">

        {/* Minimal header — left text + rotated label */}
        <div className="flex items-start gap-8 mb-12">
          <div className="hidden lg:flex flex-col items-center gap-3 flex-shrink-0 pt-1">
            <div className="w-px h-16 bg-spice/30" />
            <p
              className="font-body font-bold text-[10px] uppercase tracking-[0.28em] text-spice/60"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Gallery
            </p>
          </div>
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal mb-3">
              Inside Idli Junction
            </h2>
            <p className="font-body text-sm text-charcoal/45 max-w-sm leading-relaxed">
              A glimpse into our kitchen — where tradition meets craft on every plate.
            </p>
          </div>
        </div>

        {/* Bento grid — deliberate asymmetric layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3" style={{ height: 'clamp(460px, 60vw, 640px)' }}>

          {/* Large cell — col 1-2, row 1-2 */}
          <GalleryCell img={GALLERY_IMAGES[0]} className="col-span-2 row-span-2" onClick={() => setLightbox(GALLERY_IMAGES[0])} />

          {/* Tall cell — col 3, row 1-2 */}
          <GalleryCell img={GALLERY_IMAGES[1]} className="col-span-1 row-span-2" onClick={() => setLightbox(GALLERY_IMAGES[1])} />

          {/* Small cell — col 4, row 1 */}
          <GalleryCell img={GALLERY_IMAGES[2]} className="col-span-1 row-span-1" onClick={() => setLightbox(GALLERY_IMAGES[2])} />

          {/* Small cell — col 4, row 2 */}
          <GalleryCell img={GALLERY_IMAGES[3]} className="col-span-1 row-span-1" onClick={() => setLightbox(GALLERY_IMAGES[3])} />

          {/* Wide bottom cell — col 1-4, row 3 */}
          <GalleryCell img={GALLERY_IMAGES[4]} className="col-span-4 row-span-1" onClick={() => setLightbox(GALLERY_IMAGES[4])} />

        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          style={{ animation: 'fadeIn 0.25s ease' }}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[88vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-0 right-0 text-center text-white/60 font-body text-xs uppercase tracking-widest">{lightbox.alt}</p>
        </div>
      )}
    </section>
  );
}

function GalleryCell({ img, className = '', onClick }) {
  return (
    <div
      id={`gallery-${img.alt.replace(/\s+/g, '-').toLowerCase()}`}
      className={`relative group overflow-hidden rounded-xl cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/35 transition-all duration-300 flex items-end justify-end p-4">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-float">
            <ZoomIn size={16} className="text-spice" />
          </div>
        </div>
      </div>
    </div>
  );
}
