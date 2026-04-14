import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MessageCircle, User, Phone, Calendar, Users, Send, Globe, Package, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { countries, findSafariPackage, getLocalizedSafariPackages } from '@/data/safariPackages';

interface PackageDetails {
  title: string;
  duration: string;
  location: string;
  price: string;
  highlights: string[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageDetails?: PackageDetails;
}

const BookingModal = ({ isOpen, onClose, packageDetails }: BookingModalProps) => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const localizedSafariPackages = useMemo(() => getLocalizedSafariPackages(language), [language]);
  const bookingCopy =
    language === 'de'
      ? {
          personalDetails: 'Persoenliche Daten',
          tripDetails: 'Reisedetails',
          nationality: 'Nationalitaet *',
          selectNationality: 'Nationalitaet auswaehlen',
          safariPackage: 'Safari-Paket *',
          adults: 'Anzahl Erwachsene',
          children: 'Anzahl Kinder',
          accommodation: 'Unterkunftswunsch',
          selectAccommodation: 'Unterkunftsart auswaehlen',
          specialRequests: 'Besondere Wuensche',
          fullNamePlaceholder: 'Ihr vollstaendiger Name',
          adultsPlaceholder: 'z. B. 2',
          childrenPlaceholder: 'z. B. 0',
          requestsPlaceholder: 'Besondere Anforderungen, Ernaehrungswuensche, bevorzugte Daten oder weitere Informationen...',
          openingEmail: 'E-Mail wird geoeffnet...',
          openingWhatsApp: 'WhatsApp wird geoeffnet...',
          accommodationOptions: {
            budget: 'Budget / Camping',
            'mid-range': 'Mittelklasse-Lodge',
            luxury: 'Luxus-Lodge / Zeltcamp',
            premium: 'Premium / 5-Sterne-Resort',
            flexible: 'Flexibel / Keine Praeferenz',
          },
        }
      : language === 'it'
        ? {
            personalDetails: 'Dati personali',
            tripDetails: 'Dettagli del viaggio',
            nationality: 'Nazionalita *',
            selectNationality: 'Seleziona la nazionalita',
            safariPackage: 'Pacchetto safari *',
            adults: 'Numero di adulti',
            children: 'Numero di bambini',
            accommodation: 'Preferenza di alloggio',
            selectAccommodation: 'Seleziona il tipo di alloggio',
            specialRequests: 'Richieste speciali',
            fullNamePlaceholder: 'Il tuo nome completo',
            adultsPlaceholder: 'es. 2',
            childrenPlaceholder: 'es. 0',
            requestsPlaceholder: 'Esigenze speciali, richieste alimentari, date preferite o informazioni aggiuntive...',
            openingEmail: 'Apertura email...',
            openingWhatsApp: 'Apertura WhatsApp...',
            accommodationOptions: {
              budget: 'Budget / Campeggio',
              'mid-range': 'Lodge di fascia media',
              luxury: 'Lodge di lusso / Campo tendato',
              premium: 'Premium / Resort 5 stelle',
              flexible: 'Flessibile / Nessuna preferenza',
            },
          }
        : {
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
            fullNamePlaceholder: 'Your full name',
            adultsPlaceholder: 'e.g. 2',
            childrenPlaceholder: 'e.g. 0',
            requestsPlaceholder: 'Any special requirements, dietary needs, preferred dates, or additional information...',
            openingEmail: 'Opening Email...',
            openingWhatsApp: 'Opening WhatsApp...',
            accommodationOptions: {
              budget: 'Budget / Camping',
              'mid-range': 'Mid-Range Lodge',
              luxury: 'Luxury Lodge / Tented Camp',
              premium: 'Premium / 5-Star Resort',
              flexible: 'Flexible / No Preference',
            },
          };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    selectedPackage: packageDetails?.title || '',
    adults: '',
    children: '',
    accommodation: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!packageDetails?.title) {
      return;
    }

    const matchedPackage = findSafariPackage(packageDetails.title, language);
    if (!matchedPackage) {
      return;
    }

    setFormData((prev) => ({ ...prev, selectedPackage: String(matchedPackage.id) }));
  }, [language, packageDetails?.title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: t('booking.nameRequired'), variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: t('booking.emailRequired'), variant: "destructive" });
      return false;
    }
    if (!formData.phone.trim()) {
      toast({ title: t('booking.phoneRequired'), variant: "destructive" });
      return false;
    }
    if (!formData.nationality) {
      toast({ title: t('booking.countryRequired'), variant: "destructive" });
      return false;
    }
    if (!formData.selectedPackage && !packageDetails) {
      toast({ title: t('booking.packageRequired'), variant: "destructive" });
      return false;
    }
    return true;
  };

  const getSelectedPackageDetails = () => {
    if (packageDetails) return packageDetails;
    return findSafariPackage(formData.selectedPackage, language);
  };

  const generateBookingMessage = () => {
    const pkgDetails = getSelectedPackageDetails();
    
    return `
${t('booking.bookingRequest')}
=====================

${bookingCopy.tripDetails.toUpperCase()}
------------
${t('booking.selectSafariPackage')}: ${pkgDetails?.title || formData.selectedPackage}
${t('booking.duration')}: ${pkgDetails?.duration || 'N/A'}
${t('booking.location')}: ${pkgDetails?.location || 'N/A'}
${t('booking.price')}: ${pkgDetails?.price || 'N/A'}
${bookingCopy.adults}: ${formData.adults || t('booking.notSpecified')}
${bookingCopy.children}: ${formData.children || '0'}
${bookingCopy.accommodation}: ${formData.accommodation || t('booking.notSpecified')}

${t('booking.customerDetails')}
----------------
${t('booking.fullName')}: ${formData.name}
${t('booking.emailAddress')}: ${formData.email}
${t('booking.phoneNumber')}: ${formData.phone}
${bookingCopy.nationality.replace(' *', '')}: ${formData.nationality}

${t('booking.additionalMessage')}:
${formData.specialRequests || t('booking.noMessage')}
    `.trim();
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const selectedPackage = getSelectedPackageDetails();
    const subject = encodeURIComponent(`${t('booking.bookingRequest')}: ${selectedPackage?.title || packageDetails?.title || formData.selectedPackage}`);
    const body = encodeURIComponent(generateBookingMessage());

    window.setTimeout(() => {
      window.location.href = `mailto:gokyletours@gmail.com?subject=${subject}&body=${body}`;

      toast({
        title: t('booking.emailOpened'),
        description: t('booking.emailOpenedDesc'),
      });

      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleWhatsAppBooking = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const message = encodeURIComponent(generateBookingMessage());
    window.setTimeout(() => {
      window.open(`https://wa.me/254742196613?text=${message}`, '_blank');

      toast({
        title: t('booking.whatsappOpened'),
        description: t('booking.whatsappOpenedDesc'),
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-card shadow-2xl z-50 overflow-hidden flex flex-col md:rounded-2xl"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 md:p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl mb-1">{t('booking.title')}</h2>
                  <p className="text-primary-foreground/80 text-sm">
                    {packageDetails?.title || t('booking.selectPackage')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
              {/* PERSONAL DETAILS */}
              <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-4 text-lg flex items-center gap-2">
                    <User size={18} className="text-safari" />
                    {bookingCopy.personalDetails}
                  </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="booking-modal-name" className="block text-sm font-medium text-foreground mb-1.5">{t('booking.fullName')} *</label>
                      <Input
                        id="booking-modal-name"
                        name="name"
                        placeholder={bookingCopy.fullNamePlaceholder}
                      value={formData.name}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                  <div>
                      <label htmlFor="booking-modal-email" className="block text-sm font-medium text-foreground mb-1.5">{t('booking.emailAddress')} *</label>
                      <Input
                        id="booking-modal-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      maxLength={255}
                    />
                  </div>
                  <div>
                      <label htmlFor="booking-modal-phone" className="block text-sm font-medium text-foreground mb-1.5">{t('booking.phoneNumber')} *</label>
                      <Input
                        id="booking-modal-phone"
                      name="phone"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={20}
                    />
                  </div>
                  <div>
                      <label htmlFor="booking-modal-nationality" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.nationality}</label>
                      <Select
                        value={formData.nationality}
                        onValueChange={(value) => handleSelectChange('nationality', value)}
                      >
                        <SelectTrigger id="booking-modal-nationality" className="w-full" aria-label={bookingCopy.nationality}>
                          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder={bookingCopy.selectNationality} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* TRIP DETAILS */}
              <div>
                  <h3 className="font-semibold text-foreground mb-4 text-lg flex items-center gap-2">
                    <Package size={18} className="text-safari" />
                    {bookingCopy.tripDetails}
                  </h3>
                
                {/* Package Selection */}
                {!packageDetails && (
                  <div className="mb-4">
                    <label htmlFor="booking-modal-package" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.safariPackage}</label>
                    <Select
                      value={formData.selectedPackage}
                      onValueChange={(value) => handleSelectChange('selectedPackage', value)}
                    >
                      <SelectTrigger id="booking-modal-package" className="w-full" aria-label={bookingCopy.safariPackage}>
                        <SelectValue placeholder={t('booking.chooseSafari')} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{t('safaris.dayExcursions')}</div>
                        {localizedSafariPackages.filter(p => p.category === 'excursion').map((pkg) => (
                          <SelectItem key={pkg.id} value={String(pkg.id)}>
                            {pkg.title} - {pkg.price}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">{t('safaris.jeepSafaris')}</div>
                        {localizedSafariPackages.filter(p => p.category === 'jeep-safari').map((pkg) => (
                          <SelectItem key={pkg.id} value={String(pkg.id)}>
                            {pkg.title} - {pkg.price}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">{t('safaris.flyInSafaris')}</div>
                        {localizedSafariPackages.filter(p => p.category === 'fly-in-safari').map((pkg) => (
                          <SelectItem key={pkg.id} value={String(pkg.id)}>
                            {pkg.title} - {pkg.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {packageDetails && (
                  <div className="bg-secondary/30 rounded-xl p-4 mb-4">
                    <p className="font-medium text-foreground">{packageDetails.title}</p>
                    <p className="text-sm text-muted-foreground">{packageDetails.duration} · {packageDetails.location} · {packageDetails.price}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-modal-adults" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.adults}</label>
                    <Input
                      id="booking-modal-adults"
                      name="adults"
                      type="number"
                      min="1"
                      placeholder={bookingCopy.adultsPlaceholder}
                      value={formData.adults}
                      onChange={handleInputChange}
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-modal-children" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.children}</label>
                    <Input
                      id="booking-modal-children"
                      name="children"
                      type="number"
                      min="0"
                      placeholder={bookingCopy.childrenPlaceholder}
                      value={formData.children}
                      onChange={handleInputChange}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="booking-modal-accommodation" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.accommodation}</label>
                  <Select
                    value={formData.accommodation}
                    onValueChange={(value) => handleSelectChange('accommodation', value)}
                  >
                    <SelectTrigger id="booking-modal-accommodation" className="w-full" aria-label={bookingCopy.accommodation}>
                      <Hotel className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder={bookingCopy.selectAccommodation} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">{bookingCopy.accommodationOptions.budget}</SelectItem>
                      <SelectItem value="mid-range">{bookingCopy.accommodationOptions['mid-range']}</SelectItem>
                      <SelectItem value="luxury">{bookingCopy.accommodationOptions.luxury}</SelectItem>
                      <SelectItem value="premium">{bookingCopy.accommodationOptions.premium}</SelectItem>
                      <SelectItem value="flexible">{bookingCopy.accommodationOptions.flexible}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4">
                  <label htmlFor="booking-modal-requests" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.specialRequests}</label>
                  <Textarea
                    id="booking-modal-requests"
                    name="specialRequests"
                    placeholder={bookingCopy.requestsPlaceholder}
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={1000}
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border p-4 md:p-6 bg-background flex-shrink-0">
              <p className="text-xs md:text-sm text-muted-foreground text-center mb-3">
                {t('booking.submitMethod')}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? <LoaderIndicator label={bookingCopy.openingEmail} /> : <Send size={18} />}
                  {isSubmitting ? t('booking.emailOpened') : t('booking.submitBooking')}
                </Button>
                <Button
                  onClick={handleWhatsAppBooking}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  {isSubmitting ? <LoaderIndicator label={bookingCopy.openingWhatsApp} /> : <MessageCircle size={18} />}
                  {isSubmitting ? t('booking.whatsappOpened') : t('booking.bookOnWhatsApp')}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
