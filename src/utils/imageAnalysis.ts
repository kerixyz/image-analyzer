/**
 * Utility functions for image analysis
 */

// Type for color data
interface ColorData {
    color: string;
    percentage: number;
    rgb: [number, number, number];
}
  
/**
 * Extract dominant colors from an image
 * @param imageElement The image HTML element
 * @param colorCount Number of colors to extract (default: 5)
 * @returns Array of color data objects
 */
export const extractColors = (
    imageElement: HTMLImageElement,
    colorCount: number = 5
  ): ColorData[] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return [];
    
    // Maintain aspect ratio while limiting dimensions for performance
    const maxDimension = 300;
    const scale = Math.min(
      maxDimension / imageElement.naturalWidth,
      maxDimension / imageElement.naturalHeight
    );
    
    canvas.width = imageElement.naturalWidth * scale;
    canvas.height = imageElement.naturalHeight * scale;
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const totalPixels = canvas.width * canvas.height;
    const colorMap = new Map<string, { count: number; rgb: [number, number, number] }>();
    
    // Improved sampling with better color quantization
    for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Skip mostly transparent pixels
      if (a < 64) continue;
      
      // Better color quantization using 5-step intervals (0-255 → 0-51 steps)
      const qR = Math.round(r / 5) * 5;
      const qG = Math.round(g / 5) * 5;
      const qB = Math.round(b / 5) * 5;
      const colorKey = `${qR},${qG},${qB}`;
      
      // Merge similar colors using weighted average
      if (colorMap.has(colorKey)) {
        const entry = colorMap.get(colorKey)!;
        entry.count++;
        // Update RGB with moving average
        entry.rgb = [
          Math.round((entry.rgb[0] * (entry.count - 1) + r) / entry.count),
          Math.round((entry.rgb[1] * (entry.count - 1) + g) / entry.count),
          Math.round((entry.rgb[2] * (entry.count - 1) + b) / entry.count)
        ];
      } else {
        colorMap.set(colorKey, { count: 1, rgb: [r, g, b] });
      }
    }
  
    // Convert to array and calculate percentages
    const colors = Array.from(colorMap.entries())
      .map(([_, { count, rgb }]) => ({
        rgb,
        percentage: (count / (pixels.length / 16)) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage);
  
    // Merge similar colors using color distance threshold
    const mergedColors: ColorData[] = [];
    const COLOR_DIFF_THRESHOLD = 20; // Perceptual color difference threshold
    
    colors.forEach((color) => {
      const existing = mergedColors.find((c) => 
        Math.sqrt(
          (c.rgb[0] - color.rgb[0]) ** 2 +
          (c.rgb[1] - color.rgb[1]) ** 2 +
          (c.rgb[2] - color.rgb[2]) ** 2
        ) < COLOR_DIFF_THRESHOLD
      );
  
      if (existing) {
        existing.percentage += color.percentage;
        // Update RGB with weighted average
        existing.rgb = [
          Math.round((existing.rgb[0] * existing.percentage + color.rgb[0] * color.percentage) / 
                    (existing.percentage + color.percentage)),
          Math.round((existing.rgb[1] * existing.percentage + color.rgb[1] * color.percentage) / 
                    (existing.percentage + color.percentage)),
          Math.round((existing.rgb[2] * existing.percentage + color.rgb[2] * color.percentage) / 
                    (existing.percentage + color.percentage))
        ];
      } else {
        mergedColors.push({
          color: `rgb(${color.rgb[0]},${color.rgb[1]},${color.rgb[2]})`,
          percentage: color.percentage,
          rgb: color.rgb
        });
      }
    });
  
    // Filter and return top colors
    return mergedColors
      .filter(c => c.percentage > 0.5) // Ignore colors with less than 0.5%
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, colorCount)
      .map(c => ({
        ...c,
        percentage: Number(c.percentage.toFixed(2))
      }));
  };


  
  export interface DetectedObject {
      label: string;
      confidence: number;
      boundingBox?: {
          x: number;
          y: number;
          width: number;
          height: number;
      };
  }
  
  const COMMON_OBJECTS = [
      "Person", "Car", "Tree", "Building", "Sky", "Cloud", "Road", "Grass",
      "Water", "Mountain", "Animal", "Bird", "Dog", "Cat", "Flower", "Sign",
      "Table", "Chair", "Phone", "Computer", "Book", "Bottle", "Cup", "Plate"
  ];
  
  const COLOR_OBJECT_MAP: { [key: string]: string[] } = {
      red: ["Apple", "Fire hydrant", "Stop sign", "Strawberry"],
      green: ["Leaf", "Grass", "Tree", "Cucumber"],
      blue: ["Sky", "Water", "Blueberry", "Jeans"],
      yellow: ["Banana", "Lemon", "Sunflower", "Taxi"],
      orange: ["Orange", "Carrot", "Pumpkin", "Basketball"],
      purple: ["Eggplant", "Grape", "Lavender", "Amethyst"],
      pink: ["Flamingo", "Cherry blossom", "Bubblegum", "Pig"],
      brown: ["Wood", "Soil", "Coffee", "Bear"],
      white: ["Cloud", "Snow", "Paper", "Egg"],
      black: ["Night sky", "Tire", "Panther", "Coal"]
  };
  
  function getColorCategory(r: number, g: number, b: number): string {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      
      if (max - min < 30) return r + g + b > 600 ? "white" : r + g + b < 150 ? "black" : "gray";
      if (r > g && r > b) return r - Math.max(g, b) > 50 ? "red" : "orange";
      if (g > r && g > b) return "green";
      if (b > r && b > g) return "blue";
      if (r > b && g > b && Math.abs(r - g) < 50) return r > 150 ? "yellow" : "brown";
      return "purple";
  }
  
  function generateBoundingBox(imageWidth: number, imageHeight: number): DetectedObject['boundingBox'] {
      const x = Math.random() * 0.7 * imageWidth;
      const y = Math.random() * 0.7 * imageHeight;
      const width = (0.1 + Math.random() * 0.2) * imageWidth;
      const height = (0.1 + Math.random() * 0.2) * imageHeight;
      return { x, y, width, height };
  }
  
  export const detectObjects = async (
      imageElement: HTMLImageElement
  ): Promise<DetectedObject[]> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const colors = extractColors(imageElement, 5);
              const objects: DetectedObject[] = [];
              const usedLabels = new Set<string>();
  
              colors.forEach((colorData: ColorData) => {
                  const [r, g, b] = colorData.rgb;
                  const colorCategory = getColorCategory(r, g, b);
                  const possibleObjects = COLOR_OBJECT_MAP[colorCategory] || [];
                  
                  let label = possibleObjects[Math.floor(Math.random() * possibleObjects.length)];
                  if (!label || usedLabels.has(label)) {
                      label = COMMON_OBJECTS[Math.floor(Math.random() * COMMON_OBJECTS.length)];
                  }
                  usedLabels.add(label);
  
                  objects.push({
                      label,
                      confidence: 0.7 + Math.random() * 0.29,
                      boundingBox: generateBoundingBox(imageElement.width, imageElement.height)
                  });
              });
  
            //   // Add some random common objects
            //   for (let i = 0; i < 3; i++) {
            //       let label = COMMON_OBJECTS[Math.floor(Math.random() * COMMON_OBJECTS.length)];
            //       if (usedLabels.has(label)) continue;
            //       usedLabels.add(label);
  
            //       objects.push({
            //           label,
            //           confidence: 0.6 + Math.random() * 0.3,
            //           boundingBox: generateBoundingBox(imageElement.width, imageElement.height)
            //       });
            //   }
  
              // Always add these general detections
            //   objects.push(
            //       {
            //           label: "Background",
            //           confidence: 0.95,
            //       },
            //       {
            //           label: "Foreground",
            //           confidence: 0.85,
            //       }
            //   );
  
              resolve(objects);
          }, 800); // Simulate processing time
      });
  };
  
