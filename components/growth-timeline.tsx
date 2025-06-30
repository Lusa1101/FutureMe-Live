"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Heart, Brain } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineEntry {
  id: string;
  date: Date;
  emotion: string;
  snippet: string;
  mood: "positive" | "neutral" | "growth";
  insights: number;
}

const mockData: TimelineEntry[] = [
  {
    id: "1",
    date: new Date(2024, 0, 15),
    emotion: "anxious",
    snippet: "You were nervous about job interviews",
    mood: "growth",
    insights: 3,
  },
  {
    id: "2",
    date: new Date(2024, 0, 18),
    emotion: "excited",
    snippet: "Feeling optimistic about new opportunities",
    mood: "positive",
    insights: 5,
  },
  {
    id: "3",
    date: new Date(2024, 0, 22),
    emotion: "calm",
    snippet: "Found peace through meditation practice",
    mood: "positive",
    insights: 4,
  },
  {
    id: "4",
    date: new Date(2024, 0, 25),
    emotion: "confused",
    snippet: "Wrestling with career direction decisions",
    mood: "growth",
    insights: 6,
  },
  {
    id: "5",
    date: new Date(2024, 0, 28),
    emotion: "happy",
    snippet: "Celebrated small wins and progress made",
    mood: "positive",
    insights: 2,
  },
  {
    id: "6",
    date: new Date(2024, 1, 2),
    emotion: "neutral",
    snippet: "Reflecting on recent changes and adjustments",
    mood: "neutral",
    insights: 3,
  },
  {
    id: "7",
    date: new Date(2024, 1, 8),
    emotion: "excited",
    snippet: "Started a new creative project with enthusiasm",
    mood: "positive",
    insights: 7,
  },
  {
    id: "8",
    date: new Date(2024, 1, 12),
    emotion: "anxious",
    snippet: "Worried about upcoming presentation",
    mood: "growth",
    insights: 4,
  },
];

const emotionColors = {
  happy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  anxious: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  excited: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  calm: "bg-green-500/20 text-green-400 border-green-500/30",
  confused: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const moodIcons = {
  positive: <Heart className="w-4 h-4 text-pink-400" />,
  neutral: <Calendar className="w-4 h-4 text-gray-400" />,
  growth: <TrendingUp className="w-4 h-4 text-green-400" />,
};

export function GrowthTimeline() {
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white dark:text-white light:text-gray-800">Growth Timeline</h2>
        </div>
        <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-600">
          {mockData.length} conversations tracked
        </div>
      </div>

      <ScrollArea className="h-80 w-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass p-4 rounded-xl cursor-pointer border transition-all duration-300 hover:scale-105 ${
                selectedEntry?.id === entry.id 
                  ? 'neon-glow dark:neon-glow light:neon-glow-light border-cyan-500/50' 
                  : 'border-white/10 dark:border-white/10 light:border-gray-300/30 hover:border-white/20 dark:hover:border-white/20 light:hover:border-gray-400/40'
              }`}
              onClick={() => setSelectedEntry(entry)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {moodIcons[entry.mood]}
                  <span className="text-sm font-medium text-white dark:text-white light:text-gray-800">
                    {entry.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-white/60 dark:text-white/60 light:text-gray-600">
                  <Brain className="w-3 h-3" />
                  <span>{entry.insights}</span>
                </div>
              </div>

              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                  emotionColors[entry.emotion as keyof typeof emotionColors]
                }`}>
                  {entry.emotion}
                </span>
              </div>

              <p className="text-sm text-white/80 dark:text-white/80 light:text-gray-700 leading-relaxed line-clamp-2">
                {entry.snippet}
              </p>

              <div className="mt-3 h-1 bg-white/10 dark:bg-white/10 light:bg-gray-300/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(entry.insights / 7) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass p-4 rounded-xl border border-cyan-500/30 neon-glow dark:neon-glow light:neon-glow-light"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-800">
              Conversation Details
            </h3>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-white/60 dark:text-white/60 light:text-gray-500 hover:text-white dark:hover:text-white light:hover:text-gray-700 transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {selectedEntry.insights}
              </div>
              <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-600">Insights Gained</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold capitalize ${
                selectedEntry.mood === 'positive' ? 'text-green-400' :
                selectedEntry.mood === 'growth' ? 'text-purple-400' : 'text-gray-400'
              }`}>
                {selectedEntry.mood}
              </div>
              <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-600">Overall Mood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">
                {selectedEntry.emotion === 'happy' ? '😊' :
                 selectedEntry.emotion === 'anxious' ? '😟' :
                 selectedEntry.emotion === 'excited' ? '🤩' :
                 selectedEntry.emotion === 'calm' ? '😌' :
                 selectedEntry.emotion === 'confused' ? '🤔' : '😐'}
              </div>
              <div className="text-sm text-white/60 dark:text-white/60 light:text-gray-600 capitalize">
                {selectedEntry.emotion}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-gray-300/30">
            <p className="text-sm text-white/80 dark:text-white/80 light:text-gray-700 leading-relaxed">
              <strong>Full conversation snippet:</strong> {selectedEntry.snippet}
            </p>
            <div className="mt-2 text-xs text-white/60 dark:text-white/60 light:text-gray-600">
              Date: {selectedEntry.date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}