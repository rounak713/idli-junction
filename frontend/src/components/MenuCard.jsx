import { useState } from 'react';
import { FALLBACK_IMAGE } from '../data/menu';

export default function MenuCard({ item }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="menu-card group flex flex-col h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img
          src={imgError ? FALLBACK_IMAGE : item.image}
          alt={item.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <span className="absolute top-3.5 left-3.5 badge">
          {item.category}
        </span>

        {item.featured && (
          <span className="absolute bottom-3.5 left-3.5 bg-charcoal/85 text-white font-body font-semibold text-[11px] px-3 py-1 rounded-full shadow-sm">
            House Favorite
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className="font-display text-lg font-semibold text-charcoal mb-2 leading-snug group-hover:text-spice transition-colors duration-200">
          {item.name}
        </h3>
        <p className="font-body text-charcoal/55 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </article>
  );
}
