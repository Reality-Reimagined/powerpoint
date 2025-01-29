import React from 'react';
import { Settings2, Users, Target, Layout, List, Image, AlignLeft } from 'lucide-react';
import type { PresentationConfig } from '../types';
import { THEME_STYLES } from '../services/ai';

interface ConfigFormProps {
  onSubmit: (config: PresentationConfig) => void;
}

export function ConfigForm({ onSubmit }: ConfigFormProps) {
  const [config, setConfig] = React.useState<PresentationConfig>({
    topic: '',
    purpose: 'business',
    audience: '',
    slideCount: 8,
    keyPoints: [''],
    style: 'verdigris',
    contentLength: 'medium',
    imageSource: 'ai'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const addKeyPoint = () => {
    setConfig(prev => ({
      ...prev,
      keyPoints: [...prev.keyPoints, '']
    }));
  };

  const updateKeyPoint = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.map((point, i) => i === index ? value : point)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Theme Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Themes</h2>
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption
              name="bee-happy"
              label="Bee Happy"
              selected={config.style === 'bee-happy'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'bee-happy' }))}
            />
            <ThemeOption
              name="ash"
              label="Ash"
              selected={config.style === 'ash'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'ash' }))}
            />
            <ThemeOption
              name="oasis"
              label="Oasis"
              selected={config.style === 'oasis'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'oasis' }))}
            />
            <ThemeOption
              name="tranquil"
              label="Tranquil"
              selected={config.style === 'tranquil'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'tranquil' }))}
            />
            <ThemeOption
              name="kraft"
              label="Kraft"
              selected={config.style === 'kraft'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'kraft' }))}
            />
            <ThemeOption
              name="verdigris"
              label="Verdigris"
              selected={config.style === 'verdigris'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'verdigris' }))}
            />
          </div>
        </div>

        {/* Content Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount of text per card</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.contentLength === 'brief'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, contentLength: 'brief' }))}
                >
                  <AlignLeft className="w-4 h-4 mb-1 mx-auto" />
                  Brief
                </button>
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.contentLength === 'medium'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, contentLength: 'medium' }))}
                >
                  <AlignLeft className="w-4 h-4 mb-1 mx-auto" />
                  Medium
                </button>
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.contentLength === 'detailed'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, contentLength: 'detailed' }))}
                >
                  <AlignLeft className="w-4 h-4 mb-1 mx-auto" />
                  Detailed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image source</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.imageSource === 'ai'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, imageSource: 'ai' }))}
                >
                  <Image className="w-4 h-4 mb-1 mx-auto" />
                  AI Images
                </button>
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.imageSource === 'stock'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, imageSource: 'stock' }))}
                >
                  <Image className="w-4 h-4 mb-1 mx-auto" />
                  Stock Photos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Topic</label>
            <input
              type="text"
              value={config.topic}
              onChange={e => setConfig(prev => ({ ...prev, topic: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter presentation topic"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <select
              value={config.purpose}
              onChange={e => setConfig(prev => ({ ...prev, purpose: e.target.value as any }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="business">Business</option>
              <option value="educational">Educational</option>
              <option value="informative">Informative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <input
              type="text"
              value={config.audience}
              onChange={e => setConfig(prev => ({ ...prev, audience: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Who is this presentation for?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Slides</label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.slideCount}
              onChange={e => setConfig(prev => ({ ...prev, slideCount: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Key Points</label>
            <div className="space-y-2">
              {config.keyPoints.map((point, index) => (
                <input
                  key={index}
                  type="text"
                  value={point}
                  onChange={e => updateKeyPoint(index, e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={`Key point ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={addKeyPoint}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Key Point
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Generate ({config.slideCount} cards)
        </button>
      </form>
    </div>
  );
}

interface ThemeOptionProps {
  name: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function ThemeOption({ name, label, selected, onClick }: ThemeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'
      }`}
    >
      <div className={`absolute inset-0 ${THEME_STYLES[name].background} p-4`}>
        <div className={`text-lg font-semibold ${THEME_STYLES[name].heading}`}>Title</div>
        <div className={`text-sm ${THEME_STYLES[name].text}`}>Body</div>
      </div>
      <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-600">{label}</div>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}