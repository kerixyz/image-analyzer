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

// Simple component to display an icon based on the object label
const IconForObject = ({ label }: { label: string }) => {
  const lowerLabel = label.toLowerCase();
  // Return different SVG icons based on the label
  if (lowerLabel.includes('apple')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.9999C21 18.7613 16.9706 20.9999 12 20.9999C7.02944 20.9999 3 18.7613 3 15.9999M21 12C21 14.7614 16.9706 17 12 17C7.02944 17 3 14.7614 3 12M21 8.00011C21 10.7615 16.9706 13.0001 12 13.0001C7.02944 13.0001 3 10.7615 3 8.00011C3 5.23869 7.02944 3.00011 12 3.00011C16.9706 3.00011 21 5.23869 21 8.00011Z" />
      </svg>
    );
  } else if (lowerLabel.includes('sky')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  } else if (lowerLabel.includes('background')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    );
  } else if (lowerLabel.includes('leaf') || lowerLabel.includes('plant')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  } else if (lowerLabel.includes('shadow')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    );
  } else if (lowerLabel.includes('orange') || lowerLabel.includes('fruit')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  } else if (lowerLabel.includes('foreground')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    );
  } else {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    );
  }
};

export default ObjectDetection;
