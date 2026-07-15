import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import FilterChips from '@/components/common/FilterChips';
import PageSection from '@/components/layout/PageSection';
import SectionHeader from '@/components/sections/SectionHeader';
import { usePublicDestinationsQuery } from '@/api/queries';
import { getApiErrorMessage } from '@/api/errors';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentImage } from '@/lib/contentAssets';

type DestinationCountry = 'kenya' | 'tanzania';
type DestinationExperience = 'all' | 'wildlife' | 'coast' | 'culture' | 'mountains';

const Destinations = () => {
  const { country } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const initialCountry = country === 'kenya' || country === 'tanzania' ? country : 'all';

  const [activeCountry, setActiveCountry] = useState<'all' | DestinationCountry>(initialCountry);
  const [activeExperience, setActiveExperience] = useState<DestinationExperience>('all');

  const { data, isLoading, isError, error } = usePublicDestinationsQuery({ locale: language });

  const destinationCopy = useMemo(() => {
    if (language === 'de') return {
      all: 'Alle',
      allStyles: 'Alle Stile',
      wildlife: 'Wildlife',
      coast: 'Kueste & Inseln',
      culture: 'Kultur & Staedte',
      mountains: 'Berge & Trails',
      filterTagline: 'Filtere die Reise',
      filterTitle: 'Starte mit Kenia und verfeinere dann nach Stil',
      filterSubtitle: 'Standardmaessig siehst du kenianische Ziele zuerst. Nutze die Filter, um zwischen Laendern und Reisearten zu wechseln.',
      matchingDestinations: 'passende Reiseziele',
      noResultsTitle: 'Keine Reiseziele fuer diese Filter gefunden',
      noResultsDescription: 'Versuche einen anderen Stil oder wechsle das Land, um weitere Reiseziele zu sehen.',
      visibleDestinations: 'Aktuell sichtbare Reiseziele',
      kenyaDestinations: 'Ziele in Kenia',
      tanzaniaDestinations: 'Ziele in Tansania',
      loading: 'Reiseziele werden geladen...',
      unavailable: 'Veroeffentlichte Reiseziele sind derzeit nicht verfuegbar.',
    };
    if (language === 'it') return {
      all: 'Tutte',
      allStyles: 'Tutti gli stili',
      wildlife: 'Fauna selvatica',
      coast: 'Costa e isole',
      culture: 'Cultura e citta',
      mountains: 'Montagne e trekking',
      filterTagline: 'Filtra il viaggio',
      filterTitle: 'Inizia dal Kenya e poi affina per stile',
      filterSubtitle: 'Per impostazione predefinita mostiamo prima le destinazioni del Kenya. Usa i filtri per cambiare paese e stile di viaggio.',
      matchingDestinations: 'destinazioni trovate',
      noResultsTitle: 'Nessuna destinazione corrisponde a questi filtri',
      noResultsDescription: 'Prova un altro stile o cambia il paese per vedere piu opzioni.',
      visibleDestinations: 'Destinazioni attualmente visibili',
      kenyaDestinations: 'Destinazioni in Kenya',
      tanzaniaDestinations: 'Destinazioni in Tanzania',
      loading: 'Caricamento delle destinazioni...',
      unavailable: 'Le destinazioni pubblicate non sono al momento disponibili.',
    };
    return {
      all: 'All',
      allStyles: 'All Styles',
      wildlife: 'Wildlife',
      coast: 'Coast & Islands',
      culture: 'Culture & Cities',
      mountains: 'Mountains & Trails',
      filterTagline: 'Explore East Africa',
      filterTitle: 'Kenya, Tanzania, or both — find your perfect setting',
      filterSubtitle: 'Browse destinations across East Africa and narrow by the kind of experience you\'re looking for — wildlife, coast, culture, or mountains.',
      matchingDestinations: 'matching destinations',
      noResultsTitle: 'No destinations match these filters',
      noResultsDescription: 'Try another style or switch the country filter to see more destination options.',
      visibleDestinations: 'Destinations currently shown',
      kenyaDestinations: 'Destinations in Kenya',
      tanzaniaDestinations: 'Destinations in Tanzania',
      loading: 'Loading destinations...',
      unavailable: 'Published destinations are currently unavailable.',
    };
  }, [language]);

  const allDestinations = useMemo(() => data?.items ?? [], [data]);

  const filteredDestinations = useMemo(
    () =>
      allDestinations.filter((dest) => {
        const matchesCountry = activeCountry === 'all' || dest.country === activeCountry;
        const matchesExperience = activeExperience === 'all' || dest.experienceKeys?.includes(activeExperience);
        return matchesCountry && matchesExperience;
      }),
    [activeCountry, activeExperience, allDestinations],
  );

  const kenyaItems = useMemo(() =>
    filteredDestinations
      .filter((dest) => dest.country === 'kenya')
      .map((dest) => ({
        name: dest.name,
        image: getContentImage(dest.imageKey),
        description: dest.description,
        href: `/destinations/${dest.country}/${dest.slug}`,
      })),
    [filteredDestinations],
  );

  const tanzaniaItems = useMemo(() =>
    filteredDestinations
      .filter((dest) => dest.country === 'tanzania')
      .map((dest) => ({
        name: dest.name,
        image: getContentImage(dest.imageKey),
        description: dest.description,
        href: `/destinations/${dest.country}/${dest.slug}`,
      })),
    [filteredDestinations],
  );

  const showKenya = kenyaItems.length > 0;
  const showTanzania = tanzaniaItems.length > 0;

  const baseForExperienceCounts = activeCountry === 'all'
    ? allDestinations
    : allDestinations.filter((dest) => dest.country === activeCountry);

  const countryOptions = useMemo(() => [
    {
      value: 'all',
      label: destinationCopy.all,
      count: activeExperience === 'all'
        ? allDestinations.length
        : allDestinations.filter((d) => d.experienceKeys?.includes(activeExperience)).length,
    },
    {
      value: 'kenya',
      label: t('nav.kenya'),
      count: activeExperience === 'all'
        ? allDestinations.filter((d) => d.country === 'kenya').length
        : allDestinations.filter((d) => d.country === 'kenya' && d.experienceKeys?.includes(activeExperience)).length,
    },
    {
      value: 'tanzania',
      label: t('nav.tanzania'),
      count: activeExperience === 'all'
        ? allDestinations.filter((d) => d.country === 'tanzania').length
        : allDestinations.filter((d) => d.country === 'tanzania' && d.experienceKeys?.includes(activeExperience)).length,
    },
  ], [allDestinations, activeExperience, destinationCopy, t]);

  const experienceOptions = useMemo(() => [
    { value: 'all',       label: destinationCopy.allStyles, count: baseForExperienceCounts.length },
    { value: 'wildlife',  label: destinationCopy.wildlife,  count: baseForExperienceCounts.filter((d) => d.experienceKeys?.includes('wildlife')).length  },
    { value: 'coast',     label: destinationCopy.coast,     count: baseForExperienceCounts.filter((d) => d.experienceKeys?.includes('coast')).length     },
    { value: 'culture',   label: destinationCopy.culture,   count: baseForExperienceCounts.filter((d) => d.experienceKeys?.includes('culture')).length   },
    { value: 'mountains', label: destinationCopy.mountains, count: baseForExperienceCounts.filter((d) => d.experienceKeys?.includes('mountains')).length },
  ], [baseForExperienceCounts, destinationCopy]);

  const { heroImage, heroTitle, heroSubtitle } = useMemo(() => ({
    heroImage:    activeCountry === 'tanzania' ? getContentImage('beach') : getContentImage('zebra'),
    heroTitle:    country === 'kenya' ? t('nav.kenya') : country === 'tanzania' ? t('nav.tanzania') : t('dest.heroTitleAll'),
    heroSubtitle: country === 'kenya' ? t('dest.heroSubtitleKenya') : country === 'tanzania' ? t('dest.heroSubtitleTanzania') : t('dest.heroSubtitleAll'),
  }), [activeCountry, country, t]);

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content">

        <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
          <motion.img
            src={heroImage}
            alt={heroTitle}
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
                {t('dest.heroTagline')}
              </p>
              <div className="mb-4 h-0.5 w-10 bg-[#C9A96E]" />
              <h1 className="mb-4 font-serif text-5xl text-white md:text-6xl lg:text-7xl">
                {heroTitle}
              </h1>
              <p className="max-w-xl text-lg text-white/90 leading-relaxed">
                {heroSubtitle}
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
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <SectionHeader
                tagline={destinationCopy.filterTagline}
                title={destinationCopy.filterTitle}
                subtitle={destinationCopy.filterSubtitle}
                className="mb-10"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-4"
            >
              <FilterChips
                options={countryOptions}
                activeValue={activeCountry}
                onChange={(value) => {
                  setActiveCountry(value as 'all' | DestinationCountry);
                  navigate(value === 'all' ? '/destinations' : `/destinations/${value}`);
                }}
              />
              <div className="opacity-85">
                <FilterChips
                  options={experienceOptions}
                  activeValue={activeExperience}
                  onChange={(value) => setActiveExperience(value as DestinationExperience)}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Destination grids ──────────────────────────────────────── */}
        {isLoading ? (
          <PageSection backgroundClassName="bg-background">
            <div className="flex min-h-[280px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label={destinationCopy.loading} />
              <span className="text-sm text-muted-foreground">{destinationCopy.loading}</span>
            </div>
          </PageSection>
        ) : isError ? (
          <PageSection backgroundClassName="bg-background">
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-muted-foreground">
              {getApiErrorMessage(error) || destinationCopy.unavailable}
            </div>
          </PageSection>
        ) : (
          <>
            {showKenya && (
              <div className="bg-background py-16">
                <div className="container mx-auto px-6">
                  {/* Region title — x-slide entrance, chapter-heading scale */}
                  <motion.div
                    key={`kenya-title-${language}`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-10 flex items-end justify-between"
                  >
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-safari">
                        {t('dest.destinations')}
                      </p>
                      <h2 className="font-serif text-5xl tracking-tight text-foreground md:text-6xl">
                        {t('nav.kenya')}
                      </h2>
                      {/* Gold accent rule under region title */}
                      <div className="mt-3 h-0.5 w-12 bg-[#C9A96E]" />
                    </div>
                    {/* Item count with coral left border accent */}
                    <p className="hidden border-l-2 border-safari pl-3 text-sm text-muted-foreground md:block">
                      {kenyaItems.length} {destinationCopy.matchingDestinations}
                    </p>
                  </motion.div>

                  {/* Destination cards — staggered fade + lift */}
                  <motion.div
                    key={`kenya-grid-${language}`}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.07 } },
                    }}
                  >
                    {kenyaItems.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        variants={{
                          hidden:  { opacity: 0, y: 40 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
                        }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                        />
                        {/* Gradient overlay — lightens slightly on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 group-hover:-translate-y-1">
                          {/* Coral dot location marker */}
                          <div className="mb-2 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                              {t('nav.kenya')}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl text-white">{item.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-white/75">{item.description}</p>
                        </div>
                      </motion.a>
                    ))}
                  </motion.div>

                  {activeCountry === 'all' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="mt-10 text-center"
                    >
                      <a
                        href="/destinations/kenya"
                        className="inline-flex items-center gap-2 text-sm font-medium text-safari transition-[gap] duration-200 hover:gap-3"
                      >
                        {t('dest.viewAllKenya')}
                        <span>→</span>
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {showTanzania && (
              <div className={`py-16 ${showKenya ? 'bg-[#FAF7F2]' : 'bg-background'}`}>
                <div className="container mx-auto px-6">
                  <motion.div
                    key={`tanzania-title-${language}`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-10 flex items-end justify-between"
                  >
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-safari">
                        {t('dest.destinations')}
                      </p>
                      <h2 className="font-serif text-5xl tracking-tight text-foreground md:text-6xl">
                        {t('nav.tanzania')}
                      </h2>
                      <div className="mt-3 h-0.5 w-12 bg-[#C9A96E]" />
                    </div>
                    <p className="hidden border-l-2 border-safari pl-3 text-sm text-muted-foreground md:block">
                      {tanzaniaItems.length} {destinationCopy.matchingDestinations}
                    </p>
                  </motion.div>

                  <motion.div
                    key={`tanzania-grid-${language}`}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.07 } },
                    }}
                  >
                    {tanzaniaItems.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        variants={{
                          hidden:  { opacity: 0, y: 40 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
                        }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 group-hover:-translate-y-1">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                              {t('nav.tanzania')}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl text-white">{item.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-white/75">{item.description}</p>
                        </div>
                      </motion.a>
                    ))}
                  </motion.div>

                  {activeCountry === 'all' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="mt-10 text-center"
                    >
                      <a
                        href="/destinations/tanzania"
                        className="inline-flex items-center gap-2 text-sm font-medium text-safari transition-[gap] duration-200 hover:gap-3"
                      >
                        {t('dest.viewAllTanzania')}
                        <span>→</span>
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {!showKenya && !showTanzania && (
              <PageSection backgroundClassName="bg-background">
                <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center">
                  <h2 className="mb-4 font-serif text-3xl text-foreground">
                    {destinationCopy.noResultsTitle}
                  </h2>
                  <p className="text-muted-foreground">{destinationCopy.noResultsDescription}</p>
                </div>
              </PageSection>
            )}

            <div className="bg-[#2D4A3E] py-20">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-14 text-center"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    {t('dest.planJourney')}
                  </p>
                  <h2 className="font-serif text-4xl text-white md:text-5xl">
                    {t('dest.exploreRegion')}
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-white/60">
                    {t('dest.exploreRegionDesc')}
                  </p>
                </motion.div>

                <motion.div
                  className="grid gap-8 md:grid-cols-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                >
                  {[
                    { value: filteredDestinations.length, label: destinationCopy.visibleDestinations },
                    { value: kenyaItems.length,           label: destinationCopy.kenyaDestinations    },
                    { value: tanzaniaItems.length,        label: destinationCopy.tanzaniaDestinations  },
                  ].map(({ value, label }) => (
                    <motion.div
                      key={label}
                      variants={{
                        hidden:  { opacity: 0, scale: 0.95 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                      }}
                      className="text-center"
                    >
                      {/* Gold top accent rule */}
                      <div className="mx-auto mb-5 h-0.5 w-8 bg-[#C9A96E]" />
                      <p className="font-serif text-6xl text-white md:text-7xl">{value}</p>
                      <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/50">{label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Destinations;