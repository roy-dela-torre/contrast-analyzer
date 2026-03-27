'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorPair, ContrastReport, formatRatio, generateAccessibleColors } from '@/utils/colorContrast';
import { generatePDFReport, generateJSONReport } from '@/utils/exportReport';

interface ResultsProps {
  report: ContrastReport;
  onReset: () => void;
}

export default function Results({ report, onReset }: ResultsProps) {
  const [selectedPair, setSelectedPair] = useState<ColorPair | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const handleExportPDF = () => {
    generatePDFReport(report);
  };

  const handleExportJSON = () => {
    generateJSONReport(report);
  };

  const failedPairs = report.colorPairs.filter(p => !p.wcagAA);
  const passedPairs = report.colorPairs.filter(p => p.wcagAA);

  return (
    <motion.div
      className="w-full max-w-7xl space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-gradient">
              Analysis Complete
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-body">
              {report.url}
            </p>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-cyber-darker border border-cyber-blue/30 rounded-lg text-cyber-blue hover:bg-cyber-blue hover:text-white transition-all"
          >
            ← New Analysis
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-cyber-darker/50 rounded-xl p-4 border border-cyber-blue/20">
            <div className="text-3xl font-display font-bold text-white">
              {report.totalPairs}
            </div>
            <div className="text-sm text-gray-400 mt-1">Total Color Pairs</div>
          </div>
          
          <div className="bg-cyber-darker/50 rounded-xl p-4 border border-cyber-green/20">
            <div className="text-3xl font-display font-bold text-cyber-green">
              {report.passed}
            </div>
            <div className="text-sm text-gray-400 mt-1">Passed WCAG AA</div>
          </div>
          
          <div className="bg-cyber-darker/50 rounded-xl p-4 border border-cyber-pink/20">
            <div className="text-3xl font-display font-bold text-cyber-pink">
              {report.failed}
            </div>
            <div className="text-sm text-gray-400 mt-1">Failed WCAG AA</div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleExportPDF}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg font-display text-white hover:shadow-lg hover:shadow-cyber-purple/50 transition-all"
          >
            📄 Export PDF
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-lg font-display text-white hover:shadow-lg hover:shadow-cyber-pink/50 transition-all"
          >
            💾 Export JSON
          </button>
        </div>
      </div>

      {/* Failed Pairs */}
      {failedPairs.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-display font-bold text-cyber-pink mb-4">
            ⚠️ Failed Pairs ({failedPairs.length})
          </h3>
          <div className="space-y-3">
            {failedPairs.map((pair, idx) => (
              <ColorPairCard
                key={idx}
                pair={pair}
                onClick={() => {
                  setSelectedPair(pair);
                  setShowAlternatives(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Passed Pairs */}
      {passedPairs.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-display font-bold text-cyber-green mb-4">
            ✓ Passed Pairs ({passedPairs.length})
          </h3>
          <div className="space-y-3">
            {passedPairs.slice(0, 10).map((pair, idx) => (
              <ColorPairCard key={idx} pair={pair} />
            ))}
            {passedPairs.length > 10 && (
              <p className="text-sm text-gray-400 text-center mt-4">
                ... and {passedPairs.length - 10} more passed pairs
              </p>
            )}
          </div>
        </div>
      )}

      {/* Alternative Colors Modal */}
      <AnimatePresence>
        {showAlternatives && selectedPair && (
          <AlternativesModal
            pair={selectedPair}
            onClose={() => setShowAlternatives(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ColorPairCard({ pair, onClick }: { pair: ColorPair; onClick?: () => void }) {
  return (
    <motion.div
      className={`bg-cyber-darker/50 rounded-lg p-4 border ${
        pair.wcagAA ? 'border-cyber-green/20' : 'border-cyber-pink/20'
      } ${onClick ? 'cursor-pointer hover:border-cyber-purple transition-all' : ''}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Color Preview */}
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded-lg border border-white/20"
              style={{ backgroundColor: pair.foreground }}
              title={pair.foreground}
            />
            <div
              className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center"
              style={{ backgroundColor: pair.background, color: pair.foreground }}
            >
              <span className="text-xs font-bold">Aa</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-xs text-cyber-blue font-body">{pair.foreground}</code>
              <span className="text-gray-600">/</span>
              <code className="text-xs text-cyber-purple font-body">{pair.background}</code>
            </div>
            <div className="text-xs text-gray-400 font-body">{pair.selector}</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-right">
          <div className={`text-lg font-display font-bold ${
            pair.wcagAA ? 'text-cyber-green' : 'text-cyber-pink'
          }`}>
            {formatRatio(pair.contrastRatio)}
          </div>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded ${
              pair.wcagAA ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-pink/20 text-cyber-pink'
            }`}>
              AA {pair.wcagAA ? '✓' : '✗'}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              pair.wcagAAA ? 'bg-cyber-green/20 text-cyber-green' : 'bg-gray-700 text-gray-400'
            }`}>
              AAA {pair.wcagAAA ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AlternativesModal({ pair, onClose }: { pair: ColorPair; onClose: () => void }) {
  const alternatives = generateAccessibleColors(pair.foreground, pair.background, 4.5);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-card rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-display font-bold text-gradient">
            Color Palette Suggestions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Original */}
        <div className="mb-6">
          <h4 className="text-sm font-display text-gray-400 mb-3">Original (Failed)</h4>
          <div className="bg-cyber-darker/50 rounded-lg p-4 border border-cyber-pink/20">
            <div className="flex items-center gap-4">
              <div
                className="w-24 h-24 rounded-lg border border-white/20 flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: pair.background, color: pair.foreground }}
              >
                Aa
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-2">Contrast Ratio</div>
                <div className="text-2xl font-display font-bold text-cyber-pink">
                  {formatRatio(pair.contrastRatio)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {pair.foreground} / {pair.background}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div>
          <h4 className="text-sm font-display text-gray-400 mb-3">
            Accessible Alternatives (WCAG AA ✓)
          </h4>
          <div className="space-y-3">
            {alternatives.length > 0 ? (
              alternatives.map((alt, idx) => {
                const ratio = pair.contrastRatio; // Recalculate for accurate display
                return (
                  <div key={idx} className="bg-cyber-darker/50 rounded-lg p-4 border border-cyber-green/20">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-24 h-24 rounded-lg border border-white/20 flex items-center justify-center text-2xl font-bold"
                        style={{ 
                          backgroundColor: alt.adjustedBackground, 
                          color: alt.adjustedForeground 
                        }}
                      >
                        Aa
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-2">Solution {idx + 1}</div>
                        <div className="text-lg font-display font-bold text-cyber-green">
                          {formatRatio(4.5)} (Meets WCAG AA)
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {alt.adjustedForeground} / {alt.adjustedBackground}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-8">
                No accessible alternatives could be generated while maintaining the color scheme.
                Consider using high-contrast colors.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
