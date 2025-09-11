'use client';

import { useState, useEffect } from 'react';

const services = [
  "Real Estate Photography",
  "Virtual Staging", 
  "Airbnb Photography",
  "Aerial Photography",
  "3D Tours",
  "Cinematic Videos"
];

export default function AnimatedHeroText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentService = services[currentIndex];
    
    const typeText = () => {
      if (isPaused) return;
      
      if (isDeleting) {
        // Delete text letter by letter
        setDisplayText(currentService.substring(0, displayText.length - 1));
        
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 500); // Pause before typing next word
        }
      } else {
        // Type text letter by letter
        setDisplayText(currentService.substring(0, displayText.length + 1));
        
        if (displayText.length === currentService.length) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 2000); // Pause before deleting
        }
      }
    };

    const timer = setTimeout(typeText, isDeleting ? 50 : 100); // Faster deletion, slower typing
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, isPaused]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className='gradient-text-gray'>We help properties shine with </span><br />
          <span className="inline-block gradient-text">
            {displayText}
            <span className="animate-pulse">|</span>
          </span> <br />
          <span className='gradient-text-gray'>that helps you stand out.</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary text-lg px-8 py-4">
            Get Started
          </button>
          <a href="#portfolio" className="btn-secondary text-center text-lg px-8 py-4">
            View Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

