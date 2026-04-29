import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageSection from "@/components/layout/PageSection";
import SectionHeader from "@/components/sections/SectionHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/strip-11.jpeg"; // Ensure this matches your asset naming

const FAQ = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      category: t("faq.category.booking"),
      tagline: "Reservations",
      questions: [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
        { q: t("faq.q4"), a: t("faq.a4") },
      ],
    },
    {
      category: t("faq.category.safari"),
      tagline: "On the Road",
      questions: [
        { q: t("faq.q5"), a: t("faq.a5") },
        { q: t("faq.q6"), a: t("faq.a6") },
        { q: t("faq.q7"), a: t("faq.a7") },
        { q: t("faq.q8"), a: t("faq.a8") },
      ],
    },
    {
      category: t("faq.category.accommodation"),
      tagline: "Loding & Stays",
      questions: [
        { q: t("faq.q9"), a: t("faq.a9") },
        { q: t("faq.q10"), a: t("faq.a10") },
        { q: t("faq.q11"), a: t("faq.a11") },
      ],
    },
    {
      category: t("faq.category.health"),
      tagline: "Safety First",
      questions: [
        { q: t("faq.q12"), a: t("faq.a12") },
        { q: t("faq.q13"), a: t("faq.a13") },
        { q: t("faq.q14"), a: t("faq.a14") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        {/* ─── High-Impact Hero ─────────────────────────────────────── */}
        <div className="relative h-[60vh] min-h-[480px] overflow-hidden">
          <motion.img
            src={heroImage}
            alt="Travel Information"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end pb-16">
            <div className="container mx-auto px-6 md:px-16 lg:px-24">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {t("faq.heroTagline")}
                </p>
                <div className="mb-4 h-0.5 w-10 bg-[#C9A96E]" />
                <h1 className="mb-4 font-serif text-5xl text-white md:text-6xl lg:text-7xl">
                  {t("faq.heroTitle")}
                </h1>
                <p className="max-w-xl text-lg text-white/90 leading-relaxed">
                  {t("faq.heroSubtitle")}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ─── FAQ Content Sections ──────────────────────────────────── */}
        <PageSection backgroundClassName="bg-background">
          <div className="mx-auto max-w-4xl">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.05 }}
                className="mb-20"
              >
                {/* Chapter Heading */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-safari">
                      {category.tagline}
                    </p>
                  </div>
                  <h2 className="font-serif text-4xl text-foreground mb-4">
                    {category.category}
                  </h2>
                  <div className="h-0.5 w-12 bg-[#C9A96E]" />
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={`${category.category}-${index}`}
                      value={`${categoryIndex}-${index}`}
                      className="border border-border rounded-2xl px-6 bg-card transition-all duration-300 hover:border-safari/30 hover:bg-secondary/20 overflow-hidden"
                    >
                      <AccordionTrigger className="text-left font-serif text-lg md:text-xl text-foreground hover:text-safari hover:no-underline py-6 group">
                        <span className="flex items-center gap-4">
                          <span className="text-xs font-sans text-muted-foreground/50 tracking-tighter">
                            0{index + 1}
                          </span>
                          {faq.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-8 pl-8 leading-relaxed text-[17px]">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* ─── Support CTA (Matching Dark Style) ────────────────────── */}
        <div className="bg-[#2D4A3E] py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <MessageCircle className="h-10 w-10 text-[#C9A96E]" />
              </div>
              <h2 className="font-serif text-4xl text-white mb-6">
                {t("faq.stillQuestions")}
              </h2>
              <p className="text-white/60 mb-10 text-lg leading-relaxed">
                {t("faq.stillQuestionsDesc")}
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/contact"
                  className="btn-safari inline-flex items-center gap-2 px-10 py-4"
                >
                  {t("faq.contactUs")} <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
