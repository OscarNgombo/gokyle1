import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'United Kingdom',
    rating: 5,
    textEn: 'An absolutely incredible experience! Gokyle Tours made our African dream come true. The attention to detail and personalized service exceeded all expectations.',
    textDe: 'Ein absolut unglaubliches Erlebnis! Gokyle Tours hat unseren afrikanischen Traum wahr werden lassen. Die Liebe zum Detail und der persönliche Service haben alle Erwartungen übertroffen.',
    textIt: "Un'esperienza assolutamente incredibile! Gokyle Tours ha trasformato il nostro sogno africano in realta. L'attenzione ai dettagli e il servizio personalizzato hanno superato ogni aspettativa.",
    tripEn: 'Masai Mara Safari',
    tripDe: 'Masai Mara Safari',
    tripIt: 'Safari Masai Mara',
  },
  {
    name: 'Michael Schmidt',
    location: 'Germany',
    rating: 5,
    textEn: 'The best safari experience of our lives! The team was professional and our accommodation was first class. We will definitely come back.',
    textDe: 'Die beste Safari-Erfahrung unseres Lebens! Das Team war professionell und unsere Unterkunft war erstklassig. Wir werden definitiv wiederkommen.',
    textIt: 'La migliore esperienza safari della nostra vita! Il team e stato professionale e la sistemazione di altissimo livello. Torneremo sicuramente.',
    tripEn: 'Tanzania Explorer',
    tripDe: 'Tansania Entdecker',
    tripIt: 'Esploratore della Tanzania',
  },
  {
    name: 'Emily Chen',
    location: 'Australia',
    rating: 5,
    textEn: 'From the moment we landed, everything was perfectly organized. Seeing the Big Five was a dream come true. Highly recommend Gokyle Tours!',
    textDe: 'Von dem Moment an, als wir gelandet sind, war alles perfekt organisiert. Die Big Five zu sehen war ein Traum, der wahr wurde. Sehr zu empfehlen!',
    textIt: 'Dal momento in cui siamo atterrati, tutto e stato organizzato alla perfezione. Vedere i Big Five e stato un sogno che si avvera. Consigliatissimo!',
    tripEn: 'Kenya & Beach Holiday',
    tripDe: 'Kenia & Strandurlaub',
    tripIt: 'Kenya e vacanza al mare',
  },
];

interface TestimonialItem {
  name: string;
  location: string;
  rating: number;
  trip: string;
  quote: string;
}

interface TestimonialsSectionProps {
  tagline?: string;
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
}

const TestimonialsSection = ({
  tagline,
  title,
  subtitle,
  items,
}: TestimonialsSectionProps) => {
  const { t, language } = useLanguage();
  const resolvedItems = items ?? testimonials.map((testimonial) => ({
    name: testimonial.name,
    location: testimonial.location,
    rating: testimonial.rating,
    trip: language === 'de' ? testimonial.tripDe : language === 'it' ? testimonial.tripIt : testimonial.tripEn,
    quote: language === 'de' ? testimonial.textDe : language === 'it' ? testimonial.textIt : testimonial.textEn,
  }));

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-safari font-medium mb-4 tracking-wide uppercase text-sm">
            {tagline ?? t('testimonials.tagline')}
          </p>
          <h2 className="section-title mb-6">
            {title ?? t('testimonials.title')}
          </h2>
          <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto">
            {subtitle ?? t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {resolvedItems.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-safari text-safari" />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-primary-foreground/80 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-primary-foreground/60">{testimonial.location}</p>
                <p className="text-sm text-safari mt-1">
                  {testimonial.trip}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
