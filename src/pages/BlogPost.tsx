import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { ApiError } from '@/api/client';
import { usePublicBlogPostDetailQuery } from '@/api/queries';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import PageSection from '@/components/layout/PageSection';
import { getApiErrorMessage } from '@/api/errors';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentImage } from '@/lib/contentAssets';

const BlogPost = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { data, isLoading, isError, error } = usePublicBlogPostDetailQuery(id, language);
  const post = data?.item;
  
  const isNotFound = error instanceof ApiError && error.status === 404;

  const labels = useMemo(() => {
    if (language === 'de') return {
      notFound: 'Beitrag nicht gefunden',
      interest: 'Ich interessiere mich fuer:',
      back: 'Zurück zum Blog',
    };
    if (language === 'it') return {
      notFound: 'Articolo non trovato',
      interest: 'Mi interessa:',
      back: 'Torna al blog',
    };
    return {
      notFound: 'Post Not Found',
      interest: "I'm interested in:",
      back: 'Back to Blog',
    };
  }, [language]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center">
          <LoaderIndicator label={t('blog.loading') || 'Loading...'} />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <PageSection className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h1 className="font-serif text-4xl mb-6">
            {isNotFound ? labels.notFound : 'Error'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isNotFound ? '' : getApiErrorMessage(error)}
          </p>
          <Link to="/blog" className="btn-safari">
            <ArrowLeft className="mr-2" size={18} /> {labels.back}
          </Link>
        </PageSection>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        {/* ─── Immersive Motion Hero ─────────────────────────────────── */}
        <div className="relative h-[65vh] min-h-[500px] overflow-hidden">
          <motion.img
            src={getContentImage(post.imageKey)}
            alt={post.title}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end pb-16">
            <div className="container mx-auto px-6 md:px-16 lg:px-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm font-medium uppercase tracking-widest"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  {labels.back}
                </Link>

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                    {post.categoryLabel}
                  </p>
                </div>

                <div className="mb-6 h-0.5 w-12 bg-[#C9A96E]" />
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white mb-8 max-w-5xl leading-[1.1]">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-white/60 text-sm">
                  <span className="flex items-center gap-2">
                    <User size={16} className="text-[#C9A96E]" />
                    {post.authorName}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#C9A96E]" />
                    {post.dateLabel}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-[#C9A96E]" />
                    {post.readTime}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ─── Article Content ────────────────────────────────────────── */}
        <article className="bg-background pt-20 pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="prose prose-lg prose-stone dark:prose-invert max-w-none"
              >
                {/* Intro style for the first paragraph */}
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={`leading-relaxed mb-8 text-muted-foreground ${
                      index === 0 ? 'text-xl text-foreground/90 font-serif' : 'text-lg'
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 pt-10 border-t border-border"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-sm font-medium text-safari transition-[gap] duration-200 hover:gap-3"
                  >
                    <ArrowLeft size={18} />
                    {t('blog.backToAllArticles')}
                  </Link>

                  <div className="flex items-center gap-4">
                    <button className="p-3 rounded-full border border-border text-muted-foreground hover:bg-secondary/50 transition-colors">
                      <Share2 size={20} />
                    </button>
                    <a
                      href='/booking'
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-safari px-8"
                    >
                      {t('blog.bookExperience')}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </article>

        <div className="bg-[#2D4A3E] py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="mx-auto mb-5 h-0.5 w-8 bg-[#C9A96E]" />
            <h2 className="font-serif text-3xl text-white">{t('blog.stayUpdated')}</h2>
            <Link to="/blog" className="mt-6 inline-block text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold">
              {t('blog.readMore')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;