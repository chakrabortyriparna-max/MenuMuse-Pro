import React from 'react';
import { motion } from 'framer-motion';

// Fix: Use React.ComponentProps to correctly infer all props from motion.div
interface CardProps extends React.ComponentProps<typeof motion.div> {}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-brand-bg/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/10 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
