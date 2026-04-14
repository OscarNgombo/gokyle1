import { useEffect, useState } from 'react';
import { Minus, Plus, RotateCcw, Type } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.2;
const STEP = 0.05;
const STORAGE_KEY = 'gokyle-font-scale';

const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

const AccessibilityControls = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const copy =
    language === 'de'
      ? {
          title: 'Schriftgroesse',
          decrease: 'Schrift verkleinern',
          reset: 'Schriftgroesse zuruecksetzen',
          increase: 'Schrift vergroessern',
          toggle: 'Barrierefreiheitsoptionen umschalten',
        }
      : language === 'it'
        ? {
            title: 'Dimensione testo',
            decrease: 'Riduci dimensione testo',
            reset: 'Ripristina dimensione testo',
            increase: 'Aumenta dimensione testo',
            toggle: 'Mostra opzioni di accessibilita',
          }
        : {
            title: 'Font size',
            decrease: 'Decrease font size',
            reset: 'Reset font size',
            increase: 'Increase font size',
            toggle: 'Toggle accessibility controls',
          };

  useEffect(() => {
    const storedScale = Number(window.localStorage.getItem(STORAGE_KEY));
    const nextScale = Number.isFinite(storedScale) ? clampScale(storedScale) : 1;
    document.documentElement.style.fontSize = `${nextScale * 100}%`;
    setFontScale(nextScale);
  }, []);

  const updateScale = (nextScale: number) => {
    const clampedScale = clampScale(nextScale);
    document.documentElement.style.fontSize = `${clampedScale * 100}%`;
    window.localStorage.setItem(STORAGE_KEY, String(clampedScale));
    setFontScale(clampedScale);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9998] flex flex-col items-start gap-3">
      {isOpen && (
        <div className="rounded-2xl border border-border bg-card/95 p-3 shadow-[0_18px_50px_-24px_hsl(28_24%_18%_/_0.45)] backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Type className="h-4 w-4 text-safari" />
            {copy.title}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateScale(fontScale - STEP)}
              disabled={fontScale <= MIN_SCALE}
              aria-label={copy.decrease}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors',
                fontScale <= MIN_SCALE ? 'cursor-not-allowed opacity-50' : 'hover:border-safari hover:text-safari',
              )}
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => updateScale(1)}
              aria-label={copy.reset}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-safari hover:text-safari"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => updateScale(fontScale + STEP)}
              disabled={fontScale >= MAX_SCALE}
              aria-label={copy.increase}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors',
                fontScale >= MAX_SCALE ? 'cursor-not-allowed opacity-50' : 'hover:border-safari hover:text-safari',
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
            {Math.round(fontScale * 100)}%
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={copy.toggle}
        aria-expanded={isOpen}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur transition-colors hover:border-safari hover:text-safari"
      >
        <Type className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AccessibilityControls;
