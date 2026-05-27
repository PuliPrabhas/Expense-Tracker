"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import MobileNav from "@/components/MobileNav";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  PiggyBank,
  Brain,
  Settings,
  LogOut,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Expense = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  paymentMode: string;
  date: string;
};

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(10000);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const [expensesRes, userRes] = await Promise.all([
        fetch("/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const expensesData = await expensesRes.json();
      const userData = await userRes.json();

      if (expensesData.success) {
        setExpenses(expensesData.expenses);
      }

      if (userData.success && userData.user?.monthlyBudget) {
        setMonthlyBudget(userData.user.monthlyBudget);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expenseId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const budgetLeft = monthlyBudget - totalSpent;
  const budgetUsage = (totalSpent / monthlyBudget) * 100;

  const chartData = expenses.map((expense) => ({
    month: new Date(expense.date).toLocaleDateString("en-IN", {
      month: "short",
    }),
    expense: expense.amount,
  }));

  const getAIInsights = () => {
    if (expenses.length === 0) {
      return [
        "No spending data yet. Add expenses for AI insights.",
      ];
    }

    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) +
        expense.amount;
    });

    const highestCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    const insights = [];

    if (highestCategory) {
      insights.push(
        `${highestCategory} is your highest spending category.`
      );
    }

    if (budgetUsage >= 100) {
      insights.push(
        "Alert: You have exceeded your monthly budget."
      );
    } else if (budgetUsage >= 80) {
      insights.push(
        `Warning: You have used ${Math.round(
          budgetUsage
        )}% of your budget.`
      );
    }

    if (expenses.length >= 10) {
      insights.push(
        "You are making frequent transactions this month."
      );
    }

    if (insights.length === 0) {
      insights.push(
        "Your spending looks balanced this month."
      );
    }

    return insights;
  };

  const aiInsights = getAIInsights();

  return (
    <AuthGuard>
      <MobileNav />
      <main className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 hidden md:flex flex-col">
          <h1 className="text-3xl font-bold text-cyan-400 mb-10">
            ExpenseAI
          </h1>

          <nav className="space-y-4">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
            />

            <Link href="/add-expense">
              <SidebarItem
                icon={<PlusCircle size={20} />}
                text="Add Expense"
              />
            </Link>

            <Link href="/analytics">
  <SidebarItem
    icon={<TrendingUp size={20} />}
    text="Analytics"
  />
</Link>

            <Link href="/settings">
              <SidebarItem
                icon={<Settings size={20} />}
                text="Settings"
              />
            </Link>

            <div onClick={handleLogout} className="cursor-pointer">
              <SidebarItem
                icon={<LogOut size={20} />}
                text="Logout"
              />
            </div>
          </nav>
        </aside>

        {/* Main */}
        <section className="flex-1 p-8 overflow-y-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8"
          >
            Dashboard Overview
          </motion.h1>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Expenses"
              value={`₹${totalSpent}`}
              icon={<Wallet size={24} />}
            />

            <StatCard
              title="Budget Left"
              value={`₹${budgetLeft}`}
              icon={<PiggyBank size={24} />}
            />

            <StatCard
              title="Transactions"
              value={`${expenses.length}`}
              icon={<TrendingUp size={24} />}
            />

            <StatCard
              title="Monthly Budget"
              value={`₹${monthlyBudget}`}
              icon={<Brain size={24} />}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold mb-6">
                Expense Trend
              </h2>

              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#06b6d4"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No expense data yet
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold mb-6">
                AI Insights
              </h2>

              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <InsightCard key={index} text={insight} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6">
              Recent Transactions
            </h2>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : expenses.length === 0 ? (
              <p className="text-gray-400">
                No expenses added yet
              </p>
            ) : (
              <div className="space-y-4">
                {expenses.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-white/10 rounded-2xl p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.description}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {item.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-bold">
                        ₹{item.amount}
                      </p>

                      <button
                        onClick={() =>
                          handleDeleteExpense(item._id)
                        }
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}

function SidebarItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-white/10 transition text-left">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
    >
      <div className="text-cyan-400 mb-4">{icon}</div>
      <p className="text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </motion.div>
  );
}

function InsightCard({ text }: { text: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 text-sm">
      {text}
    </div>
  );
}