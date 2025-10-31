import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-brand-primary/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-brand-primary/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row gap-4 p-4"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
