"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { LogOut, Calendar, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiRequest("/auth/me");
        if (user.role !== "ADMIN") {
          router.push("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      router.push("/");
    } catch (e) {
      router.push("/");
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row pt-20 md:pt-24 pb-12 relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 px-4 md:px-6 py-4 md:py-8 flex flex-row md:flex-col relative md:fixed h-auto md:h-[calc(100vh-6rem)] md:top-24 bg-background/90 md:bg-background/50 backdrop-blur-xl z-20 items-center md:items-stretch justify-between">
        <h2 className="font-serif text-2xl font-bold mb-10 text-gold hidden md:block">Admin Portal</h2>
        
        <nav className="flex flex-row md:flex-col flex-1 overflow-x-auto no-scrollbar gap-2 md:gap-0 md:space-y-4 font-sans text-sm">
          <Link href="/admin" className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl transition-all whitespace-nowrap ${pathname === '/admin' ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Appointments
          </Link>
          <Link href="/admin/patients" className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl transition-all whitespace-nowrap ${pathname === '/admin/patients' ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Users className="w-4 h-4 md:w-5 md:h-5" /> Patients
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl transition-all whitespace-nowrap ${pathname === '/admin/settings' ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Settings className="w-4 h-4 md:w-5 md:h-5" /> Security
          </Link>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all md:mt-auto font-sans text-sm font-bold whitespace-nowrap">
          <LogOut className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto md:ml-64 p-4 md:p-8 relative z-10 font-sans mt-4 md:mt-0">
        {children}
      </main>
    </div>
  );
}
