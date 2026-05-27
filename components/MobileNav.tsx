"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      href: "/add-expense",
      icon: <PlusCircle size={18} />,
      label: "Add",
    },
    {
      href: "/analytics",
      icon: <TrendingUp size={18} />,
      label: "Analytics",
    },
    {
      href: "/settings",
      icon: <Settings size={18} />,
      label: "Settings",
    },
  ];

  return (
    <div className="md:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-3 py-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition ${
                pathname === item.href
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}