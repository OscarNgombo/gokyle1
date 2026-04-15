const DEFAULT_API_BASE_URL = 'https://backend-phi-beryl-11.vercel.app/';
const API_V1_PREFIX = '/api/v1';

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, '');

const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL);
const hasApiPrefix = configuredBaseUrl.endsWith(API_V1_PREFIX);

export const apiBaseUrl = hasApiPrefix
  ? configuredBaseUrl.slice(0, -API_V1_PREFIX.length)
  : configuredBaseUrl;

export const apiV1BaseUrl = hasApiPrefix ? configuredBaseUrl : `${configuredBaseUrl}${API_V1_PREFIX}`;

