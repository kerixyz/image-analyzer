import { useRef, useEffect, useState } from 'react';
import { ColorData } from '../utils/imageAnalysis';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorAnalysisProps {
  colors: ColorData[];
}

const ColorAnalysis = ({ colors }: ColorAnalysisProps) => {
  const [sortedColors, setSortedColors] = useState<ColorData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPercentage = colors.reduce((sum, { percentage }) => sum + percentage, 0);
  const maxPercentage = Math.max(...colors.map(c => c.percentage), 100);

  // Sort colors and add "Other" category if needed
  useEffect(() => {
    const sorted = [...colors].sort((a, b) => b.percentage - a.percentage);
    if (totalPercentage < 99.9 && colors.length > 0) {
      sorted.push({
        color: '#e0e0e0',
        percentage: 100 - totalPercentage,
        label: 'Other'
      });
    }
    setSortedColors(sorted);
  }, [colors, totalPercentage]);

  return (
    <div className="space-y-4 animate-fade-in" ref={containerRef}>
      <h2 className="text-lg font-medium">Color Distribution</h2>

      <div className="relative h-48 w-full">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((value) => (
            <div key={value} className="h-px bg-gray-100" />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-1 px-2">
          <AnimatePresence>
            {sortedColors.map(({ color, percentage, label }, index) => {
              const height = (percentage / maxPercentage) * 100;
              return (
                <motion.div
                  key={label || color}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex-1 relative group"
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {percentage.toFixed(1)}%
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {sortedColors.map(({ color, percentage, label }, index) => (
          <motion.div
            key={label || color}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-md shadow-sm border"
              style={{ backgroundColor: color }}
              title={label || color}
            />
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{label || color}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ColorAnalysis;
