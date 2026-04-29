import { motion } from "framer-motion";
import { ArrowRight, Route } from "lucide-react";
import { Link } from "react-router-dom";
import {
  type CardGridSectionPayload,
  type CtaBannerSectionPayload,
  type HeroSliderSectionPayload,
  type TestimonialGridSectionPayload,
  type TimelineSectionPayload,
} from "@/api/types";
import { usePublicPageContentQuery } from "@/api/queries";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import TestimonialsSection from "@/components/TestimonialsSection";
import LoaderIndicator from "@/components/common/LoaderIndicator";
import PageSection from "@/components/layout/PageSection";
import SectionHeader from "@/components/sections/SectionHeader";
import { getApiErrorMessage } from "@/api/errors";
import { useLanguage } from "@/contexts/LanguageContext";
import { getContentIcon, getContentImage } from "@/lib/contentAssets";
import PaymentMethods from "@/components/PaymentMethods";

const Index = () => {
  const { language } = useLanguage();
  const { data, isLoading, isError, error } = usePublicPageContentQuery(
    "home",
    language,
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        {isLoading ? (
          <PageSection
            backgroundClassName="bg-background"
            className="min-h-[70vh]"
          >
            <div className="flex min-h-[420px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label="Loading homepage content" />
              <span className="text-sm text-muted-foreground">
                Loading homepage content...
              </span>
            </div>
          </PageSection>
        ) : isError ? (
          <PageSection
            backgroundClassName="bg-background"
            className="min-h-[70vh]"
          >
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-sm text-muted-foreground">
              {getApiErrorMessage(error) ||
                "Unable to load published homepage content."}
            </div>
          </PageSection>
        ) : (
          data?.sections.map((section) => {
            switch (section.type) {
              // ─── Hero Slider ───────────────────────────────────────────────
              case "hero_slider": {
                const payload =
                  section.payload as unknown as HeroSliderSectionPayload;
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

              // ─── Timeline ─────────────────────────────────────────────────
              case "timeline": {
                const payload =
                  section.payload as unknown as TimelineSectionPayload;
                return (
                  <PageSection
                    key={section.key}
                    backgroundClassName="bg-background"
                  >
                    <SectionHeader
                      tagline={payload.tagline}
                      title={payload.title}
                      subtitle={payload.subtitle}
                    />

                    <div className="relative mx-auto max-w-6xl">
                      {/* Vertical spine — desktop only */}
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
                            {/* Image column — alternates sides */}
                            <div
                              className={
                                index % 2 === 0
                                  ? "lg:col-start-1"
                                  : "lg:col-start-3"
                              }
                            >
                              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_-30px_hsl(var(--safari)/0.3)]">
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img
                                    src={getContentImage(chapter.imageKey)}
                                    alt={chapter.title}
                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Step badge — desktop spine */}
                            <div className="hidden lg:flex lg:items-start lg:justify-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-safari text-sm font-semibold tracking-[0.25em] text-white shadow-lg">
                                {chapter.step}
                              </div>
                            </div>

                            {/* Content column — alternates sides, uses order-first to avoid row-start issues */}
                            <div
                              className={
                                index % 2 === 0
                                  ? "lg:col-start-3"
                                  : "lg:col-start-1 lg:order-first"
                              }
                            >
                              <div className="rounded-3xl border border-border bg-secondary/40 p-8 lg:p-10">
                                <div className="mb-5 flex items-center gap-4">
                                  {/* Step badge — mobile only */}
                                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-safari text-xs font-semibold tracking-[0.25em] text-white lg:hidden">
                                    {chapter.step}
                                  </div>
                                  <span className="text-sm font-medium uppercase tracking-[0.25em] text-safari">
                                    {chapter.eyebrow}
                                  </span>
                                </div>

                                <h2 className="mb-4 font-serif text-3xl text-foreground md:text-4xl">
                                  {chapter.title}
                                </h2>
                                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                                  {chapter.description}
                                </p>

                                <ul className="mb-8 space-y-3">
                                  {chapter.highlights.map((highlight) => (
                                    <li
                                      key={highlight}
                                      className="flex items-start gap-3 text-foreground"
                                    >
                                      <Route className="mt-0.5 h-5 w-5 flex-shrink-0 text-safari" />
                                      <span>{highlight}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* CTA — uses transition-[gap] for smooth arrow nudge */}
                                <Link
                                  to={chapter.href}
                                  className="inline-flex items-center gap-2 font-medium text-safari transition-[gap] duration-200 hover:gap-3"
                                >
                                  {chapter.cta}
                                  <ArrowRight className="h-5 w-5 flex-shrink-0" />
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

              // ─── Card Grid ────────────────────────────────────────────────
              case "card_grid": {
                const payload =
                  section.payload as unknown as CardGridSectionPayload;
                return (
                  <PageSection
                    key={section.key}
                    backgroundClassName="bg-secondary/50"
                  >
                    <SectionHeader
                      tagline={payload.tagline}
                      title={payload.title}
                      subtitle={payload.subtitle}
                    />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
                      {payload.cards.map((card, index) => {
                        const Icon = getContentIcon(card.icon);
                        return (
                          <motion.div
                            key={`${section.key}-${card.title}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            // group enables child hover states; hover lifts card with border accent
                            className="group rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-safari/30 hover:shadow-lg"
                          >
                            {/* Icon container brightens on card hover via group-hover */}
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-safari/10 transition-colors duration-300 group-hover:bg-safari/20">
                              <Icon className="h-7 w-7 text-safari" />
                            </div>

                            <h3 className="mb-3 font-serif text-2xl text-foreground">
                              {card.title}
                            </h3>
                            <p className="mb-6 leading-relaxed text-muted-foreground">
                              {card.description}
                            </p>

                            {/* Subtle divider before CTA */}
                            <div className="mb-5 h-px w-full bg-border" />

                            <Link
                              to={card.href}
                              className="inline-flex items-center gap-2 font-medium text-safari transition-[gap] duration-200 hover:gap-3"
                            >
                              {card.cta}
                              <ArrowRight className="h-4 w-4 flex-shrink-0" />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </PageSection>
                );
              }

              // ─── Testimonials ─────────────────────────────────────────────
              case "testimonial_grid": {
                const payload =
                  section.payload as unknown as TestimonialGridSectionPayload;
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

              // ─── CTA Banner ───────────────────────────────────────────────
              case "cta_banner": {
                const payload =
                  section.payload as unknown as CtaBannerSectionPayload;
                const Icon = getContentIcon(payload.icon || "shield-check");
                return (
                  <PageSection
                    key={section.key}
                    backgroundClassName="bg-primary text-primary-foreground"
                    className="text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mx-auto max-w-3xl"
                    >
                      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <Icon className="h-8 w-8 text-safari-light" />
                      </div>
                      <h2 className="mb-6 font-serif text-4xl md:text-5xl">
                        {payload.title}
                      </h2>
                      <p className="mb-8 text-lg text-primary-foreground/80">
                        {payload.description}
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        {payload.primaryCta && (
                          <Link
                            to={payload.primaryCta.href}
                            className="btn-safari"
                          >
                            {payload.primaryCta.label}
                          </Link>
                        )}
                        {payload.secondaryCta && (
                          <Link
                            to={payload.secondaryCta.href}
                            className="btn-outline-light"
                          >
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
      <Footer />
    </div>
  );
};

export default Index;
