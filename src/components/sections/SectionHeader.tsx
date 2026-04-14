import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  tagline?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionHeader = ({
  title,
  tagline,
  subtitle,
  align = 'center',
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) => {
  const isCentered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(isCentered ? 'text-center mb-16' : 'mb-12', className)}
    >
      {tagline && (
        <p className="text-safari font-medium mb-4 tracking-wide uppercase text-sm">
          {tagline}
        </p>
      )}
      <h2 className={cn('section-title text-foreground', !isCentered && 'mb-3', titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'section-subtitle',
            isCentered && 'mx-auto',
            !isCentered && 'max-w-2xl',
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
