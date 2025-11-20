import React, { useState, useEffect } from 'react';
import { TopVisuals } from './components/TopVisuals';
import { StepPerson } from './components/StepPerson';
import { StepClothes } from './components/StepClothes';
import { StepResult } from './components/StepResult';
import { Gallery } from './components/Gallery';
import { AppStep, ImageItem, GenerationHistoryItem } from './types';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.SELECT_PERSON);
  const [selectedPerson, setSelectedPerson] = useState<ImageItem | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<ImageItem | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('tryon_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Step Handlers
  const handlePersonSelect = (person: ImageItem) => {
    setSelectedPerson(person);
  };

  const handleClothesSelect = (clothes: ImageItem) => {
    setSelectedClothes(clothes);
  };

  const handleSaveResult = (url: string) => {
    setResultImage(url);
    if (selectedPerson && selectedClothes) {
      const newItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        personImage: selectedPerson.url,
        clothesImage: selectedClothes.url,
        resultImage: url,
      };
      const newHistory = [newItem, ...history];
      setHistory(newHistory);
      localStorage.setItem('tryon_history', JSON.stringify(newHistory));
    }
  };

  const handleReset = () => {
    setStep(AppStep.SELECT_PERSON);
    setResultImage(null);
    // We keep selections for easier re-running, or could clear them:
    // setSelectedPerson(null);
    // setSelectedClothes(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Visuals */}
      <TopVisuals 
        step={step} 
        person={selectedPerson} 
        clothes={selectedClothes} 
        result={resultImage} 
      />

      {/* Main Content Area */}
      <main className="flex-grow -mt-6 z-30 px-4 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8 min-h-[500px]">
          
          {step === AppStep.SELECT_PERSON && (
            <StepPerson 
              selectedPerson={selectedPerson} 
              onSelect={handlePersonSelect}
              onNext={() => setStep(AppStep.SELECT_CLOTHES)}
            />
          )}

          {step === AppStep.SELECT_CLOTHES && (
            <StepClothes 
              selectedPerson={selectedPerson}
              selectedClothes={selectedClothes}
              onSelect={handleClothesSelect}
              onBack={() => setStep(AppStep.SELECT_PERSON)}
              onNext={() => setStep(AppStep.GENERATE_RESULT)}
            />
          )}

          {step === AppStep.GENERATE_RESULT && selectedPerson && selectedClothes && (
            <StepResult 
              person={selectedPerson}
              clothes={selectedClothes}
              onBack={handleReset}
              onSaveToHistory={handleSaveResult}
            />
          )}

        </div>

        {/* Gallery Section */}
        <div className="max-w-4xl mx-auto">
           <Gallery history={history} />
        </div>
      </main>
    </div>
  );
};

export default App;
