import { useAppStore } from '../store/useAppStore';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useAppStore();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }

    return value || key;
  };

  return { t, language };
};
