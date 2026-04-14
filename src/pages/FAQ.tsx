import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      category: t('faq.category.booking'),
      questions: [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
      ],
    },
    {
      category: t('faq.category.safari'),
      questions: [
        { q: t('faq.q5'), a: t('faq.a5') },
        { q: t('faq.q6'), a: t('faq.a6') },
        { q: t('faq.q7'), a: t('faq.a7') },
        { q: t('faq.q8'), a: t('faq.a8') },
      ],
    },
    {
      category: t('faq.category.accommodation'),
      questions: [
        { q: t('faq.q9'), a: t('faq.a9') },
        { q: t('faq.q10'), a: t('faq.a10') },
        { q: t('faq.q11'), a: t('faq.a11') },
      ],
    },
    {
      category: t('faq.category.health'),
      questions: [
        { q: t('faq.q12'), a: t('faq.a12') },
        { q: t('faq.q13'), a: t('faq.a13') },
        { q: t('faq.q14'), a: t('faq.a14') },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <PageHero
        title={t('faq.heroTitle')}
        tagline={t('faq.heroTagline')}
        subtitle={t('faq.heroSubtitle')}
        backgroundClassName="bg-primary"
        overlayClassName="bg-transparent"
        heightClassName="h-[50vh] min-h-[400px]"
      />

      <PageSection backgroundClassName="bg-background" containerClassName="max-w-4xl">
        {faqs.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-12"
          >
            <h2 className="font-serif text-2xl text-foreground mb-6 pb-4 border-b border-border">{category.category}</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {category.questions.map((faq, index) => (
                <AccordionItem
                  key={`${category.category}-${faq.q}`}
                  value={`${categoryIndex}-${index}`}
                  className="border border-border rounded-xl px-6 bg-card"
                >
                  <AccordionTrigger className="text-left font-medium hover:text-safari hover:no-underline py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-16 p-12 bg-safari/10 rounded-2xl">
          <h3 className="font-serif text-2xl text-foreground mb-4">{t('faq.stillQuestions')}</h3>
          <p className="text-muted-foreground mb-6">{t('faq.stillQuestionsDesc')}</p>
          <a href="/contact" className="btn-safari inline-block">
            {t('faq.contactUs')}
          </a>
        </motion.div>
      </PageSection>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default FAQ;
