"use client";
import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import MobileNav from "@/components/MobileNav";

export default function SettingsPage() {
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserBudget();
  }, []);

  const fetchUserBudget = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMonthlyBudget(String(data.user.monthlyBudget));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateBudget = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monthlyBudget: Number(monthlyBudget),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Update failed");
        return;
      }

      setSuccess("Budget updated successfully");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
        <MobileNav />
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-20 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-bold mb-2">
          Budget Settings
        </h1>

        <p className="text-gray-400 mb-8">
          Set your monthly spending limit
        </p>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-500/20 border border-red-500/30 p-4 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl bg-green-500/20 border border-green-500/30 p-4 text-green-300">
            {success}
          </div>
        )}

        <div className="relative">
          <PiggyBank
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            placeholder="Enter monthly budget"
            className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
          />
        </div>

        <button
          onClick={updateBudget}
          disabled={loading}
          className="w-full mt-8 py-4 rounded-2xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Budget"}
        </button>
      </motion.div>
    </main>
    </AuthGuard>
  );
}