"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Brain, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-4 md:top-20 md:left-20 h-52 w-52 md:h-72 md:w-72 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-4 md:bottom-20 md:right-20 h-52 w-52 md:h-72 md:w-72 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-5 md:py-6 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
          ExpenseAI
        </h1>

        <div className="flex gap-2 sm:gap-4">
          <Link href="/login">
            <button className="px-4 sm:px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition text-sm sm:text-base">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="px-4 sm:px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold text-sm sm:text-base">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-8 py-14 md:py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyan-400 font-medium mb-4 text-sm sm:text-base">
            Intelligent Expense Management
          </p>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
            Track Smarter.
            <br />
            Spend Better.
          </h2>

          <p className="text-gray-400 text-base sm:text-lg mt-6 max-w-xl leading-relaxed">
            AI-powered expense tracking with smart categorization, budget
            alerts, and futuristic analytics.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">
            <Link href="/register">
              <button className="px-6 py-4 rounded-2xl bg-cyan-500 text-black font-semibold flex items-center gap-2 hover:scale-105 transition">
                Get Started <ArrowRight size={18} />
              </button>
            </Link>

            <Link href="/dashboard">
              <button className="px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition">
                View Demo
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Premium Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/10 rounded-2xl p-4 sm:p-5">
              <p className="text-gray-400 text-sm sm:text-base">
                Total Balance
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                ₹24,500
              </h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 sm:p-5">
              <p className="text-gray-400 text-sm sm:text-base">
                This Month
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-red-400">
                ₹8,200
              </h3>
            </div>

            {/* Advanced Visual Analytics Preview */}
            <div className="col-span-2 bg-white/10 rounded-2xl p-4 sm:p-5 h-64 sm:h-72 relative overflow-hidden border border-white/5">
              {/* glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

              {/* line chart */}
              <svg
                className="absolute inset-0 w-full h-full opacity-70"
                viewBox="0 0 500 250"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="lineGlow" x1="0" x2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                <path
                  d="M 20 200 C 80 180, 120 150, 180 160 S 280 90, 340 110 S 430 60, 480 80"
                  fill="none"
                  stroke="url(#lineGlow)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>

              {/* floating info */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <div className="bg-black/40 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-lg">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      AI Insight
                    </p>
                    <p className="text-cyan-400 font-semibold text-sm sm:text-base">
                      Food spending ↑ 18%
                    </p>
                  </div>

                  <div className="bg-black/40 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-lg">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Budget Left
                    </p>
                    <p className="text-green-400 font-semibold text-sm sm:text-base">
                      ₹6,850
                    </p>
                  </div>
                </div>

                {/* animated bars */}
                <div className="flex items-end justify-between gap-2 sm:gap-3 h-28 sm:h-32">
                  {[45, 70, 55, 90, 65, 110, 85].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-xl shadow-lg animate-pulse"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 md:px-8 pb-16 md:pb-20 max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
          Smart Features
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Brain size={28} />,
              title: "AI Categorization",
              desc: "Automatically detect expense categories intelligently.",
            },
            {
              icon: <Wallet size={28} />,
              title: "Budget Alerts",
              desc: "Get notified before crossing your spending limits.",
            },
            {
              icon: <BarChart3 size={28} />,
              title: "Analytics",
              desc: "Beautiful charts and spending insights instantly.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8"
            >
              <div className="text-cyan-400 mb-4">{feature.icon}</div>
              <h4 className="text-xl md:text-2xl font-semibold mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}