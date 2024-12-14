import { useEffect } from 'react';
import { getFontFamily } from '@/utils/fonts';

export const useFont = (font: string | undefined) => {
  useEffect(() => {
    if (font) {
      const fontFamily = getFontFamily(font);
      document.documentElement.style.setProperty('--font-primary', fontFamily);
    }
  }, [font]);
};