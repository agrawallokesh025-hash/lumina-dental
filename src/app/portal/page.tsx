"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { CalendarPlus, CheckCircle, Clock, XCircle } from "lucide-react";

const services = [
  "General Consultation",
  "Teeth Cleaning",
  "Invisalign Consultation",
  "Dental Implants",
  "Cosmetic Dentistry",
  "Emergency Dental Care"
];

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", time: "09:00", service: services[0], notes: "" });

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest("/appointments/my-appointments");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/appointments/book", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setShowForm(false);
      setForm({ date: "", time: "09:00", service: services[0], notes: "" });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || "Failed to book appointment");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await apiRequest(`/appointments/my-appointments/${id}/cancel`, { method: "PUT" });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || "Failed to cancel");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium mb-2">My Appointments</h1>
          <p className="text-slate-400 text-sm">View and manage your upcoming visits.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gold hover:bg-gold-light transition-colors px-6 py-3 rounded-full text-sm font-bold text-background shadow-sm"
        >
          <CalendarPlus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-300">
          <h2 className="text-xl font-serif mb-6 text-white">Book New Appointment</h2>
          <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Service Requested</label>
              <select required value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold transition-all [&>option]:bg-[#060913]">
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Date</label>
              <input required type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold transition-all [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Time (30 min slots)</label>
              <select required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold transition-all [&>option]:bg-[#060913]">
                {Array.from({length: 18}).map((_, i) => {
                  const hour = 9 + Math.floor(i / 2);
                  const min = i % 2 === 0 ? "00" : "30";
                  const time = `${hour.toString().padStart(2, '0')}:${min}`;
                  return <option key={time} value={time}>{time}</option>;
                })}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Notes for Doctor (Optional)</label>
              <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold transition-all" placeholder="E.g., Routine checkup, Tooth pain..." />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="submit" className="bg-white text-navy px-8 py-3 rounded-full font-bold hover:bg-gold hover:text-white transition-colors tracking-wider uppercase text-sm">Confirm Booking</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors tracking-wider uppercase text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white/5 border border-white/10 rounded-3xl">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white/5 border border-white/10 rounded-3xl">You have no past or upcoming appointments.</div>
        ) : (
          appointments.map((apt: any) => (
            <div key={apt.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/10 transition-colors backdrop-blur-md">
              <div>
                <h3 className="text-white font-serif text-xl mb-2">{apt.service}</h3>
                <p className="text-white/80 font-sans font-medium mb-1">
                  {apt.date} <span className="text-gold mx-2">|</span> {apt.time}
                </p>
                {apt.notes && <p className="text-slate-400 text-sm mt-2">{apt.notes}</p>}
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider
                  ${apt.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                  ${apt.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                  ${apt.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                  ${apt.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                `}>
                  {apt.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                  {apt.status === 'CONFIRMED' && <CheckCircle className="w-3.5 h-3.5" />}
                  {apt.status === 'COMPLETED' && <CheckCircle className="w-3.5 h-3.5" />}
                  {apt.status === 'CANCELLED' && <XCircle className="w-3.5 h-3.5" />}
                  {apt.status}
                </span>
                
                {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                  <button onClick={() => handleCancel(apt.id)} className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
