"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Lock, Phone } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"patient" | "admin">("patient");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = loginType === "patient" 
        ? { phone } 
        : { username, password };

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/portal");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10 px-6"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-3xl text-white font-medium mb-2">Secure Access</h1>
            <p className="font-sans text-slate-400 text-sm">Sign in to your Lumina Dental account.</p>
          </div>

          <div className="flex bg-black/20 rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => { setLoginType("patient"); setError(""); }}
              className={`flex-1 py-2 text-sm font-sans font-medium rounded-md transition-all ${
                loginType === "patient" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => { setLoginType("admin"); setError(""); }}
              className={`flex-1 py-2 text-sm font-sans font-medium rounded-md transition-all ${
                loginType === "admin" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {loginType === "patient" ? (
                <motion.div
                  key="patient"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-sans text-slate-400 uppercase tracking-wider">Registered Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        title="Please enter exactly 10 digits"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="5550000000"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-sans text-slate-400 uppercase tracking-wider">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans text-slate-400 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-sans text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans font-medium tracking-widest uppercase bg-white text-navy py-4 rounded-xl hover:bg-gold hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              {!loading && <User className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
