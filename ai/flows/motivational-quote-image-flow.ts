import { generate } from '@genkit-ai/ai';
import { gemini15Flash } from '../genkit';
import { z } from 'zod';

const MotivationalQuoteImageInputSchema = z.object({
  messageText: z.string().describe('The full ToiletGPT response text to extract wisdom from and create an image for'),
});

const MotivationalQuoteImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The data URI of the generated motivational image'),
  extractedWisdom: z.string().describe('The wisdom quote that was extracted from the ToiletGPT response'),
  success: z.boolean().describe('Whether the process completed successfully'),
  error: z.string().optional().describe('Error message if the process failed'),
});

// Helper function to run the flow (for server actions)
export async function runMotivationalQuoteImageFlow(messageText: string) {
  try {
    console.log('🎯 Starting AI-powered motivational quote image generation...');
    console.log('📝 Analyzing ToiletGPT response:', messageText.substring(0, 100) + '...');

    // Stage 1: AI-Powered Wisdom Extraction from Actual ToiletGPT Response
    console.log('🧠 Stage 1: AI extracting wisdom from ToiletGPT response...');
    
    // Direct API call instead of using definePrompt abstraction
    const wisdomExtractionPrompt = `You are an expert at extracting meaningful wisdom and life lessons from conversational text. Your task is to find the most inspirational, motivational, or wise statement from the given ToiletGPT response that would work well as a motivational quote.

INSTRUCTIONS:
- Extract the most meaningful wisdom, life advice, or inspirational message
- Focus on universal truths and life lessons that connect bathroom/toilet themes to broader life concepts
- The extracted wisdom should be suitable for a motivational quote image
- Keep it concise but impactful (1-3 sentences maximum)
- If no suitable wisdom is found, return an empty string

ToiletGPT Response to analyze:
"${messageText}"

Extract the wisdom as a clean, standalone quote:`;

    const wisdomExtractionResult = await generate({
      model: gemini15Flash,
      prompt: wisdomExtractionPrompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 150,
      },
    });

    const extractedWisdom = wisdomExtractionResult.text().trim();
    console.log('✨ AI extracted wisdom:', extractedWisdom);

    if (!extractedWisdom || extractedWisdom.length < 5) {
      console.log('❌ No suitable wisdom found in ToiletGPT response');
      return {
        imageDataUri: '',
        extractedWisdom: '',
        success: false,
        error: 'The AI could not find meaningful wisdom in the ToiletGPT response. The message may not contain motivational content suitable for a quote image.',
      };
    }

    // Stage 2: Create elegant toilet-inspired motivational background
    console.log('🎨 Stage 2: Creating elegant toilet-inspired motivational background...');
    
    try {
      // Create a sophisticated toilet-inspired background
      const elegantToiletBackground = await createElegantToiletInspiredBackground(extractedWisdom);
      
      console.log('🎉 Successfully generated elegant toilet-inspired motivational image!');
      return {
        imageDataUri: elegantToiletBackground,
        extractedWisdom,
        success: true,
      };

    } catch (backgroundError) {
      const errorMessage = backgroundError instanceof Error ? backgroundError.message : 'Unknown error occurred';
      console.log('⚠️ Background generation failed:', errorMessage);
      
      return {
        imageDataUri: '',
        extractedWisdom,
        success: false,
        error: `Failed to generate elegant background: ${errorMessage}`,
      };
    }

  } catch (error) {
    console.error('💥 Error in motivational quote image generation:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      imageDataUri: '',
      extractedWisdom: '',
      success: false,
      error: `Failed to generate motivational quote image: ${errorMessage}`,
    };
  }
}

// Create elegant toilet-inspired backgrounds for motivational quotes
async function createElegantToiletInspiredBackground(wisdom: string): Promise<string> {
  console.log('🚽✨ Creating elegant toilet-inspired background for wisdom:', wisdom);
  
  const width = 1200;
  const height = 800;
  
  // Elegant toilet-inspired design themes
  const elegantThemes = [
    {
      name: 'Zen Bathroom Sanctuary',
      description: 'Minimalist spa-like bathroom with soft lighting and clean lines',
      colors: {
        primary: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA'],
        accent: ['#6C757D', '#495057', '#343A40', '#212529'],
        highlights: ['#FFFFFF', '#F1F3F4', '#E8F0FE', '#FFF8E1'],
        shadows: ['#ADB5BD', '#868E96', '#6C757D', '#495057']
      }
    },
    {
      name: 'Luxury Marble Spa',
      description: 'Sophisticated marble textures with gold accents and soft ambient lighting',
      colors: {
        primary: ['#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0'],
        accent: ['#D4AF37', '#B8860B', '#DAA520', '#FFD700'],
        highlights: ['#FFFFFF', '#FFFEF7', '#FFF9C4', '#FFECB3'],
        shadows: ['#BDBDBD', '#9E9E9E', '#757575', '#616161']
      }
    },
    {
      name: 'Modern Minimalist Retreat',
      description: 'Clean geometric shapes with soft pastels and natural light',
      colors: {
        primary: ['#FEFEFE', '#F7F7F7', '#F0F0F0', '#E8E8E8'],
        accent: ['#81C784', '#66BB6A', '#4CAF50', '#388E3C'],
        highlights: ['#FFFFFF', '#F1F8E9', '#DCEDC8', '#C8E6C9'],
        shadows: ['#C5C5C5', '#A8A8A8', '#8A8A8A', '#6D6D6D']
      }
    },
    {
      name: 'Serene Water Elements',
      description: 'Flowing water patterns with soft blues and whites',
      colors: {
        primary: ['#F3F8FF', '#E3F2FD', '#BBDEFB', '#90CAF9'],
        accent: ['#2196F3', '#1976D2', '#1565C0', '#0D47A1'],
        highlights: ['#FFFFFF', '#F8FDFF', '#E8F4FD', '#D1E7DD'],
        shadows: ['#B0BEC5', '#90A4AE', '#78909C', '#607D8B']
      }
    },
    {
      name: 'Warm Comfort Zone',
      description: 'Cozy warm tones with soft textures and gentle lighting',
      colors: {
        primary: ['#FFF8E1', '#FFECB3', '#FFE082', '#FFD54F'],
        accent: ['#FF8F00', '#FF6F00', '#E65100', '#BF360C'],
        highlights: ['#FFFDE7', '#FFF9C4', '#FFF176', '#FFEB3B'],
        shadows: ['#BCAAA4', '#A1887F', '#8D6E63', '#6D4C41']
      }
    },
    {
      name: 'Fresh Clean Vibes',
      description: 'Crisp whites with subtle mint and eucalyptus accents',
      colors: {
        primary: ['#FFFFFF', '#F9F9F9', '#F0F4F8', '#E1E8ED'],
        accent: ['#26A69A', '#00897B', '#00695C', '#004D40'],
        highlights: ['#FFFFFF', '#F0FFF0', '#E8F5E8', '#DCEDC8'],
        shadows: ['#B0BEC5', '#90A4AE', '#78909C', '#546E7A']
      }
    }
  ];

  const theme = elegantThemes[Math.floor(Math.random() * elegantThemes.length)];
  console.log('🎨 Selected elegant theme:', theme.name);
  
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Elegant gradient backgrounds -->
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.colors.primary[0]};stop-opacity:1" />
          <stop offset="33%" style="stop-color:${theme.colors.primary[1]};stop-opacity:0.95" />
          <stop offset="66%" style="stop-color:${theme.colors.primary[2]};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${theme.colors.primary[3]};stop-opacity:0.85" />
        </linearGradient>
        
        <radialGradient id="accentGlow" cx="30%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:${theme.colors.accent[0]};stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:${theme.colors.accent[1]};stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:${theme.colors.accent[2]};stop-opacity:0.05" />
        </radialGradient>
        
        <radialGradient id="softHighlight" cx="70%" cy="20%" r="60%">
          <stop offset="0%" style="stop-color:${theme.colors.highlights[0]};stop-opacity:0.8" />
          <stop offset="40%" style="stop-color:${theme.colors.highlights[1]};stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:${theme.colors.highlights[2]};stop-opacity:0" />
        </radialGradient>
        
        <!-- Subtle toilet-inspired patterns -->
        <pattern id="elegantTiles" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill="${theme.colors.primary[1]}" opacity="0.3"/>
          <rect x="2" y="2" width="56" height="56" fill="none" stroke="${theme.colors.accent[0]}" stroke-width="0.5" opacity="0.2"/>
          <circle cx="30" cy="30" r="3" fill="${theme.colors.accent[1]}" opacity="0.1"/>
        </pattern>
        
        <pattern id="flowingWater" patternUnits="userSpaceOnUse" width="80" height="40">
          <path d="M0,20 Q20,10 40,20 T80,20" stroke="${theme.colors.accent[0]}" stroke-width="1" fill="none" opacity="0.1"/>
          <path d="M0,25 Q20,15 40,25 T80,25" stroke="${theme.colors.accent[1]}" stroke-width="0.8" fill="none" opacity="0.08"/>
        </pattern>
        
        <!-- Professional text styling -->
        <filter id="elegantTextShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="4" flood-color="${theme.colors.shadows[2]}" flood-opacity="0.3"/>
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${theme.colors.shadows[1]}" flood-opacity="0.2"/>
          <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="${theme.colors.shadows[0]}" flood-opacity="0.1"/>
        </filter>
        
        <!-- Elegant geometric shapes -->
        <clipPath id="elegantFrame">
          <rect x="50" y="50" width="1100" height="700" rx="20" ry="20"/>
        </clipPath>
      </defs>
      
      <!-- Base elegant background -->
      <rect width="100%" height="100%" fill="url(#primaryGradient)"/>
      
      <!-- Subtle pattern overlay -->
      <rect width="100%" height="100%" fill="url(#elegantTiles)" opacity="0.4"/>
      
      <!-- Flowing water pattern (toilet-inspired but elegant) -->
      <rect width="100%" height="100%" fill="url(#flowingWater)" opacity="0.6"/>
      
      <!-- Accent glow -->
      <rect width="100%" height="100%" fill="url(#accentGlow)"/>
      
      <!-- Soft highlight -->
      <rect width="100%" height="100%" fill="url(#softHighlight)"/>
      
      <!-- Elegant geometric elements (toilet-inspired but abstract) -->
      <!-- Subtle circular elements representing cleanliness and renewal -->
      <circle cx="150" cy="150" r="80" fill="none" stroke="${theme.colors.accent[0]}" stroke-width="2" opacity="0.15"/>
      <circle cx="150" cy="150" r="60" fill="none" stroke="${theme.colors.accent[1]}" stroke-width="1.5" opacity="0.1"/>
      <circle cx="150" cy="150" r="40" fill="${theme.colors.highlights[0]}" opacity="0.05"/>
      
      <circle cx="1050" cy="650" r="100" fill="none" stroke="${theme.colors.accent[0]}" stroke-width="2" opacity="0.12"/>
      <circle cx="1050" cy="650" r="75" fill="none" stroke="${theme.colors.accent[1]}" stroke-width="1.5" opacity="0.08"/>
      <circle cx="1050" cy="650" r="50" fill="${theme.colors.highlights[1]}" opacity="0.04"/>
      
      <!-- Elegant flowing lines (representing water flow) -->
      <path d="M0,400 Q300,350 600,400 T1200,400" stroke="${theme.colors.accent[0]}" stroke-width="3" fill="none" opacity="0.1"/>
      <path d="M0,420 Q300,370 600,420 T1200,420" stroke="${theme.colors.accent[1]}" stroke-width="2" fill="none" opacity="0.08"/>
      
      <!-- Subtle rectangular elements (representing tiles/cleanliness) -->
      <rect x="900" y="100" width="200" height="120" rx="10" fill="${theme.colors.highlights[0]}" opacity="0.06"/>
      <rect x="910" y="110" width="180" height="100" rx="8" fill="none" stroke="${theme.colors.accent[0]}" stroke-width="1" opacity="0.1"/>
      
      <rect x="100" y="550" width="180" height="100" rx="10" fill="${theme.colors.highlights[1]}" opacity="0.05"/>
      <rect x="110" y="560" width="160" height="80" rx="8" fill="none" stroke="${theme.colors.accent[1]}" stroke-width="1" opacity="0.08"/>
      
      <!-- Professional motivational text overlay -->
      <foreignObject x="80" y="200" width="1040" height="400">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 42px;
          font-weight: 600;
          color: ${theme.colors.shadows[3]};
          text-align: center;
          padding: 60px 40px;
          line-height: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          filter: url(#elegantTextShadow);
        ">
          <div style="
            background: linear-gradient(135deg, 
              ${theme.colors.highlights[0]}CC 0%, 
              ${theme.colors.highlights[1]}AA 50%, 
              ${theme.colors.highlights[2]}BB 100%);
            padding: 50px 60px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 2px solid ${theme.colors.accent[0]}40;
            box-shadow: 
              0 15px 35px ${theme.colors.shadows[1]}30, 
              inset 0 1px 0 ${theme.colors.highlights[0]}60,
              0 0 0 1px ${theme.colors.accent[0]}20;
            max-width: 900px;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(45deg, 
                ${theme.colors.accent[0]}20 0%, 
                transparent 50%, 
                ${theme.colors.accent[1]}15 100%);
              border-radius: 22px;
              z-index: -1;
            "></div>
            ${wisdom}
          </div>
        </div>
      </foreignObject>
      
      <!-- Final elegant overlay -->
      <rect width="100%" height="100%" fill="url(#softHighlight)" opacity="0.1"/>
      
      <!-- Subtle border frame -->
      <rect x="20" y="20" width="1160" height="760" rx="15" ry="15" 
            fill="none" stroke="${theme.colors.accent[0]}" stroke-width="1" opacity="0.15"/>
    </svg>
  `;

  // Convert SVG to base64 data URI
  const base64Svg = Buffer.from(svgContent).toString('base64');
  console.log('✅ Created elegant toilet-inspired background, size:', Math.round(base64Svg.length / 1024), 'KB');
  
  return `data:image/svg+xml;base64,${base64Svg}`;
}