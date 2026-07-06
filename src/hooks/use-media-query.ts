import { useSyncExternalStore } from 'react';

export function useMediaQuery() {
  const isOpen = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => undefined;
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false),
    () => false
  );
  return { isOpen };
}
