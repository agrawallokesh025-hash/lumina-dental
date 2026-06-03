"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { Calendar, Play, ShieldPlus, Activity, Heart, CheckCircle2 } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import ImageSequence from "./ImageSequence";
import HeroEffects from "../canvas/HeroEffects";

export default function Hero() {
  // Use global scroll to guarantee robust parallax updates regardless of container geometry
  const { scrollY } = useScroll();

  // Smooth scroll parallax mapped to 1000px of global scrolling
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const scaleParallax = useTransform(scrollY, [0, 1000], [1, 1.1]);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden pt-20 pb-12 z-10 bg-transparent">
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center h-full">
        
        {/* Left Column: Content */}
        <div className="w-full lg:w-1/2 pt-12 lg:pt-0 z-20 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "opacity, transform" }}
            className="font-serif text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.1] mb-6 text-white"
          >
            Crafting <br />
            Perfect Smiles <br />
            <span className="text-gold italic font-light">Through Innovation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ willChange: "opacity, transform" }}
            className="font-sans text-lg text-slate-300 max-w-lg leading-relaxed mb-10"
          >
            Experience world-class orthodontics, cosmetic dentistry, and digital smile transformation powered by clinical excellence, expert precision, and patient comfort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{ willChange: "opacity, transform" }}
            className="flex flex-col sm:flex-row items-center gap-5 mb-10"
          >
            <Link
              href="/book"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase font-semibold hover:bg-gold-dark transition-all duration-300 shadow-[0_8px_20px_rgba(203,178,141,0.3)]"
            >
              <Calendar size={18} />
              Book Appointment
            </Link>
            
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-sans text-sm tracking-widest uppercase text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              <Play size={18} className="text-white" />
              Watch Video
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            style={{ willChange: "opacity, transform" }}
            className="grid grid-cols-2 gap-y-3 gap-x-6 max-w-lg"
          >
            {[
              "Invisalign Provider",
              "15+ Years Experience",
              "Specialist Orthodontic Care",
              "Digital Smile Design"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={16} className="text-gold" />
                <span className="font-sans text-sm font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Floating Cards (Tooth is now in global background) */}
        <div className="w-full lg:w-1/2 h-[600px] lg:h-[800px] relative mt-12 lg:mt-0 flex items-center justify-center">
          
              
          <div className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 lg:gap-6 z-20 pr-4 lg:pr-0">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, x: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 w-[240px] sm:w-56 lg:w-64 translate-x-0 lg:translate-x-6 cursor-pointer pointer-events-auto"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
                <ShieldPlus className="text-white opacity-90" size={24} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-sm">Advanced Care</h4>
                <p className="font-sans text-xs text-slate-400">Evidence-based treatments</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, x: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 w-[240px] sm:w-56 lg:w-64 translate-x-0 lg:-translate-x-2 cursor-pointer pointer-events-auto shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 shadow-sm">
                <Activity className="text-gold" size={24} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-sm">Precision Driven</h4>
                <p className="font-sans text-xs text-slate-400">Minimally invasive techniques</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, x: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 w-[240px] sm:w-56 lg:w-64 translate-x-0 lg:translate-x-6 cursor-pointer pointer-events-auto"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
                <Heart className="text-white opacity-90" size={24} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-sm">Patient Comfort</h4>
                <p className="font-sans text-xs text-slate-400">Your smile, our priority</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
