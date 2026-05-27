"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Brain, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-20 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-wide">ExpenseAI</h1>

        <div className="flex gap-4">
          <Link href="/login">
            <button className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyan-400 font-medium mb-4">
            Intelligent Expense Management
          </p>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Track Smarter.
            <br />
            Spend Better.
          </h2>

          <p className="text-gray-400 text-lg mt-6 max-w-xl">
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

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-5">
              <p className="text-gray-400">Total Balance</p>
              <h3 className="text-3xl font-bold mt-2">₹24,500</h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-5">
              <p className="text-gray-400">This Month</p>
              <h3 className="text-3xl font-bold mt-2 text-red-400">₹8,200</h3>
            </div>

            <div className="col-span-2 bg-white/10 rounded-2xl p-5 h-52 flex items-center justify-center text-gray-400">
              Chart Preview
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 pb-20 max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">
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
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8"
            >
              <div className="text-cyan-400 mb-4">{feature.icon}</div>
              <h4 className="text-2xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}