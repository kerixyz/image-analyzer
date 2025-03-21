import { useState, useRef, useCallback } from 'react';
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUploaded: (image: HTMLImageElement) => void;
}

const ImageUploader = ({ onImageUploaded }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processImage = useCallback((file: File) => {
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageUploaded(img);
        setIsUploading(false);
      };
      img.onerror = () => {
        toast.error("Failed to load image");
        setIsUploading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, [onImageUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  }, [processImage]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0]);
    }
  }, [processImage]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`upload-zone ${isDragging ? 'border-primary bg-primary/5' : ''} ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-4">
        <svg 
          className="w-12 h-12 mx-auto text-gray-400"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {isUploading ? 'Processing...' : 'Upload an image'}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4">
        {isDragging 
          ? 'Drop image here' 
          : 'Drag & drop an image or click to browse'}
      </p>
      
      <button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 bg-primary/90 text-primary-foreground rounded-full text-sm font-medium transition-all hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        disabled={isUploading}
      >
        Select Image
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploader;
