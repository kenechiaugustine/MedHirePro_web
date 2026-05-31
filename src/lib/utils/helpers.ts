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
