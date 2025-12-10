"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function CallToAction({ onSignUpClick }) {
  const [nodes, setNodes] = useState([])

  // Generate neural network nodes
  useEffect(() => {
    const generateNodes = () => {
      const nodeCount = 15
      const newNodes = []

      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.7 + 0.3,
          animationDelay: Math.random() * 2,
        })
      }

      setNodes(newNodes)
    }

    generateNodes()
  }, [])

  return (
    <section className="relative bg-black text-white py-24 px-6 overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />

        {/* Animated neural network nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute bg-[#10e956] rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [node.opacity, node.opacity * 0.3, node.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: node.animationDelay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Connecting lines between nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {nodes.map((node, index) =>
            nodes.slice(index + 1).map((otherNode, otherIndex) => {
              const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))

              // Only draw lines between nearby nodes
              if (distance < 25) {
                return (
                  <motion.line
                    key={`${index}-${otherIndex}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${otherNode.x}%`}
                    y2={`${otherNode.y}%`}
                    stroke="#10e956"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: [0, 1, 0],
                      opacity: [0, 0.4, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 3,
                      ease: "easeInOut",
                    }}
                  />
                )
              }
              return null
            }),
          )}
        </svg>

        {/* Additional glowing particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[#10e956] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 1, 0.3],
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join the movement to combat misinformation.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-gray-300 text-sm md:text-base mt-4 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Empower yourself with AI-driven tools to verify information and make informed decisions in an era of
          information overload.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={onSignUpClick}
            className="bg-[#10e956] hover:bg-[#0dd149] text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-[#10e956]/25 hover:shadow-xl hover:shadow-[#10e956]/40"
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started For Free
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  )
}
