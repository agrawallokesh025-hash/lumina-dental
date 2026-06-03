"use client";

import { motion } from "framer-motion";
import { Sparkles, HeartPulse, ShieldPlus, Activity, Smile, ScanFace } from "lucide-react";

const treatments = [
  {
    title: "General Consultation",
    description: "Comprehensive dental check-ups, digital x-rays, and customized preventative care plans.",
    icon: <ScanFace className="w-8 h-8 text-gold" />,
  },
  {
    title: "Teeth Cleaning",
    description: "Professional scaling and polishing to remove plaque, prevent cavities, and brighten your smile.",
    icon: <Sparkles className="w-8 h-8 text-gold" />,
  },
  {
    title: "Invisalign Consultation",
    description: "Clear aligner therapy using 3D scanning technology for precise, invisible teeth straightening.",
    icon: <Smile className="w-8 h-8 text-gold" />,
  },
  {
    title: "Dental Implants",
    description: "Permanent, natural-looking tooth replacements placed with guided CBCT surgical precision.",
    icon: <ShieldPlus className="w-8 h-8 text-gold" />,
  },
  {
    title: "Cosmetic Dentistry",
    description: "Porcelain veneers, teeth whitening, and full digital smile design transformations.",
    icon: <HeartPulse className="w-8 h-8 text-gold" />,
  },
  {
    title: "Emergency Dental Care",
    description: "Immediate treatment for toothaches, broken teeth, or urgent surgical extractions.",
    icon: <Activity className="w-8 h-8 text-gold" />,
  }
];

export default function TreatmentJourney() {
  return (
    <section id="treatments" className="relative py-32 z-10 bg-transparent">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-white font-medium"
          >
            Our Dental Treatments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-sans text-slate-300 text-lg leading-relaxed"
          >
            We provide a comprehensive range of clinical and aesthetic dental procedures, delivered with precision and patient comfort in mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {treatments.map((treatment, index) => (
            <motion.div
              key={treatment.title}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(203,178,141,0.15)] hover:border-gold/30 hover:bg-white/10 cursor-default"
            >
              
              <div className="relative z-10">
                <div className="mb-6 p-4 bg-white/5 inline-block rounded-2xl group-hover:bg-gold/10 transition-colors duration-500 border border-white/10 group-hover:border-gold/30">
                  {treatment.icon}
                </div>
                <h3 className="font-serif text-2xl mb-4 tracking-wide text-white group-hover:text-gold transition-colors duration-300 font-medium">{treatment.title}</h3>
                <p className="font-sans text-slate-400 leading-relaxed text-sm">
                  {treatment.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
