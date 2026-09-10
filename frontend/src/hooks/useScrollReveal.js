import { useEffect } from 'react';

/**
 * Observes elements with class "reveal" and adds "visible" when they enter viewport.
 * Usage: import useScrollReveal from '../hooks/useScrollReveal'; useScrollReveal();
 */
export default function useScrollReveal(rootMargin = '0px 0px -40px 0px') {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin }
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
    };

    observeAll();
    // Re-check after short delay to capture dynamic content mounting
    const timeoutId = setTimeout(observeAll, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [rootMargin]);
}
