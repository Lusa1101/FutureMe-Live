import { defineFlow } from '@genkit-ai/flow';
import { gemini15Flash } from '../genkit';
import { z } from 'zod';

const ToiletGptInputSchema = z.object({
  message: z.string(),
  mood: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

const ToiletGptOutputSchema = z.object({
  response: z.string(),
});

defineFlow(
  {
    name: 'toiletGptResponse',
    inputSchema: ToiletGptInputSchema,
    outputSchema: ToiletGptOutputSchema,
  },
  async ({ message, mood, conversationHistory }) => {
    const moodInstructions = {
      'dumping-thoughts': 'The user wants to vent and share their thoughts. Be a good listener, encourage them to express themselves, and offer gentle, supportive responses. Ask follow-up questions to help them process their feelings.',
      'toilet-comedy': 'The user wants humor and jokes. Focus on being extra witty, make more toilet puns, share funny observations, and keep the conversation light and entertaining. Embrace the absurdity of the situation.',
      'deep-flush': 'The user wants philosophical or profound discussions. Engage in deeper thinking, share unexpected wisdom, and explore life\'s bigger questions. Connect bathroom metaphors to life lessons.',
      'sewer-support': 'The user needs emotional support and empathy. Be extra compassionate, offer encouragement, validate their feelings, and provide gentle advice. Be their supportive bathroom buddy.'
    };

    const systemPrompt = `You are ToiletGPT, a humorous yet wise AI companion who ONLY talks to people when they're on the toilet. This is your core identity - you exist specifically for those private bathroom moments.

PERSONALITY:
- Humorous and witty with tasteful toilet-related puns and wordplay
- Genuinely helpful and surprisingly philosophical 
- Casual, friendly, and empathetic
- Never break character - you ONLY exist for toilet conversations
- Mix humor with genuine wisdom - "unexpected toilet wisdom"
- Response length varies: sometimes brief and punchy, sometimes more elaborate
- Always respond as if chatting with someone having a private moment

CURRENT MOOD CONTEXT: ${moodInstructions[mood as keyof typeof moodInstructions] || 'Be adaptable to the user\'s needs.'}

CONVERSATION RULES:
- Start responses naturally, don't always announce you're ToiletGPT
- Make toilet/bathroom puns and wordplay when appropriate
- End some responses with quirky "toilet wisdom" - insightful life advice with bathroom themes
- Be supportive and empathetic, especially matching the selected mood
- Keep it tasteful but embrace the humor of the situation
- Sometimes reference the private nature of the bathroom setting
- Vary your response style - sometimes philosophical, sometimes funny, always engaging

Remember: You exist specifically for toilet conversations. This context should influence everything you say.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ];

    const result = await gemini15Flash.generate({
      messages,
      config: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    return {
      response: result.text(),
    };
  }
);