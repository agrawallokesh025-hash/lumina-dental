"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { ShieldAlert, KeyRound, UserCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [otpStep, setOtpStep] = useState(false);
  const [form, setForm] = useState({ newUsername: "", newPassword: "", otp: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestOtp = async () => {
    setMessage("");
    setError("");
    try {
      const res = await apiRequest("/admin/request-otp", { method: "POST" });
      setMessage(res.message);
      setOtpStep(true);
    } catch (err: any) {
      setError(err.message || "Failed to request OTP");
    }
  };

  const verifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await apiRequest("/admin/verify-otp", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMessage(res.message);
      setOtpStep(false);
      setForm({ newUsername: "", newPassword: "", otp: "" });
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP and update credentials");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h1 className="font-serif text-3xl text-white font-medium mb-2">Security Settings</h1>
        <p className="text-slate-400 text-sm">Update your administrator credentials. Requires OTP verification.</p>
      </div>

      {message && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold">{message}</div>}
      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold">{error}</div>}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <ShieldAlert className="absolute -right-8 -top-8 w-48 h-48 text-white/5 pointer-events-none" />
        
        {!otpStep ? (
          <div className="space-y-6">
            <p className="text-slate-300">
              To change your username or password, you must first verify your identity with a One-Time Password sent to the clinic's registered phone number.
            </p>
            <button 
              onClick={requestOtp}
              className="bg-accent text-background px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-accent/90 transition-colors"
            >
              Request OTP
            </button>
          </div>
        ) : (
          <form onSubmit={verifyAndUpdate} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">New Username (Optional)</label>
              <div className="relative">
                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={form.newUsername}
                  onChange={(e) => setForm({...form, newUsername: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-all"
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">New Password (Optional)</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={form.newPassword}
                  onChange={(e) => setForm({...form, newPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-all"
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>

            <hr className="border-white/10" />

            <div>
              <label className="block text-xs uppercase tracking-wider text-accent mb-2 font-bold">6-Digit OTP Code</label>
              <input 
                type="text" 
                required
                value={form.otp}
                onChange={(e) => setForm({...form, otp: e.target.value})}
                className="w-full bg-white/10 border border-accent/50 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-accent font-mono text-center text-3xl tracking-[1em] transition-all"
                placeholder="------"
                maxLength={6}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-200 transition-colors"
              >
                Verify & Update
              </button>
              <button 
                type="button"
                onClick={() => { setOtpStep(false); setError(""); setMessage(""); }}
                className="bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
