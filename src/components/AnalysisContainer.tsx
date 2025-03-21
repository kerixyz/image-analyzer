import { useState, useEffect } from 'react';
import ColorAnalysis from './ColorAnalysis';
import ObjectDetection from './ObjectDetection';
import ImageManipulation from './ImageManipulation';
import { ColorData, DetectedObject, extractColors, detectObjects } from '../utils/imageAnalysis';

interface AnalysisContainerProps {
  image: HTMLImageElement | null;
  onImageUpdate?: (updatedImage: HTMLImageElement) => void;
}

const AnalysisContainer = ({ image, onImageUpdate }: AnalysisContainerProps) => {
  const [colors, setColors] = useState<ColorData[]>([]);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isLoadingObjects, setIsLoadingObjects] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'objects' | 'manipulate'>('colors');
  
  // Process image when it changes
  useEffect(() => {
    if (!image) {
      setColors([]);
      setObjects([]);
      return;
    }
    
    // Extract colors
    const extractedColors = extractColors(image, 5);
    setColors(extractedColors);
    
    // Detect objects
    setIsLoadingObjects(true);
    detectObjects(image)
      .then(detectedObjects => {
        setObjects(detectedObjects);
        setIsLoadingObjects(false);
      })
      .catch(error => {
        console.error('Error detecting objects:', error);
        setIsLoadingObjects(false);
      });
  }, [image]);
  
  const handleApplyChanges = (updatedImage: HTMLImageElement) => {
    if (onImageUpdate) {
      onImageUpdate(updatedImage);
    }
  };
  
  if (!image) return null;
  
  return (
    <div className="glass-panel p-6 animate-scale-up">
      <div className="flex items-center gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2">
        <button
          className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'colors'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          onClick={() => setActiveTab('colors')}
        >
          Colors
        </button>
        <button
          className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'objects'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          onClick={() => setActiveTab('objects')}
        >
          Features
        </button>
        <button
          className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'manipulate'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          onClick={() => setActiveTab('manipulate')}
        >
          Manipulate
        </button>
      </div>
      
      <div className="transition-all duration-300 ease-out">
        {activeTab === 'colors' ? (
          <ColorAnalysis colors={colors} />
        ) : activeTab === 'objects' ? (
          <ObjectDetection objects={objects} isLoading={isLoadingObjects} />
        ) : (
          <ImageManipulation image={image} onApplyChanges={handleApplyChanges} />
        )}
      </div>
    </div>
  );
};

export default AnalysisContainer;
