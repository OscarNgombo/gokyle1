import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Globe, Hotel, Package, Send, User } from 'lucide-react';
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
import PaymentMethods from '@/components/PaymentMethods';

const Booking = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedPackage = searchParams.get('package');
  const { data, isLoading: isPackagesLoading, isError: isPackagesError } = useSafariPackagesQuery({ locale: language });
  const bookingRequestMutation = useBookingRequestMutation();

  const bookingCopy =
    language === 'de'
      ? {
          intro: 'Tragen Sie unten Ihre Details ein und senden Sie Ihre Buchungsanfrage direkt an unser Team.',
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
          submitRequest: 'Buchungsanfrage senden',
          submitting: 'Anfrage wird gesendet...',
          fullNamePlaceholder: 'Ihr vollstaendiger Name',
          phonePlaceholder: '+1 234 567 8900',
          adultsPlaceholder: 'z. B. 2',
          childrenPlaceholder: 'z. B. 0',
          requestsPlaceholder: 'Besondere Anforderungen, Ernaehrungswuensche, bevorzugte Daten oder weitere Informationen...',
          requestReceived: 'Buchungsanfrage erhalten',
          requestReceivedDesc: 'Wir haben Ihre Anfrage erhalten und melden uns bald mit den naechsten Schritten.',
          requestFailed: 'Buchungsanfrage konnte nicht gesendet werden',
          requestFailedDesc: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt, falls das Problem bestehen bleibt.',
          loadingPackages: 'Safari-Pakete werden geladen...',
          packagesUnavailable: 'Safari-Pakete sind derzeit nicht verfuegbar.',
          packagesUnavailableDesc: 'Bitte laden Sie die Seite neu oder kontaktieren Sie uns direkt fuer Unterstuetzung.',
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
            intro: 'Inserisci i tuoi dati qui sotto e invia la richiesta di prenotazione direttamente al nostro team.',
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
            submitRequest: 'Invia richiesta di prenotazione',
            submitting: 'Invio in corso...',
            fullNamePlaceholder: 'Il tuo nome completo',
            phonePlaceholder: '+1 234 567 8900',
            adultsPlaceholder: 'es. 2',
            childrenPlaceholder: 'es. 0',
            requestsPlaceholder: 'Esigenze speciali, richieste alimentari, date preferite o informazioni aggiuntive...',
            requestReceived: 'Richiesta di prenotazione ricevuta',
            requestReceivedDesc: 'Abbiamo ricevuto la tua richiesta e ti contatteremo presto con i prossimi passi.',
            requestFailed: 'Impossibile inviare la richiesta di prenotazione',
            requestFailedDesc: 'Riprova oppure contattaci direttamente se il problema continua.',
            loadingPackages: 'Caricamento dei pacchetti safari...',
            packagesUnavailable: 'I pacchetti safari non sono al momento disponibili.',
            packagesUnavailableDesc: 'Ricarica la pagina oppure contattaci direttamente per assistenza.',
            accommodationOptions: {
              budget: 'Budget / Campeggio',
              'mid-range': 'Lodge di fascia media',
              luxury: 'Lodge di lusso / Campo tendato',
              premium: 'Premium / Resort 5 stelle',
              flexible: 'Flessibile / Nessuna preferenza',
            },
          }
        : {
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
            requestsPlaceholder: 'Any special requirements, dietary needs, preferred dates, or additional information...',
            requestReceived: 'Booking request received',
            requestReceivedDesc: 'We have your request and will get back to you soon with the next steps.',
            requestFailed: 'We could not send your booking request',
            requestFailedDesc: 'Please try again or contact us directly if the problem continues.',
            loadingPackages: 'Loading safari packages...',
            packagesUnavailable: 'Safari packages are currently unavailable.',
            packagesUnavailableDesc: 'Please refresh the page or contact us directly for assistance.',
            accommodationOptions: {
              budget: 'Budget / Camping',
              'mid-range': 'Mid-Range Lodge',
              luxury: 'Luxury Lodge / Tented Camp',
              premium: 'Premium / 5-Star Resort',
              flexible: 'Flexible / No Preference',
            },
          };

  const safariPackages = data?.items ?? [];
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
    if (!matchedPackage) {
      return;
    }

    setFormData((prev) => ({ ...prev, packageId: String(matchedPackage.id) }));
  }, [preselectedPackage, safariPackages]);

  const selectedPackage = useMemo(
    () => safariPackages.find((pkg) => String(pkg.id) === formData.packageId) ?? null,
    [formData.packageId, safariPackages],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast({ title: t('booking.nameRequired'), variant: 'destructive' });
      return false;
    }
    if (!formData.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      toast({ title: t('booking.emailRequired'), variant: 'destructive' });
      return false;
    }
    if (!formData.customerPhone.trim()) {
      toast({ title: t('booking.phoneRequired'), variant: 'destructive' });
      return false;
    }
    if (!formData.customerNationality) {
      toast({ title: t('booking.countryRequired'), variant: 'destructive' });
      return false;
    }
    if (!formData.packageId) {
      toast({ title: t('booking.packageRequired'), variant: 'destructive' });
      return false;
    }
    return true;
  };

  const toOptionalInteger = (value: string, fallback: number | null = null) => {
    if (!value.trim()) {
      return fallback;
    }

    const parsedValue = Number.parseInt(value, 10);
    return Number.isNaN(parsedValue) ? fallback : parsedValue;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await bookingRequestMutation.mutateAsync({
        locale: language,
        packageId: Number.parseInt(formData.packageId, 10),
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerNationality: formData.customerNationality,
        adultsCount: toOptionalInteger(formData.adultsCount),
        childrenCount: toOptionalInteger(formData.childrenCount, 0),
        accommodationPreference: formData.accommodationPreference || null,
        specialRequests: formData.specialRequests.trim() || null,
      });

      toast({
        title: bookingCopy.requestReceived,
        description: selectedPackage
          ? `${selectedPackage.title} — ${bookingCopy.requestReceivedDesc}`
          : bookingCopy.requestReceivedDesc,
      });
    } catch (error) {
      toast({
        title: bookingCopy.requestFailed,
        description: getApiErrorMessage(error) || bookingCopy.requestFailedDesc,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section className="bg-primary text-primary-foreground py-20 pt-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-3">{t('booking.title')}</h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">{bookingCopy.intro}</p>
        </div>
      </section>

      <main id="main-content">
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
                  <User size={22} className="text-safari" />
                  {bookingCopy.personalDetails}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="booking-name" className="block text-sm font-medium text-foreground mb-1.5">{t('booking.fullName')} *</label>
                    <Input id="booking-name" name="customerName" placeholder={bookingCopy.fullNamePlaceholder} value={formData.customerName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="block text-sm font-medium text-foreground mb-1.5">{t('booking.emailAddress')} *</label>
                    <Input id="booking-email" name="customerEmail" type="email" placeholder="your@email.com" value={formData.customerEmail} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="block text-sm font-medium text-foreground mb-1.5">{t('booking.phoneNumber')} *</label>
                    <Input id="booking-phone" name="customerPhone" placeholder={bookingCopy.phonePlaceholder} value={formData.customerPhone} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="booking-nationality" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.nationality}</label>
                    <Select value={formData.customerNationality} onValueChange={(value) => handleSelectChange('customerNationality', value)}>
                      <SelectTrigger id="booking-nationality" className="w-full" aria-label={bookingCopy.nationality}>
                        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder={bookingCopy.selectNationality} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
                  <Package size={22} className="text-safari" />
                  {bookingCopy.tripDetails}
                </h2>

                <div className="mb-5">
                  <label htmlFor="booking-package" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.safariPackage}</label>
                  <Select
                    value={formData.packageId}
                    onValueChange={(value) => handleSelectChange('packageId', value)}
                    disabled={isPackagesLoading || isPackagesError}
                  >
                    <SelectTrigger id="booking-package" className="w-full" aria-label={bookingCopy.safariPackage}>
                      <SelectValue placeholder={isPackagesLoading ? bookingCopy.loadingPackages : t('booking.chooseSafari')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{t('safaris.dayExcursions')}</div>
                      {safariPackages.filter((pkg) => pkg.category === 'excursion').map((pkg) => (
                        <SelectItem key={pkg.id} value={String(pkg.id)}>{pkg.title} - {pkg.price}</SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">{t('safaris.jeepSafaris')}</div>
                      {safariPackages.filter((pkg) => pkg.category === 'jeep-safari').map((pkg) => (
                        <SelectItem key={pkg.id} value={String(pkg.id)}>{pkg.title} - {pkg.price}</SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">{t('safaris.flyInSafaris')}</div>
                      {safariPackages.filter((pkg) => pkg.category === 'fly-in-safari').map((pkg) => (
                        <SelectItem key={pkg.id} value={String(pkg.id)}>{pkg.title} - {pkg.price}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isPackagesLoading && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-4 mb-5 text-sm text-muted-foreground">
                    <LoaderIndicator size={28} label={bookingCopy.loadingPackages} />
                    <span>{bookingCopy.loadingPackages}</span>
                  </div>
                )}

                {isPackagesError && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 mb-5">
                    <p className="font-medium text-foreground">{bookingCopy.packagesUnavailable}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{bookingCopy.packagesUnavailableDesc}</p>
                  </div>
                )}

                {selectedPackage && (
                  <div className="bg-secondary/30 rounded-xl p-4 mb-5">
                    <p className="font-medium text-foreground">{selectedPackage.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedPackage.duration} · {selectedPackage.location} · {selectedPackage.price}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{selectedPackage.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="booking-adults" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.adults}</label>
                    <Input id="booking-adults" name="adultsCount" type="number" min="1" placeholder={bookingCopy.adultsPlaceholder} value={formData.adultsCount} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="booking-children" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.children}</label>
                    <Input id="booking-children" name="childrenCount" type="number" min="0" placeholder={bookingCopy.childrenPlaceholder} value={formData.childrenCount} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="booking-accommodation" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.accommodation}</label>
                  <Select value={formData.accommodationPreference} onValueChange={(value) => handleSelectChange('accommodationPreference', value)}>
                    <SelectTrigger id="booking-accommodation" className="w-full" aria-label={bookingCopy.accommodation}>
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

                <div className="mt-5">
                  <label htmlFor="booking-requests" className="block text-sm font-medium text-foreground mb-1.5">{bookingCopy.specialRequests}</label>
                  <Textarea
                    id="booking-requests"
                    name="specialRequests"
                    placeholder={bookingCopy.requestsPlaceholder}
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <p className="text-sm text-muted-foreground text-center mb-6">{t('booking.submitMethod')}</p>
                <Button
                  type="submit"
                  disabled={bookingRequestMutation.isPending || isPackagesLoading || isPackagesError}
                  aria-busy={bookingRequestMutation.isPending}
                  className="w-full h-14 text-base btn-safari"
                >
                  {bookingRequestMutation.isPending ? <LoaderIndicator label={bookingCopy.submitting} /> : <Send size={20} />}
                  {bookingRequestMutation.isPending ? bookingCopy.submitting : bookingCopy.submitRequest}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Booking;
