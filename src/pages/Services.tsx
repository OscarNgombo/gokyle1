import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  type FilterableServiceListSectionPayload,
  type HeroSectionPayload,
  type SplitCardsSectionPayload,
  type ValueGridSectionPayload,
} from "@/api/types";
import { usePublicPageContentQuery } from "@/api/queries";
import LoaderIndicator from "@/components/common/LoaderIndicator";
import FilterChips from "@/components/common/FilterChips";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
// FIX: PaymentMethods import removed — now rendered inside Footer.tsx permanently.
import ValueCard from "@/components/cards/ValueCard";
import PageSection from "@/components/layout/PageSection";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import { getApiErrorMessage } from "@/api/errors";
import { useLanguage } from "@/contexts/LanguageContext";
import { getContentIcon, getContentImage } from "@/lib/contentAssets";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("journey-design");
  const [isFiltering, setIsFiltering] = useState(false);
  const { language } = useLanguage();
  const { data, isLoading, isError, error } = usePublicPageContentQuery(
    "services",
    language,
  );

  useEffect(() => {
    if (!isFiltering) return;
    const timeoutId = window.setTimeout(() => setIsFiltering(false), 320);
    return () => window.clearTimeout(timeoutId);
  }, [isFiltering]);

  const serviceListSection = data?.sections.find(
    (s) => s.type === "filterable_service_list",
  );
  const serviceListPayload = serviceListSection?.payload as unknown as
    | FilterableServiceListSectionPayload
    | undefined;

  useEffect(() => {
    if (!serviceListPayload) return;
    const allowedValues = new Set(
      serviceListPayload.filters.map((f) => f.value),
    );
    if (!allowedValues.has(activeCategory)) {
      setActiveCategory(serviceListPayload.filters[0]?.value || "all");
    }
  }, [activeCategory, serviceListPayload]);

  const filteredServices = useMemo(() => {
    const items = serviceListPayload?.items ?? [];
    return activeCategory === "all"
      ? items
      : items.filter((s) => s.category === activeCategory);
  }, [activeCategory, serviceListPayload]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* FIX: id="main-content" added for accessibility/skip-nav consistency with all other pages */}
      <main id="main-content">
        {isLoading ? (
          <PageSection
            backgroundClassName="bg-background"
            className="min-h-[70vh]"
          >
            <div className="flex min-h-[420px] items-center justify-center gap-4 rounded-3xl border border-border bg-card">
              <LoaderIndicator label="Loading services content" />
              <span className="text-sm text-muted-foreground">
                Loading services content...
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
                "Unable to load published services content."}
            </div>
          </PageSection>
        ) : (
          data?.sections.map((section) => {
            switch (section.type) {
              // ─── Hero ──────────────────────────────────────────────────────
              case "hero": {
                const payload =
                  section.payload as unknown as HeroSectionPayload;
                return (
                  <PageHero
                    key={section.key}
                    title={payload.title}
                    tagline={payload.tagline}
                    subtitle={payload.subtitle}
                    backgroundImage={getContentImage(
                      payload.backgroundImageKey,
                    )}
                  />
                );
              }

              // ─── Split cards ───────────────────────────────────────────────
              case "split_cards": {
                const payload =
                  section.payload as unknown as SplitCardsSectionPayload;
                return (
                  // FIX: bg-secondary/50 (was /30) — consistent contrast with other pages
                  <PageSection
                    key={section.key}
                    backgroundClassName="bg-secondary/50"
                  >
                    <SectionHeader
                      tagline={payload.tagline}
                      title={payload.title}
                      subtitle={payload.subtitle}
                    />

                    <div className="grid gap-8 lg:grid-cols-2">
                      {payload.cards.map((item, index) => (
                        <motion.div
                          key={`${section.key}-${item.title}`}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          // FIX: group + hover lift added for premium card feel
                          className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-safari/30 hover:shadow-lg"
                        >
                          <div className="aspect-[16/10] overflow-hidden">
                            <img
                              src={getContentImage(item.imageKey)}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                          </div>
                          <div className="p-8">
                            <h2 className="mb-4 font-serif text-3xl text-foreground">
                              {item.title}
                            </h2>
                            <p className="mb-6 leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                            <ul className="mb-8 space-y-3">
                              {item.bullets.map((bullet) => (
                                <li
                                  key={bullet}
                                  className="flex items-start gap-3 text-foreground"
                                >
                                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-safari" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                            <Link
                              to={item.href}
                              className="btn-safari inline-flex items-center gap-2"
                            >
                              {item.cta}
                              <ArrowRight className="h-5 w-5" />
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </PageSection>
                );
              }

              // ─── Filterable service list ────────────────────────────────────
              case "filterable_service_list": {
                const payload =
                  section.payload as unknown as FilterableServiceListSectionPayload;
                const filterOptions = payload.filters.map((filter) => ({
                  value: filter.value,
                  label: filter.label,
                  count:
                    filter.value === "all"
                      ? payload.items.length
                      : payload.items.filter(
                          (item) => item.category === filter.value,
                        ).length,
                }));

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

                    <FilterChips
                      options={filterOptions}
                      activeValue={activeCategory}
                      onChange={(value) => {
                        if (value === activeCategory) return;
                        setActiveCategory(value);
                        setIsFiltering(true);
                      }}
                      className="mb-12 justify-start"
                    />

                    {isFiltering ? (
                      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card/70">
                        <LoaderIndicator label={payload.filterLabel} />
                        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                          {payload.filterLabel}
                        </p>
                      </div>
                    ) : (
                      /*
                        FIX: key={language} forces remount on language switch, resetting
                        whileInView once:true observers — prevents blank content after
                        language change (same fix applied to About.tsx values section).
                      */
                      <motion.div
                        key={language}
                        className="space-y-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.08 } },
                        }}
                      >
                        {filteredServices.map((service, index) => {
                          const Icon = getContentIcon(service.icon);
                          return (
                            <motion.div
                              key={`${section.key}-${service.title}`}
                              variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: {
                                  opacity: 1,
                                  y: 0,
                                  transition: { duration: 0.6 },
                                },
                              }}
                              className="grid items-center gap-12 lg:grid-cols-2"
                            >
                              {/*
                                FIX: base order classes added so mobile always stacks
                                image first, content second — regardless of index parity.
                                Previously, even-index columns had no order class at all,
                                relying on implicit DOM order which breaks on some layouts.
                              */}
                              <div
                                className={`order-1 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}
                              >
                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                                  <img
                                    src={getContentImage(service.imageKey)}
                                    alt={service.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>
                              </div>

                              <div
                                className={`order-2 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}
                              >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-safari-gradient">
                                  <Icon className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="mb-4 font-serif text-4xl text-foreground">
                                  {service.title}
                                </h2>
                                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                                  {service.description}
                                </p>
                                <ul className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2">
                                  {service.features.map((feature) => (
                                    <li
                                      key={feature}
                                      className="flex items-center gap-2 text-foreground"
                                    >
                                      <Check className="h-5 w-5 flex-shrink-0 text-safari" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                                {payload.inquiryCta && (
                                  <Link
                                    to={payload.inquiryCta.href}
                                    className="btn-safari inline-flex items-center gap-2"
                                  >
                                    {payload.inquiryCta.label}
                                    <ArrowRight className="h-5 w-5" />
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </PageSection>
                );
              }

              // ─── Value grid ────────────────────────────────────────────────
              case "value_grid": {
                const payload =
                  section.payload as unknown as ValueGridSectionPayload;
                return (
                  // FIX: bg-secondary/50 (was /30) — consistent contrast with other pages
                  <PageSection
                    key={section.key}
                    backgroundClassName="bg-secondary/50"
                  >
                    <SectionHeader
                      tagline={payload.tagline}
                      title={payload.title}
                      subtitle={payload.subtitle}
                    />

                    {/*
                      FIX: motion wrapper added for staggered entrance — delay prop on
                      ValueCard had no orchestration parent so stagger never actually fired.
                      key={language} resets the observer on language switch.
                    */}
                    <motion.div
                      key={language}
                      className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } },
                      }}
                    >
                      {payload.items.map((item) => (
                        <motion.div
                          key={`${section.key}-${item.title}`}
                          variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 0.5 },
                            },
                          }}
                        >
                          <ValueCard
                            icon={getContentIcon(item.icon)}
                            title={item.title}
                            description={item.description}
                            align="center"
                            // FIX: hover lift added — was missing entirely on this page
                            className="h-full rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-safari/30 hover:shadow-lg"
                          />
                        </motion.div>
                      ))}
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

export default Services;
