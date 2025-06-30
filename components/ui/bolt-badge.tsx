'use client';

import { ExternalLink } from 'lucide-react';

export function BoltBadge() {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center gap-2 px-3 py-1.5 
        bg-gradient-to-r from-purple-600 to-blue-600 
        hover:from-purple-700 hover:to-blue-700
        text-white text-sm font-medium rounded-full
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        border border-white/20 backdrop-blur-sm
      "
    >
      <span className="text-xs">⚡</span>
      <span>Built with Bolt.new</span>
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}