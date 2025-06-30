"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Camera, CameraOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as faceapi from "face-api.js";

interface WebcamCaptureProps {
  onEmotionChange: (emotion: string) => void;
  emotion: string;
}

const emotions = [
  { name: "happy", emoji: "😊", color: "text-yellow-400" },
  { name: "sad", emoji: "😢", color: "text-blue-400" },
  { name: "angry", emoji: "😠", color: "text-red-400" },
  { name: "surprised", emoji: "😲", color: "text-orange-400" },
  { name: "fearful", emoji: "😨", color: "text-purple-400" },
  { name: "disgusted", emoji: "🤢", color: "text-green-400" },
  { name: "neutral", emoji: "😐", color: "text-gray-400" },
];

// Map face-api.js emotions to our emotion names
const emotionMapping: { [key: string]: string } = {
  happy: "happy",
  sad: "sad",
  angry: "angry",
  surprised: "surprised",
  fearful: "fearful",
  disgusted: "disgusted",
  neutral: "neutral",
};

export function WebcamCapture({ onEmotionChange, emotion }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [detectedEmotion, setDetectedEmotion] = useState("neutral");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Starting to load face-api.js models...');
        
        // Load models sequentially with better error handling
        try {
          console.log('Loading tiny face detector...');
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          console.log('Tiny face detector loaded successfully');
        } catch (err) {
          console.error('Failed to load tiny face detector:', err);
          throw new Error('Face detector model failed to load');
        }

        try {
          console.log('Loading face landmarks...');
          await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
          console.log('Face landmarks loaded successfully');
        } catch (err) {
          console.error('Failed to load face landmarks:', err);
          throw new Error('Face landmarks model failed to load');
        }

        try {
          console.log('Loading face expressions...');
          await faceapi.nets.faceExpressionNet.loadFromUri('/models');
          console.log('Face expressions loaded successfully');
        } catch (err) {
          console.error('Failed to load face expressions:', err);
          throw new Error('Face expressions model failed to load');
        }
        
        // Verify models are actually loaded
        if (!faceapi.nets.tinyFaceDetector.isLoaded || 
            !faceapi.nets.faceLandmark68Net.isLoaded || 
            !faceapi.nets.faceExpressionNet.isLoaded) {
          throw new Error('One or more models failed to load properly');
        }
        
        setIsModelLoaded(true);
        setIsLoading(false);
        console.log('All face-api models loaded successfully');
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load emotion detection models. Using fallback mode.');
        setIsLoading(false);
        setIsModelLoaded(false);
        
        // Set to neutral emotion as fallback
        setDetectedEmotion("neutral");
        onEmotionChange("neutral");
      }
    };

    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(loadModels, 100);
    return () => clearTimeout(timer);
  }, [onEmotionChange]);

  // Detect emotions from video stream
  const detectEmotions = useCallback(async () => {
    if (!webcamRef.current?.video || !isModelLoaded || !isEnabled) {
      return;
    }

    const video = webcamRef.current.video;
    
    // Check if video is ready
    if (video.readyState !== 4) {
      return;
    }
    
    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5
        }))
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        
        // Find the emotion with highest confidence
        let maxEmotion = 'neutral';
        let maxConfidence = 0;
        
        Object.entries(expressions).forEach(([emotion, confidence]) => {
          if (confidence > maxConfidence) {
            maxConfidence = confidence;
            maxEmotion = emotionMapping[emotion] || emotion;
          }
        });

        // Only update if confidence is above threshold (30%)
        if (maxConfidence > 0.3) {
          setDetectedEmotion(maxEmotion);
          setConfidence(maxConfidence);
          onEmotionChange(maxEmotion);
          setError(null); // Clear any previous errors on successful detection
        } else {
          // Low confidence - default to neutral
          setDetectedEmotion("neutral");
          setConfidence(0);
          onEmotionChange("neutral");
          setError(null); // Clear any previous errors
        }
      } else {
        // No face detected - default to neutral
        setDetectedEmotion("neutral");
        setConfidence(0);
        onEmotionChange("neutral");
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      console.error('Error detecting emotions:', err);
      // On detection error, also default to neutral
      setDetectedEmotion("neutral");
      setConfidence(0);
      onEmotionChange("neutral");
    }
  }, [isModelLoaded, isEnabled, onEmotionChange]);

  // Start/stop emotion detection
  useEffect(() => {
    if (isModelLoaded && isEnabled && webcamRef.current?.video) {
      // Start detection interval
      detectionIntervalRef.current = setInterval(detectEmotions, 1000); // Detect every second
      
      return () => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
      };
    }
  }, [isModelLoaded, isEnabled, detectEmotions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const currentEmotionData = emotions.find(e => e.name === detectedEmotion) || emotions[6];

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div className="glass-strong rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white dark:text-white light:text-gray-800">You</h2>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="flex items-center space-x-1 text-yellow-400 text-xs">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Loading AI...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-1 text-red-400 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>Fallback Mode</span>
            </div>
          )}
          {isModelLoaded && !error && (
            <div className="flex items-center space-x-1 text-green-400 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>AI Ready</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEnabled(!isEnabled)}
            className="text-white dark:text-white light:text-gray-700 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10"
          >
            {isEnabled ? (
              <Camera className="w-4 h-4" />
            ) : (
              <CameraOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black/50 dark:bg-black/50 light:bg-gray-200/50 aspect-video">
        {isEnabled ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              mirrored
            />
            
            {/* Emotion Overlay */}
            {(isModelLoaded || error) && (
              <motion.div
                key={detectedEmotion}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-4 left-4 glass p-3 rounded-lg"
              >
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl">{currentEmotionData.emoji}</span>
                  <div className="flex flex-col">
                    <span className={`font-medium capitalize ${currentEmotionData.color}`}>
                      {detectedEmotion}
                    </span>
                    <span className="text-xs text-white/60">
                      {error ? 'Manual' : confidence > 0 ? `${Math.round(confidence * 100)}%` : 'No face'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Loading emotion detection...</p>
                </div>
              </div>
            )}

            {/* Error Overlay - Show briefly then fade */}
            {error && isLoading === false && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute top-16 left-4 right-4 bg-red-500/20 border border-red-400/50 rounded-lg p-3"
              >
                <div className="text-center text-red-400">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Pulse Effect */}
            <motion.div
              className="absolute inset-0 border-4 border-cyan-400/50 rounded-xl"
              animate={{
                borderColor: [
                  "rgba(34, 211, 238, 0.5)",
                  "rgba(34, 211, 238, 0.8)",
                  "rgba(34, 211, 238, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/50 dark:text-white/50 light:text-gray-500">
            <div className="text-center">
              <CameraOff className="w-16 h-16 mx-auto mb-4" />
              <p>Camera is disabled</p>
            </div>
          </div>
        )}
      </div>

      {/* Emotion Stats */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/80 dark:text-white/80 light:text-gray-700">
            Recent Emotions
          </h3>
          {isModelLoaded && !error && (
            <span className="text-xs text-green-400">
              Real-time AI Detection
            </span>
          )}
          {error && (
            <span className="text-xs text-orange-400">
              Manual Mode
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {emotions.slice(0, 4).map((emotionItem) => (
            <motion.div
              key={emotionItem.name}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full glass text-sm cursor-pointer ${
                emotionItem.name === detectedEmotion ? 'neon-glow dark:neon-glow light:neon-glow-light' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (error) {
                  // Allow manual emotion selection in fallback mode
                  setDetectedEmotion(emotionItem.name);
                  onEmotionChange(emotionItem.name);
                  setConfidence(1);
                }
              }}
            >
              <span>{emotionItem.emoji}</span>
              <span className={`capitalize ${emotionItem.color}`}>
                {emotionItem.name}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Confidence indicator */}
        {(isModelLoaded || error) && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-white/60 dark:text-white/60 light:text-gray-600 mb-1">
              <span>Detection Status</span>
              <span>
                {error ? 'Manual selection enabled' : 
                 confidence > 0 ? `${Math.round(confidence * 100)}% confidence` : 'No face detected'}
              </span>
            </div>
            <div className="w-full bg-white/10 dark:bg-white/10 light:bg-gray-300/30 rounded-full h-1">
              <motion.div
                className={`h-full rounded-full ${
                  error ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: error ? '100%' : `${confidence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}