import pptxgen from 'pptxgenjs';
import type { Presentation } from '../types';
import { THEME_STYLES } from '../services/ai';

export async function exportToPowerPoint(presentation: Presentation): Promise<void> {
  // Create a new PowerPoint presentation
  const pptx = new pptxgen();

  // Set presentation properties
  pptx.author = 'AI Presentation Generator';
  pptx.title = presentation.config.topic;

  // Get theme colors
  const theme = THEME_STYLES[presentation.config.style].pptx;

  // Process each slide
  for (const slide of presentation.slides) {
    const pptSlide = pptx.addSlide();

    // Set slide background
    pptSlide.background = { color: theme.background };

    // Add title
    pptSlide.addText(slide.title, {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '15%',
      fontSize: 36,
      color: theme.text,
      bold: true,
      align: 'left',
      fontFace: 'Cabin'
    });

    // Add image if available
    if (slide.imageUrl) {
      try {
        // For Unsplash URLs, we can use them directly
        if (slide.imageUrl.includes('unsplash.com')) {
          await pptSlide.addImage({
            src: slide.imageUrl,
            x: '5%',
            y: '25%',
            w: '40%',
            h: '40%'
          });
        } else if (slide.imageUrl.startsWith('data:image')) {
          // For base64 images, we need to extract the base64 data
          const base64Data = slide.imageUrl.split(',')[1];
          await pptSlide.addImage({
            data: base64Data,
            x: '5%',
            y: '25%',
            w: '40%',
            h: '40%'
          });
        }
      } catch (error) {
        console.error('Failed to add image to slide:', error);
      }
    }

    // Add content
    pptSlide.addText(slide.content, {
      x: slide.imageUrl ? '50%' : '5%',
      y: '25%',
      w: slide.imageUrl ? '45%' : '90%',
      h: '50%',
      fontSize: 18,
      color: theme.text,
      align: 'left',
      breakLine: true,
      fontFace: 'Unbounded'
    });

    // Add sources if available
    if (slide.sources && slide.sources.length > 0) {
      pptSlide.addText(slide.sources.join('\n'), {
        x: '5%',
        y: '80%',
        w: '90%',
        h: '15%',
        fontSize: 10,
        color: theme.text,
        italic: true,
        align: 'left',
        fontFace: 'Unbounded'
      });
    }

    // Add speaker notes if available
    if (slide.notes) {
      pptSlide.addNotes(slide.notes);
    }
  }

  // Add a references slide if available
  if (presentation.references && presentation.references.length > 0) {
    const referencesSlide = pptx.addSlide();
    referencesSlide.background = { color: theme.background };

    referencesSlide.addText('References', {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '15%',
      fontSize: 36,
      color: theme.text,
      bold: true,
      align: 'left',
      fontFace: 'Cabin'
    });

    referencesSlide.addText(presentation.references.join('\n\n'), {
      x: '5%',
      y: '25%',
      w: '90%',
      h: '70%',
      fontSize: 14,
      color: theme.text,
      align: 'left',
      breakLine: true,
      fontFace: 'Unbounded'
    });
  }

  // Save the presentation
  const fileName = `${presentation.config.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pptx`;
  await pptx.writeFile({ fileName });
}