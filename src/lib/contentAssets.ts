import {
  Award,
  Car,
  Clock,
  Compass,
  Heart,
  Hotel,
  Map,
  Plane,
  Shield,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import antelope from '@/assets/antelope.jpeg';
import beach from '@/assets/beach.jpeg';
import elephant from '@/assets/elephant.jpeg';
import flamingo from '@/assets/flamingo.jpeg';
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
import strip14 from '@/assets/strip-14.jpeg';
import wildbeast from '@/assets/wildbeast.jpeg';
import zebra from '@/assets/zebra.jpeg';

const contentImages: Record<string, string> = {
  antelope,
  beach,
  elephant,
  flamingo,
  wildbeast,
  zebra,
  'strip-1': strip1,
  'strip-2': strip2,
  'strip-3': strip3,
  'strip-4': strip4,
  'strip-5': strip5,
  'strip-6': strip6,
  'strip-7': strip7,
  'strip-8': strip8,
  'strip-9': strip9,
  'strip-10': strip10,
  'strip-11': strip11,
  'strip-12': strip12,
  'strip-14': strip14,
};

const contentIcons: Record<string, LucideIcon> = {
  award: Award,
  car: Car,
  clock: Clock,
  compass: Compass,
  heart: Heart,
  hotel: Hotel,
  map: Map,
  plane: Plane,
  shield: Shield,
  'shield-check': ShieldCheck,
  users: Users,
};

export const getContentImage = (imageKey: string, fallback = strip14) => contentImages[imageKey] || fallback;

export const getContentIcon = (iconKey: string, fallback: LucideIcon = Map) => contentIcons[iconKey] || fallback;
