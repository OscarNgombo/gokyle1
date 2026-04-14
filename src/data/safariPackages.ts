import hero1 from '@/assets/strip-14.jpeg';
import hero2 from '@/assets/strip-10.jpeg';
import hero3 from '@/assets/strip-12.jpeg';
import hero4 from '@/assets/strip-6.jpeg';
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

type SupportedLanguage = 'en' | 'de' | 'it';

export interface SafariPackage {
  id: number;
  title: string;
  duration: string;
  groupSize: string;
  location: string;
  price: string;
  priceNote?: string;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  description: string;
  featured: boolean;
  category: 'excursion' | 'jeep-safari' | 'fly-in-safari';
}

export const safariPackages: SafariPackage[] = [
  // ½ Day Tours (Excursions)
  {
    id: 1,
    title: '½ Day Mombasa City Tour',
    duration: 'Half Day',
    groupSize: '2+ People',
    location: 'Mombasa, Kenya',
    price: 'EUR 120',
    rating: 4.8,
    reviews: 86,
    image: strip1,
    highlights: ['Elephant Tusks', 'Fort Jesus', 'Local markets', 'Old town exploration'],
    description: 'Visit the historic port city of Mombasa, including Elephant Tusks, Fort Jesus, local markets, and the old town.',
    featured: false,
    category: 'excursion',
  },
  {
    id: 2,
    title: '½ Day Bush Tour',
    duration: 'Half Day',
    groupSize: '2+ People',
    location: 'Kenya',
    price: 'EUR 100',
    rating: 4.7,
    reviews: 64,
    image: strip2,
    highlights: ['Village life experience', 'Local culture', 'Daily activities', 'Authentic encounters'],
    description: 'Experience local village life, culture, and daily activities of the local people.',
    featured: false,
    category: 'excursion',
  },
  // 1 Day Tours (Excursions)
  {
    id: 3,
    title: '1 Day Mombasa City Tour',
    duration: '1 Day',
    groupSize: '2+ People',
    location: 'Mombasa, Kenya',
    price: 'EUR 150',
    rating: 4.9,
    reviews: 112,
    image: strip3,
    highlights: ['Full city exploration', 'Haller Park visit', 'Lunch included', 'Cultural immersion'],
    description: 'Full day Mombasa City Tour including Haller Park visit and lunch. Explore the rich history and vibrant culture.',
    featured: false,
    category: 'excursion',
  },
  {
    id: 4,
    title: '1 Day Funzi Island',
    duration: '1 Day',
    groupSize: '2+ People',
    location: 'Funzi Island, Kenya',
    price: 'EUR 170',
    rating: 4.9,
    reviews: 78,
    image: strip4,
    highlights: ['Mangrove forests', 'Sandbanks in the ocean', 'Dolphin spotting', 'Island paradise'],
    description: 'Visit mangrove forests, sandbanks in the ocean, and enjoy dolphin spotting in this pristine island setting.',
    featured: true,
    category: 'excursion',
  },
  {
    id: 5,
    title: '1 Day Wasini – Kisite Marine Park',
    duration: '1 Day',
    groupSize: '2+ People',
    location: 'Wasini Island, Kenya',
    price: 'EUR 150',
    rating: 5.0,
    reviews: 145,
    image: strip5,
    highlights: ['Dhow cruise', 'Snorkeling adventure', 'Lobster lunch', 'Marine wildlife'],
    description: 'Dhow cruise, snorkeling in crystal-clear waters, and a delicious lobster lunch on Wasini Island.',
    featured: true,
    category: 'excursion',
  },
  {
    id: 6,
    title: '1 Day Shimoni – Pilli Pippa',
    duration: '1 Day',
    groupSize: '2+ People',
    location: 'Shimoni, Kenya',
    price: 'EUR 180',
    rating: 4.8,
    reviews: 67,
    image: strip6,
    highlights: ['Traditional Arab dhow', 'Kisite Marine Park', 'Snorkeling', 'Authentic experience'],
    description: 'Traditional Arab dhow cruise with snorkeling at Kisite Marine Park. An unforgettable maritime adventure.',
    featured: false,
    category: 'excursion',
  },
  // Jeep Safaris
  {
    id: 7,
    title: '1 Day Tsavo East National Park',
    duration: '1 Day',
    groupSize: '2-8 People',
    location: 'Tsavo East, Kenya',
    price: 'EUR 350',
    rating: 4.9,
    reviews: 156,
    image: hero1,
    highlights: ['Famous red elephants', 'Game drives', 'Lunch included', 'Big Five viewing'],
    description: 'Short safari to the land of the famous red elephants. Experience incredible wildlife with lunch included.',
    featured: true,
    category: 'jeep-safari',
  },
  {
    id: 8,
    title: '1 Day Shimba Hills',
    duration: '1 Day',
    groupSize: '2-8 People',
    location: 'Shimba Hills, Kenya',
    price: 'EUR 170',
    rating: 4.7,
    reviews: 89,
    image: strip7,
    highlights: ['Game drive', 'Shimba Lodge lunch', 'Rainforest exploration', 'Sable antelope'],
    description: 'Game drive in Shimba Hills with lunch at Shimba Lodge. Home to the rare sable antelope.',
    featured: false,
    category: 'jeep-safari',
  },
  {
    id: 9,
    title: '1½ Days Tsavo East',
    duration: '1.5 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Tsavo East, Kenya',
    price: 'EUR 350',
    rating: 4.8,
    reviews: 94,
    image: strip8,
    highlights: ['Overnight safari', 'Lodge accommodation', 'Multiple game drives', 'Sunset experience'],
    description: 'Overnight at Zeltcamp Tahri / Voi Wildlife Lodge / Voi Safari Lodge / Ashnil Aruba Lodge.',
    featured: false,
    category: 'jeep-safari',
  },
  {
    id: 10,
    title: '2 Days Tsavo East – Highlights',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Tsavo East, Kenya',
    price: 'EUR 400',
    rating: 4.9,
    reviews: 108,
    image: hero2,
    highlights: ['Extended game drives', 'Wildlife photography', 'Lodge stay', 'Red elephants'],
    description: 'Two-day highlights safari with overnight at premium lodges in Tsavo East National Park.',
    featured: true,
    category: 'jeep-safari',
  },
  {
    id: 11,
    title: '2 Days Tsavo East – Salt Lick',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Tsavo East / Taita Hills, Kenya',
    price: 'EUR 550',
    priceNote: '+ night drive',
    rating: 5.0,
    reviews: 132,
    image: strip9,
    highlights: ['Salt Lick Lodge', 'Elevated wildlife viewing', 'Night drive', 'Unique stilted lodge'],
    description: 'Stay at the famous Salt Lick Lodge, elevated on stilts for unique wildlife viewing. Includes night drive.',
    featured: true,
    category: 'jeep-safari',
  },
  {
    id: 12,
    title: '2 Days Tsavo East & West',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Tsavo East & West, Kenya',
    price: 'EUR 550',
    rating: 4.9,
    reviews: 87,
    image: strip10,
    highlights: ['Two national parks', 'Night safari', 'Walking safari', 'Diverse landscapes'],
    description: 'Night and walking safari in Tsavo West. Tent or lodge accommodation. Explore two distinct ecosystems.',
    featured: false,
    category: 'jeep-safari',
  },
  {
    id: 13,
    title: '3 Days Tsavo East & West / Amboseli',
    duration: '3 Days / 2 Nights',
    groupSize: '2-6 People',
    location: 'Multiple Parks, Kenya',
    price: 'EUR 750',
    rating: 5.0,
    reviews: 76,
    image: hero3,
    highlights: ['Mount Kilimanjaro views', 'Multiple parks', 'Extended wildlife viewing', 'Premium lodges'],
    description: 'Combination safari with chance to see Mount Kilimanjaro. Visit Tsavo East & West or Taita Hills & Amboseli.',
    featured: true,
    category: 'jeep-safari',
  },
  // Fly-in Safaris
  {
    id: 14,
    title: '2 Days Lamu',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Lamu, Kenya',
    price: 'EUR 900',
    rating: 4.8,
    reviews: 54,
    image: strip11,
    highlights: ['UNESCO World Heritage', 'Old town exploration', 'Museum visits', 'Swahili culture'],
    description: 'Explore the old town and museum in northern Kenya. Lamu is a UNESCO World Heritage Site with rich Swahili culture.',
    featured: false,
    category: 'fly-in-safari',
  },
  {
    id: 15,
    title: '2 Days Zanzibar',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Zanzibar, Tanzania',
    price: 'EUR 950',
    rating: 4.9,
    reviews: 98,
    image: strip12,
    highlights: ['Spice island tour', 'Local markets', 'Stone Town', 'Beach paradise'],
    description: 'Visit Zanzibar Island, spice farms, and local markets. Experience the magic of the Spice Island.',
    featured: true,
    category: 'fly-in-safari',
  },
  {
    id: 16,
    title: '2 Days Maasai Mara – Fig Tree Camp',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Maasai Mara, Kenya',
    price: 'EUR 1,500',
    rating: 5.0,
    reviews: 167,
    image: hero4,
    highlights: ['Three game drives', 'Endless plains', 'Big Five', 'Fig Tree Camp / Mara Siana Springs'],
    description: 'Three exciting game drives in the endless plains of Maasai Mara. Stay at Fig Tree Camp or Mara Siana Springs.',
    featured: true,
    category: 'fly-in-safari',
  },
  {
    id: 17,
    title: '2 Days Maasai Mara – Governors Camp',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Maasai Mara, Kenya',
    price: 'EUR 1,550',
    rating: 5.0,
    reviews: 143,
    image: hero2,
    highlights: ['Out of Africa experience', 'Big Five viewing', 'Luxury accommodation', 'Pristine wilderness'],
    description: 'Experience the "Out of Africa" wilderness and the Big Five at the prestigious Governors Camp.',
    featured: true,
    category: 'fly-in-safari',
  },
  {
    id: 18,
    title: '2 Days Amboseli & Maasai Mara',
    duration: '2 Days / 1 Night',
    groupSize: '2-6 People',
    location: 'Amboseli & Maasai Mara, Kenya',
    price: 'EUR 1,550',
    rating: 4.9,
    reviews: 89,
    image: strip4,
    highlights: ['Two iconic parks', 'Scenic flights', 'Mount Kilimanjaro', 'Diverse wildlife'],
    description: 'Two iconic national parks by flight in two days. Experience both Amboseli and the Maasai Mara.',
    featured: false,
    category: 'fly-in-safari',
  },
  {
    id: 19,
    title: '3 Days Maasai Mara',
    duration: '3 Days / 2 Nights',
    groupSize: '2-6 People',
    location: 'Maasai Mara, Kenya',
    price: 'EUR 2,000',
    rating: 5.0,
    reviews: 201,
    image: hero1,
    highlights: ['Two nights in the wild', 'Multiple game drives', 'Big Five guaranteed', 'Sunset experiences'],
    description: 'Two nights surrounded by the sounds of the wild. The ultimate Maasai Mara experience with extensive game drives.',
    featured: true,
    category: 'fly-in-safari',
  },
];

export const safariTypes = [
  {
    id: 'excursions',
    title: 'Day Excursions',
    description: 'Half-day and full-day tours exploring local culture, islands, and marine life.',
    image: strip1,
  },
  {
    id: 'jeep',
    title: 'Jeep Safaris',
    description: 'Classic game drives in 4x4 vehicles through Kenya\'s famous national parks.',
    image: strip2,
  },
  {
    id: 'fly-in',
    title: 'Fly-in Safaris',
    description: 'Premium experiences to remote destinations including Maasai Mara and Zanzibar.',
    image: strip5,
  },
  {
    id: 'multi-day',
    title: 'Multi-Day Adventures',
    description: 'Extended safaris with overnight stays at luxury lodges and tented camps.',
    image: strip6,
  },
];

type SafariPackageOverride = Pick<SafariPackage, 'title' | 'description' | 'highlights'> & {
  priceNote?: string;
};

const safariPackageTranslations: Record<Exclude<SupportedLanguage, 'en'>, Record<number, SafariPackageOverride>> = {
  de: {
    1: { title: '1/2 Tag Mombasa Stadttour', description: 'Besuchen Sie die historische Hafenstadt Mombasa mit Elefantenzähnen, Fort Jesus, lokalen Märkten und der Altstadt.', highlights: ['Elefantenzähne', 'Fort Jesus', 'Lokale Märkte', 'Altstadterkundung'] },
    2: { title: '1/2 Tag Busch Tour', description: 'Erleben Sie das Dorfleben, die Kultur und den Alltag der lokalen Gemeinschaften.', highlights: ['Dorferlebnis', 'Lokale Kultur', 'Alltagsleben', 'Authentische Begegnungen'] },
    3: { title: '1 Tag Mombasa Stadttour', description: 'Ganztägige Stadttour durch Mombasa inklusive Haller Park und Mittagessen. Entdecken Sie Geschichte und lebendige Kultur.', highlights: ['Stadterkundung', 'Haller Park', 'Mittagessen inklusive', 'Kulturelle Einblicke'] },
    4: { title: '1 Tag Funzi Island', description: 'Besuchen Sie Mangrovenwälder, Sandbänke im Ozean und halten Sie Ausschau nach Delfinen in dieser traumhaften Inselkulisse.', highlights: ['Mangrovenwälder', 'Sandbänke im Meer', 'Delfinbeobachtung', 'Inselparadies'] },
    5: { title: '1 Tag Wasini - Kisite Marine Park', description: 'Dhau-Fahrt, Schnorcheln in kristallklarem Wasser und ein köstliches Hummer-Mittagessen auf Wasini Island.', highlights: ['Dhau-Fahrt', 'Schnorcheln', 'Hummer-Mittagessen', 'Meereswelt'] },
    6: { title: '1 Tag Shimoni - Pilli Pippa', description: 'Traditionelle arabische Dhau-Fahrt mit Schnorcheln im Kisite Marine Park. Ein unvergessliches Meeresabenteuer.', highlights: ['Traditionelle Dhau', 'Kisite Marine Park', 'Schnorcheln', 'Authentisches Erlebnis'] },
    7: { title: '1 Tag Tsavo East Nationalpark', description: 'Kurze Safari ins Land der berühmten roten Elefanten. Erleben Sie beeindruckende Tierwelt inklusive Mittagessen.', highlights: ['Rote Elefanten', 'Pirschfahrten', 'Mittagessen inklusive', 'Big Five Sichtungen'] },
    8: { title: '1 Tag Shimba Hills', description: 'Pirschfahrt in den Shimba Hills mit Mittagessen in der Shimba Lodge. Heimat der seltenen Rappenantilope.', highlights: ['Pirschfahrt', 'Mittagessen in der Shimba Lodge', 'Regenwald', 'Rappenantilopen'] },
    9: { title: '1,5 Tage Tsavo East', description: 'Übernachtung im Zeltcamp Tahri, Voi Wildlife Lodge, Voi Safari Lodge oder Ashnil Aruba Lodge.', highlights: ['Safari mit Übernachtung', 'Lodge-Unterkunft', 'Mehrere Pirschfahrten', 'Sonnenuntergangserlebnis'] },
    10: { title: '2 Tage Tsavo East - Highlights', description: 'Zweitägige Highlight-Safari mit Übernachtung in ausgewählten Lodges im Tsavo East Nationalpark.', highlights: ['Ausgedehnte Pirschfahrten', 'Wildlife-Fotografie', 'Lodge-Aufenthalt', 'Rote Elefanten'] },
    11: { title: '2 Tage Tsavo East - Salt Lick', description: 'Aufenthalt in der berühmten Salt Lick Lodge auf Stelzen mit einzigartiger Tierbeobachtung. Inklusive Nachtsafari.', highlights: ['Salt Lick Lodge', 'Erhöhte Tierbeobachtung', 'Nachtsafari', 'Lodge auf Stelzen'], priceNote: '+ Nachtsafari' },
    12: { title: '2 Tage Tsavo East & West', description: 'Nacht- und Wandersafari in Tsavo West. Zelt- oder Lodge-Unterkunft und zwei sehr unterschiedliche Ökosysteme.', highlights: ['Zwei Nationalparks', 'Nachtsafari', 'Wandersafari', 'Vielfältige Landschaften'] },
    13: { title: '3 Tage Tsavo East & West / Amboseli', description: 'Kombinationssafari mit Chance auf den Kilimandscharo. Besuchen Sie Tsavo East & West oder Taita Hills & Amboseli.', highlights: ['Kilimandscharo-Blicke', 'Mehrere Parks', 'Lange Tierbeobachtung', 'Premium-Lodges'] },
    14: { title: '2 Tage Lamu', description: 'Entdecken Sie die Altstadt und das Museum im Norden Kenias. Lamu ist UNESCO-Weltkulturerbe mit reicher Swahili-Kultur.', highlights: ['UNESCO-Weltkulturerbe', 'Altstadterkundung', 'Museumsbesuche', 'Swahili-Kultur'] },
    15: { title: '2 Tage Sansibar', description: 'Besuchen Sie Sansibar, Gewürzfarmen und lokale Märkte. Erleben Sie die Magie der Gewürzinsel.', highlights: ['Gewürzinsel-Tour', 'Lokale Märkte', 'Stone Town', 'Strandparadies'] },
    16: { title: '2 Tage Maasai Mara - Fig Tree Camp', description: 'Drei spannende Pirschfahrten in den endlosen Ebenen der Maasai Mara. Aufenthalt im Fig Tree Camp oder Mara Siana Springs.', highlights: ['Drei Pirschfahrten', 'Endlose Ebenen', 'Big Five', 'Fig Tree Camp / Mara Siana Springs'] },
    17: { title: '2 Tage Maasai Mara - Governors Camp', description: 'Erleben Sie die Wildnis aus "Out of Africa" und die Big Five im renommierten Governors Camp.', highlights: ['Out of Africa Atmosphäre', 'Big Five', 'Luxusunterkunft', 'Unberührte Wildnis'] },
    18: { title: '2 Tage Amboseli & Maasai Mara', description: 'Zwei ikonische Nationalparks per Flug in zwei Tagen. Erleben Sie Amboseli und die Maasai Mara in einer Reise.', highlights: ['Zwei ikonische Parks', 'Panoramaflüge', 'Kilimandscharo', 'Vielfältige Tierwelt'] },
    19: { title: '3 Tage Maasai Mara', description: 'Zwei Nächte mitten in der Wildnis. Das ultimative Maasai-Mara-Erlebnis mit intensiven Pirschfahrten.', highlights: ['Zwei Nächte in der Wildnis', 'Mehrere Pirschfahrten', 'Big Five garantiert', 'Sonnenuntergangserlebnisse'] },
  },
  it: {
    1: { title: 'Tour della citta di Mombasa di mezza giornata', description: 'Visita la storica citta portuale di Mombasa, inclusi Elephant Tusks, Fort Jesus, i mercati locali e la citta vecchia.', highlights: ['Elephant Tusks', 'Fort Jesus', 'Mercati locali', 'Esplorazione della citta vecchia'] },
    2: { title: 'Tour bush di mezza giornata', description: 'Scopri la vita del villaggio, la cultura locale e le attivita quotidiane della comunita.', highlights: ['Esperienza nel villaggio', 'Cultura locale', 'Attivita quotidiane', 'Incontri autentici'] },
    3: { title: 'Tour della citta di Mombasa di 1 giorno', description: 'Tour completo di Mombasa con visita ad Haller Park e pranzo incluso. Scopri storia e cultura vivace.', highlights: ['Tour completo della citta', 'Visita ad Haller Park', 'Pranzo incluso', 'Immersione culturale'] },
    4: { title: '1 giorno a Funzi Island', description: 'Visita le foreste di mangrovie, i banchi di sabbia nell\'oceano e goditi l\'avvistamento dei delfini in questo scenario incontaminato.', highlights: ['Foreste di mangrovie', 'Banchi di sabbia in mare', 'Avvistamento delfini', 'Paradiso tropicale'] },
    5: { title: '1 giorno Wasini - Kisite Marine Park', description: 'Crociera in dhow, snorkeling in acque cristalline e delizioso pranzo con aragosta a Wasini Island.', highlights: ['Crociera in dhow', 'Avventura snorkeling', 'Pranzo con aragosta', 'Fauna marina'] },
    6: { title: '1 giorno Shimoni - Pilli Pippa', description: 'Tradizionale crociera araba in dhow con snorkeling al Kisite Marine Park. Un\'avventura marina indimenticabile.', highlights: ['Dhow tradizionale', 'Kisite Marine Park', 'Snorkeling', 'Esperienza autentica'] },
    7: { title: '1 giorno Tsavo East National Park', description: 'Breve safari nella terra dei famosi elefanti rossi. Fauna straordinaria con pranzo incluso.', highlights: ['Famosi elefanti rossi', 'Game drive', 'Pranzo incluso', 'Avvistamento Big Five'] },
    8: { title: '1 giorno a Shimba Hills', description: 'Game drive nelle Shimba Hills con pranzo allo Shimba Lodge. Habitat della rara antilope sable.', highlights: ['Game drive', 'Pranzo allo Shimba Lodge', 'Esplorazione della foresta pluviale', 'Antilope sable'] },
    9: { title: '1,5 giorni Tsavo East', description: 'Pernottamento allo Zeltcamp Tahri, Voi Wildlife Lodge, Voi Safari Lodge o Ashnil Aruba Lodge.', highlights: ['Safari con pernottamento', 'Soggiorno in lodge', 'Molteplici game drive', 'Esperienza al tramonto'] },
    10: { title: '2 giorni Tsavo East - Highlights', description: 'Safari di due giorni con pernottamento in lodge selezionati nel Tsavo East National Park.', highlights: ['Game drive estesi', 'Fotografia naturalistica', 'Soggiorno in lodge', 'Elefanti rossi'] },
    11: { title: '2 giorni Tsavo East - Salt Lick', description: 'Soggiorna al celebre Salt Lick Lodge, sospeso su palafitte per un avvistamento unico. Include safari notturno.', highlights: ['Salt Lick Lodge', 'Avvistamento rialzato', 'Safari notturno', 'Lodge su palafitte'], priceNote: '+ safari notturno' },
    12: { title: '2 giorni Tsavo East e West', description: 'Safari notturno e passeggiata nel Tsavo West. Sistemazione in tenda o lodge per esplorare due ecosistemi distinti.', highlights: ['Due parchi nazionali', 'Safari notturno', 'Safari a piedi', 'Paesaggi diversi'] },
    13: { title: '3 giorni Tsavo East e West / Amboseli', description: 'Safari combinato con possibilita di vedere il Kilimangiaro. Visita Tsavo East e West oppure Taita Hills e Amboseli.', highlights: ['Vista sul Kilimangiaro', 'Piu parchi', 'Osservazione prolungata', 'Lodge premium'] },
    14: { title: '2 giorni a Lamu', description: 'Esplora la citta vecchia e il museo nel nord del Kenya. Lamu e patrimonio UNESCO con una ricca cultura swahili.', highlights: ['Patrimonio UNESCO', 'Esplorazione della citta vecchia', 'Visite ai musei', 'Cultura swahili'] },
    15: { title: '2 giorni a Zanzibar', description: 'Visita Zanzibar, le piantagioni di spezie e i mercati locali. Vivi il fascino della Spice Island.', highlights: ['Tour dell\'isola delle spezie', 'Mercati locali', 'Stone Town', 'Paradiso balneare'] },
    16: { title: '2 giorni Maasai Mara - Fig Tree Camp', description: 'Tre emozionanti game drive nelle pianure infinite della Maasai Mara. Soggiorno al Fig Tree Camp o Mara Siana Springs.', highlights: ['Tre game drive', 'Pianure infinite', 'Big Five', 'Fig Tree Camp / Mara Siana Springs'] },
    17: { title: '2 giorni Maasai Mara - Governors Camp', description: 'Vivi la natura di "Out of Africa" e i Big Five nel prestigioso Governors Camp.', highlights: ['Atmosfera Out of Africa', 'Big Five', 'Alloggio di lusso', 'Natura incontaminata'] },
    18: { title: '2 giorni Amboseli e Maasai Mara', description: 'Due parchi iconici raggiunti in volo in due giorni. Scopri sia Amboseli sia la Maasai Mara.', highlights: ['Due parchi iconici', 'Voli panoramici', 'Monte Kilimangiaro', 'Fauna diversificata'] },
    19: { title: '3 giorni Maasai Mara', description: 'Due notti circondati dai suoni della natura. L\'esperienza definitiva nella Maasai Mara con ampi game drive.', highlights: ['Due notti nella natura', 'Molteplici game drive', 'Big Five garantiti', 'Esperienze al tramonto'] },
  },
};

const safariTypeTranslations: Record<Exclude<SupportedLanguage, 'en'>, Record<string, { title: string; description: string }>> = {
  de: {
    excursions: { title: 'Tagesausfluege', description: 'Halbtages- und Ganztagestouren mit lokaler Kultur, Inseln und Meereswelt.' },
    jeep: { title: 'Jeep-Safaris', description: 'Klassische Pirschfahrten im 4x4 durch Kenias bekannteste Nationalparks.' },
    'fly-in': { title: 'Flugsafaris', description: 'Premium-Erlebnisse zu entlegenen Zielen wie Maasai Mara und Sansibar.' },
    'multi-day': { title: 'Mehrtaegige Abenteuer', description: 'Laengere Safaris mit Uebernachtungen in Luxuslodges und Zeltcamps.' },
  },
  it: {
    excursions: { title: 'Escursioni giornaliere', description: 'Tour di mezza giornata e di un giorno tra cultura locale, isole e vita marina.' },
    jeep: { title: 'Safari in jeep', description: 'Classici game drive in 4x4 attraverso i celebri parchi nazionali del Kenya.' },
    'fly-in': { title: 'Safari fly-in', description: 'Esperienze premium verso destinazioni remote come Maasai Mara e Zanzibar.' },
    'multi-day': { title: 'Avventure di piu giorni', description: 'Safari estesi con pernottamenti in lodge di lusso e campi tendati.' },
  },
};

const translateDuration = (duration: string, language: SupportedLanguage) => {
  if (language === 'en') {
    return duration;
  }

  const replacements =
    language === 'de'
      ? [
          ['Half Day', 'Halber Tag'],
          ['Days', 'Tage'],
          ['Day', 'Tag'],
          ['Nights', 'Naechte'],
          ['Night', 'Nacht'],
        ]
      : [
          ['Half Day', 'Mezza giornata'],
          ['Days', 'giorni'],
          ['Day', 'giorno'],
          ['Nights', 'notti'],
          ['Night', 'notte'],
        ];

  return replacements.reduce((value, [from, to]) => value.split(from).join(to), duration);
};

const translateGroupSize = (groupSize: string, language: SupportedLanguage) => {
  if (language === 'en') {
    return groupSize;
  }

  return groupSize.replace('People', language === 'de' ? 'Personen' : 'persone');
};

const localizeSafariPackage = (pkg: SafariPackage, language: SupportedLanguage): SafariPackage => {
  if (language === 'en') {
    return pkg;
  }

  const override = safariPackageTranslations[language][pkg.id];

  return {
    ...pkg,
    ...override,
    duration: translateDuration(pkg.duration, language),
    groupSize: translateGroupSize(pkg.groupSize, language),
    priceNote: override?.priceNote ?? pkg.priceNote,
    highlights: override?.highlights ?? pkg.highlights,
  };
};

export const getLocalizedSafariPackages = (language: SupportedLanguage) =>
  safariPackages.map((pkg) => localizeSafariPackage(pkg, language));

export const findSafariPackage = (query: string | null | undefined, language: SupportedLanguage = 'en') => {
  if (!query) {
    return null;
  }

  const safari = safariPackages.find((pkg) => String(pkg.id) === query || pkg.title === query);
  return safari ? localizeSafariPackage(safari, language) : null;
};

export const getLocalizedSafariTypes = (language: SupportedLanguage) => {
  if (language === 'en') {
    return safariTypes;
  }

  return safariTypes.map((type) => ({
    ...type,
    ...safariTypeTranslations[language][type.id],
  }));
};

export const countries = [
  'Germany',
  'United Kingdom',
  'United States',
  'France',
  'Italy',
  'Netherlands',
  'Belgium',
  'Austria',
  'Switzerland',
  'Spain',
  'Australia',
  'Canada',
  'Kenya',
  'Other',
];
