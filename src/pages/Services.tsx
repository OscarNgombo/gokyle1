import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import {
  type FilterableServiceListSectionPayload,
  type HeroSectionPayload,
  type SplitCardsSectionPayload,
  type ValueGridSectionPayload,
} from '@/api/types';
import { usePublicPageContentQuery } from '@/api/queries';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import FilterChips from '@/components/common/FilterChips';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import ValueCard from '@/components/cards/ValueCard';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import SectionHeader from '@/components/sections/SectionHeader';
import { getApiErrorMessage } from '@/api/errors';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentIcon, getContentImage } from '@/lib/contentAssets';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('journey-design');
  const [isFiltering, setIsFiltering] = useState(false);
  const { language } = useLanguage();
  const { data, isLoading, isError, error } = usePublicPageContentQuery('services', language);

  useEffect(() => {
    if (!isFiltering) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsFiltering(false);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [isFiltering]);

  const serviceListSection = data?.sections.find((section) => section.type === 'filterable_service_list');
  const serviceListPayload = serviceListSection?.payload as unknown as FilterableServiceListSectionPayload | undefined;

  useEffect(() => {
    if (!serviceListPayload) {
      return;
    }

    const allowedValues = new Set(serviceListPayload.filters.map((filter) => filter.value));
    if (!allowedValues.has(activeCategory)) {
      setActiveCategory(serviceListPayload.filters[0]?.value || 'all');
    }
  }, [activeCategory, serviceListPayload]);

  const filteredServices = useMemo(() => {
    const items = serviceListPayload?.items ?? [];
    return activeCategory === 'all' ? items : items.filter((service) => service.category === activeCategory);
  }, [activeCategory, serviceListPayload]);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {isLoading ? (
          <PageSection backgroundClassName="bg-background" className="min-h-[70vh]">
            <div className="flex min-h-[420px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label="Loading services content" />
              <span className="text-sm text-muted-foreground">Loading services content...</span>
            </div>
          </PageSection>
        ) : isError ? (
          <PageSection backgroundClassName="bg-background" className="min-h-[70vh]">
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-muted-foreground">
              {getApiErrorMessage(error) || 'Unable to load published services content.'}
            </div>
          </PageSection>
        ) : (
          data?.sections.map((section) => {
            switch (section.type) {
              case 'hero': {
                const payload = section.payload as unknown as HeroSectionPayload;
                return (
                  <PageHero
                    key={section.key}
                    title={payload.title}
                    tagline={payload.tagline}
                    subtitle={payload.subtitle}
                    backgroundImage={getContentImage(payload.backgroundImageKey)}
                  />
                );
              }
              case 'split_cards': {
                const payload = section.payload as unknown as SplitCardsSectionPayload;
                return (
                  <PageSection key={section.key} backgroundClassName="bg-secondary/30">
                    <SectionHeader tagline={payload.tagline} title={payload.title} subtitle={payload.subtitle} />

                    <div className="grid lg:grid-cols-2 gap-8">
                      {payload.cards.map((item, index) => (
                        <motion.div
                          key={`${section.key}-${item.title}`}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="overflow-hidden rounded-3xl border border-border bg-card"
                        >
                          <div className="aspect-[16/10] overflow-hidden">
                            <img
                              src={getContentImage(item.imageKey)}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                          </div>
                          <div className="p-8">
                            <h2 className="font-serif text-3xl text-foreground mb-4">{item.title}</h2>
                            <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>
                            <ul className="space-y-3 mb-8">
                              {item.bullets.map((bullet) => (
                                <li key={bullet} className="flex items-start gap-3 text-foreground">
                                  <Check className="w-5 h-5 text-safari mt-0.5 flex-shrink-0" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                            <Link to={item.href} className="btn-safari inline-flex items-center gap-2">
                              {item.cta}
                              <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </PageSection>
                );
              }
              case 'filterable_service_list': {
                const payload = section.payload as unknown as FilterableServiceListSectionPayload;
                const filterOptions = payload.filters.map((filter) => ({
                  value: filter.value,
                  label: filter.label,
                  count: filter.value === 'all'
                    ? payload.items.length
                    : payload.items.filter((item) => item.category === filter.value).length,
                }));

                return (
                  <PageSection key={section.key} backgroundClassName="bg-background">
                    <SectionHeader tagline={payload.tagline} title={payload.title} subtitle={payload.subtitle} />

                    <FilterChips
                      options={filterOptions}
                      activeValue={activeCategory}
                      onChange={(value) => {
                        if (value === activeCategory) {
                          return;
                        }
                        setActiveCategory(value);
                        setIsFiltering(true);
                      }}
                      className="mb-12 justify-start"
                    />

                    {isFiltering ? (
                      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card/70">
                        <LoaderIndicator label={payload.filterLabel} />
                        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{payload.filterLabel}</p>
                      </div>
                    ) : (
                      <div className="space-y-24">
                        {filteredServices.map((service, index) => {
                          const Icon = getContentIcon(service.icon);
                          return (
                            <motion.div
                              key={`${section.key}-${service.title}`}
                              initial={{ opacity: 0, y: 50 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6 }}
                              className="grid lg:grid-cols-2 gap-12 items-center"
                            >
                              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                                  <img
                                    src={getContentImage(service.imageKey)}
                                    alt={service.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>
                              </div>

                              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                <div className="w-16 h-16 rounded-2xl bg-safari-gradient flex items-center justify-center mb-6">
                                  <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="font-serif text-4xl text-foreground mb-4">{service.title}</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{service.description}</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                                  {service.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-foreground">
                                      <Check className="w-5 h-5 text-safari flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                                {payload.inquiryCta && (
                                  <Link to={payload.inquiryCta.href} className="btn-safari inline-flex items-center gap-2">
                                    {payload.inquiryCta.label}
                                    <ArrowRight className="w-5 h-5" />
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </PageSection>
                );
              }
              case 'value_grid': {
                const payload = section.payload as unknown as ValueGridSectionPayload;
                return (
                  <PageSection key={section.key} backgroundClassName="bg-secondary/30">
                    <SectionHeader tagline={payload.tagline} title={payload.title} subtitle={payload.subtitle} />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {payload.items.map((item, index) => (
                        <ValueCard
                          key={`${section.key}-${item.title}`}
                          icon={getContentIcon(item.icon)}
                          title={item.title}
                          description={item.description}
                          delay={index * 0.1}
                          align="center"
                          className="rounded-2xl"
                        />
                      ))}
                    </div>
                  </PageSection>
                );
              }
              default:
                return null;
            }
          })
        )}
      </main>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Services;
