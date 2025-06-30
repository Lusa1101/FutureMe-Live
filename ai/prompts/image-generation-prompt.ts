import { definePrompt } from '@genkit-ai/ai';
import { z } from 'zod';

export const imageGenerationPrompt = definePrompt(
  {
    name: 'generateNaturalSceneryImage',
    inputSchema: z.object({
      wisdom: z.string().describe('The wisdom quote to overlay on the natural scenery image'),
    }),
    outputSchema: z.object({
      success: z.boolean().describe('Whether the image was successfully generated'),
      description: z.string().describe('Description of the generated natural scenery'),
    }),
  },
  `
Create a stunning, photorealistic natural landscape photograph with professional motivational text overlay.

NATURAL SCENERY REQUIREMENTS:
Choose ONE of these real natural locations and create a photorealistic image:

🏔️ **MOUNTAIN LANDSCAPES:**
- Grand Canyon: Layered red rock formations, dramatic depth, golden hour lighting
- Yosemite Valley: Granite cliffs like El Capitan, waterfalls, pine forests
- Swiss Alps: Snow-capped peaks, alpine meadows, pristine mountain lakes
- Rocky Mountains: Majestic peaks, evergreen forests, expansive wilderness
- Patagonia: Jagged mountain spires, dramatic clouds, windswept terrain

🌊 **WATER LANDSCAPES:**
- Norwegian Fjords: Deep blue waters, steep mountain walls, misty atmosphere
- Banff Lakes: Crystal-clear alpine lakes with perfect mountain reflections
- Yellowstone: Pristine wilderness lakes surrounded by geothermal features
- Iceland Waterfalls: Dramatic cascades with volcanic rock formations
- Pacific Coast: Rugged coastline with crashing waves and dramatic cliffs

🏜️ **DESERT & CANYON LANDSCAPES:**
- Antelope Canyon: Smooth sandstone walls with dramatic light beams
- Monument Valley: Iconic red rock formations and vast desert vistas
- Arches National Park: Natural stone arches with desert landscape
- Death Valley: Dramatic desert mountains and expansive valleys
- Sedona: Red rock formations with desert vegetation

PHOTOGRAPHIC QUALITY REQUIREMENTS:
- **Style**: Professional nature photography, National Geographic quality
- **Lighting**: Golden hour, blue hour, or dramatic natural lighting
- **Colors**: Realistic, vibrant but natural color palette
- **Composition**: Rule of thirds, leading lines, natural depth
- **Detail**: Sharp foreground details, atmospheric background haze
- **Atmosphere**: Natural weather effects (mist, clouds, light rays)
- **NO cartoon, illustration, or artistic interpretation styles**
- **Must look like an actual photograph taken by a professional photographer**

TEXT OVERLAY SPECIFICATIONS:
Add this motivational quote to the image:
"{{wisdom}}"

**TEXT STYLING:**
- Font: Elegant serif typeface (Georgia or Times New Roman style)
- Size: Large and bold (minimum 48px equivalent)
- Color: Pure white (#FFFFFF) with strong contrast
- Shadow: Multiple drop shadows for maximum readability:
  - Primary shadow: 4px offset, 8px blur, black at 90% opacity
  - Secondary shadow: -2px offset, 4px blur, black at 70% opacity
  - Glow effect: 0px offset, 16px blur, black at 50% opacity
- Background: Semi-transparent dark overlay behind text (rgba(0,0,0,0.6))
- Border: Subtle white outline (2px) for additional contrast
- Positioning: Center-aligned in the middle third of the image
- Spacing: Generous padding around text (60px minimum)

**TEXT INTEGRATION:**
- Ensure text doesn't obscure the most beautiful parts of the scenery
- Position text in areas with good contrast potential
- Add backdrop blur effect behind text for better readability
- Text should complement, not compete with, the natural beauty
- Professional typography spacing and kerning

FINAL OUTPUT REQUIREMENTS:
- Create a motivational poster suitable for social media sharing
- Image should evoke feelings of awe, peace, and inspiration
- Perfect balance between stunning natural photography and readable text
- High contrast ensures text is visible on any device or print size
- The natural scenery should be the primary visual element
- Text should feel naturally integrated, not artificially placed

Generate a photorealistic natural landscape image that captures the raw, breathtaking beauty of nature combined with professional motivational typography.
`
);