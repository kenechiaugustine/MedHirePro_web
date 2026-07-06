type StorageKey = string;

export const setTokenItem = async <T = string>(key: StorageKey, value: T): Promise<void> => {
  const storedValue = typeof value === 'string' ? value : JSON.stringify(value);
  await localStorage.setItem(key, storedValue);
};

export const getTokenItem = async <T = string>(key: StorageKey): Promise<T | undefined> => {
  const value = await localStorage.getItem(key);
  if (value === null) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export const clearTokenItem = async (key: StorageKey): Promise<void> => {
  await localStorage.removeItem(key);
};

export const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const TOKEN_KEY = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ROLE: 'userRole',
} as const;

export const getErrorMessage = (err: unknown, fallback = 'An error occurred. Please try again.'): string => {
  if (!err || typeof err !== 'object') return fallback;

  const errorObj = err as Record<string, unknown>;

  // Handle RTK Query / fetch error structure
  if ('data' in errorObj && errorObj.data && typeof errorObj.data === 'object') {
    const data = errorObj.data as Record<string, unknown>;

    // 1. FastAPI/Pydantic style detail field
    if ('detail' in data && data.detail) {
      const detail = data.detail;
      if (typeof detail === 'string') {
        return detail;
      }
      if (Array.isArray(detail)) {
        const messages = detail
          .map((d) => {
            if (d && typeof d === 'object' && 'msg' in d && typeof d.msg === 'string') {
              return d.msg;
            }
            return null;
          })
          .filter((msg): msg is string => !!msg);
        if (messages.length > 0) {
          return messages.join(', ');
        }
      }
    }

    // 2. Generic message or error field inside data
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }
    if ('error' in data && typeof data.error === 'string') {
      return data.error;
    }
  }

  // 3. Top-level error/message fields
  if ('message' in errorObj && typeof errorObj.message === 'string') {
    return errorObj.message;
  }
  if ('error' in errorObj && typeof errorObj.error === 'string') {
    return errorObj.error;
  }

  return fallback;
};
