import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin, Star, Users } from 'lucide-react';
import type { SafariPackageCardData } from '@/api/types';
import { cn } from '@/lib/utils';

interface SafariCardProps {
  safari: SafariPackageCardData;
  categoryLabel: string;
  categoryIcon?: ReactNode;
  bookNowLabel: string;
  featuredLabel?: string;
  variant?: 'featured' | 'default';
  delay?: number;
  onBookNow: () => void;
}

const SafariCard = ({
  safari,
  categoryLabel,
  categoryIcon,
  bookNowLabel,
  featuredLabel,
  variant = 'default',
  delay = 0,
  onBookNow,
}: SafariCardProps) => {
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className={cn('bg-card overflow-hidden border border-border card-hover', isFeatured ? 'rounded-2xl' : 'rounded-xl')}>
        <div className={cn('relative overflow-hidden', isFeatured ? 'aspect-[4/3]' : 'aspect-video')}>
          <img
            src={safari.image}
            alt={safari.title}
            loading="lazy"
            className={cn(
              'w-full h-full object-cover transition-transform',
              isFeatured ? 'duration-700 group-hover:scale-110' : 'duration-500 group-hover:scale-105',
            )}
          />

          <div className={cn('absolute top-3 left-3', isFeatured && 'top-4 left-4 flex gap-2')}>
            {isFeatured && featuredLabel && (
              <span className="px-3 py-1 bg-safari text-white text-xs font-medium rounded-full">
                {featuredLabel}
              </span>
            )}
            <span
              className={cn(
                'bg-foreground/60 backdrop-blur-sm text-background text-xs font-medium rounded-full flex items-center gap-1',
                isFeatured ? 'px-3 py-1' : 'px-2 py-1',
              )}
            >
              {categoryIcon}
              {categoryLabel}
            </span>
          </div>

          <div className={cn('absolute right-3 top-3 bg-white/90 backdrop-blur-sm rounded flex items-center gap-1 px-2 py-1', isFeatured && 'right-4 top-4')}>
            <Star className={cn(isFeatured ? 'w-4 h-4' : 'w-3 h-3', 'text-yellow-500 fill-yellow-500')} />
            <span className={cn(isFeatured ? 'text-sm' : 'text-xs', 'font-medium')}>{safari.rating}</span>
          </div>
        </div>

        <div className={isFeatured ? 'p-6' : 'p-5'}>
          {isFeatured ? (
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {safari.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {safari.groupSize}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {safari.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {safari.location}
              </span>
            </div>
          )}

          <h3 className={cn(isFeatured ? 'font-serif text-2xl' : 'font-serif text-lg', 'text-foreground mb-2 group-hover:text-safari transition-colors')}>
            {safari.title}
          </h3>

          {isFeatured && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
              <MapPin size={14} />
              {safari.location}
            </div>
          )}

          <p className={cn(isFeatured ? 'text-muted-foreground mb-4 line-clamp-2' : 'text-muted-foreground text-sm mb-4 line-clamp-2')}>
            {safari.description}
          </p>

          {isFeatured && (
            <ul className="grid grid-cols-2 gap-2 mb-6">
              {safari.highlights.slice(0, 4).map((highlight) => (
                <li key={highlight} className="flex items-center gap-1 text-sm text-foreground">
                  <Check size={14} className="text-safari flex-shrink-0" />
                  <span className="truncate">{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          <div className={cn('flex items-center justify-between border-t border-border', isFeatured ? 'pt-4' : 'pt-3')}>
            <div>
              <div className={cn(isFeatured ? 'text-2xl' : 'text-lg', 'font-serif text-safari')}>
                {safari.price}
              </div>
              {safari.priceNote && <div className="text-xs text-muted-foreground">{safari.priceNote}</div>}
            </div>
            <button
              type="button"
              onClick={onBookNow}
              aria-label={`${bookNowLabel}: ${safari.title}`}
              className={cn('btn-safari', isFeatured ? 'text-sm' : 'text-xs py-2 px-4')}
            >
              {bookNowLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SafariCard;
