import { GoogleGenerativeAI } from "@google/generative-ai";
import Together from "together-ai";

// Types for AI response
interface SlideContent {
  title: string;
  content: string;
  notes: string;
  imagePrompt: string;
  sources?: string[];
}

interface PresentationContent {
  slides: SlideContent[];
  references: string[];
}

interface ImageGenerationConfig {
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  negativePrompt?: string;
}

export const THEME_STYLES = {
  'bee-happy': {
    background: 'bg-black text-yellow-400',
    text: 'text-yellow-400',
    heading: 'text-yellow-400 font-bold',
    accent: 'border-yellow-400',
    pptx: { background: '000000', accent: 'FFD700', text: 'FFD700' }
  },
  ash: {
    background: 'bg-white',
    text: 'text-gray-800',
    heading: 'text-gray-900 font-bold',
    accent: 'border-gray-200',
    pptx: { background: 'FFFFFF', accent: '1F2937', text: '1F2937' }
  },
  oasis: {
    background: 'bg-green-50',
    text: 'text-gray-700',
    heading: 'text-green-800 font-bold',
    accent: 'border-green-200',
    pptx: { background: 'F0FDF4', accent: '166534', text: '374151' }
  },
  tranquil: {
    background: 'bg-gradient-to-br from-blue-50 to-blue-100',
    text: 'text-blue-900',
    heading: 'text-blue-800 font-bold',
    accent: 'border-blue-300',
    pptx: { background: 'EFF6FF', accent: '1E40AF', text: '1E3A8A' }
  },
  kraft: {
    background: 'bg-amber-50',
    text: 'text-amber-900',
    heading: 'text-amber-800 font-bold',
    accent: 'border-amber-200',
    pptx: { background: 'FFFBEB', accent: '92400E', text: '78350F' }
  },
  verdigris: {
    background: 'bg-gradient-to-br from-teal-900 to-emerald-800',
    text: 'text-white',
    heading: 'text-white font-bold',
    accent: 'border-teal-400',
    pptx: { background: '134E4A', accent: '2DD4BF', text: 'FFFFFF' }
  }
};

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private together: Together;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096,
      }
    });

    const togetherApiKey = import.meta.env.VITE_TOGETHER_API_KEY;
    if (!togetherApiKey) {
      console.warn('VITE_TOGETHER_API_KEY is not set, image generation will fallback to Unsplash');
    }
    
    this.together = new Together({ auth: togetherApiKey || 'dummy-key' });
  }

  async generatePresentation(topic: string, purpose: string, audience: string, keyPoints: string[], slideCount: number): Promise<PresentationContent> {
    const prompt = `Create a well-researched presentation with exactly ${slideCount} slides on:
    Topic: ${topic}
    Purpose: ${purpose}
    Audience: ${audience}
    Key Points: ${keyPoints.join(', ')}

    IMPORTANT: The presentation MUST have exactly ${slideCount} slides, including the title slide.
    Respond ONLY with a valid JSON object containing comprehensive research and citations.
    The response must be a JSON object with this exact schema:
    {
      "slides": [
        {
          "title": string,
          "content": string,
          "notes": string (include research findings and talking points),
          "imagePrompt": string,
          "sources": string[] (list of relevant sources)
        }
      ],
      "references": string[] (complete list of all sources used)
    }

    Requirements:
    1. Content:
      - First slide is a compelling title slide
      - Each key point gets its own detailed slide
      - Content is concise yet informative
      - Use professional language for ${audience}
      
    2. Research:
      - Include relevant statistics and data
      - Cite reputable sources (academic papers, industry reports, etc.)
      - Add context and background in speaker notes
      
    3. Speaker Notes:
      - Provide detailed talking points
      - Include relevant research findings
      - Add engagement tips and audience interaction points
      - Suggest answers to potential questions
      
    4. Visual Elements:
      - Include descriptive imagePrompt for professional visuals
      - Suggest data visualization where appropriate
      
    5. Sources:
      - Include source citations for each slide
      - Provide a complete reference list`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        return JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Invalid JSON response:', cleanResponse);
        throw new Error('Failed to parse AI response as JSON');
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw error;
    }
  }

  async generateImage(prompt: string, config: ImageGenerationConfig = {}): Promise<string> {
    const togetherApiKey = import.meta.env.VITE_TOGETHER_API_KEY;
    
    if (!togetherApiKey) {
      return this.getUnsplashImage(prompt);
    }

    try {
      const response = await fetch('https://api.together.xyz/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${togetherApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "stabilityai/stable-diffusion-xl-base-1.0",
          prompt: `Professional, high quality presentation image: ${prompt}`,
          width: config.width || 1024,
          height: config.height || 1024,
          steps: config.steps || 40,
          n: 1,
          seed: config.seed || Math.floor(Math.random() * 10000),
          response_format: "b64_json"
        })
      });

      if (!response.ok) {
        throw new Error(`Together.ai API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data?.data?.[0]?.b64_json) {
        throw new Error('No image data in response');
      }

      return `data:image/png;base64,${data.data[0].b64_json}`;
    } catch (error) {
      console.error('Error generating image with Together.ai:', error);
      return this.getUnsplashImage(prompt);
    }
  }

  private getUnsplashImage(prompt: string): string {
    const baseUrl = "https://source.unsplash.com/1600x900";
    const searchQuery = encodeURIComponent(prompt);
    return `${baseUrl}/?${searchQuery}`;
  }
}