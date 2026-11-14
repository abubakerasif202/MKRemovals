import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { mrkBusiness } from '../config/business';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
      <p className="font-mono text-xs text-[#C5A15C] tracking-widest">ERROR 404 · ROUTE NOT FOUND</p>
      <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
        Looks like that address isn&rsquo;t on our route.
      </h1>
      <p className="text-sm sm:text-base text-[#C9D2DC] max-w-xl mx-auto leading-relaxed">
        The page you requested could not be found. You can return to the{' '}
        <strong className="text-white">{mrkBusiness.brandName}</strong> homepage, browse our Adelaide
        service corridors, or request a moving quote below.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="px-5 py-3 rounded-lg bg-[#C81036] hover:bg-[#DF143E] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href="/services"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/services');
          }}
          className="px-5 py-3 rounded-lg bg-[#161E2E] hover:bg-[#242A34] text-white border border-[#C9D2DC]/25 text-xs sm:text-sm font-semibold transition-colors"
        >
          View Moving Services
        </a>

        <a
          href={mrkBusiness.phoneHref}
          className="px-5 py-3 rounded-lg bg-[#0E1420] hover:bg-[#161E2E] text-[#F5F7FA] border border-[#C9D2DC]/20 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
        >
          <Phone className="w-4 h-4 text-[#C81036]" />
          <span>Call {mrkBusiness.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
};
