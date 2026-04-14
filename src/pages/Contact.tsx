import { type FormEvent, type ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PaymentMethods from '@/components/PaymentMethods';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import PageSection from '@/components/layout/PageSection';
import PageHero from '@/components/sections/PageHero';
import SectionHeader from '@/components/sections/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContactInquiryMutation } from '@/api/queries';
import { getApiErrorMessage } from '@/api/errors';
import hero3 from '@/assets/strip-12.jpeg';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const contactInquiryMutation = useContactInquiryMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await contactInquiryMutation.mutateAsync({
        locale: language,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim() || null,
        message: formData.message.trim(),
      });

      toast({
        title: t('contact.messageSent'),
        description: t('contact.messageSentDesc'),
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: t('contact.messageFailed'),
        description: getApiErrorMessage(error) || t('contact.messageFailedDesc'),
        variant: 'destructive',
      });
    }
  };

  const contactMethods: Array<{ icon: typeof Phone; title: string; content: ReactNode }> = [
    {
      icon: Phone,
      title: t('contact.phoneWhatsApp'),
      content: (
        <a href="tel:+254742196613" className="text-muted-foreground hover:text-safari transition-colors">
          +254 742 196 613
        </a>
      ),
    },
    {
      icon: Mail,
      title: t('contact.email'),
      content: (
        <a href="mailto:gokyletours@gmail.com" className="text-muted-foreground hover:text-safari transition-colors">
          gokyletours@gmail.com
        </a>
      ),
    },
    {
      icon: MapPin,
      title: t('contact.location'),
      content: (
        <p className="text-muted-foreground">
          Diani Beach, Beach Road
          <br />
          Kwale District, Kenya
        </p>
      ),
    },
    {
      icon: Clock,
      title: t('contact.businessHours'),
      content: (
        <p className="text-muted-foreground">
          {t('contact.mondaySaturday')}
          <br />
          {t('contact.sunday')}
        </p>
      ),
    },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', label: 'Facebook', icon: <Facebook className="w-5 h-5" /> },
    { href: 'https://instagram.com', label: 'Instagram', icon: <Instagram className="w-5 h-5" /> },
    {
      href: 'https://tiktok.com',
      label: 'TikTok',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <PageHero
        title={t('contact.heroTitle')}
        tagline={t('contact.heroTagline')}
        subtitle={t('contact.heroSubtitle')}
        backgroundImage={hero3}
        overlayClassName="bg-gradient-to-r from-primary/80 to-primary/40"
        heightClassName="h-[50vh] min-h-[400px]"
        align="left"
      />

      <PageSection backgroundClassName="bg-background">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl text-foreground mb-6">{t('contact.planSafari')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('contact.planSafariDesc')}</p>
            </div>

            <div className="space-y-6">
              {contactMethods.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-safari/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-safari" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4">{t('contact.followUs')}</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-12 h-12 rounded-lg bg-safari/10 flex items-center justify-center hover:bg-safari hover:text-white transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/254742196613"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('contact.chatWhatsApp')}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
              <h3 className="font-serif text-2xl text-foreground mb-8">{t('contact.sendMessage')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('contact.fullName')} *</label>
                    <Input
                      required
                      placeholder={t('contact.yourName')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('contact.emailAddress')} *</label>
                    <Input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('contact.phoneNumber')}</label>
                    <Input
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('contact.subject')}</label>
                    <Input
                      placeholder={t('contact.safariInquiry')}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('contact.yourMessage')} *</label>
                  <Textarea
                    required
                    minLength={10}
                    placeholder={t('contact.dreamSafari')}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={contactInquiryMutation.isPending} className="btn-safari w-full md:w-auto min-h-14">
                  {contactInquiryMutation.isPending ? <LoaderIndicator label={t('contact.sending')} /> : <Send className="w-4 h-4" />}
                  {contactInquiryMutation.isPending ? t('contact.sending') : t('contact.send')}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </PageSection>

      <PageSection backgroundClassName="bg-secondary/30">
        <SectionHeader
          tagline={t('contact.findUs')}
          title={t('contact.ourLocation')}
          subtitle={t('contact.locationDesc')}
        />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31885.70285892073!2d39.55761131083984!3d-4.318635099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18403a2b59b34abd%3A0x8a0a2c9fba3e5f6b!2sDiani%20Beach%2C%20Kenya!5e0!3m2!1sen!2sus!4v1706527200000!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Gokyle Tours Location - Diani Beach, Kenya"
            className="w-full"
          />
        </motion.div>
      </PageSection>

      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default Contact;
