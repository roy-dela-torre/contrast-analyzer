'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface InputFormProps {
  onAnalyze: (data: { type: 'url' | 'files'; url?: string; html?: string; css?: string }) => void;
  isLoading: boolean;
  activeTab: 'url' | 'files';
  onTabChange: (tab: 'url' | 'files') => void;
}

export default function InputForm({ onAnalyze, isLoading, activeTab, onTabChange }: InputFormProps) {
  const [url, setUrl] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [cssFiles, setCssFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'url') {
      if (!url.trim()) {
        alert('Please enter a URL');
        return;
      }
      onAnalyze({ type: 'url', url: url.trim() });
    } else {
      if (!htmlFile && cssFiles.length === 0) {
        alert('Please upload at least one file');
        return;
      }

      const html = htmlFile ? await readFileAsText(htmlFile) : '';
      const cssContents = await Promise.all(cssFiles.map(readFileAsText));
      const css = cssContents.join('\n');

      onAnalyze({ type: 'files', html, css });
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleCssFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setCssFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name));
      const newFiles = selected.filter(f => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });
    e.target.value = '';
  };

  const removeCssFile = (index: number) => {
    setCssFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-8 w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tab Switcher */}
      <div className="flex gap-4 mb-6 border-b border-cyber-blue/20 pb-4">
        <button
          onClick={() => onTabChange('url')}
          className={`px-6 py-3 rounded-lg font-display text-sm transition-all ${
            activeTab === 'url'
              ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="mr-2">🔗</span>
          Analyze URL
        </button>
        <button
          onClick={() => onTabChange('files')}
          className={`px-6 py-3 rounded-lg font-display text-sm transition-all ${
            activeTab === 'files'
              ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="mr-2">📁</span>
          Upload Files
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'url' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-display text-cyber-blue mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-cyber-darker border border-cyber-blue/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-400 font-body">
              Enter any website URL to analyze its color contrast accessibility
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* HTML File */}
            <div>
              <label className="block text-sm font-display text-cyber-blue mb-2">
                HTML File (optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={(e) => setHtmlFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="html-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="html-upload"
                  className="block w-full px-4 py-3 bg-cyber-darker border border-cyber-blue/30 rounded-lg text-gray-400 cursor-pointer hover:border-cyber-purple transition-all"
                >
                  {htmlFile ? (
                    <span className="text-white">📄 {htmlFile.name}</span>
                  ) : (
                    <span>Click to upload HTML file</span>
                  )}
                </label>
              </div>
            </div>

            {/* CSS Files (multiple) */}
            <div>
              <label className="block text-sm font-display text-cyber-blue mb-2">
                CSS Files (optional — multiple allowed)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".css"
                  multiple
                  onChange={handleCssFiles}
                  className="hidden"
                  id="css-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="css-upload"
                  className="block w-full px-4 py-3 bg-cyber-darker border border-cyber-blue/30 rounded-lg text-gray-400 cursor-pointer hover:border-cyber-purple transition-all"
                >
                  {cssFiles.length > 0 ? (
                    <span className="text-cyber-blue">+ Add more CSS files</span>
                  ) : (
                    <span>Click to upload CSS file(s)</span>
                  )}
                </label>
              </div>

              {cssFiles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {cssFiles.map((file, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between px-3 py-2 bg-cyber-darker border border-cyber-blue/20 rounded-lg text-sm"
                    >
                      <span className="text-white">🎨 {file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCssFile(i)}
                        className="text-gray-500 hover:text-cyber-pink transition-colors ml-3 text-xs"
                        disabled={isLoading}
                      >
                        ✕ remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-xs text-gray-400 font-body">
              Upload your HTML and/or CSS files to analyze color contrast
            </p>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full py-4 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink rounded-lg font-display font-bold text-white shadow-lg hover:shadow-cyber-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          <span className="relative z-10">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              '🚀 Analyze Contrast'
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </form>
    </motion.div>
  );
}
