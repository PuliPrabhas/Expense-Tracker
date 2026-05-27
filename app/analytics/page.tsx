"use client";

import { useEffect, useState } from "react";
import MobileNav from "@/components/MobileNav";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  LogOut,
  PlusCircle,
  Brain,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

type Expense = {
  _id: string;
  amount: number;
  description: string;
  category: string;
  paymentMode: string;
  date: string;
};

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(10000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const avgExpense =
    expenses.length > 0
      ? Math.round(totalSpent / expenses.length)
      : 0;

  const budgetUsage =
    monthlyBudget > 0
      ? Math.round((totalSpent / monthlyBudget) * 100)
      : 0;

  const categoryMap: Record<string, number> = {};
  const paymentMap: Record<string, number> = {};

  expenses.forEach((expense) => {
    categoryMap[expense.category] =
      (categoryMap[expense.category] || 0) +
      expense.amount;

    paymentMap[expense.paymentMode] =
      (paymentMap[expense.paymentMode] || 0) +
      expense.amount;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const paymentData = Object.entries(paymentMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const highestCategory =
    categoryData.length > 0
      ? categoryData.sort((a, b) => b.value - a.value)[0].name
      : "N/A";

  const chartColors = [
    "#06b6d4",
    "#8b5cf6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
  ];

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
            <Link href="/dashboard">
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
              />
            </Link>

            <Link href="/add-expense">
              <SidebarItem
                icon={<PlusCircle size={20} />}
                text="Add Expense"
              />
            </Link>

            <SidebarItem
              icon={<TrendingUp size={20} />}
              text="Analytics"
            />

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
            Analytics Dashboard
          </motion.h1>

          {loading ? (
            <p className="text-gray-400">Loading analytics...</p>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Spent"
                  value={`₹${totalSpent}`}
                />

                <StatCard
                  title="Transactions"
                  value={`${expenses.length}`}
                />

                <StatCard
                  title="Avg Expense"
                  value={`₹${avgExpense}`}
                />

                <StatCard
                  title="Top Category"
                  value={highestCategory}
                />
              </div>

              {/* Budget Utilization */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold mb-4">
                  Budget Utilization
                </h2>

                <div className="w-full bg-white/10 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{
                      width: `${Math.min(budgetUsage, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-gray-300">
                  {budgetUsage}% of monthly budget used
                </p>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Category Pie */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <h2 className="text-2xl font-semibold mb-6">
                    Category Breakdown
                  </h2>

                  {categoryData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <PieChart>
                          <Pie
                            data={categoryData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={110}
                          >
                            {categoryData.map((_, index) => (
                              <Cell
                                key={index}
                                fill={
                                  chartColors[
                                    index % chartColors.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      No data available
                    </p>
                  )}
                </div>

                {/* Payment Bar */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <h2 className="text-2xl font-semibold mb-6">
                    Payment Mode Analysis
                  </h2>

                  {paymentData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart data={paymentData}>
                          <XAxis dataKey="name" stroke="#aaa" />
                          <YAxis stroke="#aaa" />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#06b6d4"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      No data available
                    </p>
                  )}
                </div>
              </div>

              {/* AI Summary */}
              <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Brain size={24} />
                  AI Summary
                </h2>

                <div className="space-y-3 text-gray-300">
                  <p>
                    Highest spending category:{" "}
                    <span className="text-cyan-400">
                      {highestCategory}
                    </span>
                  </p>

                  <p>
                    Average transaction amount:{" "}
                    <span className="text-cyan-400">
                      ₹{avgExpense}
                    </span>
                  </p>

                  <p>
                    Budget consumption:{" "}
                    <span className="text-cyan-400">
                      {budgetUsage}%
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
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
}: {
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
    >
      <p className="text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </motion.div>
  );
}