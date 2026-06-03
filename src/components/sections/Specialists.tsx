"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const specialists = [
  {
    name: "Dr. Elena Rodriguez",
    title: "Lead Orthodontist",
    image: "/specialists/elena.png",
    bio: "Dr. Rodriguez specializes in advanced Invisalign treatments and structural alignments, crafting perfect smiles with over 15 years of experience."
  },
  {
    name: "Dr. Michael Chen",
    title: "Cosmetic Dentist",
    image: "/specialists/michael.png",
    bio: "Renowned for his meticulous aesthetic restorations and porcelain veneers, Dr. Chen transforms smiles into stunning works of art."
  },
  {
    name: "Dr. Sarah Jenkins",
    title: "Oral & Maxillofacial Surgeon",
    image: "/specialists/sarah.png",
    bio: "Dr. Jenkins is an expert in complex implantology and painless extractions, prioritizing patient comfort and cutting-edge surgical techniques."
  }
];

export default function Specialists() {
  return (
    <section id="specialists" className="py-32 relative bg-[#060913] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-xs tracking-[0.3em] text-gold font-bold uppercase mb-4 block"
          >
            Meet the Experts
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl text-white mb-6"
          >
            Our Dental Specialists
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-slate-400 text-lg leading-relaxed"
          >
            Entrust your smile to a dedicated team of master clinicians, combining decades of specialized experience with an artistic touch.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {specialists.map((specialist, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group"
            >
              <div className="relative h-[450px] w-full rounded-3xl overflow-hidden mb-6 bg-white/5 border border-white/10">
                <Image
                  src={specialist.image}
                  alt={specialist.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent opacity-80" />
              </div>
              <div className="text-center px-4">
                <h3 className="font-serif text-2xl text-white mb-1">{specialist.name}</h3>
                <p className="font-sans text-xs tracking-widest uppercase text-gold font-bold mb-4">{specialist.title}</p>
                <p className="font-sans text-slate-400 text-sm leading-relaxed">
                  {specialist.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
