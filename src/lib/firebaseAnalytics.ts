import { getAnalytics, isSupported, logEvent, setUserProperties, type Analytics } from 'firebase/analytics';
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseConfigKeys: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
  'messagingSenderId',
  'measurementId',
];

let analyticsPromise: Promise<Analytics | null> | null = null;
let hasWarnedAboutIncompleteConfig = false;

const getConfiguredFirebaseOptions = (): FirebaseOptions | null => {
  const hasAnyConfiguredValue = requiredFirebaseConfigKeys.some((key) => Boolean(firebaseConfig[key]));
  if (!hasAnyConfiguredValue) {
    return null;
  }

  const missingKeys = requiredFirebaseConfigKeys.filter((key) => !firebaseConfig[key]);
  if (missingKeys.length > 0) {
    if (!hasWarnedAboutIncompleteConfig && typeof window !== 'undefined') {
      hasWarnedAboutIncompleteConfig = true;
      console.warn(
        `Firebase Analytics is disabled because these Vite env vars are missing: ${missingKeys.join(', ')}`,
      );
    }
    return null;
  }

  return firebaseConfig;
};

const getAnalyticsInstance = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  analyticsPromise ??= (async () => {
    const configuredOptions = getConfiguredFirebaseOptions();
    if (!configuredOptions) {
      return null;
    }

    if (!(await isSupported())) {
      return null;
    }

    const app = getApps()[0] ?? initializeApp(configuredOptions);
    return getAnalytics(app);
  })();

  return analyticsPromise;
};

export const syncAnalyticsLanguage = async (language: string) => {
  const analytics = await getAnalyticsInstance();
  if (!analytics) {
    return;
  }

  setUserProperties(analytics, { language });
};

export const trackPageView = async (path: string, language: string) => {
  const analytics = await getAnalyticsInstance();
  if (!analytics || typeof window === 'undefined') {
    return;
  }

  logEvent(analytics, 'page_view', {
    language,
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
};
