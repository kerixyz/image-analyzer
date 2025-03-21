import { useState } from 'react';
import { toast } from "sonner";
import ImageUploader from '../components/ImageUploader';
import AnalysisContainer from '../components/AnalysisContainer';

const Index = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageUploaded = (uploadedImage: HTMLImageElement) => {
    setImage(uploadedImage);
    setImageLoaded(true);
    toast.success("Image analysis complete!");
  };

  const handleImageUpdated = (updatedImage: HTMLImageElement) => {
    setImage(updatedImage);
    toast.success("Image updated successfully!");
  };

  const resetAnalysis = () => {
    setImageLoaded(false);
    setTimeout(() => {
      setImage(null);
    }, 300); // Small delay for animation
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-6 sm:px-8 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-medium">
            Image Analysis + Quick Visualization
            {/* <span className="ml-2 text-xs font-normal text-gray-500">Image Analysis Tool</span> */}
          </h1>
          
          {imageLoaded && (
            <button
              onClick={resetAnalysis}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Analyze New Image
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-1 px-6 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-light mb-3">Image Analysis</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Upload an image to analyze its color distribution, detect features, and apply manipulations. Our tool provides insights and transformations for your images.
            </p>
          </div>
          
          <div className={`transition-all duration-500 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {imageLoaded && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="glass-panel p-6 animate-fade-in">
                    <div className="bg-[#fafafa] rounded-xl overflow-hidden shadow-inner">
                      <img 
                        src={image?.src} 
                        alt="Uploaded" 
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                    
                    <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm">
                      <div className="flex-1 py-2 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Dimensions:</span>
                        <span className="font-medium ml-2">{image?.naturalWidth} × {image?.naturalHeight}</span>
                      </div>
                      
                      <div className="flex-1 py-2 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Format:</span>
                        <span className="font-medium ml-2">
                          {image?.src.startsWith('data:image/png') ? 'PNG' : 
                            image?.src.startsWith('data:image/jpeg') ? 'JPEG' : 
                            image?.src.startsWith('data:image/gif') ? 'GIF' : 
                            image?.src.startsWith('data:image/webp') ? 'WEBP' : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <AnalysisContainer image={image} onImageUpdate={handleImageUpdated} />
                </div>
              </div>
            )}
          </div>
          
          <div className={`transition-all duration-500 ease-out max-w-lg mx-auto ${imageLoaded ? 'opacity-0 absolute -z-10' : 'opacity-100'}`}>
            {!imageLoaded && (
              <ImageUploader onImageUploaded={handleImageUploaded} />
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-6 sm:px-8 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            Test Project
        </div>
      </footer>
    </div>
  );
};

export default Index;
