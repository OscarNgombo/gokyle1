import { ApiError } from '@/api/client';

const isValidationErrorItem = (value: unknown): value is { msg?: string } =>
  typeof value === 'object' && value !== null && 'msg' in value;

export const getApiErrorMessage = (error: unknown): string | null => {
  if (error instanceof ApiError) {
    const data = error.data;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object' && data !== null && 'detail' in data) {
      const detail = (data as { detail?: unknown }).detail;

      if (typeof detail === 'string') {
        return detail;
      }

      if (Array.isArray(detail)) {
        const messages = detail
          .filter(isValidationErrorItem)
          .map((item) => item.msg)
          .filter((message): message is string => Boolean(message));

        if (messages.length > 0) {
          return messages.join(' ');
        }
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return null;
};
