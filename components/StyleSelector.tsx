import React from 'react';
import { motion } from 'framer-motion';
import { ImageStyle } from '../types';
import { Button } from './ui/button';

interface StyleSelectorProps {
  styles: { id: ImageStyle; name: string }[];
  selectedStyle: ImageStyle;
  onChange: (style: ImageStyle) => void;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onChange, disabled }) => {
  return (
    <div className="space-y-4">
      <label className="text-xl font-bold font-serif text-brand-bg">2. Choose a Style</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {styles.map(style => (
          <Button
            key={style.id}
            onClick={() => onChange(style.id)}
            disabled={disabled}
            variant={selectedStyle === style.id ? 'primary' : 'secondary'}
            className="w-full relative py-5 text-base"
          >
            {selectedStyle === style.id && (
               <motion.span
                  layoutId="style-selector-glow"
                  className="absolute inset-0 bg-brand-accent-glow rounded-lg -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
            {style.name}
          </Button>
        ))}
      </div>
    </div>
  );
};