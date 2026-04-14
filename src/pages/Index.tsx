import { motion } from 'framer-motion';
import { ArrowRight, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  type CardGridSectionPayload,
  type CtaBannerSectionPayload,
  type HeroSliderSectionPayload,
  type TestimonialGridSectionPayload,
  type TimelineSectionPayload,
} from '@/api/types';
import { usePublicPageContentQuery } from '@/api/queries';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import PaymentMethods from '@/components/PaymentMethods';
import TestimonialsSection from '@/components/TestimonialsSection';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import PageSection from '@/components/layout/PageSection';
import SectionHeader from '@/components/sections/SectionHeader';
import { getApiErrorMessage } from '@/api/errors';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentIcon, getContentImage } from '@/lib/contentAssets';

const Index = () => {
  const { language } = useLanguage();
  const { data, isLoading, isError, error } = usePublicPageContentQuery('home', language);

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        {isLoading ? (
          <PageSection backgroundClassName="bg-background" className="min-h-[70vh]">
            <div className="flex min-h-[420px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label="Loading homepage content" />
              <span className="text-sm text-muted-foreground">Loading homepage content...</span>
            </div>
          </PageSection>
        ) : isError ? (
          <PageSection backgroundClassName="bg-background" className="min-h-[70vh]">
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-muted-foreground">
              {getApiErrorMessage(error) || 'Unable to load published homepage content.'}
            </div>
          </PageSection>
        ) : (
          data?.sections.map((section) => {
            switch (section.type) {
              case 'hero_slider': {
                const payload = section.payload as unknown as HeroSliderSectionPayload;
                return (
                  <HeroSlider
                    key={section.key}
                    slides={payload.slides.map((slide) => ({
                      image: getContentImage(slide.imageKey),
                      title: slide.title,
                      subtitle: slide.subtitle,
                      description: slide.description,
                    }))}
                    primaryCta={payload.primaryCta}
                    secondaryCta={payload.secondaryCta}
                  />
                );
              }
              case 'timeline': {
                const payload = section.payload as unknown as TimelineSectionPayload;
                return (
                  <PageSection key={section.key} backgroundClassName="bg-background">
                    <SectionHeader
                      tagline={payload.tagline}
                      title={payload.title}
                      subtitle={payload.subtitle}
                    />

                    <div className="relative mx-auto max-w-6xl">
                      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

                      <div className="space-y-12">
                        {payload.items.map((chapter, index) => (
                          <motion.article
                            key={`${section.key}-${chapter.step}`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            className="relative grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10"
                          >
                            <div className={index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3'}>
                              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_-30px_hsl(25_25%_12%_/_0.3)]">
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img
                                    src={getContentImage(chapter.imageKey)}
                                    alt={chapter.title}
                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="hidden lg:flex lg:items-start lg:justify-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-safari text-sm font-semibold tracking-[0.25em] text-white shadow-lg">
                                {chapter.step}
                              </div>
                            </div>

                            <div className={index % 2 === 0 ? 'lg:col-start-3' : 'lg:col-start-1 lg:row-start-1'}>
                              <div className="rounded-3xl border border-border bg-secondary/40 p-8 lg:p-10">
                                <div className="flex items-center gap-4 mb-5">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-safari text-xs font-semibold tracking-[0.25em] text-white lg:hidden">
                                    {chapter.step}
                                  </div>
                                  <span className="text-sm font-medium uppercase tracking-[0.25em] text-safari">
                                    {chapter.eyebrow}
                                  </span>
                                </div>
                                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{chapter.title}</h2>
                                <p className="text-lg leading-relaxed text-muted-foreground mb-6">{chapter.description}</p>
                                <ul className="space-y-3 mb-8">
                                  {chapter.highlights.map((highlight) => (
                                    <li key={highlight} className="flex items-start gap-3 text-foreground">
                                      <Route className="mt-0.5 h-5 w-5 flex-shrink-0 text-safari" />
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>
                                <Link to={chapter.href} className="inline-flex items-center gap-2 text-safari font-medium hover:gap-3 transition-all">
                                  {chapter.cta}
                                  <ArrowRight className="h-5 w-5" />
                                </Link>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  </PageSection>
                );
              }
              case 'card_grid': {
                const payload = section.payload as unknown as CardGridSectionPayload;
                return (
                  <PageSection key={section.key} backgroundClassName="bg-secondary/30">
                    <SectionHeader tagline={payload.tagline} title={payload.title} subtitle={payload.subtitle} />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                      {payload.cards.map((card, index) => {
                        const Icon = getContentIcon(card.icon);
                        return (
                          <motion.div
                            key={`${section.key}-${card.title}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="rounded-3xl border border-border bg-card p-8"
                          >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-safari/10">
                              <Icon className="h-7 w-7 text-safari" />
                            </div>
                            <h3 className="font-serif text-2xl text-foreground mb-3">{card.title}</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">{card.description}</p>
                            <Link to={card.href} className="inline-flex items-center gap-2 text-safari font-medium hover:gap-3 transition-all">
                              {card.cta}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </PageSection>
                );
              }
              case 'testimonial_grid': {
                const payload = section.payload as unknown as TestimonialGridSectionPayload;
                return (
                  <TestimonialsSection
                    key={section.key}
                    tagline={payload.tagline}
                    title={payload.title}
                    subtitle={payload.subtitle}
                    items={payload.items}
                  />
                );
              }
              case 'cta_banner': {
                const payload = section.payload as unknown as CtaBannerSectionPayload;
                const Icon = getContentIcon(payload.icon || 'shield-check');
                return (
                  <PageSection key={section.key} backgroundClassName="bg-primary text-primary-foreground" className="text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl">
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <Icon className="h-8 w-8 text-safari-light" />
                      </div>
                      <h2 className="font-serif text-4xl md:text-5xl mb-6">{payload.title}</h2>
                      <p className="text-lg text-primary-foreground/80 mb-8">{payload.description}</p>
                      <div className="flex flex-wrap justify-center gap-4">
                        {payload.primaryCta && (
                          <Link to={payload.primaryCta.href} className="btn-safari">
                            {payload.primaryCta.label}
                          </Link>
                        )}
                        {payload.secondaryCta && (
                          <Link to={payload.secondaryCta.href} className="btn-outline-light">
                            {payload.secondaryCta.label}
                          </Link>
                        )}
                      </div>
                    </motion.div>
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

export default Index;
