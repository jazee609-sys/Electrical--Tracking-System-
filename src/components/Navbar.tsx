import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import {
  Zap,
  PhoneCall,
  Menu,
  X,
  PlusCircle,
  Search,
  BarChart3,
  Shield,
  Info,
  Home,
  Languages,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { language, toggleLanguage, t, stats } = useComplaints();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = window.location.href.split('#')[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const navItems = [
    {
      id: 'home',
      label: t('Home', 'முகப்பு'),
      icon: Home,
    },
    {
      id: 'report',
      label: t('Report Complaint', 'புகார் பதிவு'),
      icon: PlusCircle,
      highlight: true,
    },
    {
      id: 'track',
      label: t('Track Complaint', 'புகார் நிலை'),
      icon: Search,
    },
    {
      id: 'districts',
      label: t('District Dashboard', '38 மாவட்டங்கள்'),
      icon: BarChart3,
    },
    {
      id: 'admin',
      label: t('Admin Dashboard', 'நிர்வாக பலகை'),
      icon: Shield,
      badge: stats.pending > 0 ? stats.pending : undefined,
    },
    {
      id: 'about',
      label: t('About Us', 'எங்களை பற்றி'),
      icon: Info,
    },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-blue-900/60">
      {/* Top official banner bar */}
      <div className="bg-[#0b2559] text-xs py-1.5 px-4 border-b border-blue-800/40 text-blue-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium tracking-wide">
              {t(
                'Government of Tamil Nadu • Electricity Grievance & Outage Redressal',
                'தமிழ்நாடு அரசு • மின் நுகர்வோர் குறைதீர்க்கும் மற்றும் கண்காணிப்பு தளம்'
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <a
              href="tel:1912"
              className="flex items-center gap-1.5 text-yellow-300 hover:text-yellow-200 font-bold tracking-wide transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('24/7 Helpline: 1912', '24/7 உதவி எண்: 1912')}</span>
            </a>

            {/* Quick Copy Link Button in Header */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-all ${
                copied
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                  : 'bg-blue-800/90 hover:bg-blue-700 text-yellow-300 border-blue-600/60 hover:text-white'
              }`}
              title={t('Copy web link to share or bookmark', 'இணையதள முகவரியை நகலெடுக்க')}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>{t('Copied!', 'நகலெடுக்கப்பட்டது!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('Copy Web Link', 'இணைப்பை நகலெடு')}</span>
                </>
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-blue-800/80 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-medium cursor-pointer border border-blue-600/50 transition-colors"
              title="Switch language / மொழியை மாற்றுக"
            >
              <Languages className="w-3 h-3 text-yellow-400" />
              <span className="font-semibold">{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-6 h-6 fill-current text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-yellow-300 transition-colors">
                  Electrical Tracking System
                </span>
                <span className="bg-blue-800 text-yellow-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block border border-blue-700">
                  TN-ELEC
                </span>
              </div>
              <p className="text-xs text-blue-300 font-medium tracking-wide">
                {t('Tamil Nadu District-wise Outage & Grievance Portal', 'தமிழ்நாடு மின்சார குறைதீர்ப்பு தளம்')}
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4 fill-current" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer relative ${
                    isActive
                      ? 'bg-blue-800/80 text-yellow-300 font-semibold shadow-inner'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-300' : 'text-blue-300'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-yellow-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Desktop Share / Copy Button */}
            <button
              onClick={handleCopyLink}
              title={t('Copy web address to clipboard', 'இணையதள முகவரியை நகலெடுக்க')}
              className={`ml-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                  : 'text-slate-200 hover:text-yellow-300 hover:bg-slate-800/80 border-slate-700/60'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span className="font-semibold text-emerald-100">{t('Copied!', 'நகலெடுக்கப்பட்டது!')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-yellow-400" />
                  <span>{t('Share Link', 'பகிர்')}</span>
                </>
              )}
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handleCopyLink}
              title="Copy web link"
              className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                copied
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-yellow-300 hover:text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleNavClick('report')}
              className="bg-yellow-400 text-slate-950 font-bold px-2.5 py-1.5 rounded text-xs flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('Report', 'பதிவு')}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-5 space-y-1 shadow-2xl animate-in slide-in-from-top-4 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-800 text-yellow-300 font-bold'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-300' : 'text-blue-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile Copy Web Link Button */}
          <button
            onClick={handleCopyLink}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer border transition-colors ${
              copied
                ? 'bg-emerald-700/80 border-emerald-500 text-white font-bold'
                : 'bg-slate-800/80 border-slate-700 text-yellow-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-yellow-400" />}
              <span>{copied ? t('Link Copied to Clipboard!', 'இணைப்பு நகலெடுக்கப்பட்டது!') : t('Copy Website Link (URL)', 'இணைய முகவரியை நகலெடு')}</span>
            </div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wide">
              {copied ? 'Done' : 'Copy'}
            </span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-blue-300 px-2">
            <span>{t('Language / மொழி:', 'மொழி / Language:')}</span>
            <button
              onClick={toggleLanguage}
              className="bg-blue-800 text-yellow-300 font-semibold px-3 py-1 rounded cursor-pointer"
            >
              {language === 'en' ? 'தமிழில் படிக்க' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Copied Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {t('Website link copied to clipboard!', 'இணையதள முகவரி நகலெடுக்கப்பட்டது!')}
            </p>
            <p className="text-xs text-slate-300">
              {t('You can now paste (Ctrl+V) or share it with anyone.', 'இதை நீங்கள் எங்கு வேண்டுமானாலும் ஒட்டி (Ctrl+V) பகிரலாம்.')}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
