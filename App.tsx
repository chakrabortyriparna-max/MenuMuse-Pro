import React from 'react';
import { Generator } from './components/Generator';

const AnimatedBackground = () => (
    <div className="blob-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
    </div>
);

export default function App() {
  return (
    <div className="min-h-screen font-sans relative">
      <AnimatedBackground />
      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <Generator />
      </main>
      <footer className="text-center py-6 text-sm text-brand-bg/60 relative z-10">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
}