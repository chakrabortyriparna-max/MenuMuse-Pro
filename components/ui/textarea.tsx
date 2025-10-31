import React from 'react';
import { motion } from 'framer-motion';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <motion.textarea
      whileFocus={{
        boxShadow: '0 0 0 2px #C4FF47', // Electric Lime
        borderColor: '#C4FF47',
      }}
      className={`w-full p-4 bg-white/10 border-2 border-white/20 rounded-lg text-brand-bg focus:ring-0 focus:outline-none transition-colors duration-300 disabled:opacity-50 placeholder:text-brand-bg/40 ${className}`}
      {...props}
    />
  );
};
