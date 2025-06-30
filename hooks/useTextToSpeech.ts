'use client';

import { useState, useCallback, useRef } from 'react';
import { generateSpeech } from '@/app/actions';
import { toast } from 'sonner';

interface UseTextToSpeechReturn {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  stop: () => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop browser speech synthesis
    if (speechSynthRef.current) {
      speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (isSpeaking) {
      stop();
    }

    setIsSpeaking(true);

    try {
      console.log('Attempting ElevenLabs TTS...');
      // Try ElevenLabs first with the configured voice
      const result = await generateSpeech(text);
      
      if (result.success && result.audioBase64) {
        console.log('ElevenLabs TTS successful, playing audio...');
        const audio = new Audio(`data:audio/mpeg;base64,${result.audioBase64}`);
        audioRef.current = audio;
        
        audio.onended = () => {
          console.log('ElevenLabs audio playback ended');
          setIsSpeaking(false);
        };

        audio.onerror = (error) => {
          console.error('ElevenLabs audio playback error:', error);
          console.log('Falling back to browser TTS');
          fallbackToSpeechSynthesis(text);
        };

        await audio.play();
        console.log('ElevenLabs audio started playing');
      } else {
        console.log('ElevenLabs failed, reason:', result.error);
        // Fallback to browser speech synthesis
        fallbackToSpeechSynthesis(text);
      }
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      fallbackToSpeechSynthesis(text);
    }
  }, [isSpeaking, stop]);

  const fallbackToSpeechSynthesis = useCallback((text: string) => {
    console.log('Using browser speech synthesis fallback');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthRef.current = utterance;
      
      utterance.onstart = () => {
        console.log('Browser TTS started');
      };
      
      utterance.onend = () => {
        console.log('Browser TTS ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (error) => {
        console.error('Browser TTS error:', error);
        setIsSpeaking(false);
        toast.error('Text-to-speech is not available');
      };

      // Try to find a natural-sounding voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Natural') ||
        voice.default
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name);
      } else {
        console.log('Using default browser voice');
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    } else {
      console.error('Browser speech synthesis not supported');
      setIsSpeaking(false);
      toast.error('Text-to-speech is not supported in your browser');
    }
  }, []);

  return {
    speak,
    isSpeaking,
    stop,
  };
}