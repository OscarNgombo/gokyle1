import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Hotel, Package, Send, User, Calendar, Users, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookingRequestMutation, useSafariPackagesQuery } from '@/api/queries';
import { getApiErrorMessage } from '@/api/errors';
import { countries } from '@/data/safariPackages';
import { findSafariPackageMatch } from '@/lib/safariPackageUtils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import heroImage from '@/assets/strip-10.jpeg'; // High-impact safari imagery

const Booking = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedPackage = searchParams.get('package');
  const { data, isLoading: isPackagesLoading, isError: isPackagesError } = useSafariPackagesQuery({ locale: language });
  const bookingRequestMutation = useBookingRequestMutation();

  const bookingCopy = useMemo(() => {
    const copies = {
      de: {
        intro: 'Tragen Sie unten Ihre Details ein und senden Sie Ihre Buchungsanfrage direkt an unser Team.',
        personalDetails: 'Persönliche Daten',
        tripDetails: 'Reisedetails',
        nationality: 'Nationalität *',
        selectNationality: 'Nationalität auswählen',
        safariPackage: 'Safari-Paket *',
        adults: 'Anzahl Erwachsene',
        children: 'Anzahl Kinder',
        accommodation: 'Unterkunftswunsch',
        selectAccommodation: 'Unterkunftsart auswählen',
        specialRequests: 'Besondere Wünsche',
        submitRequest: 'Buchungsanfrage senden',
        submitting: 'Anfrage wird gesendet...',
        fullNamePlaceholder: 'Ihr vollständiger Name',
        phonePlaceholder: '+1 234 567 8900',
        adultsPlaceholder: 'z. B. 2',
        childrenPlaceholder: 'z. B. 0',
        requestsPlaceholder: 'Besondere Anforderungen, Ernährungswünsche...',
        requestReceived: 'Buchungsanfrage erhalten',
        requestReceivedDesc: 'Wir haben Ihre Anfrage erhalten und melden uns bald.',
        requestFailed: 'Anfrage fehlgeschlagen',
        requestFailedDesc: 'Bitte versuchen Sie es erneut.',
        loadingPackages: 'Pakete werden geladen...',
        packagesUnavailable: 'Pakete nicht verfügbar.',
        packagesUnavailableDesc: 'Bitte laden Sie die Seite neu.',
        accommodationOptions: {
          budget: 'Budget / Camping',
          'mid-range': 'Mittelklasse-Lodge',
          luxury: 'Luxus-Lodge / Zeltcamp',
          premium: 'Premium / 5-Sterne-Resort',
          flexible: 'Flexibel / Keine Präferenz',
        },
      },
      it: {
        intro: 'Inserisci i tuoi dati qui sotto e invia la richiesta di prenotazione direttamente al nostro team.',
        personalDetails: 'Dati personali',
        tripDetails: 'Dettagli del viaggio',
        nationality: 'Nazionalità *',
        selectNationality: 'Seleziona la nazionalità',
        safariPackage: 'Pacchetto safari *',
        adults: 'Numero di adulti',
        children: 'Numero di bambini',
        accommodation: 'Preferenza di alloggio',
        selectAccommodation: 'Seleziona il tipo di alloggio',
        specialRequests: 'Richieste speciali',
        submitRequest: 'Invia richiesta',
        submitting: 'Invio in corso...',
        fullNamePlaceholder: 'Il tuo nome completo',
        phonePlaceholder: '+1 234 567 8900',
        adultsPlaceholder: 'es. 2',
        childrenPlaceholder: 'es. 0',
        requestsPlaceholder: 'Esigenze speciali, richieste alimentari...',
        requestReceived: 'Richiesta ricevuta',
        requestReceivedDesc: 'Ti contatteremo presto con i prossimi passi.',
        requestFailed: 'Invio fallito',
        requestFailedDesc: 'Riprova più tardi.',
        loadingPackages: 'Caricamento pacchetti...',
        packagesUnavailable: 'Pacchetti non disponibili.',
        packagesUnavailableDesc: 'Ricarica la pagina.',
        accommodationOptions: {
          budget: 'Budget / Campeggio',
          'mid-range': 'Lodge di fascia media',
          luxury: 'Lodge di lusso / Campo tendato',
          premium: 'Premium / Resort 5 stelle',
          flexible: 'Flessibile / Nessuna preferenza',
        },
      },
      en: {
        intro: 'Fill in your details below and send your booking request directly to our team.',
        personalDetails: 'Personal Details',
        tripDetails: 'Trip Details',
        nationality: 'Nationality *',
        selectNationality: 'Select nationality',
        safariPackage: 'Safari Package *',
        adults: 'Number of Adults',
        children: 'Number of Children',
        accommodation: 'Accommodation Preference',
        selectAccommodation: 'Select accommodation type',
        specialRequests: 'Special Requests',
        submitRequest: 'Send Booking Request',
        submitting: 'Sending request...',
        fullNamePlaceholder: 'Your full name',
        phonePlaceholder: '+1 234 567 8900',
        adultsPlaceholder: 'e.g. 2',
        childrenPlaceholder: 'e.g. 0',
        requestsPlaceholder: 'Any special requirements, dietary needs, preferred dates...',
        requestReceived: 'Booking request received',
        requestReceivedDesc: 'We have your request and will get back to you soon.',
        requestFailed: 'Submission failed',
        requestFailedDesc: 'Please try again.',
        loadingPackages: 'Loading safari packages...',
        packagesUnavailable: 'Safari packages are currently unavailable.',
        packagesUnavailableDesc: 'Please refresh the page.',
        accommodationOptions: {
          budget: 'Budget / Camping',
          'mid-range': 'Mid-Range Lodge',
          luxury: 'Luxury Lodge / Tented Camp',
          premium: 'Premium / 5-Star Resort',
          flexible: 'Flexible / No Preference',
        },
      }
    };
    return copies[language as keyof typeof copies] || copies.en;
  }, [language]);

  const safariPackages = useMemo(() => data?.items ?? [], [data]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerNationality: '',
    packageId: '',
    adultsCount: '',
    childrenCount: '',
    accommodationPreference: '',
    specialRequests: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const matchedPackage = findSafariPackageMatch(safariPackages, preselectedPackage);
    if (matchedPackage) {
      setFormData((prev) => ({ ...prev, packageId: String(matchedPackage.id) }));
    }
  }, [preselectedPackage, safariPackages]);

  const selectedPackage = useMemo(
    () => safariPackages.find((pkg) => String(pkg.id) === formData.packageId) ?? null,
    [formData.packageId, safariPackages]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await bookingRequestMutation.mutateAsync({
        locale: language,
        packageId: Number.parseInt(formData.packageId, 10),
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerNationality: formData.customerNationality,
        adultsCount: parseInt(formData.adultsCount) || null,
        childrenCount: parseInt(formData.childrenCount) || 0,
        accommodationPreference: formData.accommodationPreference || null,
        specialRequests: formData.specialRequests.trim() || null,
      });

      toast({
        title: bookingCopy.requestReceived,
        description: selectedPackage ? `${selectedPackage.title} — ${bookingCopy.requestReceivedDesc}` : bookingCopy.requestReceivedDesc,
      });
      setFormData({ customerName: '', customerEmail: '', customerPhone: '', customerNationality: '', packageId: '', adultsCount: '', childrenCount: '', accommodationPreference: '', specialRequests: '' });
    } catch (error) {
      toast({ title: bookingCopy.requestFailed, description: getApiErrorMessage(error), variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main id="main-content">
        {/* ─── Immersive Hero ────────────────────────────────────────── */}
        <div className="relative h-[55vh] min-h-[450px] overflow-hidden">
          <motion.img
            src={heroImage}
            alt="Book Your Safari"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end pb-16 pl-8 md:pl-16 lg:pl-24">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {t('booking.title')}
              </p>
              <div className="mb-4 h-0.5 w-10 bg-[#C9A96E]" />
              <h1 className="mb-4 font-serif text-5xl text-white md:text-6xl lg:text-7xl">
                {t('booking.title')}
              </h1>
              <p className="max-w-xl text-lg text-white/90 leading-relaxed">
                {bookingCopy.intro}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ─── Booking Form ───────────────────────────────────────────── */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-16">
              
              {/* Personal Details Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-safari/60">Stage One</p>
                </div>
                <h2 className="font-serif text-3xl mb-8 flex items-center gap-3">
                  <User size={24} className="text-[#C9A96E]" />
                  {bookingCopy.personalDetails}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-secondary/20 p-8 rounded-[2rem] border border-border">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('booking.fullName')} *</label>
                    <Input required name="customerName" placeholder={bookingCopy.fullNamePlaceholder} value={formData.customerName} onChange={handleInputChange} className="h-14 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('booking.emailAddress')} *</label>
                    <Input type="email" required name="customerEmail" placeholder="your@email.com" value={formData.customerEmail} onChange={handleInputChange} className="h-14 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('booking.phoneNumber')} *</label>
                    <Input required name="customerPhone" placeholder={bookingCopy.phonePlaceholder} value={formData.customerPhone} onChange={handleInputChange} className="h-14 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{bookingCopy.nationality}</label>
                    <Select value={formData.customerNationality} onValueChange={(v) => handleSelectChange('customerNationality', v)}>
                      <SelectTrigger className="h-14 rounded-xl"><Globe className="w-4 h-4 mr-2" /><SelectValue placeholder={bookingCopy.selectNationality} /></SelectTrigger>
                      <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>

              {/* Trip Details Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-safari/60">Stage Two</p>
                </div>
                <h2 className="font-serif text-3xl mb-8 flex items-center gap-3">
                  <Package size={24} className="text-[#C9A96E]" />
                  {bookingCopy.tripDetails}
                </h2>
                
                <div className="space-y-8 bg-secondary/20 p-8 rounded-[2rem] border border-border">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{bookingCopy.safariPackage}</label>
                    <Select value={formData.packageId} onValueChange={(v) => handleSelectChange('packageId', v)} disabled={isPackagesLoading}>
                      <SelectTrigger className="h-14 rounded-xl"><SelectValue placeholder={isPackagesLoading ? bookingCopy.loadingPackages : t('booking.chooseSafari')} /></SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {['excursion', 'jeep-safari', 'fly-in-safari'].map(cat => (
                          <div key={cat}>
                            <div className="px-2 py-2 text-[10px] font-bold uppercase text-safari tracking-widest bg-secondary/50">{t(`safaris.${cat}s`)}</div>
                            {safariPackages.filter(p => p.category === cat).map(p => <SelectItem key={p.id} value={String(p.id)}>{p.title} — {p.price}</SelectItem>)}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPackage && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-background border-l-2 border-[#C9A96E] p-6 rounded-r-2xl shadow-sm">
                      <p className="font-serif text-xl mb-1">{selectedPackage.title}</p>
                      <p className="text-sm text-safari font-medium mb-2">{selectedPackage.duration} · {selectedPackage.location}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedPackage.description}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{bookingCopy.adults}</label>
                      <Input name="adultsCount" type="number" min="1" placeholder={bookingCopy.adultsPlaceholder} value={formData.adultsCount} onChange={handleInputChange} className="h-14 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{bookingCopy.children}</label>
                      <Input name="childrenCount" type="number" min="0" placeholder={bookingCopy.childrenPlaceholder} value={formData.childrenCount} onChange={handleInputChange} className="h-14 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{bookingCopy.accommodation}</label>
                    <Select value={formData.accommodationPreference} onValueChange={(v) => handleSelectChange('accommodationPreference', v)}>
                      <SelectTrigger className="h-14 rounded-xl"><Hotel className="w-4 h-4 mr-2" /><SelectValue placeholder={bookingCopy.selectAccommodation} /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(bookingCopy.accommodationOptions).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{bookingCopy.specialRequests}</label>
                    <Textarea name="specialRequests" rows={4} placeholder={bookingCopy.requestsPlaceholder} value={formData.specialRequests} onChange={handleInputChange} className="rounded-2xl p-4 resize-none" />
                  </div>
                </div>
              </motion.div>

              {/* Submission Footer */}
              <div className="bg-[#2D4A3E] p-10 rounded-[2.5rem] text-center text-white">
                <p className="text-sm text-white/50 mb-6 uppercase tracking-widest">{t('booking.submitMethod')}</p>
                <Button 
                  type="submit" 
                  disabled={bookingRequestMutation.isPending || isPackagesLoading} 
                  className="btn-safari min-h-16 px-12 text-lg rounded-xl w-full md:w-auto shadow-xl"
                >
                  {bookingRequestMutation.isPending ? <LoaderIndicator label={bookingCopy.submitting} /> : <><Send className="mr-3" size={20} /> {bookingCopy.submitRequest}</>}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* ─── Footer Section ────────────────────────────────────────── */}
        <div className="bg-secondary/30 py-16 text-center">
          <div className="container mx-auto px-6">
            <div className="mx-auto mb-6 h-0.5 w-10 bg-[#C9A96E]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Need help?</p>
            <h2 className="font-serif text-3xl mb-8">Contact Our Concierge Team</h2>
            <div className="flex justify-center gap-6">
               <a href="https://wa.me/254742196613" className="flex items-center gap-2 text-safari hover:underline font-medium">
                 WhatsApp Support <ArrowRight size={16} />
               </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;