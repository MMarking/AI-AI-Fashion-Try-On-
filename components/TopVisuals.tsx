import React from 'react';
import { ImageItem, AppStep } from '../types';
import { User, Shirt, Sparkles } from 'lucide-react';

interface TopVisualsProps {
  step: AppStep;
  person: ImageItem | null;
  clothes: ImageItem | null;
  result: string | null;
}

const Card = ({ 
  image, 
  placeholderIcon: Icon, 
  label, 
  isActive, 
  rotateClass, 
  zIndex 
}: { 
  image: string | null; 
  placeholderIcon: any; 
  label: string; 
  isActive: boolean; 
  rotateClass: string; 
  zIndex: string 
}) => {
  return (
    <div 
      className={`relative w-32 h-48 md:w-48 md:h-72 rounded-2xl shadow-xl transition-all duration-500 ease-out ${rotateClass} ${zIndex} ${isActive ? 'scale-105 ring-4 ring-purple-400 shadow-2xl' : 'opacity-90 grayscale-[0.3]'}`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center border border-gray-200">
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-gray-400 p-4 text-center">
            <Icon size={48} className="mb-2 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
          </div>
        )}
      </div>
      {/* Glassmorphism Label Overlay */}
      {image && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl">
          <p className="text-white text-xs font-medium text-center">{label}</p>
        </div>
      )}
    </div>
  );
};

export const TopVisuals: React.FC<TopVisualsProps> = ({ step, person, clothes, result }) => {
  return (
    <div className="w-full py-8 md:py-12 bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64 md:h-80 relative px-4">
        
        {/* Card 1: Person */}
        <div className="transform translate-x-12 md:translate-x-24 transition-transform duration-500">
           <Card 
             image={person?.url || null} 
             placeholderIcon={User} 
             label="人物" 
             isActive={step === AppStep.SELECT_PERSON}
             rotateClass="-rotate-6 hover:-rotate-3"
             zIndex="z-10"
           />
        </div>

        {/* Card 2: Clothes */}
        <div className="transform transition-transform duration-500">
          <Card 
            image={clothes?.url || null} 
            placeholderIcon={Shirt} 
            label="服装" 
            isActive={step === AppStep.SELECT_CLOTHES}
            rotateClass="rotate-0 -translate-y-4 hover:-translate-y-6"
            zIndex="z-20"
          />
        </div>

        {/* Card 3: Result */}
        <div className="transform -translate-x-12 md:-translate-x-24 transition-transform duration-500">
          <Card 
            image={result} 
            placeholderIcon={Sparkles} 
            label="试穿效果" 
            isActive={step === AppStep.GENERATE_RESULT}
            rotateClass="rotate-6 hover:rotate-3"
            zIndex="z-10"
          />
        </div>

      </div>
    </div>
  );
};
