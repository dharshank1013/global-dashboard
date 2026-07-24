import { motion } from 'framer-motion';

export const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex items-center justify-center p-8"
    >
      <div className="glass-panel p-12 text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-slate-400">
          This section is currently under development. Please check back later or return to the World Map.
        </p>
      </div>
    </motion.div>
  );
};
