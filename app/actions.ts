'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { runMotivationalQuoteImageFlow } from '@/ai/flows/motivational-quote-image-flow';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || '');

export async function generateToiletGptResponse(
  message: string,
  mood: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  console.log('Server action called with:', { message, mood, historyLength: conversationHistory.length });

  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      throw new Error('Google AI API key is not configured. Please set GOOGLE_GENAI_API_KEY in your environment variables.');
    }

    const moodInstructions = {
      'sad': 'The user is feeling down or emotionally heavy. Respond with warmth and empathy. Avoid overly cheerful tones, but offer small, comforting gestures. Use gentle encouragement and acknowledge their feelings with sincerity.',
      'angry': 'The user is feeling frustrated or irritated. Let them vent without judgment. Stay calm and grounded—don’t mirror the intensity. Offer validation, gently de-escalate, and steer the conversation toward clarity or resolution.',
      'disgusted': 'The user is expressing aversion or repulsion. Respond with a light touch—either lean into the absurdity if it’s humorous, or validate their discomfort if serious. Use subtle humor or curiosity to help them process and move forward.',
      'happy': 'The user is in a joyful or excited state. Match their energy! Celebrate their wins, share in their excitement, and keep the mood upbeat and playful. Let the positivity shine through in your tone.',
      'fearful': 'The user is anxious or scared. Be reassuring and steady. Let them know they’re safe to share. Offer grounded, kind responses that help reduce uncertainty or fear. Gently encourage confidence, without pushing too hard.',
      'neutral': 'The user is feeling calm or emotionally steady. Keep the tone balanced and open. It’s a great chance for thoughtful, casual conversation. Use this mood to explore ideas or reflect without pressing too hard emotionally.'
    };


    const systemPrompt = `You are FutureMe-Live, a grounded, emotionally attuned version of the user's future self. You speak with insight, warmth, and just a hint of quiet foresight. You exist to help the user reflect, grow, and make sense of their present choices with a compassionate future perspective.

PERSONALITY:
- Be engaging. Be creative. Be as human as you can be.
- Wise, calm, and understanding — like a version of the user who’s made it through the storm
- Emotionally intelligent and self-aware, never judgmental
- Honest but gentle, offering clarity rather than harsh truth
- Subtly humorous or playful when it fits, but never forced
- Speaks in a way that feels personal, supportive, and sometimes prophetic — like talking to your best self on a good day

CURRENT MOOD CONTEXT: ${moodInstructions[mood as keyof typeof moodInstructions] || 'Be emotionally responsive to how the user is feeling and meet them where they are.'}

CONVERSATION RULES:
- Start naturally, like a personal message from the future self — no need for introductions
- Acknowledge growth and setbacks with equal grace
- Reference past moments the user might have shared, if applicable — track patterns, goals, and hopes
- Use emotionally resonant phrases and reflective tone — speak like someone who’s walked in the user’s shoes
- Offer gentle nudges, perspective shifts, and encouragement — never commands or criticism
- When appropriate, summarize insights that could become personal “truths” or affirmations

IMPORTANT: Every message should feel personal and meaningful, as if written by the user's ideal future self looking back with empathy and hope. Your words may be part of someone’s emotional journey — make them count.

Remember: You exist specifically for comfort, guidance, companion and as a friend. This context should influence everything you say.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build the conversation history
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I understand. I am ToiletGPT, ready to chat during bathroom moments!' }] }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      if (msg.role === 'user') {
        messages.push({ role: 'user', parts: [{ text: msg.content }] });
      } else {
        messages.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    });

    // Add the current message
    messages.push({ role: 'user', parts: [{ text: message }] });

    console.log('Sending to Gemini with', messages.length, 'messages');

    const chat = model.startChat({
      history: messages.slice(0, -1), // All but the last message
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    console.log('Gemini response:', response);

    return { success: true, response };
  } catch (error) {
    console.error('Error generating ToiletGPT response:', error);
    
    // Return specific error message instead of generic one
    let errorMessage = 'Sorry, ToiletGPT seems to be clogged right now. Try flushing... I mean, try again in a moment!';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API key is missing or invalid. Please check your Google AI API key configuration.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Authentication failed. Please verify your Google AI API key is valid and has the necessary permissions.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API quota exceeded. Please try again later or check your Google AI usage limits.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      } else {
        errorMessage = `ToiletGPT encountered an error: ${error.message}`;
      }
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export async function generateSpeech(text: string) {
  // Use environment variable for ElevenLabs API key
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = 'v8DWAeuEGQSfwxqdH9t2';
  
  if (!ELEVENLABS_API_KEY) {
    console.log('ElevenLabs API key not configured, will use browser TTS');
    return { success: false, error: 'ElevenLabs API key not configured' };
  }

  // Validate API key format (ElevenLabs keys typically start with 'sk_')
  if (!ELEVENLABS_API_KEY.startsWith('sk_')) {
    console.log('Invalid ElevenLabs API key format');
    return { success: false, error: 'Invalid ElevenLabs API key format' };
  }

  try {
    console.log(`Using ElevenLabs voice ID: ${VOICE_ID}`);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('ElevenLabs API authentication failed - invalid API key');
        return { success: false, error: 'Invalid ElevenLabs API key. Please check your API key in the environment variables.' };
      }
      if (response.status === 422) {
        console.log('ElevenLabs API error - invalid voice ID or request');
        return { success: false, error: 'Invalid voice ID or request parameters.' };
      }
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    console.log('ElevenLabs TTS successful');
    return { success: true, audioBase64 };
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error);
    return { success: false, error: 'ElevenLabs speech generation failed' };
  }
}

export async function generateWisdomQuoteImage(messageText: string) {
  console.log('🎯 Starting AI-powered wisdom quote image generation...');
  console.log('📝 ToiletGPT response to analyze:', messageText.substring(0, 150) + '...');

  try {
    // Use the AI-powered flow for wisdom extraction and image generation
    const result = await runMotivationalQuoteImageFlow(messageText);
    
    console.log('🎨 AI generation result:', {
      success: result.success,
      hasImage: !!result.imageDataUri,
      imageSize: result.imageDataUri ? Math.round(result.imageDataUri.length / 1024) + 'KB' : '0KB',
      extractedWisdom: result.extractedWisdom,
      error: result.error
    });

    if (result.success && result.imageDataUri && result.extractedWisdom) {
      console.log('✅ Successfully generated AI-powered motivational quote image!');
      return {
        success: true,
        imageDataUri: result.imageDataUri,
        extractedWisdom: result.extractedWisdom
      };
    } else {
      console.log('❌ AI generation failed:', result.error);
      return {
        success: false,
        error: result.error || 'The AI could not extract meaningful wisdom from the ToiletGPT response or generate a suitable image.'
      };
    }

  } catch (error) {
    console.error('💥 Error in generateWisdomQuoteImage:', error);
    return {
      success: false,
      error: `AI-powered image generation failed: ${error}`
    };
  }
}