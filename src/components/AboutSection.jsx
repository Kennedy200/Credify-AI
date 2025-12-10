"use client"

import { motion } from "framer-motion"
import { CheckCircle, Cpu, Shield, Users } from "lucide-react"
import bgImage from '../assets/About1.jpg' // Adjust the path to your background image;

export default function AboutSection() {
  const missionPoints = [
    "Advanced AI algorithms trained on millions of verified articles",
    "Partnerships with leading fact-checking organizations",
    "Continuous learning and adaptation to new misinformation trends",
  ]

  const stats = [
    { value: "2M+", label: "Articles analyzed daily" },
    { value: "98%", label: "Accuracy rate" },
    { value: "500K+", label: "Active users" },
    { value: "50+", label: "Partner organizations" },
  ]

  const features = [
    {
      icon: Cpu,
      title: "AI Technology",
      description: "State-of-the-art machine learning models for accurate content analysis.",
      delay: 0.2,
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Robust verification systems and partnerships with trusted sources.",
      delay: 0.4,
    },
    {
      icon: Users,
      title: "Community",
      description: "Growing network of truth-seekers and fact-checking experts.",
      delay: 0.6,
    },
  ]

  return (
    <section id="about" className="bg-black text-white py-20 px-6 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About Credify AI</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Empowering truth-seekers in the digital age with advanced AI technology.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#10e956] mb-6">Our Mission</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              At Credify AI, we're committed to making truth verification accessible to everyone. Our platform combines
              cutting-edge artificial intelligence with comprehensive fact-checking methodologies to help users navigate
              the complex landscape of online information.
            </p>

            <div className="space-y-4">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-5 h-5 text-[#10e956] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="border-b border-gray-700/50 pb-6 last:border-b-0 last:pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-bold text-[#10e956] mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-[#10e956]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#10e956]/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#10e956]/20 rounded-full flex items-center justify-center mb-6">
                  <IconComponent className="w-6 h-6 text-[#10e956]" />
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>

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
// This code defines an AboutSection component that displays information about the Credify AI platform, including its mission, key statistics, and features. It uses Framer Motion for animations and Lucide icons for visual elements.