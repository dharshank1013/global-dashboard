import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Plane, Users, Map as MapIcon, TrendingUp, GraduationCap, Globe2, Award } from 'lucide-react';
import { useGoogleSheetData } from '../../hooks/useGoogleSheetData';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';

export const Statistics = () => {
  const { data: universities = [] } = useGoogleSheetData();
  const { isDarkMode } = useAppStore();
  const { t } = useTranslation();

  const metrics = useMemo(() => {
    let totalOutbound = 0;
    let totalInbound = 0;
    let outboundFaculty = 0;
    let inboundFaculty = 0;
    const countries = new Set<string>();

    const countryMap = new Map<string, number>();

    universities.forEach(uni => {
      totalOutbound += uni.outboundStudents;
      totalInbound += uni.inboundStudents;
      outboundFaculty += uni.outboundFaculty;
      inboundFaculty += uni.inboundFaculty;
      countries.add(uni.country);

      if (uni.outboundStudents > 0) {
        countryMap.set(uni.country, (countryMap.get(uni.country) || 0) + uni.outboundStudents);
      }
    });

    const popularCountries = Array.from(countryMap.entries())
      .map(([name, count]) => ({ name, Students: count }))
      .sort((a, b) => b.Students - a.Students)
      .slice(0, 7);

    const topUniversities = [...universities]
      .filter(u => u.outboundStudents > 0)
      .sort((a, b) => b.outboundStudents - a.outboundStudents)
      .slice(0, 5)
      .map(u => ({ name: u.name, Students: u.outboundStudents }));

    return {
      totalOutbound,
      totalInbound,
      totalFaculty: outboundFaculty + inboundFaculty,
      uniqueCountries: countries.size,
      popularCountries,
      topUniversities
    };
  }, [universities]);

  const pieData = [
    { name: t('statistics.outbound'), value: metrics.totalOutbound },
    { name: t('statistics.inbound'), value: metrics.totalInbound },
  ];

  const COLORS = ['#9C1C22', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'];
  const textColor = isDarkMode ? '#cbd5e1' : '#334155';
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#ffffff10' : '#00000010';
  const tooltipBg = isDarkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#1e293b' : '#e2e8f0';

  if (universities.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
        <TrendingUp className="w-12 h-12 animate-pulse text-brand-cyan" />
        <p className="text-xl font-medium tracking-wider animate-pulse">{t('statistics.loading')}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 lg:p-12 relative z-10">
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-[0_0_20px_rgba(100,255,218,0.2)]">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('statistics.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{t('statistics.subtitle')}</p>
          </div>
        </motion.div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Plane, label: t('statistics.studentsAbroad'), value: metrics.totalOutbound, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10' },
            { icon: Users, label: t('statistics.hosted'), value: metrics.totalInbound, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-400/10' },
            { icon: MapIcon, label: t('statistics.countries'), value: metrics.uniqueCountries, color: 'text-green-500 dark:text-green-400', bg: 'bg-green-500/10 dark:bg-green-400/10' },
            { icon: Users, label: t('statistics.faculty'), value: metrics.totalFaculty, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-400/10' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-center gap-6 group hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className={`p-4 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform shadow-lg`}>
                <kpi.icon size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{kpi.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Popular Countries Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 flex flex-col min-h-[400px]"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('statistics.topDestinations')}</h2>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.popularCountries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#ffffff05' : '#00000005' }}
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: textColor }}
                  />
                  <Bar dataKey="Students" fill="#9C1C22" radius={[6, 6, 0, 0]} barSize={40}>
                    {metrics.popularCountries.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Student Flow Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 flex flex-col min-h-[400px]"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('statistics.globalFlow')}</h2>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#9C1C22' : '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: textColor }}
                    itemStyle={{ color: textColor }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: textColor, fontSize: '14px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Universities List/Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 lg:col-span-2 min-h-[400px] flex flex-col"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('statistics.topChoices')}</h2>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.topUniversities} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} width={250} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#ffffff05' : '#00000005' }}
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: textColor }}
                  />
                  <Bar dataKey="Students" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={25}>
                    {metrics.topUniversities.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
