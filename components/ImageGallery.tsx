import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedImage } from '../types';
import { EditIcon, AlertTriangleIcon, ImageIcon } from './icons/Icons';
import { Card } from './ui/card';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onEdit: (image: GeneratedImage) => void;
  hasGenerated: boolean;
}

const ImageCard: React.FC<{ image: GeneratedImage; onEdit: (image: GeneratedImage) => void }> = ({ image, onEdit }) => {
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    const renderContent = () => {
        switch (image.status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-brand-primary/10">
                        <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-sm text-brand-primary/80">Generating...</p>
                    </div>
                );
            case 'success':
                return (
                    <motion.img 
                      src={image.imageUrl} 
                      alt={image.dishName} 
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-500/10">
                        <AlertTriangleIcon className="w-8 h-8"/>
                        <p className="mt-2 text-sm text-center font-medium">Generation Failed</p>
                    </div>
                 );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-brand-primary/30 bg-brand-primary/5">
                       <ImageIcon className="w-8 h-8"/>
                    </div>
                );
        }
    };

    return (
        <Card
            variants={cardVariants}
            className="group relative aspect-[4/3] overflow-hidden"
            layout
        >
            {renderContent()}
            {image.status === 'success' && (
                <AnimatePresence>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <motion.div 
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          className="absolute inset-0 flex flex-col justify-end p-4"
                        >
                            <h3 className="font-bold font-serif text-white text-lg">{image.dishName}</h3>
                            <p className="text-sm text-gray-200 line-clamp-2">{image.dishDescription}</p>
                        </motion.div>
                        <motion.button 
                            onClick={() => onEdit(image)}
                            className="absolute top-3 right-3 bg-brand-highlight text-brand-primary p-2.5 rounded-full"
                            aria-label={`Edit ${image.dishName}`}
                            whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF' }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <EditIcon className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                </AnimatePresence>
            )}
        </Card>
    );
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onEdit, hasGenerated }) => {
  if (!hasGenerated) {
    return null;
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div 
      className="mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h2 className="font-serif text-4xl font-bold text-center mb-10 text-brand-bg">Your Culinary Showcase</h2>
      <motion.div 
        className="masonry-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map(image => (
          <div className="masonry-item" key={image.id}>
            <ImageCard image={image} onEdit={onEdit} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};