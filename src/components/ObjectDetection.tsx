import { DetectedObject } from '../utils/imageAnalysis';

interface ObjectDetectionProps {
  objects: DetectedObject[];
  isLoading: boolean;
}

const ObjectDetection = ({ objects, isLoading }: ObjectDetectionProps) => {
  // Sort objects by confidence
  const sortedObjects = [...objects].sort((a, b) => b.confidence - a.confidence);
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-medium">Detected Features</h2>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-full h-12 bg-gray-100 rounded-lg shimmer"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedObjects.map((object, index) => (
            <div 
              key={index}
              className="flex items-center p-3 glass-panel animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-gray-100">
                  <IconForObject label={object.label} />
                </div>
                <div>
                  <div className="font-medium">{object.label}</div>
                  <div className="text-xs text-gray-500">
                    Confidence: {(object.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="w-16 h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-primary/80 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${object.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
