"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, X, Check } from "lucide-react"

export default function CredibilityShowcase() {
  return (
    <section id="credibility-showcase" className="bg-black text-white py-20 px-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,233,86,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,233,86,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Credibility Showcase</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            See how our AI distinguishes between credible and questionable content.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Low Credibility Card */}
          <motion.div
            className="relative bg-gradient-to-br from-red-900/20 to-purple-900/20 backdrop-blur-sm border border-red-800/30 rounded-2xl p-8 hover:border-red-700/50 transition-all duration-300"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Score Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Low Credibility Score: 32%</h3>
                <p className="text-red-400 text-sm">Multiple red flags detected</p>
              </div>
            </div>

            {/* Article Title */}
            <h4 className="text-lg font-semibold text-white mb-4">Example Article Title with Misleading Claims</h4>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              This article contains several unverified claims, emotional language, and lacks credible sources. Our AI
              detected inconsistencies with established facts.
            </p>

            {/* Red Flags */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-gray-300">No verifiable sources cited</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-gray-300">Emotional manipulation detected</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-gray-300">Contradicts established research</span>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
          </motion.div>

          {/* High Credibility Card */}
          <motion.div
            className="relative bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-sm border border-green-800/30 rounded-2xl p-8 hover:border-green-700/50 transition-all duration-300"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Score Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">High Credibility Score: 89%</h3>
                <p className="text-green-400 text-sm">Verified by multiple sources</p>
              </div>
            </div>

            {/* Article Title */}
            <h4 className="text-lg font-semibold text-white mb-4">Example Article with Well-Supported Information</h4>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              This article presents information that is well-supported by credible sources, uses neutral language, and
              aligns with expert consensus.
            </p>

            {/* Green Checks */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-gray-300">Multiple credible sources cited</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-gray-300">Neutral, fact-based language</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-gray-300">Consistent with expert consensus</span>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
// This code defines a CredibilityShowcase component that displays a section comparing low and high credibility articles with animated cards.