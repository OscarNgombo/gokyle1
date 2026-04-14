import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export interface BlogCardPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

interface BlogCardProps {
  post: BlogCardPost;
  variant?: 'featured' | 'default';
  readMoreLabel?: string;
  delay?: number;
}

const BlogCard = ({
  post,
  variant = 'default',
  readMoreLabel,
  delay = 0,
}: BlogCardProps) => {
  const isFeatured = variant === 'featured';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group"
    >
      <Link to={`/blog/${post.id}`} className="block">
        <div
          className={`relative overflow-hidden ${isFeatured ? 'rounded-2xl aspect-[16/10] mb-6' : 'rounded-xl aspect-[4/3] mb-4'}`}
        >
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform ${isFeatured ? 'duration-700 group-hover:scale-110' : 'duration-500 group-hover:scale-105'}`}
          />
          <div className={`absolute inset-0 ${isFeatured ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent' : ''}`} />
          <div className="absolute top-4 left-4">
            <span
              className={`text-white font-medium ${isFeatured ? 'px-3 py-1 bg-safari text-xs rounded-full' : 'px-2 py-1 bg-safari/90 text-xs rounded'}`}
            >
              {post.category}
            </span>
          </div>
          {isFeatured && (
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-safari-light transition-colors">
                {post.title}
              </h3>
            </div>
          )}
        </div>

        {!isFeatured && (
          <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-safari transition-colors line-clamp-2">
            {post.title}
          </h3>
        )}

        <p className={`text-muted-foreground ${isFeatured ? 'mb-4 line-clamp-2' : 'text-sm mb-3 line-clamp-2'}`}>
          {post.excerpt}
        </p>

        <div
          className={`text-muted-foreground ${isFeatured ? 'flex items-center gap-4 text-sm' : 'flex items-center justify-between text-xs mb-3'}`}
        >
          <span className="flex items-center gap-1">
            <Calendar size={isFeatured ? 14 : 12} />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={isFeatured ? 14 : 12} />
            {post.readTime}
          </span>
        </div>

        {!isFeatured && readMoreLabel && (
          <span className="inline-flex items-center gap-1 text-safari font-medium text-sm group-hover:gap-2 transition-all">
            {readMoreLabel}
            <ArrowRight size={14} />
          </span>
        )}
      </Link>
    </motion.article>
  );
};

export default BlogCard;
