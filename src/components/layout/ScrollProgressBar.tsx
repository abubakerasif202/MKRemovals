import React, { useState, useEffect } from 'react';
import { calculateScrollProgress } from '../../lib/seo';

interface ScrollProgressBarProps {
  pathname: string;
}

/**
 * Subtle, thin reading progress bar at the top of the viewport using MRK Sapphire Blue (#124FA3) branding.
 * Uses compositor-only transform (scaleX) for zero layout shift and 60fps smoothness.
 */
export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ pathname }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let rafId: number | null = null;

    const updateScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || 0;
      const clientHeight = doc.clientHeight || window.innerHeight || 0;
      setProgress(calculateScrollProgress(scrollTop, scrollHeight, clientHeight));
      rafId = null;
    };

    const handleScrollOrResize = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [pathname]);

  return (
    <div
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      data-testid="mrk-scroll-progress"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#F3F7FC] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-[#124FA3] via-[#C81036] to-[#C5A15C] transition-transform duration-75 ease-out shadow-[0_0_10px_rgba(200,16,54,0.5)]"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
};
