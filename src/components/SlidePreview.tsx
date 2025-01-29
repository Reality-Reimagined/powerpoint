import React, { useState } from 'react';
import type { Slide } from '../types';
import { ChevronLeft, ChevronRight, Edit2, MessageSquare, X, Download, ExternalLink } from 'lucide-react';
import { THEME_STYLES } from '../services/ai';

interface SlidePreviewProps {
  slides: Slide[];
  currentSlide: number;
  theme: 'modern' | 'classic' | 'minimal' | 'bold';
  onNavigate: (index: number) => void;
  onEdit: (slide: Slide) => void;
  onExport: () => void;
}

export function SlidePreview({ slides, currentSlide, theme, onNavigate, onEdit, onExport }: SlidePreviewProps) {
  const [showNotes, setShowNotes] = useState(false);
  const slide = slides[currentSlide];
  const styles = THEME_STYLES[theme];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className={`aspect-[16/9] ${styles.background} rounded-lg relative overflow-hidden shadow-inner`}>
        {/* Slide Content */}
        <div className="absolute inset-0 p-8">
          <h2 className={`text-3xl font-bold mb-4 ${styles.heading}`}>{slide.title}</h2>
          <div className={`prose max-w-none ${styles.text}`}>
            {slide.imageUrl && (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="max-h-48 object-contain mb-4 rounded-lg shadow-md"
              />
            )}
            <p className="text-lg">{slide.content}</p>
            
            {slide.sources && slide.sources.length > 0 && (
              <div className="mt-4 text-sm opacity-75">
                <p className="font-medium">Sources:</p>
                <ul className="list-disc list-inside">
                  {slide.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
            title="Toggle Speaker Notes"
          >
            <MessageSquare className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onEdit(slide)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
            title="Edit Slide"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onExport}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
            title="Export Presentation"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Speaker Notes Panel */}
      {showNotes && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Speaker Notes</h3>
            <button
              onClick={() => setShowNotes(false)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">{slide.notes}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate(currentSlide - 1)}
          disabled={currentSlide === 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <span className="text-sm text-gray-600">
          Slide {currentSlide + 1} of {slides.length}
        </span>
        
        <button
          onClick={() => onNavigate(currentSlide + 1)}
          disabled={currentSlide === slides.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}