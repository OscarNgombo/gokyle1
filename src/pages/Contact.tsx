import { type FormEvent, type ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoaderIndicator from '@/components/common/LoaderIndicator';
import PageSection from '@/components/layout/PageSection';
import SectionHeader from '@/components/sections/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContactInquiryMutation } from '@/api/queries';
import { getApiErrorMessage } from '@/api/errors';
import heroImage from '@/assets/strip-12.jpeg';
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

      toast({ title: t('contact.messageSent'), description: t('contact.messageSentDesc') });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: t('contact.messageFailed'),
        description: getApiErrorMessage(error) || t('contact.messageFailedDesc'),
        variant: 'destructive',
      });
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: t('contact.phoneWhatsApp'),
      tagline: "Direct Line",
      content: <a href="tel:+254742196613" className="hover:text-safari transition-colors">+254 742 196 613</a>,
    },
    {
      icon: Mail,
      title: t('contact.email'),
      tagline: "Digital Inquiry",
      content: <a href="mailto:gokyletours@gmail.com" className="hover:text-safari transition-colors">gokyletours@gmail.com</a>,
    },
    {
      icon: MapPin,
      title: t('contact.location'),
      tagline: "Visit Us",
      content: <p>Diani Beach, Beach Road, Kenya</p>,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        {/* ─── Immersive Hero ────────────────────────────────────────── */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <motion.img
            src={heroImage}
            alt="Contact Gokyle Tours"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end pb-16 pl-8 md:pl-16 lg:pl-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {t('contact.heroTagline')}
              </p>
              <div className="mb-4 h-0.5 w-10 bg-[#C9A96E]" />
              <h1 className="mb-4 font-serif text-5xl text-white md:text-6xl lg:text-7xl">
                {t('contact.heroTitle')}
              </h1>
              <p className="max-w-xl text-lg text-white/90 leading-relaxed">
                {t('contact.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ─── Contact Information & Form ───────────────────────────── */}
        <PageSection backgroundClassName="bg-background">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Sidebar Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="lg:col-span-4 space-y-12"
            >
              <div>
                <h2 className="font-serif text-4xl text-foreground mb-6">{t('contact.planSafari')}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{t('contact.planSafariDesc')}</p>
              </div>

              <div className="space-y-10">
                {contactMethods.map((item) => (
                  <div key={item.title} className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#C4704F]" />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-safari/60">
                        {item.tagline}
                      </p>
                    </div>
                    <h4 className="font-serif text-xl text-foreground mb-2">{item.title}</h4>
                    <div className="text-muted-foreground transition-colors group-hover:text-foreground">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Connect with us</p>
                <div className="flex gap-4">
                  <a href="https://wa.me/254742196613" target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all">
                    <Send size={20} />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-safari hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-safari hover:text-white transition-all">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form Container */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="lg:col-span-8"
            >
              <div className="bg-card border border-border rounded-[2rem] p-8 md:p-14 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-safari/5 rounded-bl-full -mr-10 -mt-10" />
                
                <h3 className="font-serif text-3xl text-foreground mb-10">{t('contact.sendMessage')}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('contact.fullName')} *</label>
                      <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl border-border bg-background focus:ring-safari/20 h-14" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('contact.emailAddress')} *</label>
                      <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-xl border-border bg-background focus:ring-safari/20 h-14" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('contact.phoneNumber')}</label>
                      <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="rounded-xl border-border bg-background focus:ring-safari/20 h-14" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('contact.subject')}</label>
                      <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="rounded-xl border-border bg-background focus:ring-safari/20 h-14" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{t('contact.yourMessage')} *</label>
                    <Textarea required minLength={10} rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="rounded-xl border-border bg-background focus:ring-safari/20 resize-none p-4" />
                  </div>

                  <Button type="submit" disabled={contactInquiryMutation.isPending} className="btn-safari min-h-16 px-12 text-lg rounded-xl w-full md:w-auto">
                    {contactInquiryMutation.isPending ? <LoaderIndicator label={t('contact.sending')} /> : <><Send className="mr-2 h-5 w-5" /> {t('contact.send')}</>}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </PageSection>

        {/* ─── Map Section ──────────────────────────────────────────── */}
        <PageSection backgroundClassName="bg-secondary/50">
          <SectionHeader
            tagline={t('contact.findUs')}
            title={t('contact.ourLocation')}
            subtitle={t('contact.locationDesc')}
            className="mb-16"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31885.70285892073!2d39.55761131083984!3d-4.318635099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18403a2b59b34abd%3A0x8a0a2c9fba3e5f6b!2sDiani%20Beach%2C%20Kenya!5e0!3m2!1sen!2sus!4v1706527200000!5m2!1sen!2sus"
              width="100%" height="500" style={{ border: 0 }} allowFullScreen loading="lazy" title="Gokyle Tours Location"
            />
          </motion.div>
        </PageSection>

        {/* ─── Footer Transition ────────────────────────────────────── */}
        <div className="bg-[#2D4A3E] py-16 text-center">
          <div className="mx-auto mb-6 h-0.5 w-10 bg-[#C9A96E]" />
          <h2 className="font-serif text-3xl text-white mb-8">{t('contact.chatWhatsApp')}</h2>
          <a href="https://wa.me/254742196613" className="btn-safari inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] hover:bg-[#128C7E] border-none">
            Join the Conversation <ArrowRight size={20} />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;