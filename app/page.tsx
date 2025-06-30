"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { WebcamCapture } from "@/components/webcam-capture";
import { ConversationInterface } from "@/components/conversation-interface";
import { GrowthTimeline } from "@/components/growth-timeline";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral");

  const handleStart = () => {
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black light:bg-light-gradient relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 light:bg-purple-500/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 dark:bg-pink-500/10 light:bg-pink-500/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <Brain className="w-20 h-20 text-cyan-400 animate-float" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 gradient-neon dark:gradient-neon light:gradient-neon-light bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              FutureMe Live
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 dark:text-slate-300 light:text-slate-700 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Experience the future of self-reflection through AI-powered conversations
              <br />
              with your future self, guided by real-time emotion detection.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="glass-strong text-white dark:text-white light:text-gray-800 border-cyan-500/50 hover:border-cyan-400 neon-glow dark:neon-glow light:neon-glow-light hover:neon-glow transition-all duration-300 px-8 py-6 text-lg font-semibold group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Start Your Journey
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                {
                  title: "Emotion Detection",
                  description: "Real-time analysis of your emotional state",
                  icon: "😊",
                },
                {
                  title: "AI Future Self",
                  description: "Personalized responses from your future self",
                  icon: "🔮",
                },
                {
                  title: "Growth Timeline",
                  description: "Track your emotional journey over time",
                  icon: "📈",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass p-6 rounded-2xl hover:glass-strong transition-all duration-300 hover:neon-glow-purple dark:hover:neon-glow-purple light:hover:neon-glow-purple-light"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white dark:text-white light:text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 dark:text-slate-300 light:text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black light:bg-light-gradient">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto p-4 space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-4xl font-bold gradient-neon dark:gradient-neon light:gradient-neon-light bg-clip-text text-transparent mb-2">
            FutureMe Live
          </h1>
          <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">
            Having a conversation with your future self
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <WebcamCapture
              onEmotionChange={setCurrentEmotion}
              emotion={currentEmotion}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <ConversationInterface currentEmotion={currentEmotion} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GrowthTimeline />
        </motion.div>
      </div>
    </div>
  );
}