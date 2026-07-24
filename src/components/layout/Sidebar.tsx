import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, LayoutDashboard, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSettingsOpen } = useAppStore();
  const { t } = useTranslation();

  const menuItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/dashboard' },
    { icon: Globe, label: t('sidebar.worldMap'), path: '/map' },
    { icon: BarChart3, label: t('sidebar.statistics'), path: '/statistics' },
  ];

  const bottomItems = [
    { icon: Settings, label: t('sidebar.settings'), action: 'settings' },
  ];

  const renderItem = (item: any, index: number, isBottom = false) => {
    const isActive = !isBottom && location.pathname === item.path;
    return (
      <motion.button
        key={item.label}
        onClick={() => {
          if (item.action === 'settings') {
            setIsSettingsOpen(true);
          } else if (item.path) {
            navigate(item.path);
          }
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.05 }}
        className={cn(
          "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 w-full group",
          isActive 
            ? "bg-brand-cyan/10 text-brand-cyan shadow-[0_0_15px_rgba(156,28,34,0.1)]" 
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
        )}
        title={!isOpen ? item.label : undefined}
      >
        <item.icon size={22} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-brand-cyan" : "group-hover:text-slate-900 dark:group-hover:text-white")} />
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-nowrap font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </motion.button>
    );
  };

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isOpen ? 256 : 80 }}
      className="h-screen bg-white/60 dark:bg-brand-light-blue/40 backdrop-blur-md border-r border-slate-200 dark:border-white/10 flex flex-col relative shrink-0 z-20"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-brand-cyan text-white rounded-full p-1 z-30 shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="p-6 flex items-center justify-center border-b border-slate-200 dark:border-white/5 h-20">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlziv_nmvJyWIDNuPYpMPNBQaFjq1xj_pLLN2PEMrClg&s=10" alt="Karunya Logo" className="w-full h-full object-cover" />
        </div>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 font-semibold text-slate-900 dark:text-white tracking-wide text-xs leading-tight"
          >
            Karunya Institute of Technology and Sciences
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
        {menuItems.map((item, i) => renderItem(item, i))}
        
        <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-slate-200 dark:border-white/5">
          {bottomItems.map((item, i) => renderItem(item, i, true))}
        </div>
      </nav>
    </motion.aside>
  );
};
