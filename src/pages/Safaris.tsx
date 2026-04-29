import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Compass, Plane, Users, BadgeDollarSign, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import SafariCard from '@/components/cards/SafariCard';
import FilterChips from '@/components/common/FilterChips';
import PageSection from '@/components/layout/PageSection';
import SectionHeader from '@/components/sections/SectionHeader';
import { useSafariPackagesQuery } from '@/api/queries';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedSafariTypes } from '@/data/safariPackages';
import { toSafariPackageCardDataList } from '@/lib/safariPackageUtils';
import heroImage from '@/assets/strip-14.jpeg';

type SafariCategory = 'all' | 'excursion' | 'jeep-safari' | 'fly-in-safari';

const Safaris = () => {
  const [activeCategory, setActiveCategory] = useState<SafariCategory>('all');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const localizedSafariTypes = useMemo(() => getLocalizedSafariTypes(language), [language]);
  const { data, isLoading, isError } = useSafariPackagesQuery({ locale: language });

  const safariPackages = useMemo(() => toSafariPackageCardDataList(data?.items ?? []), [data?.items]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'excursion':    return <Compass size={14} />;
      case 'jeep-safari':  return <Car size={14} />;
      case 'fly-in-safari': return <Plane size={14} />;
      default:             return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'excursion':    return t('category.excursion');
      case 'jeep-safari':  return t('category.jeepSafari');
      case 'fly-in-safari': return t('category.flyInSafari');
      default:             return '';
    }
  };

  const featuredSafaris = safariPackages.filter((s) => s.featured);
  const filteredSafaris = activeCategory === 'all'
    ? safariPackages
    : safariPackages.filter((s) => s.category === activeCategory);

  const handleBookNow = (packageId: number) => navigate(`/booking?package=${packageId}`);

  const whyBookItems = [
    { icon: Users,            title: t('safaris.expertGuides'),      desc: t('safaris.expertGuidesDesc')      },
    { icon: BadgeDollarSign,  title: t('safaris.bestPrices'),        desc: t('safaris.bestPricesDesc')        },
    { icon: CalendarCheck,    title: t('safaris.flexibleBooking'),   desc: t('safaris.flexibleBookingDesc')   },
    { icon: ShieldCheck,      title: t('safaris.support'),           desc: t('safaris.supportDesc')           },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content">
        <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
          <motion.img
            src={heroImage}
            alt="Safari Adventures"
            initial={{ scale: 1.06 }}
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
                {t('safaris.heroTagline')}
              </p>
              <div className="mb-4 h-0.5 w-10 bg-[#C9A96E]" />
              <h1 className="mb-4 font-serif text-5xl text-white md:text-6xl lg:text-7xl">
                {t('safaris.heroTitle')}
              </h1>
              <p className="max-w-xl text-lg text-white/90 leading-relaxed mb-8">
                {t('safaris.heroSubtitle')}
              </p>
              <Link to="/contact" className="btn-safari inline-flex items-center gap-2 px-8 py-4">
                {t('safaris.planSafari')} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ─── Featured & Filtering Header ────────────────────────────── */}
        <div className="border-b border-border bg-[#FAF7F2]">
          <div className="container mx-auto px-6 py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                tagline={t('safaris.allTagline')}
                title={t('safaris.allTitle')}
                subtitle={t('safaris.heroSubtitle')}
                className="mb-10"
              />
            </motion.div>
            
            <FilterChips
              options={[
                { value: 'all',          label: t('safaris.allPackages')   },
                { value: 'excursion',    label: t('safaris.dayExcursions') },
                { value: 'jeep-safari',  label: t('safaris.jeepSafaris')   },
                { value: 'fly-in-safari', label: t('safaris.flyInSafaris') },
              ]}
              activeValue={activeCategory}
              onChange={(value) => setActiveCategory(value as SafariCategory)}
            />
          </div>
        </div>

        {/* ─── Safari Grid ────────────────────────────────────────────── */}
        <div className="bg-background py-16">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center gap-4">
                <LoaderIndicator label={t('safaris.loadingPackages')} />
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center">
                <p className="text-muted-foreground">{t('safaris.packagesUnavailableDesc')}</p>
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
                      {t('safaris.styleTagline')}
                    </p>
                    <h2 className="font-serif text-5xl tracking-tight text-foreground md:text-6xl">
                      {activeCategory === 'all' ? t('safaris.allPackages') : getCategoryLabel(activeCategory)}
                    </h2>
                    <div className="mt-3 h-0.5 w-12 bg-[#C9A96E]" />
                  </div>
                  <p className="hidden border-l-2 border-safari pl-3 text-sm text-muted-foreground md:block">
                    {filteredSafaris.length} {t('dest.matchingDestinations')}
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
                  {filteredSafaris.map((safari) => (
                    <motion.div
                      key={safari.id}
                      variants={{
                        hidden:  { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
                      }}
                    >
                      <SafariCard
                        safari={safari}
                        categoryIcon={getCategoryIcon(safari.category)}
                        categoryLabel={getCategoryLabel(safari.category)}
                        bookNowLabel={t('safaris.bookNow')}
                        onBookNow={() => handleBookNow(safari.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* ─── Information Section (Modernized) ────────────────────────── */}
        <div className="bg-[#FAF7F2] py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center font-serif text-4xl text-foreground">
                {t('safaris.importantInfo')}
              </h2>
              <div className="grid gap-10 md:grid-cols-2">
                {[
                  { title: t('safaris.bookingPricing'), items: [t('safaris.bookingInfo1'), t('safaris.bookingInfo2'), t('safaris.bookingInfo3')] },
                  { title: t('safaris.paymentCancellation'), items: [t('safaris.paymentInfo1'), t('safaris.paymentInfo2'), t('safaris.paymentInfo3')] }
                ].map((col) => (
                  <div key={col.title} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                    <h3 className="mb-5 font-serif text-2xl text-foreground">{col.title}</h3>
                    <ul className="space-y-4">
                      {col.items.map((text, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C4704F]" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Why Gokyle (Matching Destinations Dark Style) ──────────── */}
        <div className="bg-[#2D4A3E] py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                {t('safaris.whyBookTagline')}
              </p>
              <h2 className="font-serif text-4xl text-white md:text-5xl">
                {t('safaris.whyBook')}
              </h2>
            </motion.div>

            <motion.div
              className="grid gap-8 md:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {whyBookItems.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={{
                    hidden:  { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="text-center"
                >
                  <div className="mx-auto mb-5 h-0.5 w-8 bg-[#C9A96E]" />
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                    <Icon className="h-8 w-8 text-white/80" />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── Custom Request CTA ─────────────────────────────────────── */}
        <PageSection>
          <div className="flex flex-col items-center text-center">
            <SectionHeader
              tagline={t('safaris.customTagline')}
              title={t('safaris.customTitle')}
              subtitle={t('safaris.customSubtitle')}
              className="mb-10"
            />
            <Link to="/contact" className="btn-safari text-lg px-12 py-5">
              {t('safaris.requestCustom')}
            </Link>
          </div>
        </PageSection>
      </main>

      <Footer />
    </div>
  );
};

export default Safaris;