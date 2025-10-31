import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GeneratedImage } from '../types';
import { editImage } from '../services/geminiService';
import { SparklesIcon, XIcon } from './icons/Icons';
import { Modal } from './ui/modal';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface ImageEditorModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onUpdate: (image: GeneratedImage) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ image, onClose, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(image);

  const handleApplyEdit = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsEditing(true);
    setError(null);
    try {
      const base64Data = currentImage.imageUrl.split(',')[1];
      const { base64: newBase64, mimeType: newMimeType } = await editImage(base64Data, currentImage.mimeType, prompt);
      const newImageUrl = `data:${newMimeType};base64,${newBase64}`;
      const updatedImage = { ...currentImage, imageUrl: newImageUrl, mimeType: newMimeType };
      setCurrentImage(updatedImage);
      onUpdate(updatedImage);
      setPrompt('');
    } catch (e: any) {
      setError(e.message || 'Failed to edit image.');
    } finally {
      setIsEditing(false);
    }
  }, [prompt, currentImage, onUpdate]);

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeType});
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    const base64Data = currentImage.imageUrl.split(',')[1];
    const blob = base64ToBlob(base64Data, currentImage.mimeType);
    link.href = URL.createObjectURL(blob);
    link.download = `${currentImage.dishName.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal onClose={onClose}>
        <div className="relative w-full md:w-3/5 aspect-[4/3] bg-brand-primary/10 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={currentImage.imageUrl} alt={currentImage.dishName} className="w-full h-full object-contain" />
            {isEditing && (
                <div className="absolute inset-0 bg-brand-primary/80 flex flex-col items-center justify-center text-white">
                    <svg className="animate-spin h-10 w-10 text-brand-accent-glow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg font-semibold">Applying magic...</p>
                </div>
            )}
        </div>
        <div className="w-full md:w-2/5 flex flex-col p-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-3xl font-bold font-serif text-brand-bg">{currentImage.dishName}</h2>
                    <p className="text-sm text-brand-bg/70">{currentImage.dishDescription}</p>
                </div>
                <motion.button 
                  onClick={onClose} 
                  className="text-brand-bg/50 hover:text-brand-bg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                    <XIcon className="w-8 h-8" />
                </motion.button>
            </div>
            <div className="flex-grow space-y-4 my-4">
                <label htmlFor="edit-prompt" className="font-semibold text-brand-bg">Edit with a prompt:</label>
                <Textarea
                    id="edit-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isEditing}
                    placeholder="e.g., 'Add a sprinkle of parsley', 'Make it look more vintage', 'Add a glass of wine next to it'"
                    className="h-28"
                />
                 {error && <div className="text-red-300 text-sm text-center bg-red-500/20 p-2 rounded-md">{error}</div>}
            </div>
            <div className="space-y-3 mt-auto">
                <Button
                    onClick={handleApplyEdit}
                    disabled={isEditing || !prompt.trim()}
                    className="w-full"
                    size="lg"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Apply Edit
                </Button>
                <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                >
                    Download Image
                </Button>
            </div>
        </div>
    </Modal>
  );
};