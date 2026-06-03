"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { UserPlus, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({ username: "", password: "", firstName: "", lastName: "" });

  const fetchPatients = async () => {
    try {
      const data = await apiRequest("/admin/patients");
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/admin/patients", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setShowForm(false);
      setForm({ username: "", password: "", firstName: "", lastName: "" });
      fetchPatients();
    } catch (err: any) {
      alert(err.message || "Failed to create patient");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/admin/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchPatients();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium mb-2">Patients</h1>
          <p className="text-slate-400 text-sm">Manage patient accounts and access credentials.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/80 transition-colors px-4 py-2 rounded-xl text-sm font-bold text-background shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
          <h2 className="text-lg font-bold mb-6 text-white">Create Patient Account</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">First Name</label>
              <input required type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Last Name</label>
              <input required type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Username</label>
              <input required type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Temporary Password</label>
              <input required type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all" />
            </div>
            <div className="col-span-2 mt-4 flex gap-4">
              <button type="submit" className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Create Account</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No patients found. Create one to get started.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500 bg-white/5">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Username</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p: any) => (
                <tr key={p.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${!p.isActive ? 'opacity-50' : ''}`}>
                  <td className="p-4 text-white font-medium">{p.firstName} {p.lastName}</td>
                  <td className="p-4 text-slate-300 font-mono text-sm">{p.username}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleActive(p.id, p.isActive)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${p.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'}`}
                    >
                      {p.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
