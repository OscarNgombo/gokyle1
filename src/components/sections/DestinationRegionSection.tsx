import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DestinationCard from '@/components/cards/DestinationCard';
import PageSection from '@/components/layout/PageSection';

interface DestinationRegionItem {
  name: string;
  image: string;
  description: string;
  href: string;
}

interface DestinationRegionSectionProps {
  title: string;
  tagline: string;
  itemCountLabel: string;
  items: DestinationRegionItem[];
  backgroundClassName?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

const DestinationRegionSection = ({
  title,
  tagline,
  itemCountLabel,
  items,
  backgroundClassName = 'bg-background',
  ctaHref,
  ctaLabel,
}: DestinationRegionSectionProps) => {
  return (
    <PageSection backgroundClassName={backgroundClassName}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <p className="text-safari font-medium mb-2 tracking-wide uppercase text-sm">{tagline}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-2">{itemCountLabel}</p>
        </div>
        {ctaHref && ctaLabel && (
          <Link
            to={ctaHref}
            className="hidden md:flex items-center gap-2 text-safari hover:text-safari-dark transition-colors font-medium"
          >
            {ctaLabel}
            <ArrowRight size={18} />
          </Link>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <DestinationCard
            key={item.href}
            title={item.name}
            image={item.image}
            description={item.description}
            locationLabel={title}
            href={item.href}
            delay={index * 0.05}
          />
        ))}
      </div>

      {ctaHref && ctaLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Link to={ctaHref} className="btn-safari inline-flex items-center gap-2">
            {ctaLabel}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      )}
    </PageSection>
  );
};

export default DestinationRegionSection;
