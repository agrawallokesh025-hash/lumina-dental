"use client";

import { motion } from "framer-motion";
import { ScanFace, ClipboardList, ShieldPlus, Smile, HeartPulse, ChevronRight, Activity, Users } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const pathwaySteps = [
  {
    number: "1",
    title: "Comprehensive Evaluation",
    desc: "Detailed examination and digital imaging",
    icon: <ScanFace className="text-white w-6 h-6" />
  },
  {
    number: "2",
    title: "Personalized Treatment Plan",
    desc: "Crafted based on your oral health goals",
    icon: <ClipboardList className="text-white w-6 h-6" />
  },
  {
    number: "3",
    title: "Advanced Treatment",
    desc: "Using minimally invasive and modern techniques",
    icon: <ShieldPlus className="text-white w-6 h-6" />
  },
  {
    number: "4",
    title: "Smile Transformation",
    desc: "Enhancing function, aesthetics & confidence",
    icon: <Smile className="text-white w-6 h-6" />
  },
  {
    number: "5",
    title: "Lifelong Care",
    desc: "Continuous support for a healthy, lasting smile",
    icon: <HeartPulse className="text-white w-6 h-6" />
  }
];

const features = [
  {
    title: "Expert Dental Team",
    desc: "Specialists committed to excellence in every smile",
    icon: <ShieldPlus className="text-white w-6 h-6" />
  },
  {
    title: "Advanced Technology",
    desc: "State-of-the-art equipment for accurate & safe treatment",
    icon: <Activity className="text-white w-6 h-6" />
  },
  {
    title: "Patient Comfort",
    desc: "A relaxing environment with gentle care",
    icon: <HeartPulse className="text-white w-6 h-6" />
  },
  {
    title: "Trusted by Patients",
    desc: "Delivering smiles that last a lifetime",
    icon: <Users className="text-white w-6 h-6" />
  }
];

export default function TechnologyShowcase() {
  return (
    <section id="path-to-smile" className="py-24 bg-transparent relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gold/50"></div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-slate-400">
                Your Journey
              </span>
              <div className="h-[1px] w-12 bg-gold/50"></div>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-white font-medium">
              Path to Smile
            </h2>
          </div>
        </ScrollReveal>

        {/* 5-Step Horizontal Pathway */}
        <div className="flex flex-col lg:flex-row items-start justify-between relative mb-24 max-w-6xl mx-auto">
          {pathwaySteps.map((step, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.15}>
              <div className="flex flex-col items-center text-center w-full relative z-10 px-4 mb-8 lg:mb-0 group cursor-pointer">
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center mb-6 shadow-sm group-hover:border-gold group-hover:bg-white/10 transition-all duration-500 relative">
                  {step.icon}
                  
                  {/* Arrow connecting to next step (hide on last step) */}
                  {idx < pathwaySteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-[150%] translate-x-1/2 -translate-y-1/2 text-white/20">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-tight">
                  {step.number}. {step.title}
                </h3>
                <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-[150px]">
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Feature Bar */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 pt-6 md:pt-0 px-0 md:px-6 first:pl-0 last:pr-0">
                  <div className="mt-1 opacity-80">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base mb-1">{feature.title}</h4>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
