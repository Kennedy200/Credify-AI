"use client"

import { motion } from "framer-motion"
import { FileText, BarChart3, Search, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const features = [
    {
      icon: FileText,
      title: "Analyze",
      description: "Paste or link to any article, social media post, or news story. Our AI will scan the content.",
      delay: 0.2,
    },
    {
      icon: BarChart3,
      title: "Score",
      description:
        "Get a credibility score backed by trusted sources, fact-checking databases, and linguistic analysis.",
      delay: 0.4,
    },
    {
      icon: Search,
      title: "Trace",
      description: "See how claims spread through the web and discover the original sources behind the information.",
      delay: 0.6,
    },
  ]

  return (
    <section id="how-it-works" className="bg-black text-white py-20 px-6 relative">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our advanced AI technology analyzes content across multiple dimensions to determine credibility.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="group relative bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-[#10e956]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#10e956]/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#10e956]/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#10e956]/30 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-[#10e956]" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>

                {/* Learn More Link */}
                <motion.a
                  href="#"
                  className="inline-flex items-center gap-2 text-[#10e956] hover:text-[#0dd149] font-medium transition-colors duration-300 group/link"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </motion.a>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#10e956]/0 via-[#10e956]/5 to-[#10e956]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
// This code defines a HowItWorks component that displays a section explaining how the service works, with animated feature cards.