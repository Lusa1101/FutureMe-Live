"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Volume2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ConversationInterfaceProps {
  currentEmotion: string;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  emotion?: string;
  timestamp: Date;
}

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const emotionResponses = {
  happy: {
    responses: [
      "I love seeing you this happy! In my future, this joy has led to some incredible opportunities. What's bringing you this happiness?",
      "Your happiness is infectious! I remember this feeling - it's what motivated me to take that big leap forward.",
      "This radiant joy you're feeling? It becomes the foundation for so many beautiful moments ahead. Tell me more!",
    ],
    style: "gradient-to-r from-yellow-400 to-orange-500",
    glow: "neon-glow-pink",
  },
  sad: {
    responses: [
      "I see the sadness in your heart. In our future, this difficult time teaches us profound lessons about resilience. You're stronger than you know.",
      "These tears you're shedding? They water the seeds of wisdom that bloom in our future. What's weighing on your heart?",
      "I remember this sadness. It's hard now, but it shapes us into someone more compassionate and understanding.",
    ],
    style: "gradient-to-r from-blue-400 to-indigo-500",
    glow: "neon-glow",
  },
  angry: {
    responses: [
      "I feel that fire in you. In our future, we learn to channel this passion into positive change. What's stirring this anger?",
      "That anger? It's actually your inner strength demanding justice. We learn to use it wisely in the years ahead.",
      "I remember this intensity. It becomes the fuel for some of our most important stands and achievements.",
    ],
    style: "gradient-to-r from-red-500 to-pink-500",
    glow: "neon-glow-pink",
  },
  surprised: {
    responses: [
      "Your surprise delights me! These unexpected moments become some of our most treasured memories. What caught you off guard?",
      "I love that wide-eyed wonder! In our future, we learn to seek out more of these surprising moments.",
      "That beautiful surprise you're feeling? It opens doors we never even knew existed. Tell me what amazed you!",
    ],
    style: "gradient-to-r from-orange-400 to-yellow-500",
    glow: "neon-glow-pink",
  },
  fearful: {
    responses: [
      "I understand that fear. Take a deep breath - in our future, we've learned that courage isn't the absence of fear, but action despite it.",
      "That fear you're feeling? It's actually your intuition protecting you. We learn to listen to it while still moving forward.",
      "I remember being afraid too. But every fear we face makes us braver for the next challenge. What's frightening you?",
    ],
    style: "gradient-to-r from-purple-500 to-indigo-600",
    glow: "neon-glow-purple",
  },
  disgusted: {
    responses: [
      "I sense your disgust. Sometimes our strongest reactions point us toward what we need to change. What's bothering you?",
      "That feeling of disgust? It's your values speaking loudly. In our future, we use this clarity to make better choices.",
      "I remember feeling this way too. It's actually a sign of your integrity - you know what doesn't align with who you are.",
    ],
    style: "gradient-to-r from-green-500 to-teal-500",
    glow: "neon-glow",
  },
  neutral: {
    responses: [
      "Sometimes the neutral moments are the most important - they're when we can think clearly. What's on your mind?",
      "I appreciate these balanced moments. They're when we make our most thoughtful decisions. How can I help you today?",
      "This calm equilibrium you're in? It's perfect for deep reflection. What would you like to explore together?",
    ],
    style: "gradient-to-r from-gray-400 to-slate-500",
    glow: "neon-glow",
  },
};

export function ConversationInterface({ currentEmotion }: ConversationInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        
        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
          setInterimTranscript("");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setInterimTranscript(interimTranscript);
          
          if (finalTranscript) {
            setInputValue(prev => prev + finalTranscript);
            setInterimTranscript("");
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setIsListening(false);
          setInterimTranscript("");
          
          switch (event.error) {
            case 'not-allowed':
              setSpeechError('Microphone access denied. Please allow microphone access and try again.');
              break;
            case 'no-speech':
              setSpeechError('No speech detected. Please try again.');
              break;
            case 'audio-capture':
              setSpeechError('No microphone found. Please check your microphone connection.');
              break;
            case 'network':
              setSpeechError('Network error occurred. Please check your internet connection.');
              break;
            default:
              setSpeechError(`Speech recognition error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript("");
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      emotion: currentEmotion,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response with emotion-aware responses using current emotion
    setTimeout(() => {
      const emotionData = emotionResponses[currentEmotion as keyof typeof emotionResponses] || emotionResponses.neutral;
      const response = emotionData.responses[Math.floor(Math.random() * emotionData.responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        emotion: currentEmotion,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const toggleListening = () => {
    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch (error) {
        setSpeechError('Failed to start speech recognition. Please try again.');
        setIsListening(false);
      }
    }
  };

  const emotionData = emotionResponses[currentEmotion as keyof typeof emotionResponses] || emotionResponses.neutral;

  return (
    <div className="glass-strong rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white dark:text-white light:text-gray-800">Future You</h2>
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-green-400">Online</span>
        </div>
      </div>

      {/* Speech Recognition Status */}
      {!speechSupported && (
        <div className="mb-4 p-3 glass rounded-lg border border-yellow-500/30">
          <div className="flex items-center space-x-2 text-yellow-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Speech recognition not supported in this browser</span>
          </div>
        </div>
      )}

      {speechError && (
        <div className="mb-4 p-3 glass rounded-lg border border-red-500/30">
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{speechError}</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-4 rounded-2xl",
                  message.type === "user"
                    ? "bg-white/10 dark:bg-white/10 light:bg-black/10 text-white dark:text-white light:text-gray-800 ml-4"
                    : `bg-gradient-to-r ${
                        message.emotion 
                          ? (emotionResponses[message.emotion as keyof typeof emotionResponses] || emotionResponses.neutral).style
                          : emotionData.style
                      } text-white mr-4 ${
                        message.emotion 
                          ? (emotionResponses[message.emotion as keyof typeof emotionResponses] || emotionResponses.neutral).glow
                          : emotionData.glow
                      } dark:${
                        message.emotion 
                          ? (emotionResponses[message.emotion as keyof typeof emotionResponses] || emotionResponses.neutral).glow
                          : emotionData.glow
                      } light:${
                        (message.emotion 
                          ? (emotionResponses[message.emotion as keyof typeof emotionResponses] || emotionResponses.neutral).glow
                          : emotionData.glow
                        ).replace('neon-glow', 'neon-glow-light')
                      }`
                )}
              >
                {message.type === "ai" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm opacity-80">Future You</span>
                    {message.emotion && (
                      <span className="text-xs opacity-60 capitalize">
                        responding to: {message.emotion}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl mr-4",
              `bg-gradient-to-r ${emotionData.style} text-white animate-glow-pulse dark:animate-glow-pulse light:animate-glow-pulse-light`
            )}>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm opacity-80">Future You</span>
              </div>
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            value={inputValue + interimTranscript}
            onChange={(e) => setInputValue(e.target.value.replace(interimTranscript, ''))}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Share what's on your mind..."
            className="glass border-white/20 dark:border-white/20 light:border-gray-300/50 text-white dark:text-white light:text-gray-800 placeholder:text-white/60 dark:placeholder:text-white/60 light:placeholder:text-gray-500 pr-12"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleListening}
            disabled={!speechSupported}
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8",
              isListening ? "text-red-400 animate-pulse" : "text-white/60 dark:text-white/60 light:text-gray-500 hover:text-white dark:hover:text-white light:hover:text-gray-700",
              !speechSupported && "opacity-50 cursor-not-allowed"
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>
        <Button
          onClick={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          className={cn(
            "glass-strong border-cyan-500/50 hover:border-cyan-400 transition-all duration-300",
            emotionData.glow,
            "dark:" + emotionData.glow,
            "light:" + emotionData.glow.replace('neon-glow', 'neon-glow-light')
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Speech Recognition Status */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <span className="text-sm text-red-400 flex items-center justify-center space-x-2">
            <motion.div
              className="w-2 h-2 bg-red-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span>Listening... Speak now</span>
          </span>
          {interimTranscript && (
            <div className="mt-1 text-xs text-white/60 dark:text-white/60 light:text-gray-600 italic">
              "{interimTranscript}"
            </div>
          )}
        </motion.div>
      )}

      {speechSupported && !isListening && !speechError && (
        <div className="mt-2 text-center">
          <span className="text-xs text-white/40 dark:text-white/40 light:text-gray-500">
            Click the microphone to use voice input
          </span>
        </div>
      )}
    </div>
  );
}