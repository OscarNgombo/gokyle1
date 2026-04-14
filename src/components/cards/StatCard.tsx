import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
  className?: string;
}

const StatCard = ({ value, label, delay = 0, className }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn('p-8 rounded-2xl bg-card border border-border text-center', className)}
    >
      <div className="text-4xl font-serif text-safari mb-2">{value}</div>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default StatCard;
