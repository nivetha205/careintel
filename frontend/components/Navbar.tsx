"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Users, FileSearch, TrendingUp, Info } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <Activity size={20} /> },
    { name: "Patients", href: "/patients", icon: <Users size={20} /> },
    { name: "Analyze", href: "/analyze", icon: <FileSearch size={20} /> },
    { name: "Forecast", href: "/forecast", icon: <TrendingUp size={20} /> },
    { name: "Transparency", href: "/transparency", icon: <Info size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Activity size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareIntel AI</h1>
        </div>
        
        <nav className="flex space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === item.href
                  ? "bg-blue-50 text-primary border border-blue-100 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-primary">
            DR
          </div>
          <div className="hidden lg:block text-sm">
            <p className="font-semibold text-slate-800">Dr. Roberts</p>
            <p className="text-slate-500 text-xs">Medical Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
