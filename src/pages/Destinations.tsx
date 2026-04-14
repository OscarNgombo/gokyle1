import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import StatCard from '@/components/cards/StatCard';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import FilterChips from '@/components/common/FilterChips';
import PageSection from '@/components/layout/PageSection';
import DestinationRegionSection from '@/components/sections/DestinationRegionSection';
import PageHero from '@/components/sections/PageHero';
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

  useEffect(() => {
    setActiveCountry(initialCountry);
  }, [initialCountry]);

  const destinationCopy =
    language === 'de'
      ? {
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
        }
      : language === 'it'
        ? {
            all: 'Tutte',
            allStyles: 'Tutti gli stili',
            wildlife: 'Fauna selvatica',
            coast: 'Costa e isole',
            culture: 'Cultura e citta',
            mountains: 'Montagne e trekking',
            filterTagline: 'Filtra il viaggio',
            filterTitle: 'Inizia dal Kenya e poi affina per stile',
            filterSubtitle: 'Per impostazione predefinita mostriamo prima le destinazioni del Kenya. Usa i filtri per cambiare paese e stile di viaggio.',
            matchingDestinations: 'destinazioni trovate',
            noResultsTitle: 'Nessuna destinazione corrisponde a questi filtri',
            noResultsDescription: 'Prova un altro stile o cambia il paese per vedere piu opzioni.',
            visibleDestinations: 'Destinazioni attualmente visibili',
            kenyaDestinations: 'Destinazioni in Kenya',
            tanzaniaDestinations: 'Destinazioni in Tanzania',
            loading: 'Caricamento delle destinazioni...',
            unavailable: 'Le destinazioni pubblicate non sono al momento disponibili.',
          }
        : {
            all: 'All',
            allStyles: 'All Styles',
            wildlife: 'Wildlife',
            coast: 'Coast & Islands',
            culture: 'Culture & Cities',
            mountains: 'Mountains & Trails',
            filterTagline: 'Filter the journey',
            filterTitle: 'Start with Kenya first, then refine by travel style',
            filterSubtitle: 'By default, Kenyan destinations appear first. Use the filters to switch countries and narrow the destinations by travel style.',
            matchingDestinations: 'matching destinations',
            noResultsTitle: 'No destinations match these filters',
            noResultsDescription: 'Try another style or switch the country filter to see more destination options.',
            visibleDestinations: 'Destinations currently shown',
            kenyaDestinations: 'Destinations in Kenya',
            tanzaniaDestinations: 'Destinations in Tanzania',
            loading: 'Loading destinations...',
            unavailable: 'Published destinations are currently unavailable.',
          };

  const allDestinations = useMemo(() => data?.items ?? [], [data]);
  const filteredDestinations = useMemo(
    () =>
      allDestinations.filter((dest) => {
        const matchesCountry = activeCountry === 'all' || dest.country === activeCountry;
        const matchesExperience = activeExperience === 'all' || dest.experienceKeys.includes(activeExperience);
        return matchesCountry && matchesExperience;
      }),
    [activeCountry, activeExperience, allDestinations],
  );

  const kenyaItems = filteredDestinations
    .filter((dest) => dest.country === 'kenya')
    .map((dest) => ({
      name: dest.name,
      image: getContentImage(dest.imageKey),
      description: dest.description,
      href: `/destinations/${dest.country}/${dest.slug}`,
    }));

  const tanzaniaItems = filteredDestinations
    .filter((dest) => dest.country === 'tanzania')
    .map((dest) => ({
      name: dest.name,
      image: getContentImage(dest.imageKey),
      description: dest.description,
      href: `/destinations/${dest.country}/${dest.slug}`,
    }));

  const showKenya = kenyaItems.length > 0;
  const showTanzania = tanzaniaItems.length > 0;

  const baseForExperienceCounts = activeCountry === 'all'
    ? allDestinations
    : allDestinations.filter((dest) => dest.country === activeCountry);

  const countryOptions = [
    {
      value: 'all',
      label: destinationCopy.all,
      count:
        activeExperience === 'all'
          ? allDestinations.length
          : allDestinations.filter((dest) => dest.experienceKeys.includes(activeExperience)).length,
    },
    {
      value: 'kenya',
      label: t('nav.kenya'),
      count:
        activeExperience === 'all'
          ? allDestinations.filter((dest) => dest.country === 'kenya').length
          : allDestinations.filter((dest) => dest.country === 'kenya' && dest.experienceKeys.includes(activeExperience)).length,
    },
    {
      value: 'tanzania',
      label: t('nav.tanzania'),
      count:
        activeExperience === 'all'
          ? allDestinations.filter((dest) => dest.country === 'tanzania').length
          : allDestinations.filter((dest) => dest.country === 'tanzania' && dest.experienceKeys.includes(activeExperience)).length,
    },
  ] as const;

  const experienceOptions = [
    {
      value: 'all',
      label: destinationCopy.allStyles,
      count: baseForExperienceCounts.length,
    },
    {
      value: 'wildlife',
      label: destinationCopy.wildlife,
      count: baseForExperienceCounts.filter((dest) => dest.experienceKeys.includes('wildlife')).length,
    },
    {
      value: 'coast',
      label: destinationCopy.coast,
      count: baseForExperienceCounts.filter((dest) => dest.experienceKeys.includes('coast')).length,
    },
    {
      value: 'culture',
      label: destinationCopy.culture,
      count: baseForExperienceCounts.filter((dest) => dest.experienceKeys.includes('culture')).length,
    },
    {
      value: 'mountains',
      label: destinationCopy.mountains,
      count: baseForExperienceCounts.filter((dest) => dest.experienceKeys.includes('mountains')).length,
    },
  ] as const;

  const heroImage = activeCountry === 'tanzania' ? getContentImage('beach') : getContentImage('zebra');
  const heroTitle = country === 'kenya' ? t('nav.kenya') : country === 'tanzania' ? t('nav.tanzania') : t('dest.heroTitleAll');
  const heroSubtitle = country === 'kenya'
    ? t('dest.heroSubtitleKenya')
    : country === 'tanzania'
      ? t('dest.heroSubtitleTanzania')
      : t('dest.heroSubtitleAll');

  return (
    <div className="min-h-screen">
      <Header />
      <PageHero title={heroTitle} tagline={t('dest.heroTagline')} subtitle={heroSubtitle} backgroundImage={heroImage} />

      <main id="main-content">
        <PageSection backgroundClassName="bg-secondary/30" className="py-12">
          <SectionHeader
            tagline={destinationCopy.filterTagline}
            title={destinationCopy.filterTitle}
            subtitle={destinationCopy.filterSubtitle}
            className="mb-10"
          />

          <div className="space-y-6">
            <FilterChips
              options={countryOptions}
              activeValue={activeCountry}
              onChange={(value) => {
                setActiveCountry(value);
                navigate(value === 'all' ? '/destinations' : `/destinations/${value}`);
              }}
            />
            <FilterChips
              options={experienceOptions}
              activeValue={activeExperience}
              onChange={setActiveExperience}
            />
          </div>
        </PageSection>

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
              <DestinationRegionSection
                title={t('nav.kenya')}
                tagline={t('dest.destinations')}
                itemCountLabel={`${kenyaItems.length} ${destinationCopy.matchingDestinations}`}
                items={kenyaItems}
                ctaHref={activeCountry === 'all' ? '/destinations/kenya' : undefined}
                ctaLabel={activeCountry === 'all' ? t('dest.viewAllKenya') : undefined}
              />
            )}

            {showTanzania && (
              <DestinationRegionSection
                title={t('nav.tanzania')}
                tagline={t('dest.destinations')}
                itemCountLabel={`${tanzaniaItems.length} ${destinationCopy.matchingDestinations}`}
                items={tanzaniaItems}
                backgroundClassName={showKenya ? 'bg-secondary/30' : 'bg-background'}
                ctaHref={activeCountry === 'all' ? '/destinations/tanzania' : undefined}
                ctaLabel={activeCountry === 'all' ? t('dest.viewAllTanzania') : undefined}
              />
            )}

            {!showKenya && !showTanzania && (
              <PageSection backgroundClassName="bg-background">
                <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center">
                  <h2 className="font-serif text-3xl text-foreground mb-4">
                    {destinationCopy.noResultsTitle}
                  </h2>
                  <p className="text-muted-foreground">
                    {destinationCopy.noResultsDescription}
                  </p>
                </div>
              </PageSection>
            )}

            <PageSection backgroundClassName={showTanzania && !showKenya ? 'bg-secondary/30' : 'bg-background'}>
              <SectionHeader
                tagline={t('dest.planJourney')}
                title={t('dest.exploreRegion')}
                subtitle={t('dest.exploreRegionDesc')}
                className="mb-12"
              />

              <div className="grid md:grid-cols-3 gap-8">
                <StatCard value={`${filteredDestinations.length}`} label={destinationCopy.visibleDestinations} />
                <StatCard
                  value={`${kenyaItems.length}`}
                  label={destinationCopy.kenyaDestinations}
                  delay={0.1}
                />
                <StatCard
                  value={`${tanzaniaItems.length}`}
                  label={destinationCopy.tanzaniaDestinations}
                  delay={0.2}
                />
              </div>
            </PageSection>
          </>
        )}
      </main>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Destinations;
