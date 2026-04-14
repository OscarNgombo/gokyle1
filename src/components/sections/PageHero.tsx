import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  tagline?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundClassName?: string;
  overlayClassName?: string;
  heightClassName?: string;
  align?: 'left' | 'center';
  contentClassName?: string;
  children?: ReactNode;
}

const PageHero = ({
  title,
  tagline,
  subtitle,
  backgroundImage,
  backgroundClassName = 'bg-primary',
  overlayClassName = 'bg-gradient-to-b from-black/60 via-black/40 to-black/60',
  heightClassName = 'h-[60vh]',
  align = 'center',
  contentClassName,
  children,
}: PageHeroProps) => {
  const isCentered = align === 'center';

  return (
    <section className={cn('relative overflow-hidden', backgroundClassName, heightClassName)}>
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className={cn('absolute inset-0', overlayClassName)} />

      <div className={cn('relative z-10 flex h-full items-center', isCentered && 'justify-center')}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl',
              contentClassName,
            )}
          >
            {tagline && (
              <p className="text-safari-light font-medium mb-4 tracking-wide uppercase text-sm">
                {tagline}
              </p>
            )}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">{title}</h1>
            {subtitle && (
              <p className={cn('text-xl text-white/80', isCentered && 'max-w-2xl mx-auto')}>
                {subtitle}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
