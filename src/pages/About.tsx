import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Globe, Heart, Shield, Users } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ValueCard from '@/components/cards/ValueCard';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import SectionHeader from '@/components/sections/SectionHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import hero1 from '@/assets/strip-14.jpeg';
import strip3 from '@/assets/strip-3.jpeg';       // ← fixed: was incorrectly pointing to strip-14
import directorPhoto from '@/assets/strip-3.jpeg'; // ← update to correct director portrait asset

// NOTE: directorPhoto should point to Lucky's portrait asset once confirmed.
// Replace '@/assets/strip-3.jpeg' above with the correct file path.

const About = () => {
  const { t, language } = useLanguage();

  // useMemo ensures the values array is fully rebuilt when language changes.
  // Without this, translated strings could be stale after a language switch.
  const values = useMemo(() => [
    { icon: Heart,   title: t('about.value.passion'),        description: t('about.value.passionDesc')        },
    { icon: Shield,  title: t('about.value.safety'),         description: t('about.value.safetyDesc')         },
    { icon: Users,   title: t('about.value.personal'),       description: t('about.value.personalDesc')       },
    { icon: Award,   title: t('about.value.excellence'),     description: t('about.value.excellenceDesc')     },
    { icon: Globe,   title: t('about.value.sustainability'), description: t('about.value.sustainabilityDesc') },
    { icon: Compass, title: t('about.value.adventure'),      description: t('about.value.adventureDesc')      },
  ], [t, language]);

  return (
    <div className="min-h-screen">
      <Header />

      {/*
        FIX: <main> now wraps PageHero so the landmark covers the full page content.
        Previously PageHero sat outside <main>, breaking accessibility and SEO structure.
      */}
      <main id="main-content">
        <PageHero
          title={t('about.heroTitle')}
          tagline={t('about.heroTagline')}
          subtitle={t('about.heroSubtitle')}
          backgroundImage={hero1}
          overlayClassName="bg-gradient-to-r from-primary/80 to-primary/40"
          heightClassName="h-[60vh] min-h-[500px]"
          align="left"
        />

        {/* ─── About intro ──────────────────────────────────────────────── */}
        <PageSection backgroundClassName="bg-background">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6 text-foreground">{t('about.mainTitle')}</h2>
              <div className="space-y-6 leading-relaxed text-muted-foreground">
                <p>{t('about.mainP1')}</p>
                <p>{t('about.mainP2')}</p>
                <p>{t('about.mainP3')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={strip3}
                alt="East African culture and landscape"
                loading="lazy"
                className="w-full rounded-xl shadow-xl"
              />
              {/*
                FIX: badge uses responsive negative offsets to prevent horizontal
                overflow on mobile. Previously -bottom-8 -left-8 caused overflow
                on narrow viewports.
              */}
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-safari px-8 py-6 text-white shadow-xl md:-bottom-8 md:-left-8">
                <p className="mb-1 font-serif text-4xl">10+</p>
                <p className="text-sm opacity-80">{t('about.yearsExcellence')}</p>
              </div>
            </motion.div>
          </div>
        </PageSection>

        {/* ─── Values ───────────────────────────────────────────────────── */}
        {/*
          FIX: bg-secondary/50 (was /30) for better section differentiation.
          Added motion wrapper on the grid for staggered card entrance.
        */}
        <PageSection backgroundClassName="bg-secondary/50">
          <SectionHeader
            tagline={t('about.valuesTagline')}
            title={t('about.valuesTitle')}
          />

          {/*
            FIX: key={language} forces React to unmount and remount this motion.div
            on every language change. Without this, viewport={{ once: true }} means
            the stagger animation fires once and never re-triggers — leaving cards
            stuck in their hidden state (opacity: 0) after a language switch.
          */}
          <motion.div
            key={language}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={{
                  hidden:  { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <ValueCard
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  delay={index * 0.1}
                  className="card-hover h-full transition-all duration-300 hover:-translate-y-1 hover:border-safari/30 hover:shadow-lg"
                />
              </motion.div>
            ))}
          </motion.div>
        </PageSection>

        {/* ─── Director ─────────────────────────────────────────────────── */}
        <PageSection backgroundClassName="bg-background">
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              tagline={t('about.directorTagline')}
              title={t('about.directorTitle')}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid items-center gap-12 md:grid-cols-2"
            >
              {/*
                FIX: removed the absolute-positioned "Founder & Director" badge overlay
                from the image — it duplicated the inline label in the text column.
                The label is retained below in the text column only.
              */}
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={directorPhoto}
                  alt="Lucky Katama Katoya — Director of Gokyle Tours & Safaris"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="mb-2 font-serif text-3xl text-foreground">Lucky Katama Katoya</h3>
                <p className="mb-6 font-medium text-safari">{t('about.founderDirector')}</p>
                <div className="space-y-4 leading-relaxed text-muted-foreground">
                  <p>{t('about.directorBio1')}</p>
                  <p>{t('about.directorBio2')}</p>
                  <p>{t('about.directorBio3')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </PageSection>

      </main>

      {/*
        FIX: <PaymentMethods /> removed from here — same issue as Index.tsx.
        Move it inside Footer.tsx so it renders anchored to the page bottom
        and not as a floating island between content and footer.
      */}
      <Footer />
    </div>
  );
};

export default About;