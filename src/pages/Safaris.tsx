import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Compass, Plane } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import SafariCard from '@/components/cards/SafariCard';
import FilterChips from '@/components/common/FilterChips';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import SectionHeader from '@/components/sections/SectionHeader';
import { useSafariPackagesQuery } from '@/api/queries';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedSafariTypes } from '@/data/safariPackages';
import { toSafariPackageCardDataList } from '@/lib/safariPackageUtils';
import hero1 from '@/assets/strip-14.jpeg';

const Safaris = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'excursion' | 'jeep-safari' | 'fly-in-safari'>('all');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const localizedSafariTypes = useMemo(() => getLocalizedSafariTypes(language), [language]);
  const { data, isLoading, isError } = useSafariPackagesQuery({ locale: language });

  const safariPackages = useMemo(() => toSafariPackageCardDataList(data?.items ?? []), [data?.items]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'excursion':
        return <Compass size={14} />;
      case 'jeep-safari':
        return <Car size={14} />;
      case 'fly-in-safari':
        return <Plane size={14} />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'excursion':
        return t('category.excursion');
      case 'jeep-safari':
        return t('category.jeepSafari');
      case 'fly-in-safari':
        return t('category.flyInSafari');
      default:
        return '';
    }
  };

  const featuredSafaris = safariPackages.filter((safari) => safari.featured);
  const filteredSafaris = activeCategory === 'all'
    ? safariPackages
    : safariPackages.filter((safari) => safari.category === activeCategory);

  const handleBookNow = (packageId: number) => {
    navigate(`/booking?package=${packageId}`);
  };

  const renderLoadingState = () => (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card/50 p-10 text-center">
      <LoaderIndicator label={t('safaris.loadingPackages')} />
      <p className="text-sm text-muted-foreground">{t('safaris.loadingPackages')}</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <p className="font-medium text-foreground">{t('safaris.packagesUnavailable')}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t('safaris.packagesUnavailableDesc')}</p>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="rounded-2xl border border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      <PageHero
        title={t('safaris.heroTitle')}
        tagline={t('safaris.heroTagline')}
        subtitle={t('safaris.heroSubtitle')}
        backgroundImage={hero1}
        heightClassName="h-[70vh]"
      >
        <Link to="/contact" className="btn-safari text-lg px-8 py-4">
          {t('safaris.planSafari')}
        </Link>
      </PageHero>

      <main id="main-content">
        <PageSection backgroundClassName="bg-background">
          <SectionHeader
            tagline={t('safaris.featuredTagline')}
            title={t('safaris.featuredTitle')}
            subtitle={t('safaris.featuredSubtitle')}
          />

          {isLoading ? renderLoadingState() : isError ? renderErrorState() : featuredSafaris.length === 0 ? renderEmptyState(t('safaris.noFeaturedPackages')) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredSafaris.slice(0, 6).map((safari, index) => (
                <SafariCard
                  key={safari.id}
                  safari={safari}
                  categoryIcon={getCategoryIcon(safari.category)}
                  categoryLabel={getCategoryLabel(safari.category)}
                  bookNowLabel={t('safaris.bookNow')}
                  featuredLabel={t('safaris.featured')}
                  variant="featured"
                  delay={index * 0.1}
                  onBookNow={() => handleBookNow(safari.id)}
                />
              ))}
            </div>
          )}
        </PageSection>

        <PageSection backgroundClassName="bg-secondary/30">
          <SectionHeader tagline={t('safaris.styleTagline')} title={t('safaris.styleTitle')} />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {localizedSafariTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
              >
                <img
                  src={type.image}
                  alt={type.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white mb-2">{type.title}</h3>
                  <p className="text-white/80 text-sm">{type.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>

        <PageSection backgroundClassName="bg-background">
          <SectionHeader tagline={t('safaris.allTagline')} title={t('safaris.allTitle')} className="mb-12" />

          <FilterChips
            options={[
              { value: 'all', label: t('safaris.allPackages') },
              { value: 'excursion', label: t('safaris.dayExcursions') },
              { value: 'jeep-safari', label: t('safaris.jeepSafaris') },
              { value: 'fly-in-safari', label: t('safaris.flyInSafaris') },
            ]}
            activeValue={activeCategory}
            onChange={(value) => setActiveCategory(value)}
            className="mb-12"
          />

          {isLoading ? renderLoadingState() : isError ? renderErrorState() : filteredSafaris.length === 0 ? renderEmptyState(t('safaris.noPackagesFound')) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSafaris.map((safari, index) => (
                <SafariCard
                  key={safari.id}
                  safari={safari}
                  categoryIcon={getCategoryIcon(safari.category)}
                  categoryLabel={getCategoryLabel(safari.category)}
                  bookNowLabel={t('safaris.bookNow')}
                  delay={index * 0.05}
                  onBookNow={() => handleBookNow(safari.id)}
                />
              ))}
            </div>
          )}
        </PageSection>

        <PageSection backgroundClassName="bg-secondary/30" className="py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl text-foreground text-center mb-8">{t('safaris.importantInfo')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('safaris.bookingPricing')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t('safaris.bookingInfo1')}</li>
                  <li>• {t('safaris.bookingInfo2')}</li>
                  <li>• {t('safaris.bookingInfo3')}</li>
                  <li>• {t('safaris.bookingInfo4')}</li>
                </ul>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('safaris.paymentCancellation')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t('safaris.paymentInfo1')}</li>
                  <li>• {t('safaris.paymentInfo2')}</li>
                  <li>• {t('safaris.paymentInfo3')}</li>
                  <li>• {t('safaris.paymentInfo4')}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </PageSection>

        <PageSection backgroundClassName="bg-primary text-primary-foreground">
          <SectionHeader
            title={t('safaris.whyBook')}
            subtitle={t('safaris.whyBookSubtitle')}
            titleClassName="text-white mb-6"
            subtitleClassName="text-primary-foreground/80"
          />

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🦁', title: t('safaris.expertGuides'), desc: t('safaris.expertGuidesDesc') },
              { icon: '💰', title: t('safaris.bestPrices'), desc: t('safaris.bestPricesDesc') },
              { icon: '📅', title: t('safaris.flexibleBooking'), desc: t('safaris.flexibleBookingDesc') },
              { icon: '🛡️', title: t('safaris.support'), desc: t('safaris.supportDesc') },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-primary-foreground/70 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </PageSection>

        <PageSection backgroundClassName="bg-background" className="text-center">
          <SectionHeader
            tagline={t('safaris.customTagline')}
            title={t('safaris.customTitle')}
            subtitle={t('safaris.customSubtitle')}
            className="mb-10"
          />
          <Link to="/contact" className="btn-safari text-lg px-10 py-4">
            {t('safaris.requestCustom')}
          </Link>
        </PageSection>
      </main>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Safaris;
