import { Search, MapPin, Globe2, Users, GraduationCap, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useGoogleSheetData } from '../../hooks/useGoogleSheetData';
import { useTranslation } from '../../hooks/useTranslation';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export const Header = () => {
  const { searchTerm, setSearchTerm, setSelectedUniversity } = useAppStore();
  const { data: universities } = useGoogleSheetData();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUniversities = universities?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.country.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSelect = (uni: any) => {
    setSelectedUniversity(uni);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const stats = {
    totalPartners: universities?.length || 0,
    totalInbound: universities?.reduce((acc, u) => acc + u.inboundStudents, 0) || 0,
    totalOutbound: universities?.reduce((acc, u) => acc + u.outboundStudents, 0) || 0,
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-brand-light-blue/20 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
          {t('header.title')}
        </h1>
        <p className="text-xs text-brand-cyan font-medium hidden sm:block">
          {t('header.subtitle')}
        </p>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 mr-4">
          <StatBadge label={t('header.totalPartners')} value={stats.totalPartners} />
          <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
          <StatBadge label={t('header.inbound')} value={stats.totalInbound} color="text-exchange-inbound" />
          <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
          <StatBadge label={t('header.outbound')} value={stats.totalOutbound} color="text-exchange-outbound" />
        </div>

        <div className="relative z-50" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder={t('header.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            className="w-64 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan transition-all shadow-inner"
          />

          <AnimatePresence>
            {searchTerm && isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[var(--glass-panel-bg)] border border-slate-200 dark:border-white/10 shadow-2xl z-50 rounded-xl py-2 custom-scrollbar backdrop-blur-xl"
              >
                {filteredUniversities.map((uni) => (
                  <button
                    key={uni.sNo}
                    onClick={() => handleSelect(uni)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center gap-3 group border-b border-slate-100 dark:border-white/5 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-cyan/10 dark:group-hover:bg-brand-cyan/20 transition-colors">
                      <MapPin size={14} className="text-brand-cyan" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{uni.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{uni.country}</p>
                    </div>
                  </button>
                ))}
                {filteredUniversities.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <Building2 className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('header.noResults')}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const StatBadge = ({ label, value, color = "text-slate-900 dark:text-white" }: { label: string, value: number, color?: string }) => (
  <div className="flex flex-col items-end">
    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</span>
    <span className={`font-bold text-xl leading-none mt-1 ${color}`}>
      <AnimatedCounter value={value} />
    </span>
  </div>
);
