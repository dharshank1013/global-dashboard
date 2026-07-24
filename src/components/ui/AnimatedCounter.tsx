import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const AnimatedCounter = ({ value }: { value: number }) => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    setIsReady(true);
  }, []);

  const springValue = useSpring(0, { bounce: 0, duration: 2000 });
  const displayValue = useTransform(springValue, (current) => Math.floor(current));
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  if (!isReady) return <span>{value}</span>;

  return <motion.span>{displayValue}</motion.span>;
};
