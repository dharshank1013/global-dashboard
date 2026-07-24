import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe2 } from 'lucide-react';
import { useAppStore, type Language } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';

export const SettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen, language, setLanguage } = useAppStore();
  const { t } = useTranslation();

  if (!isSettingsOpen) return null;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSettingsOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md glass-panel p-8 shadow-2xl overflow-hidden"
        >
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-opacity bg-white/5 p-2 rounded-full"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-white">
            ⚙️ {t('settings.title')}
          </h2>

          <div className="space-y-6">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe2 className="text-brand-cyan" size={20} />
                <h3 className="font-semibold text-lg text-white">
                  {t('settings.language')}
                </h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                {t('settings.languageDesc')}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium
                      ${language === lang.code 
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_10px_rgba(156,28,34,0.2)]' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
