import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2 py-1.5 rounded transition-all ${
          language === 'en' 
            ? 'bg-safari/20 ring-1 ring-safari' 
            : 'hover:bg-primary-foreground/10'
        }`}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
        title="English"
      >
        {/* UK Flag */}
        <svg className="w-6 h-4 rounded-sm shadow-sm" viewBox="0 0 60 40">
          <rect fill="#012169" width="60" height="40"/>
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8"/>
          <path d="M0,0 L60,40" stroke="#C8102E" strokeWidth="4" clipPath="url(#ukClip1)"/>
          <path d="M60,0 L0,40" stroke="#C8102E" strokeWidth="4" clipPath="url(#ukClip2)"/>
          <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12"/>
          <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('de')}
        className={`flex items-center gap-1 px-2 py-1.5 rounded transition-all ${
          language === 'de' 
            ? 'bg-safari/20 ring-1 ring-safari' 
            : 'hover:bg-primary-foreground/10'
        }`}
        aria-label="Auf Deutsch umschalten"
        aria-pressed={language === 'de'}
        title="Deutsch"
      >
        {/* German Flag */}
        <svg className="w-6 h-4 rounded-sm shadow-sm" viewBox="0 0 60 40">
          <rect y="0" fill="#000" width="60" height="13.33"/>
          <rect y="13.33" fill="#DD0000" width="60" height="13.33"/>
          <rect y="26.66" fill="#FFCE00" width="60" height="13.34"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('it')}
        className={`flex items-center gap-1 px-2 py-1.5 rounded transition-all ${
          language === 'it'
            ? 'bg-safari/20 ring-1 ring-safari'
            : 'hover:bg-primary-foreground/10'
        }`}
        aria-label="Passa all'italiano"
        aria-pressed={language === 'it'}
        title="Italiano"
      >
        <svg className="w-6 h-4 rounded-sm shadow-sm" viewBox="0 0 60 40">
          <rect x="0" y="0" fill="#009246" width="20" height="40" />
          <rect x="20" y="0" fill="#FFFFFF" width="20" height="40" />
          <rect x="40" y="0" fill="#CE2B37" width="20" height="40" />
        </svg>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
