import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export const useWebScroll = () => {
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && scrollRef.current) {
      // Forzar scroll en web
      const element = scrollRef.current;
      if (element && element.scrollTo) {
        // Habilitar scroll nativo del navegador
        element.style.overflowY = 'auto';
        element.style.height = '100vh';
      }
    }
  }, []);

  return scrollRef;
};
