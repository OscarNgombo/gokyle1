import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import BlogCard from '@/components/cards/BlogCard';
import FilterChips from '@/components/common/FilterChips';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
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
      count: category.value === 'all' ? undefined : category.count,
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
      <PageHero
        title={t('blog.heroTitle')}
        tagline={t('blog.heroTagline')}
        subtitle={t('blog.heroSubtitle')}
        backgroundImage={heroImage}
        heightClassName="h-[50vh]"
      />

      <main id="main-content">
        <PageSection backgroundClassName="bg-background" className="py-16">
          <SectionHeader
            title={t('blog.featuredArticles')}
            align="left"
            className="mb-8"
            titleClassName="mb-0"
          />

          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label={t('blog.featuredArticles')} />
              <span className="text-sm text-muted-foreground">{t('blog.featuredArticles')}</span>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-muted-foreground">
              {getApiErrorMessage(error) || 'Unable to load published blog posts.'}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={{
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt,
                    image: getContentImage(post.imageKey),
                    category: post.categoryLabel,
                    date: post.dateLabel || '',
                    readTime: post.readTime,
                  }}
                  variant="featured"
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
              No featured blog posts are published yet.
            </div>
          )}
        </PageSection>

        <PageSection backgroundClassName="bg-secondary/30" className="py-8 sticky top-20 z-40">
          <FilterChips
            options={categories}
            activeValue={activeCategory}
            onChange={setActiveCategory}
          />
        </PageSection>

        <PageSection backgroundClassName="bg-background" className="py-16">
          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label={t('blog.readMore')} />
              <span className="text-sm text-muted-foreground">{t('blog.readMore')}</span>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-muted-foreground">
              {getApiErrorMessage(error) || 'Unable to load published blog posts.'}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
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
                  delay={index * 0.03}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
              No published blog posts match this filter yet.
            </div>
          )}
        </PageSection>

        <PageSection backgroundClassName="bg-primary text-primary-foreground" className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-4xl mb-4">{t('blog.stayUpdated')}</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{t('blog.newsletterDesc')}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">
                {t('blog.enterEmail')}
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={t('blog.enterEmail')}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-safari"
              />
              <button type="submit" className="btn-safari whitespace-nowrap">
                {t('blog.subscribe')}
              </button>
            </form>
          </motion.div>
        </PageSection>
      </main>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Blog;
