import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface DestinationCardProps {
  title: string;
  image: string;
  locationLabel: string;
  description: string;
  href: string;
  delay?: number;
}

const DestinationCard = ({
  title,
  image,
  locationLabel,
  description,
  href,
  delay = 0,
}: DestinationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={href} className="group block">
        <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-3">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-1 text-safari-light text-xs mb-1">
              <MapPin size={12} />
              {locationLabel}
            </div>
            <h3 className="font-serif text-xl text-white">{title}</h3>
          </div>
        </div>
        <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors line-clamp-2">
          {description}
        </p>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;
