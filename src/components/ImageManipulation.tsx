
import { useRef, useEffect, useState } from 'react';
import { Slider } from './ui/slider';

interface ImageManipulationProps {
  image: HTMLImageElement;
  onApplyChanges: (manipulatedImage: HTMLImageElement) => void;
}

const ImageManipulation = ({ image, onApplyChanges }: ImageManipulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distortionLevel, setDistortionLevel] = useState(0);
  const [warpLevel, setWarpLevel] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  // Apply effects to canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply brightness and contrast
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    
    // Draw the original image
    ctx.drawImage(image, 0, 0);
    
    // Reset filter for further manipulations
    ctx.filter = 'none';
    
    // Apply distortion effect if distortionLevel > 0
    if (distortionLevel > 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          
          // Skip transparent pixels
          if (data[index + 3] === 0) continue;
          
          // Apply noise based on distortion level
          if (Math.random() < distortionLevel / 200) {
            data[index] = Math.min(255, Math.max(0, data[index] + (Math.random() - 0.5) * distortionLevel * 5));
            data[index + 1] = Math.min(255, Math.max(0, data[index + 1] + (Math.random() - 0.5) * distortionLevel * 5));
            data[index + 2] = Math.min(255, Math.max(0, data[index + 2] + (Math.random() - 0.5) * distortionLevel * 5));
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Apply warp effect if warpLevel > 0
    if (warpLevel > 0) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // Copy current canvas to temp canvas
        tempCtx.drawImage(canvas, 0, 0);
        
        // Clear main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply warp effect
        const amplitude = warpLevel * 10;
        const period = 200 - warpLevel * 10;
        
        for (let y = 0; y < canvas.height; y++) {
          const displacement = Math.sin(y / period) * amplitude;
          ctx.drawImage(
            tempCanvas,
            0, y, canvas.width, 1,
            displacement, y, canvas.width, 1
          );
        }
      }
    }
    
  }, [image, distortionLevel, warpLevel, brightness, contrast]);
  
  const handleApplyChanges = () => {
    if (!canvasRef.current) return;
    
    // Create a new image from the canvas
    const dataURL = canvasRef.current.toDataURL('image/png');
    const resultImage = new Image();
    resultImage.onload = () => {
      onApplyChanges(resultImage);
    };
    resultImage.src = dataURL;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-lg font-medium">Image Manipulation</h2>
      
      <div className="mb-4 rounded-xl overflow-hidden bg-[#fafafa] shadow-inner flex justify-center">
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-[250px] object-contain"
        />
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Distortion</span>
            <span>{distortionLevel}%</span>
          </div>
          <Slider 
            value={[distortionLevel]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => setDistortionLevel(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Warp</span>
            <span>{warpLevel}%</span>
          </div>
          <Slider 
            value={[warpLevel]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => setWarpLevel(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Brightness</span>
            <span>{brightness}%</span>
          </div>
          <Slider 
            value={[brightness]} 
            min={50} 
            max={150} 
            step={1}
            onValueChange={(value) => setBrightness(value[0])} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Contrast</span>
            <span>{contrast}%</span>
          </div>
          <Slider 
            value={[contrast]} 
            min={50} 
            max={150} 
            step={1}
            onValueChange={(value) => setContrast(value[0])} 
          />
        </div>
      </div>
      
      <button
        onClick={handleApplyChanges}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Apply Changes
      </button>
    </div>
  );
};

export default ImageManipulation;