'use client'

import { TrendingUp, Shield, Globe, BarChart3, Lock, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function InvestorHighlights() {
  const highlights = [
    {
      icon: TrendingUp,
      title: 'Proven Returns',
      description: 'Average annual ROI of 17% with consistent monthly payouts',
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'End-to-End Management',
      description: 'Fully hands-off control with professional property management',
      color: 'bg-blue-500'
    },
    {
      icon: Globe,
      title: 'Diverse Portfolio',
      description: 'Prime tourist and emerging market properties worldwide',
      color: 'bg-purple-500'
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'Protected transactions with multiple payment gateways',
      color: 'bg-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Real-time Dashboard',
      description: 'Track ROI and performance metrics in real-time',
      color: 'bg-indigo-500'
    },
    {
      icon: FileText,
      title: 'Regular Reports',
      description: 'Detailed monthly reports on property performance',
      color: 'bg-pink-500'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Invest with <span className="text-gradient">Habibistay</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of successful investors earning passive income through our managed property portfolio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-habibistay-blue text-white rounded-xl hover:bg-habibistay-600 transition-all transform hover:scale-105 shadow-lg font-semibold">
              Start Investing Today
            </button>
            <button className="px-8 py-3 bg-white text-habibistay-blue border-2 border-habibistay-blue rounded-xl hover:bg-gray-50 transition-all font-semibold">
              Download Investment Guide
            </button>
          </div>
        </motion.div>

        {/* Investment Calculator CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-habibistay-blue to-habibistay-600 rounded-2xl p-8 text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">Calculate Your Potential Returns</h3>
            <p className="text-lg mb-6 text-white/90">
              Use our investment calculator to see how much you could earn with Habibistay
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">$10,000</div>
                <div className="text-sm text-white/80">Minimum Investment</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">$1,700</div>
                <div className="text-sm text-white/80">Annual Return (17%)</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">$141</div>
                <div className="text-sm text-white/80">Monthly Passive Income</div>
              </div>
            </div>
            <button className="px-8 py-3 bg-white text-habibistay-blue rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg font-semibold">
              Try Investment Calculator
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}