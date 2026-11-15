import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SeoHead } from './components/layout/SeoHead';
import { ScrollProgressBar } from './components/layout/ScrollProgressBar';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import { ServiceAreaDetailPage } from './pages/ServiceAreaDetailPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { QuotePage } from './pages/QuotePage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export interface AppProps {
  initialPath?: string;
}

export default function App({ initialPath }: AppProps = {}): React.ReactElement {
  const [locationState, setLocationState] = useState<{ pathname: string; search: string }>(() => {
    if (typeof window !== 'undefined') {
      return {
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      };
    }
    const [rawPath, rawSearch] = (initialPath || '/').split('?');
    const pathname = rawPath.replace(/\/+$/, '') || '/';
    const search = rawSearch ? `?${rawSearch}` : '';
    return { pathname, search };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setLocationState({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const [rawPath, rawSearch] = to.split('?');
    const pathname = rawPath.replace(/\/+$/, '') || '/';
    const search = rawSearch ? `?${rawSearch}` : '';
    const fullUrl = `${pathname}${search}`;

    if (typeof window !== 'undefined') {
      if (
        window.location.pathname !== pathname ||
        window.location.search !== search
      ) {
        window.history.pushState({}, '', fullUrl);
      }
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }

    setLocationState({ pathname, search });
  }, []);

  const { pathname, search } = locationState;
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  const renderRoute = () => {
    if (cleanPath === '/') {
      return <HomePage onNavigate={navigate} />;
    }
    if (cleanPath === '/services') {
      return <ServicesPage onNavigate={navigate} />;
    }
    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (cleanPath === '/service-areas') {
      return <ServiceAreasPage onNavigate={navigate} />;
    }
    if (cleanPath.startsWith('/service-areas/')) {
      const slug = cleanPath.replace('/service-areas/', '');
      return <ServiceAreaDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (cleanPath === '/pricing') {
      return <PricingPage onNavigate={navigate} />;
    }
    if (cleanPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (cleanPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (cleanPath === '/quote') {
      return <QuotePage searchQuery={search} onNavigate={navigate} />;
    }
    if (cleanPath === '/faq') {
      return <FaqPage onNavigate={navigate} />;
    }
    if (cleanPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0B1B33]">
      <SeoHead pathname={cleanPath} />
      <ScrollProgressBar pathname={cleanPath} />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#C81036] focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <Header currentPath={cleanPath} onNavigate={navigate} />

      <main id="main-content" className="flex-1">
        {renderRoute()}
      </main>

      <Footer onNavigate={navigate} currentPath={cleanPath} />
    </div>
  );
}
