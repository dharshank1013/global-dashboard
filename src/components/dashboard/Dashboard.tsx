import { motion } from 'framer-motion';
import { Globe, Users, Plane, GraduationCap, ArrowRight, BookOpen, MapPin, Award, Building2, TrendingUp, FlaskConical, Sun, Briefcase } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const stats = [
  { icon: Users, label: 'Inbound Students', value: '350', color: 'text-blue-400' },
  { icon: Plane, label: 'Outbound Students', value: '400', color: 'text-brand-cyan' },
  { icon: Globe, label: 'Partner HEIs', value: '80', color: 'text-green-400' },
  { icon: GraduationCap, label: 'Programs Organized', value: '135', color: 'text-orange-400' },
];

export const Dashboard = () => {
  const { t } = useTranslation();

  const inboundPrograms = [
    {
      title: t('programs.semester'),
      desc: t('programs.semesterDesc'),
      icon: BookOpen,
    },
    {
      title: t('programs.summer'),
      desc: t('programs.summerDesc'),
      icon: MapPin,
    },
    {
      title: t('programs.internship'),
      desc: t('programs.internshipDesc'),
      icon: FlaskConical,
    }
  ];

  const outboundPrograms = [
    {
      title: t('programs.exchange'),
      desc: t('programs.exchangeDesc'),
    },
    {
      title: t('programs.semester'),
      desc: t('programs.semesterDesc'),
    },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 lg:p-12 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-brand-cyan text-sm font-bold mb-4 border border-brand-cyan/20">
            <Globe className="w-4 h-4" /> Global Engagement
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            {t('dashboard.heroTitle')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-400">
              {t('dashboard.heroHighlight')}
            </span>
          </h1>
          <p className="mt-6 text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
            {t('dashboard.heroDesc')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className={`p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/50 mb-4 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-3xl group-hover:bg-brand-cyan/20 transition-colors"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-brand-cyan/10 text-brand-cyan rounded-lg"><MapPin size={24} /></span>
              {t('dashboard.vision')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              {t('dashboard.visionDesc')}
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><TrendingUp size={24} /></span>
              {t('dashboard.mission')}
            </h2>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0"></span>
                <span>{t('dashboard.mission1')}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0"></span>
                <span>{t('dashboard.mission2')}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0"></span>
                <span>{t('dashboard.mission3')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Programs Section */}
        <div className="space-y-12">
          {/* Inbound */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard.inboundMobility')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {inboundPrograms.map((prog, i) => (
                <motion.div 
                  key={prog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 border-t border-blue-500/20"
                >
                  <prog.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{prog.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{prog.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Outbound */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-brand-cyan rounded-full"></div>
              <h2 className="text-3xl font-bold text-white">{t('dashboard.outboundMobility')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {outboundPrograms.map((prog, i) => (
                <motion.div 
                  key={prog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-8 bg-gradient-to-br from-white/80 dark:from-slate-900/80 to-white/40 dark:to-slate-800/40 border border-brand-cyan/20 group hover:border-brand-cyan/50 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-cyan transition-colors">{prog.title}</h3>
                  <p className="text-slate-300 leading-relaxed text-lg">{prog.desc}</p>
                  <button className="mt-6 flex items-center gap-2 text-brand-cyan font-bold text-sm uppercase tracking-wider hover:text-white transition-colors">
                    Explore Opportunities <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
