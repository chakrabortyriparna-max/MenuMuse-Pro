import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageStyle, GeneratedImage, Dish } from '../types';
import { parseMenu, generateImages } from '../services/geminiService';
import { IMAGE_STYLES } from '../constants';
import { MenuInput } from './MenuInput';
import { StyleSelector } from './StyleSelector';
import { ImageGallery } from './ImageGallery';
import { ImageEditorModal } from './ImageEditorModal';
import { SparklesIcon } from './icons/Icons';
import { Button } from './ui/button';

export const Generator: React.FC = () => {
  const [menuText, setMenuText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(ImageStyle.BRIGHT_MODERN);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!menuText.trim()) {
      setError("Please enter your menu text first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setGeneratedImages([]);
    setHasGenerated(true);

    try {
      const dishes = await parseMenu(menuText);
      if (dishes.length === 0) {
        setError("Could not find any dishes in the menu. Please check the text format.");
        setIsProcessing(false);
        return;
      }

      const initialImages: GeneratedImage[] = dishes.flatMap((dish, dishIndex) =>
        Array.from({ length: 3 }).map((_, variationIndex) => ({
          id: `${dish.name}-${dishIndex}-${variationIndex}`,
          dishName: dish.name,
          dishDescription: dish.description,
          imageUrl: '',
          status: 'loading',
          mimeType: ''
        }))
      );
      setGeneratedImages(initialImages);
      
      await Promise.all(dishes.map(async (dish, dishIndex) => {
        try {
          const imagesData = await generateImages(dish, selectedStyle);
          
          setGeneratedImages(prev => {
            const newImages = [...prev];
            imagesData.forEach((imageData, variationIndex) => {
              const imageId = `${dish.name}-${dishIndex}-${variationIndex}`;
              const imageIndex = newImages.findIndex(img => img.id === imageId);
              if (imageIndex !== -1) {
                const { base64, mimeType } = imageData;
                const imageUrl = `data:${mimeType};base64,${base64}`;
                newImages[imageIndex] = { ...newImages[imageIndex], imageUrl, mimeType, status: 'success' };
              }
            });
            
            if (imagesData.length < 3) {
              for (let i = imagesData.length; i < 3; i++) {
                const imageId = `${dish.name}-${dishIndex}-${i}`;
                const imageIndex = newImages.findIndex(img => img.id === imageId);
                if (imageIndex !== -1) {
                  newImages[imageIndex] = { ...newImages[imageIndex], status: 'error' };
                }
              }
            }
            return newImages;
          });
        } catch (e) {
          setGeneratedImages(prev => {
            const newImages = [...prev];
            for (let i = 0; i < 3; i++) {
              const imageId = `${dish.name}-${dishIndex}-${i}`;
              const imageIndex = newImages.findIndex(img => img.id === imageId);
              if (imageIndex !== -1) {
                newImages[imageIndex] = { ...newImages[imageIndex], status: 'error' };
              }
            }
            return newImages;
          });
        }
      }));

    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsProcessing(false);
    }
  }, [menuText, selectedStyle]);

  const handleUpdateImage = (updatedImage: GeneratedImage) => {
    setGeneratedImages(prevImages =>
      prevImages.map(img => (img.id === updatedImage.id ? updatedImage : img))
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-brand-bg tracking-tight">
          Virtual Food Photographer
        </h1>
        <p className="text-lg md:text-xl text-brand-bg/80 max-w-3xl mx-auto mt-4">
          Turn your menu into a masterpiece. Paste your menu, select a style, and let AI generate stunning, realistic photos for every dish.
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 space-y-8 border border-white/20"
      >
        <motion.div variants={itemVariants}>
          <MenuInput
            value={menuText}
            onChange={e => setMenuText(e.target.value)}
            disabled={isProcessing}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StyleSelector
            styles={IMAGE_STYLES}
            selectedStyle={selectedStyle}
            onChange={setSelectedStyle}
            disabled={isProcessing}
          />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-100 bg-red-500/30 p-4 rounded-lg text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="text-center pt-4">
          <Button
            onClick={handleGenerate}
            disabled={isProcessing || !menuText.trim()}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                Generate Photos
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      <ImageGallery images={generatedImages} onEdit={setEditingImage} hasGenerated={hasGenerated} />
      
      <AnimatePresence>
        {editingImage && (
          <ImageEditorModal
              image={editingImage}
              onClose={() => setEditingImage(null)}
              onUpdate={handleUpdateImage}
          />
        )}
      </AnimatePresence>
    </>
  );
};
