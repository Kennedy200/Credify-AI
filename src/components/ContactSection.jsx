"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { MapPin, Mail, Phone, Twitter, Linkedin, Facebook, Instagram, CheckCircle } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would typically send the form data to your email service
    console.log("Form submitted:", formData)

    setIsLoading(false)
    setShowSuccess(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 5000)
  }

  const socialIcons = [
    { icon: Twitter, label: "Twitter" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Facebook, label: "Facebook" },
    { icon: Instagram, label: "Instagram" },
  ]

  return (
    <section id="contact" className="bg-gray-900 text-white py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have questions? We're here to help you navigate the world of information verification.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Contact Info Header */}
            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#10e956]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#10e956]" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Location</h4>
                <p className="text-gray-400">123 Tech Hub Street</p>
                <p className="text-gray-400">Innovation City, IC 12345</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#10e956]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#10e956]" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
                <p className="text-gray-400">contact@credifyai.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#10e956]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#10e956]" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Phone</h4>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-8">
              <h4 className="text-lg font-semibold text-white mb-6">Follow Us</h4>
              <div className="flex gap-4">
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <motion.div
                      key={social.label}
                      className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 cursor-default"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>

            {showSuccess ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-[#10e956]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-[#10e956]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Message Sent Successfully!</h4>
                <p className="text-gray-400">
                  Thank you for reaching out. The Credify AI team will reach out to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 transition-all duration-200"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message..."
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10e956] focus:ring-2 focus:ring-[#10e956]/20 transition-all duration-200 resize-none"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#10e956] hover:bg-[#0dd149] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-[#10e956]/25 hover:shadow-xl hover:shadow-[#10e956]/40 flex items-center justify-center gap-2"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
