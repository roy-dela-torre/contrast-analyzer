'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import InputForm from '@/components/InputForm';
import Results from '@/components/Results';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { ContrastReport } from '@/utils/colorContrast';

export default function Home() {
  const [report, setReport] = useState<ContrastReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'files'>('url');
  const [showUploadHint, setShowUploadHint] = useState(false);

  const handleAnalyze = async (data: { 
    type: 'url' | 'files'; 
    url?: string; 
    html?: string; 
    css?: string 
  }) => {
    setIsLoading(true);
    setError(null);
    setShowUploadHint(false);
    
    try {
      let response;
      
      if (data.type === 'url') {
        response = await axios.post('/api/analyze-url', { url: data.url });
      } else {
        response = await axios.post('/api/analyze-files', { 
          html: data.html, 
          css: data.css 
        });
      }
      
      setReport(response.data);
    } catch (err: any) {
      const serverError = err.response?.data?.details || err.response?.data?.error || err.message || 'An error occurred during analysis';
      setError(serverError);
      if (data.type === 'url' && err.response?.status === 422) {
        setShowUploadHint(true);
      }
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <main className="min-h-screen cyber-grid relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-display font-bold text-gradient mb-4 glitch-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            CONTRAST
            <br />
            ANALYZER
          </motion.h1>
          <motion.p
            className="text-lg text-gray-400 font-body max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Analyze website color contrast • WCAG 2.1 compliance checker • 
            Accessibility made easy
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="px-4 py-2 bg-cyber-blue/20 border border-cyber-blue/30 rounded-full text-xs font-display text-cyber-blue">
              ✓ WCAG AA/AAA
            </span>
            <span className="px-4 py-2 bg-cyber-purple/20 border border-cyber-purple/30 rounded-full text-xs font-display text-cyber-purple">
              📊 Detailed Reports
            </span>
            <span className="px-4 py-2 bg-cyber-pink/20 border border-cyber-pink/30 rounded-full text-xs font-display text-cyber-pink">
              🎨 Color Fixes
            </span>
            <span className="px-4 py-2 bg-cyber-green/20 border border-cyber-green/30 rounded-full text-xs font-display text-cyber-green">
              💾 Export PDF/JSON
            </span>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          {!report ? (
            <>
              <InputForm
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              
              {error && (
                <motion.div
                  className="glass-card rounded-xl p-6 border border-cyber-pink/50 max-w-3xl w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-cyber-pink mb-1">
                        Analysis Failed
                      </h3>
                      <p className="text-sm text-gray-300 font-body">{error}</p>
                      {showUploadHint && (
                        <div className="mt-3 p-3 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg">
                          <p className="text-xs text-cyber-blue font-body mb-2">
                            💡 This site blocks automated requests. You can download the page source and upload it directly instead.
                          </p>
                          <button
                            onClick={() => {
                              setActiveTab('files');
                              setError(null);
                              setShowUploadHint(false);
                            }}
                            className="text-xs font-display font-bold text-white bg-gradient-to-r from-cyber-blue to-cyber-purple px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Switch to Upload Files →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* How It Works */}
              <motion.div
                className="glass-card rounded-2xl p-8 max-w-3xl w-full mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h2 className="text-2xl font-display font-bold text-gradient mb-6">
                  How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl">
                      1
                    </div>
                    <h3 className="font-display font-bold text-white mb-2">Input</h3>
                    <p className="text-sm text-gray-400 font-body">
                      Enter a URL or upload HTML/CSS files
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-purple to-cyber-pink rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl">
                      2
                    </div>
                    <h3 className="font-display font-bold text-white mb-2">Analyze</h3>
                    <p className="text-sm text-gray-400 font-body">
                      We extract and check all color combinations
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-pink to-cyber-green rounded-lg flex items-center justify-center mx-auto mb-3 text-2xl">
                      3
                    </div>
                    <h3 className="font-display font-bold text-white mb-2">Fix</h3>
                    <p className="text-sm text-gray-400 font-body">
                      Get accessible color alternatives & export
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <Results report={report} onReset={handleReset} />
          )}
        </div>

        {/* Footer */}
        <motion.footer
          className="text-center mt-16 text-gray-500 text-sm font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>Built with Next.js • Following WCAG 2.1 Guidelines</p>
          <p className="mt-2">
            Made with <span className="text-cyber-pink">♥</span> for accessibility
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
