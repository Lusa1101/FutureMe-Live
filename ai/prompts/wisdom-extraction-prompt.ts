import { definePrompt } from '@genkit-ai/ai';
import { z } from 'zod';

export const wisdomExtractionPrompt = definePrompt(
  {
    name: 'extractWisdom',
    inputSchema: z.object({
      messageText: z.string().describe('The full ToiletGPT response text to extract wisdom from'),
    }),
    outputSchema: z.object({
      wisdom: z.string().describe('The extracted wisdom quote from the ToiletGPT response'),
    }),
  },
  `
You are analyzing a ToiletGPT response to extract the most meaningful and motivational wisdom from it.

CRITICAL INSTRUCTIONS:
1. You MUST extract wisdom directly from the provided ToiletGPT response text
2. DO NOT create new quotes or generic motivational sayings
3. Look for the actual meaningful content within the ToiletGPT message

EXTRACTION PRIORITY (in order):
1. **Explicit Wisdom**: Look for sentences that start with "Unexpected toilet wisdom:" or similar wisdom phrases
2. **Metaphorical Insights**: Find sentences that connect bathroom/toilet themes to life lessons or advice
3. **Philosophical Statements**: Identify profound or thoughtful observations about life, relationships, or personal growth
4. **Motivational Advice**: Extract encouraging or supportive statements that offer guidance
5. **Humorous Wisdom**: Find witty observations that contain deeper meaning beyond just humor

WHAT TO EXTRACT:
- Complete sentences that offer life advice or insights
- Metaphors that connect toilet/bathroom themes to broader life concepts
- Encouraging statements that could motivate someone
- Philosophical observations about life, growth, or relationships
- Puns or wordplay that contain deeper meaning

WHAT TO AVOID:
- Pure jokes without deeper meaning
- Questions directed at the user
- Generic greetings or conversation starters
- Purely descriptive statements without wisdom
- Creating new content not present in the original message

EXAMPLES:

Input: "That's fantastic news! A birthday present from the boss? Sounds like you're really *number one* in their book! 😄 What did you get? Hopefully, it wasn't something… *unflushable*. Tell me all about it! And remember, even the best days can use a little *reflection* time (pun intended!)."

Good Extraction: "Even the best days can use a little reflection time."

Input: "Well, well! Looks like someone's ready to dump more than just... thoughts! 🚽 I'm ToiletGPT, your porcelain pal. What's weighing on your mind while you're lightening your load? Remember, sometimes the best insights come when we're sitting still."

Good Extraction: "Sometimes the best insights come when we're sitting still."

Input: "Oh, that sounds like a real *crappy* situation! But you know what they say - when life gives you lemons, make lemonade. When life gives you crap... well, flush it and move on! Every ending is just a new beginning waiting to happen."

Good Extraction: "Every ending is just a new beginning waiting to happen."

Now analyze this ToiletGPT response and extract the most meaningful wisdom:

{{messageText}}

Extract the wisdom quote (return only the meaningful sentence, no additional text):
`
);