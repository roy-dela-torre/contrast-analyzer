'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('cyber-dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'cyber-dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: string) => {
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const themes = [
    { 
      id: 'cyber-dark', 
      name: 'Cyber Dark', 
      colors: ['#0a0e27', '#00d4ff', '#b84fff'],
      icon: '🌙'
    },
    { 
      id: 'cyber-purple', 
      name: 'Neon Purple', 
      colors: ['#1a0f2e', '#b84fff', '#ff2e97'],
      icon: '💜'
    },
    { 
      id: 'cyber-green', 
      name: 'Matrix Green', 
      colors: ['#0d1b0d', '#00ff88', '#00d4ff'],
      icon: '🟢'
    },
    { 
      id: 'cyber-orange', 
      name: 'Sunset Orange', 
      colors: ['#1a0f0a', '#ff6b35', '#ffeb3b'],
      icon: '🔥'
    },
  ];

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    applyTheme(themeId);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="glass-card rounded-xl p-3 flex gap-2">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              theme === t.id 
                ? 'ring-2 ring-cyber-blue shadow-lg shadow-cyber-blue/50' 
                : 'hover:ring-1 hover:ring-cyber-purple/50'
            }`}
            style={{
              background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}, ${t.colors[2]})`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={t.name}
          >
            <span className="text-xl">{t.icon}</span>
            {theme === t.id && (
              <motion.div
                className="absolute inset-0 border-2 border-cyber-blue rounded-lg"
                layoutId="activeTheme"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
