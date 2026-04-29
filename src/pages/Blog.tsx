import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import BlogCard from '@/components/cards/BlogCard';
import FilterChips from '@/components/common/FilterChips';
import SectionHeader from '@/components/sections/SectionHeader';
import { usePublicBlogPostsQuery } from '@/api/queries';
import { getApiErrorMessage } from '@/api/errors';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentImage } from '@/lib/contentAssets';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { t, language } = useLanguage();
  const { data, isLoading, isError, error } = usePublicBlogPostsQuery({ locale: language });

  const categories = useMemo(
    () => data?.categories.map((category) => ({
      value: category.value,
      label: category.label,
      count: category.value === 'all' ? data?.items.length : category.count,
    })) ?? [{ value: 'all', label: 'All' }],
    [data],
  );

  const filteredPosts = useMemo(() => {
    const items = data?.items ?? [];
    return activeCategory === 'all' ? items : items.filter((post) => post.categoryKey === activeCategory);
  }, [activeCategory, data]);

  const featuredPosts = useMemo(
    () => (data?.items ?? []).filter((post) => post.featured),
    [data],
  );

  const heroImage = useMemo(() => {
    const heroPost = featuredPosts[0] ?? data?.items[0];
    return getContentImage(heroPost?.imageKey ?? 'strip-14');
  }, [data, featuredPosts]);

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content">
        <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
          <motion.img
            src={heroImage}
            alt={t('blog.heroTitle')}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end pb-16 pl-8 md:pl-16 lg:pl-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {t('blog.heroTagline')}
              </p>
              <div className="mb-4 h-0.5 w-10 bg-[#C9A96E]" />
              <h1 className="mb-4 font-serif text-5xl text-white md:text-6xl lg:text-7xl">
                {t('blog.heroTitle')}
              </h1>
              <p className="max-w-xl text-lg text-white/90 leading-relaxed">
                {t('blog.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="border-b border-border bg-[#FAF7F2]">
          <div className="container mx-auto px-6 py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                tagline={t('blog.heroTagline')}
                title={t('blog.featuredArticles')}
                subtitle={t('blog.heroSubtitle')}
                className="mb-10"
              />
            </motion.div>
            
            <FilterChips
              options={categories}
              activeValue={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        <div className="bg-background py-16">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <LoaderIndicator label={t('blog.loading')} />
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center">
                <p className="text-muted-foreground">{getApiErrorMessage(error)}</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-10 flex items-end justify-between"
                >
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-safari">
                      {t('blog.heroTagline')}
                    </p>
                    <h2 className="font-serif text-5xl tracking-tight text-foreground md:text-6xl">
                      {activeCategory === 'all' ? t('blog.readMore') : categories.find(c => c.value === activeCategory)?.label}
                    </h2>
                    <div className="mt-3 h-0.5 w-12 bg-[#C9A96E]" />
                  </div>
                  <p className="hidden border-l-2 border-safari pl-3 text-sm text-muted-foreground md:block">
                    {filteredPosts.length} {t('dest.matchingDestinations')}
                  </p>
                </motion.div>

                <motion.div
                  key={`${activeCategory}-${language}`}
                  className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={{
                        hidden:  { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
                      }}
                    >
                      <BlogCard
                        post={{
                          id: post.id,
                          title: post.title,
                          excerpt: post.excerpt,
                          image: getContentImage(post.imageKey),
                          category: post.categoryLabel,
                          date: post.dateLabel || '',
                          readTime: post.readTime,
                        }}
                        readMoreLabel={t('blog.readMore')}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#2D4A3E] py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto mb-5 h-0.5 w-8 bg-[#C9A96E]" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                {t('blog.stayUpdated')}
              </p>
              <h2 className="font-serif text-4xl text-white md:text-5xl mb-6">
                {t('blog.stayUpdated')}
              </h2>
              <p className="text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
                {t('blog.newsletterDesc')}
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t('blog.enterEmail')}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-safari focus:bg-white/10 transition-all"
                  required
                />
                <button type="submit" className="btn-safari whitespace-nowrap px-8 py-4">
                  {t('blog.subscribe')} <ArrowRight className="ml-2 inline" size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;