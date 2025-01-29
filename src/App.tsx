import React from 'react';
import { ConfigForm } from './components/ConfigForm';
import { SlidePreview } from './components/SlidePreview';
import { SlideEditor } from './components/SlideEditor';
import type { PresentationConfig, Slide, Presentation } from './types';
import { Presentation as PresentationIcon } from 'lucide-react';
import { AIService } from './services/ai';
import { exportToPowerPoint } from './utils/export';

// Initialize AI service with your API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const aiService = new AIService(apiKey);

function App() {
  const [presentation, setPresentation] = React.useState<Presentation | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [editingSlide, setEditingSlide] = React.useState<Slide | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfigSubmit = async (config: PresentationConfig) => {
    setLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        throw new Error('API key is not configured');
      }

      const content = await aiService.generatePresentation(
        config.topic,
        config.purpose,
        config.audience,
        config.keyPoints,
        config.slideCount
      );

      const slides: Slide[] = await Promise.all(content.slides.map(async (slide, index) => {
        let imageUrl = '';
        try {
          imageUrl = await aiService.generateImage(slide.imagePrompt || slide.title);
        } catch (err) {
          console.error('Error generating image:', err);
        }

        return {
          id: `slide-${index}`,
          title: slide.title,
          content: slide.content,
          notes: slide.notes,
          imageUrl,
          sources: slide.sources
        };
      }));

      setPresentation({
        id: 'presentation-1',
        config,
        slides,
        references: content.references,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlideEdit = async (updatedSlide: Slide) => {
    if (!presentation) return;
    
    // If the image URL was cleared, generate a new one based on the slide title
    if (!updatedSlide.imageUrl) {
      try {
        const imageUrl = await aiService.generateImage(updatedSlide.title);
        updatedSlide = { ...updatedSlide, imageUrl };
      } catch (err) {
        console.error('Error generating new image:', err);
      }
    }
    
    setPresentation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        slides: prev.slides.map(slide => 
          slide.id === updatedSlide.id ? updatedSlide : slide
        ),
        updatedAt: new Date()
      };
    });
  };

  const handleExport = async () => {
    if (!presentation) return;
    
    try {
      await exportToPowerPoint(presentation);
    } catch (err) {
      setError('Failed to export presentation');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <PresentationIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Presentation Generator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!presentation ? (
          <div className="relative">
            <ConfigForm onSubmit={handleConfigSubmit} />
            {loading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <SlidePreview
              slides={presentation.slides}
              currentSlide={currentSlide}
              theme={presentation.config.style}
              onNavigate={setCurrentSlide}
              onEdit={setEditingSlide}
              onExport={handleExport}
            />
          </div>
        )}

        {editingSlide && (
          <SlideEditor
            slide={editingSlide}
            onSave={handleSlideEdit}
            onClose={() => setEditingSlide(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App