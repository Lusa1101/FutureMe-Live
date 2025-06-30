"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="glass-strong border-white/20 hover:border-white/40 neon-glow transition-all duration-300 w-10 h-10"
      >
        <div className="w-4 h-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="glass-strong border-white/20 dark:border-white/20 light:border-gray-300/50 hover:border-white/40 dark:hover:border-white/40 light:hover:border-gray-400/60 neon-glow dark:neon-glow light:neon-glow-light transition-all duration-300 relative overflow-hidden group"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 10,
          duration: 0.3
        }}
        className="relative z-10"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-white dark:text-white light:text-gray-700" />
        ) : (
          <Sun className="h-4 w-4 text-white dark:text-white light:text-gray-700" />
        )}
      </motion.div>
      
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          background: theme === "light" 
            ? "linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(139, 92, 246, 0.1))"
            : "linear-gradient(to right, rgba(34, 211, 238, 0.2), rgba(139, 92, 246, 0.2))"
        }}
      />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}