"use client"

import { motion } from "framer-motion"
import { Building2, Newspaper, Shield, Globe } from "lucide-react"

export default function TrustedBy() {
  const trustedOrganizations = [
    {
      icon: Building2,
      name: "Academia Trust",
      delay: 0.1,
    },
    {
      icon: Newspaper,
      name: "Media Watch",
      delay: 0.2,
    },
    {
      icon: Shield,
      name: "Truth Defense",
      delay: 0.3,
    },
    {
      icon: Globe,
      name: "Global Facts",
      delay: 0.4,
    },
  ]

  return (
    <section className="bg-gray-900 text-white py-20 px-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,233,86,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,233,86,0.1)_1px,transparent_1px)] bg-[size:80px_80px]" />
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted By</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Join the growing community of organizations and individuals fighting misinformation.
          </p>
        </motion.div>

        {/* Trust Organizations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
          {trustedOrganizations.map((org, index) => {
            const IconComponent = org.icon
            return (
              <motion.div
                key={org.name}
                className="flex flex-col items-center text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: org.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Organization Name */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
                  {org.name}
                </h3>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
