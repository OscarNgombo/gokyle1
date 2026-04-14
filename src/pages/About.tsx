import { motion } from 'framer-motion';
import { Award, Compass, Globe, Heart, Shield, Users } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import ValueCard from '@/components/cards/ValueCard';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import SectionHeader from '@/components/sections/SectionHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import hero1 from '@/assets/strip-14.jpeg';
import strip3 from '@/assets/strip-14.jpeg';
import directorPhoto from '@/assets/strip-3.jpeg';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Heart, title: t('about.value.passion'), description: t('about.value.passionDesc') },
    { icon: Shield, title: t('about.value.safety'), description: t('about.value.safetyDesc') },
    { icon: Users, title: t('about.value.personal'), description: t('about.value.personalDesc') },
    { icon: Award, title: t('about.value.excellence'), description: t('about.value.excellenceDesc') },
    { icon: Globe, title: t('about.value.sustainability'), description: t('about.value.sustainabilityDesc') },
    { icon: Compass, title: t('about.value.adventure'), description: t('about.value.adventureDesc') },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <PageHero
        title={t('about.heroTitle')}
        tagline={t('about.heroTagline')}
        subtitle={t('about.heroSubtitle')}
        backgroundImage={hero1}
        overlayClassName="bg-gradient-to-r from-primary/80 to-primary/40"
        heightClassName="h-[60vh] min-h-[500px]"
        align="left"
      />

      <main id="main-content">
      <PageSection backgroundClassName="bg-background">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="section-title text-foreground mb-6">{t('about.mainTitle')}</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{t('about.mainP1')}</p>
              <p>{t('about.mainP2')}</p>
              <p>{t('about.mainP3')}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <img src={strip3} alt="Local culture" loading="lazy" className="rounded-xl shadow-xl w-full" />
            <div className="absolute -bottom-8 -left-8 bg-safari text-white p-8 rounded-xl shadow-xl">
              <p className="text-4xl font-serif mb-1">10+</p>
              <p className="text-sm opacity-80">{t('about.yearsExcellence')}</p>
            </div>
          </motion.div>
        </div>
      </PageSection>

      <PageSection backgroundClassName="bg-secondary/30">
        <SectionHeader tagline={t('about.valuesTagline')} title={t('about.valuesTitle')} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              icon={value.icon}
              title={value.title}
              description={value.description}
              delay={index * 0.1}
              className="card-hover"
            />
          ))}
        </div>
      </PageSection>

      <PageSection backgroundClassName="bg-background">
        <div className="max-w-4xl mx-auto">
          <SectionHeader tagline={t('about.directorTagline')} title={t('about.directorTitle')} />

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={directorPhoto}
                  alt="Lucky Katama Katoya - Director of Gokyle Tours & Safaris"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-safari text-white px-6 py-3 rounded-lg shadow-lg">
                <p className="font-medium">{t('about.founderDirector')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-3xl text-foreground mb-2">Lucky Katama Katoya</h3>
              <p className="text-safari font-medium mb-6">{t('about.founderDirector')}</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t('about.directorBio1')}</p>
                <p>{t('about.directorBio2')}</p>
                <p>{t('about.directorBio3')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </PageSection>
      </main>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default About;
