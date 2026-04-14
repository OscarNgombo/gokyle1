import logo from '@/assets/gokyle-logo.png';
import { cn } from '@/lib/utils';

interface LoaderIndicatorProps {
  size?: number;
  className?: string;
  label?: string;
}

const LoaderIndicator = ({
  size = 36,
  className,
  label = 'Loading',
}: LoaderIndicatorProps) => {
  const ringInset = Math.max(3, Math.round(size * 0.1));
  const innerInset = ringInset + 3;

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{ width: size, height: size }}
    >
      <div className="loader-orbit absolute inset-0 rounded-full" />
      <div
        className="absolute rounded-full border border-border/70 bg-background/95 shadow-[0_8px_24px_-14px_hsl(var(--primary)/0.45)] backdrop-blur-sm"
        style={{ inset: ringInset }}
      />
      <div
        className="absolute overflow-hidden rounded-full bg-gradient-to-br from-white/70 via-background to-secondary/70"
        style={{ inset: innerInset }}
      >
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-[1.55] object-cover object-top"
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoaderIndicator;
