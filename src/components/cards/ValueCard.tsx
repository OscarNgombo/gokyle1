import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  align?: 'left' | 'center';
  className?: string;
}

const ValueCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  align = 'left',
  className,
}: ValueCardProps) => {
  const isCentered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'p-8 bg-card rounded-xl border border-border',
        isCentered && 'text-center',
        className,
      )}
    >
      <div
        className={cn(
          'w-14 h-14 rounded-xl bg-safari/10 flex items-center justify-center mb-6',
          isCentered && 'mx-auto',
        )}
      >
        <Icon className="w-7 h-7 text-safari" />
      </div>
      <h3 className="font-serif text-xl text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default ValueCard;
