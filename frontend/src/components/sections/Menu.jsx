import { useState, useEffect } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';
import { fetchMenuItems } from '../../api/client';
import { DEFAULT_MENU_ITEMS, FALLBACK_IMAGE } from '../../data/menu';

function BestSellerCard({ item, index }) {
  const [imgError, setImgError] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      className="reveal group flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image — left on even, right on odd for visual variety */}
      <div className={`relative w-full md:w-64 flex-shrink-0 h-52 md:h-auto overflow-hidden ${isEven ? 'md:order-first' : 'md:order-last'}`}>
        <img
          src={imgError ? FALLBACK_IMAGE : item.image}
          alt={item.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Category strip */}
        <div className={`absolute top-0 bottom-0 w-1 bg-spice ${isEven ? 'right-0' : 'left-0'}`} />
        {item.featured && (
          <span className="absolute top-3 left-3 bg-charcoal/80 text-white font-body font-semibold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center p-7 flex-grow">
        <p className="font-body text-[10px] font-bold uppercase tracking-widest text-spice mb-2">{item.category}</p>
        <h3 className="font-display text-xl font-bold text-charcoal mb-3 group-hover:text-spice transition-colors duration-200">
          {item.name}
        </h3>
        <p className="font-body text-sm text-charcoal/55 leading-relaxed max-w-sm">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white border border-gray-100">
      <div className="skeleton w-full md:w-64 h-52 md:h-40 flex-shrink-0" />
      <div className="flex flex-col justify-center p-7 gap-3 flex-grow">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-5 w-48" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-3/4" />
      </div>
    </div>
  );
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    let isMounted = true;
    async function loadMenu() {
      try {
        const data = await fetchMenuItems();
        if (isMounted) {
          setItems(data.length ? data : DEFAULT_MENU_ITEMS);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setItems(DEFAULT_MENU_ITEMS);
          setLoading(false);
        }
      }
    }
    loadMenu();
    return () => { isMounted = false; };
  }, []);

  const bestSellers = items.filter(item => item.available !== false && item.featured === true);

  return (
    <section id="menu" className="py-28 bg-cream relative overflow-hidden">
      {/* Large decorative number */}
      <div
        className="absolute -top-4 -left-4 font-display font-black text-[12rem] leading-none text-spice/5 select-none pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        01
      </div>

      <div className="section-container relative">
        {/* Left-aligned header — different from other sections */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 reveal">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-spice mb-2">Fan Favourites</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
              Best Sellers
            </h2>
          </div>
          <p className="font-body text-sm text-charcoal/50 max-w-xs leading-relaxed md:text-right">
            Our most loved dishes, crafted fresh every morning with stone-ground batter and traditional accompaniments.
          </p>
        </div>

        {/* Vertical list of landscape cards */}
        <div className="flex flex-col gap-5">
          {loading
            ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : bestSellers.map((item, i) => (
                <BestSellerCard key={item.id} item={item} index={i} />
              ))
          }
        </div>

        {!loading && bestSellers.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-spice/30 bg-white p-8 text-center font-body text-sm text-charcoal/55">
            Best sellers coming soon. Check back shortly!
          </div>
        )}
      </div>
    </section>
  );
}
