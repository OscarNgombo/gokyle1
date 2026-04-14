import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import FilterChips from '@/components/common/FilterChips';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import strip1 from '@/assets/strip-1.jpeg';
import strip2 from '@/assets/strip-2.jpeg';
import strip3 from '@/assets/strip-3.jpeg';
import strip4 from '@/assets/strip-4.jpeg';
import strip5 from '@/assets/strip-5.jpeg';
import strip6 from '@/assets/strip-6.jpeg';
import strip7 from '@/assets/strip-7.jpeg';
import strip8 from '@/assets/strip-8.jpeg';
import strip9 from '@/assets/strip-9.jpeg';
import strip10 from '@/assets/strip-10.jpeg';
import strip11 from '@/assets/strip-11.jpeg';
import strip12 from '@/assets/strip-12.jpeg';
import hero1 from '@/assets/strip-1.jpeg';
import hero2 from '@/assets/strip-10.jpeg';
import hero3 from '@/assets/strip-12.jpeg';
import hero4 from '@/assets/strip-6.jpeg';

const images = [
  { src: hero1, category: 'Safari', title: 'Elephant Herd at Sunset' },
  { src: hero4, category: 'Safari', title: 'Balloon Safari' },
  { src: strip2, category: 'Safari', title: 'Giraffe Silhouette' },
  { src: strip6, category: 'Safari', title: 'Luxury Safari Camp' },
  { src: strip12, category: 'Safari', title: 'Mount Kenya Sunrise' },
  { src: hero2, category: 'Safari', title: 'Golden Hour Game Drive' },
  { src: strip9, category: 'Safari', title: 'Savanna Landscape' },
  { src: strip4, category: 'Safari', title: 'Safari Vehicle' },
  { src: hero3, category: 'Safari', title: 'Sunset on the Plains' },
  { src: strip1, category: 'Safari', title: 'Bush Walking Safari' },
  { src: strip7, category: 'Safari', title: 'Night Safari Adventure' },
  { src: hero2, category: 'Wildlife', title: 'Lion Pride' },
  { src: strip1, category: 'Wildlife', title: 'Cheetah Portrait' },
  { src: strip4, category: 'Wildlife', title: 'Baby Elephant' },
  { src: strip5, category: 'Wildlife', title: 'Flamingos at Lake Nakuru' },
  { src: strip7, category: 'Wildlife', title: 'Leopard in Tree' },
  { src: strip8, category: 'Wildlife', title: 'Rhino at Sunset' },
  { src: strip9, category: 'Wildlife', title: 'Zebras at Waterhole' },
  { src: strip10, category: 'Wildlife', title: 'Hippo in River' },
  { src: hero1, category: 'Wildlife', title: 'Elephant Crossing' },
  { src: strip2, category: 'Wildlife', title: 'Giraffe Family' },
  { src: strip6, category: 'Wildlife', title: 'Buffalo Herd' },
  { src: strip12, category: 'Wildlife', title: 'Wildebeest Migration' },
  { src: hero3, category: 'Beach', title: 'Diani Beach Paradise' },
  { src: strip11, category: 'Beach', title: 'Traditional Dhow' },
  { src: strip10, category: 'Beach', title: 'Crystal Clear Waters' },
  { src: strip3, category: 'Beach', title: 'Sunset Beach Walk' },
  { src: hero4, category: 'Beach', title: 'Tropical Shoreline' },
  { src: strip8, category: 'Beach', title: 'Palm Trees Paradise' },
  { src: strip5, category: 'Beach', title: 'Beach Resort View' },
  { src: hero1, category: 'Beach', title: 'Ocean Breeze' },
  { src: strip9, category: 'Beach', title: 'White Sand Beach' },
  { src: strip2, category: 'Beach', title: 'Coastal Sunrise' },
  { src: strip12, category: 'Beach', title: 'Snorkeling Adventure' },
  { src: strip3, category: 'Culture', title: 'Maasai Warrior' },
  { src: strip4, category: 'Culture', title: 'Traditional Dance' },
  { src: strip6, category: 'Culture', title: 'Local Crafts' },
  { src: strip7, category: 'Culture', title: 'Village Life' },
  { src: hero2, category: 'Culture', title: 'Tribal Ceremony' },
  { src: strip1, category: 'Culture', title: 'Maasai Market' },
  { src: strip8, category: 'Culture', title: 'Traditional Attire' },
  { src: strip10, category: 'Culture', title: 'Cultural Heritage' },
  { src: hero3, category: 'Culture', title: 'Swahili Coast' },
  { src: strip11, category: 'Culture', title: 'Historic Stone Town' },
  { src: strip5, category: 'Culture', title: 'Local Cuisine' },
];

const categories = ['All', 'Safari', 'Wildlife', 'Beach', 'Culture'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const closeLightbox = () => setLightboxIndex(null);

  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1);
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <PageHero
        title="Our Gallery"
        tagline="Visual Journey"
        subtitle={`Explore the breathtaking beauty of East Africa through our lens. ${images.length} stunning images from our adventures.`}
        backgroundClassName="bg-primary"
        overlayClassName="bg-transparent"
        heightClassName="h-[50vh] min-h-[400px]"
      />

      <PageSection backgroundClassName="bg-background" className="py-16">
        <FilterChips
          options={categories.map((category) => ({
            value: category,
            label: category,
            count: category === 'All' ? undefined : images.filter((img) => img.category === category).length,
          }))}
          activeValue={activeCategory}
          onChange={setActiveCategory}
          className="mb-12"
        />

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.title}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                index === 0 || index === 7 || index === 15 ? 'col-span-2 row-span-2' : ''
              }`}
              onClick={() => setLightboxIndex(index)}
            >
              <img
                src={image.src}
                alt={image.title}
                loading="lazy"
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-medium text-safari">{image.category}</span>
                  <h4 className="font-serif text-lg">{image.title}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </PageSection>

      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button className="absolute top-6 right-6 text-white hover:text-safari transition-colors z-10" onClick={closeLightbox}>
            <X size={32} />
          </button>

          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-safari transition-colors z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft size={40} />
          </button>

          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-safari transition-colors z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight size={40} />
          </button>

          <img
            src={filteredImages[lightboxIndex].src}
            alt={filteredImages[lightboxIndex].title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-8 text-center text-white">
            <span className="text-safari text-sm">{filteredImages[lightboxIndex].category}</span>
            <h3 className="font-serif text-2xl mt-1">{filteredImages[lightboxIndex].title}</h3>
            <p className="text-white/60 text-sm mt-2">{lightboxIndex + 1} / {filteredImages.length}</p>
          </div>
        </motion.div>
      )}

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Gallery;
