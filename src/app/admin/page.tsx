"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Search, Download, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      let url = "/appointments?";
      if (search) url += `search=${search}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      
      const data = await apiRequest(url);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search or filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAppointments();
    }, 300); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      fetchAppointments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleExport = () => {
    // Navigate directly to trigger standard file download behavior while sending cookies implicitly
    window.location.href = "/api/appointments/export";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium mb-2">Appointments</h1>
          <p className="text-slate-400 text-sm">Manage clinic schedule and patient bookings.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search patients by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent [&>option]:bg-[#060913] transition-all"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No appointments found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500 bg-white/5">
                  <th className="p-4 font-bold">Patient</th>
                  <th className="p-4 font-bold">Contact</th>
                  <th className="p-4 font-bold">Service</th>
                  <th className="p-4 font-bold">Date & Time</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: any) => (
                  <tr key={apt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      <div className="flex flex-col">
                        <span>{apt.patient?.phone || "N/A"}</span>
                        <span className="text-slate-500 text-xs">{apt.patient?.email || ""}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {apt.service || "General Consultation"}
                    </td>
                    <td className="p-4 text-slate-300">
                      {apt.date} <span className="text-slate-500 mx-1">|</span> {apt.time}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider
                        ${apt.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                        ${apt.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${apt.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                        ${apt.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                      `}>
                        {apt.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {apt.status === 'CONFIRMED' && <CheckCircle className="w-3 h-3" />}
                        {apt.status === 'COMPLETED' && <CheckCircle className="w-3 h-3" />}
                        {apt.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => window.location.href = `/api/appointments/${apt.id}/export`}
                        className="px-3 py-1.5 bg-slate-500/20 text-slate-300 hover:bg-slate-500/30 rounded-lg text-xs font-bold transition-colors"
                        title="Download Patient Details"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {apt.status === 'PENDING' && (
                        <button onClick={() => updateStatus(apt.id, 'CONFIRMED')} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider">Confirm</button>
                      )}
                      {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                        <>
                          <button onClick={() => updateStatus(apt.id, 'COMPLETED')} className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider">Complete</button>
                          <button onClick={() => updateStatus(apt.id, 'CANCELLED')} className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider">Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
