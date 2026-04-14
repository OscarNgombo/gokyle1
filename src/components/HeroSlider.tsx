import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { getContentImage } from '@/lib/contentAssets';

interface HeroSliderSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface HeroSliderProps {
  slides?: HeroSliderSlide[];
  primaryCta?: {
    href: string;
    label: string;
  } | null;
  secondaryCta?: {
    href: string;
    label: string;
  } | null;
}

const HeroSlider = ({ slides: customSlides, primaryCta, secondaryCta }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides = customSlides && customSlides.length > 0
    ? customSlides
    : [
        {
          image: getContentImage('antelope'),
          title: t('hero.slide1.title'),
          subtitle: t('hero.slide1.subtitle'),
          description: t('hero.slide1.description'),
        },
        {
          image: getContentImage('elephant'),
          title: t('hero.slide2.title'),
          subtitle: t('hero.slide2.subtitle'),
          description: t('hero.slide2.description'),
        },
        {
          image: getContentImage('flamingo'),
          title: t('hero.slide3.title'),
          subtitle: t('hero.slide3.subtitle'),
          description: t('hero.slide3.description'),
        },
        {
          image: getContentImage('wildbeast'),
          title: t('hero.slide4.title'),
          subtitle: t('hero.slide4.subtitle'),
          description: t('hero.slide4.description'),
        },
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden" aria-label={slides[currentSlide].title}>
      {/* Slides */}
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="hero-overlay absolute inset-0" />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl"
            >
              <motion.p 
                className="text-safari-light font-medium text-lg mb-4 tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p 
                className="text-xl text-white/80 mb-10 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {slides[currentSlide].description}
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {(primaryCta || secondaryCta) ? (
                  <>
                    {primaryCta && (
                      <Link to={primaryCta.href} className="btn-safari">
                        {primaryCta.label}
                      </Link>
                    )}
                    {secondaryCta && (
                      <Link to={secondaryCta.href} className="btn-outline-light">
                        {secondaryCta.label}
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/services" className="btn-safari">
                      {t('nav.services')}
                    </Link>
                    <Link to="/contact" className="btn-outline-light">
                      {t('hero.planTrip')}
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-6 right-6 flex justify-between pointer-events-none">
        <button 
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-safari transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-safari transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'w-12 bg-safari' : 'w-6 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
