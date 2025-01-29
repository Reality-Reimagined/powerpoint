export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  notes?: string;
  sources?: string[];
}

export interface PresentationConfig {
  topic: string;
  purpose: 'business' | 'educational' | 'informative';
  audience: string;
  slideCount: number;
  keyPoints: string[];
  style: 'bee-happy' | 'ash' | 'oasis' | 'tranquil' | 'kraft' | 'verdigris';
  contentLength: 'brief' | 'medium' | 'detailed';
  imageSource: 'ai' | 'stock';
}

export interface Presentation {
  id: string;
  config: PresentationConfig;
  slides: Slide[];
  references?: string[];
  createdAt: Date;
  updatedAt: Date;
}