"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-20 right-20 h-72 w-72 bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">
          Sign in to manage your expenses smarter
        </p>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-500/20 border border-red-500/30 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-cyan-400 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-cyan-400 cursor-pointer"
          >
            Register
          </span>
        </p>
      </motion.div>
    </main>
  );
}