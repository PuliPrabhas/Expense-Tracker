"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DollarSign,
  FileText,
  Calendar,
  CreditCard,
  ChevronDown,
} from "lucide-react";

export default function AddExpensePage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const detectCategory = (text: string) => {
    const input = text.toLowerCase();

    if (
      input.includes("swiggy") ||
      input.includes("zomato") ||
      input.includes("food") ||
      input.includes("restaurant") ||
      input.includes("dinner") ||
      input.includes("lunch") ||
      input.includes("breakfast")
    ) {
      return "Food";
    }

    if (
      input.includes("uber") ||
      input.includes("ola") ||
      input.includes("bus") ||
      input.includes("train") ||
      input.includes("fuel") ||
      input.includes("petrol") ||
      input.includes("travel")
    ) {
      return "Travel";
    }

    if (
      input.includes("amazon") ||
      input.includes("flipkart") ||
      input.includes("shopping") ||
      input.includes("mall")
    ) {
      return "Shopping";
    }

    if (
      input.includes("electricity") ||
      input.includes("water bill") ||
      input.includes("wifi") ||
      input.includes("internet") ||
      input.includes("recharge")
    ) {
      return "Utilities";
    }

    if (
      input.includes("netflix") ||
      input.includes("movie") ||
      input.includes("spotify") ||
      input.includes("gaming")
    ) {
      return "Entertainment";
    }

    if (
      input.includes("hospital") ||
      input.includes("doctor") ||
      input.includes("medicine") ||
      input.includes("pharmacy") ||
      input.includes("apollo")
    ) {
      return "Health";
    }

    return "";
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setDescription(value);

    const detected = detectCategory(value);

    if (detected) {
      setCategory(detected);
    }
  };

  const handleAddExpense = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!amount || !description || !category || !paymentMode || !date) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          category,
          paymentMode,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add expense");
        setLoading(false);
        return;
      }

      setSuccess("Expense added successfully");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 h-72 w-72 bg-cyan-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-20 right-20 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <h1 className="text-4xl font-bold mb-2">Add New Expense</h1>

          <p className="text-gray-400 mb-8">
            Track your spending with smart expense management
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Amount */}
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Description */}
            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 text-white border border-white/10 rounded-2xl py-4 px-4 pr-12 outline-none focus:border-cyan-400 transition appearance-none"
              >
                <option value="">Select Category</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Utilities</option>
                <option>Entertainment</option>
                <option>Health</option>
              </select>

              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>

            {/* Payment Mode */}
            <div className="relative">
              <CreditCard
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-zinc-900 text-white border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-cyan-400 transition appearance-none"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Debit Card</option>
                <option>Credit Card</option>
                <option>Net Banking</option>
              </select>

              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>

            {/* Date */}
            <div className="relative md:col-span-2">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <button
            onClick={handleAddExpense}
            disabled={loading}
            className="w-full mt-8 py-4 rounded-2xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {loading ? "Adding Expense..." : "Add Expense"}
          </button>
        </motion.div>
      </main>
    </AuthGuard>
  );
}