import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, MapPin, TrendingUp, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';

export const MarkerPanel = () => {
  const { selectedUniversity, setSelectedUniversity, language } = useAppStore();
  const { t } = useTranslation();

  if (!selectedUniversity) return null;

  const chartData = [
    { name: 'Students', Inbound: selectedUniversity.inboundStudents, Outbound: selectedUniversity.outboundStudents },
    { name: 'Faculty', Inbound: selectedUniversity.inboundFaculty, Outbound: selectedUniversity.outboundFaculty },
  ];

  // Hardcode dark mode tooltip colors since we enforce dark mode now
  const tooltipBg = '#0f172a';
  const tooltipBorder = '#1e293b';
  const textColor = '#cbd5e1';
  const cursorFill = 'rgba(255,255,255,0.05)';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="absolute top-0 right-0 w-[400px] h-full bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col z-50 overflow-hidden"
      >
        <button
          onClick={() => setSelectedUniversity(null)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors self-end group"
        >
          <X className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" size={20} />
        </button>

        <div className="flex flex-col items-center mt-6 mb-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-xl ring-1 ring-slate-200 dark:ring-white/10">
            <img src={selectedUniversity.logoUrl} alt={selectedUniversity.name} className="max-w-full max-h-full object-contain" />
          </div>
          <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(selectedUniversity.name + ' official website')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 group mt-4"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {selectedUniversity.name}
            </h2>
            <ExternalLink size={18} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <div className="flex items-center gap-2 mt-2 text-brand-cyan">
            <MapPin size={16} />
            <span className="text-sm text-slate-500 dark:text-slate-400">{selectedUniversity.country}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 px-8">
          <StatCard label={t('header.inbound') + " Faculty"} value={selectedUniversity.inboundFaculty} icon={<Users size={16} />} color="text-emerald-500" bg="bg-slate-50 dark:bg-emerald-500/10" />
          <StatCard label={t('header.outbound') + " Faculty"} value={selectedUniversity.outboundFaculty} icon={<Users size={16} />} color="text-blue-500" bg="bg-slate-50 dark:bg-blue-500/10" />
          <StatCard label={t('header.inbound') + " Students"} value={selectedUniversity.inboundStudents} icon={<GraduationCap size={16} />} color="text-emerald-500" bg="bg-slate-50 dark:bg-emerald-500/10" />
          <StatCard label={t('header.outbound') + " Students"} value={selectedUniversity.outboundStudents} icon={<GraduationCap size={16} />} color="text-amber-500" bg="bg-slate-50 dark:bg-amber-500/10" />
        </div>

        <div className="mb-6 px-8">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-cyan" /> {t('marker.overview')}
          </h3>
          <div className="h-48 bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-200 dark:border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: cursorFill }} 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: textColor }}
                />
                <Bar dataKey="Inbound" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Outbound" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const StatCard = ({ label, value, icon, color, bg }: { label: string, value: number, icon: React.ReactNode, color: string, bg: string }) => (
  <div className={`${bg} rounded-xl p-4 flex flex-col items-center text-center border border-slate-200 dark:border-white/5 transition-colors`}>
    <div className={`p-2 rounded-full bg-white dark:bg-black/20 mb-2 ${color}`}>
      {icon}
    </div>
    <span className="text-xl font-bold text-slate-900 dark:text-white">
      <AnimatedCounter value={value} />
    </span>
    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</span>
  </div>
);
