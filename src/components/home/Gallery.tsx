"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryImages = [
  {
    src: "/gallery/veneers.png",
    alt: "Porcelain Veneers - Before and After",
    caption: "Porcelain Veneers",
    span: "md:col-span-2 md:row-span-2"
  },
  {
    src: "/gallery/female.png",
    alt: "Happy female patient with perfect smile",
    caption: "Smile Transformation",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    src: "/gallery/whitening.png",
    alt: "Teeth Whitening - Before and After",
    caption: "Professional Whitening",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    src: "/gallery/male.png",
    alt: "Confident male patient smiling",
    caption: "Invisalign Results",
    span: "md:col-span-2 md:row-span-1"
  }
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-[#060913] relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-xs tracking-[0.3em] text-gold font-bold uppercase mb-4 block"
          >
            Real Results
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl text-white font-medium mb-6"
          >
            Smile Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-slate-400 text-lg leading-relaxed"
          >
            Explore our transformative before-and-after cases and witness the life-changing impact of precision aesthetic dentistry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-[250px] lg:auto-rows-[300px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer ${image.span}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-serif text-xl lg:text-2xl text-white font-medium">{image.caption}</h3>
                <div className="h-0.5 w-0 bg-gold mt-4 group-hover:w-12 transition-all duration-500 ease-out" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
