import React from 'react';
import { Phone, ArrowRight, MapPin } from 'lucide-react';
import { mrkBusiness } from '../config/business';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C81036]/15 border border-[#C81036]/30 text-xs text-white font-medium">
        <MapPin className="w-3.5 h-3.5 text-[#C81036]" />
        <span className="font-mono text-xs text-[#C5A15C] tracking-widest uppercase">ERROR 404 · ROUTE NOT FOUND</span>
      </div>

      <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
        Looks like that address isn&rsquo;t on our route.
      </h1>

      <p className="text-sm sm:text-base text-[#C9D2DC] max-w-xl mx-auto leading-relaxed">
        The page you requested could not be found. You can return to the{' '}
        <strong className="text-white font-semibold">{mrkBusiness.brandName}</strong> homepage, browse our Adelaide
        service corridors, or request a moving quote directly with Mubashar.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="px-6 py-3.5 rounded-xl btn-ruby text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-lg cursor-pointer"
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
          className="px-5 py-3.5 rounded-xl btn-secondary text-white text-xs sm:text-sm font-semibold transition-all"
        >
          View Moving Services
        </a>

        <a
          href={mrkBusiness.phoneHref}
          className="px-5 py-3.5 rounded-xl bg-[#0E1420] hover:bg-[#161E2E] text-[#F5F7FA] border border-[#C9D2DC]/20 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all"
        >
          <Phone className="w-4 h-4 text-[#C81036]" />
          <span>Call {mrkBusiness.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
};
