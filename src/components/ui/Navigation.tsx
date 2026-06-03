"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Specialists", href: "/#specialists" },
    { name: "Treatments", href: "/#treatments" },
    { name: "Gallery", href: "/#gallery" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      
      // If we are already on the homepage, smoothly scroll to the element manually.
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
      // If we are not on the homepage, let Next.js handle the navigation to the root route.
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "py-4" : "py-8"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div
          className={`flex items-center justify-between rounded-full px-8 py-4 transition-all duration-500 ${
            isScrolled ? "bg-[#060913]/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10" : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-serif text-2xl tracking-widest text-white uppercase font-medium">
              Lumina
            </span>
            <span className="font-sans text-xs tracking-[0.2em] text-gold font-semibold uppercase mt-1 hidden sm:block">
              Dental
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-sans text-sm font-medium tracking-wide text-white/80 hover:text-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 z-50">
            <Link
              href="/login"
              className="hidden md:flex items-center font-sans font-medium text-sm tracking-widest uppercase text-white/80 hover:text-gold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/book"
              className="hidden md:flex items-center justify-center font-sans font-medium text-sm tracking-widest uppercase bg-white text-navy px-6 py-3 rounded-full hover:bg-gold hover:text-white transition-colors duration-300 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_25px_rgba(203,178,141,0.25)]"
            >
              Book Consultation
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        className="fixed inset-0 bg-[#060913]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8"
      >
        {navLinks.map((link, i) => (
          <motion.div
            key={link.name}
            variants={{
              open: { y: 0, opacity: 1, transition: { delay: i * 0.1 } },
              closed: { y: 20, opacity: 0 },
            }}
          >
            <Link
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-serif text-4xl text-white hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          </motion.div>
        ))}
        <Link
          href="/book"
          onClick={() => setIsMobileMenuOpen(false)}
          className="font-sans font-medium tracking-widest uppercase bg-white text-navy px-8 py-4 rounded-full hover:bg-gold hover:text-white transition-colors mt-8"
        >
          Book Consultation
        </Link>
        <Link
          href="/login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="font-sans font-medium tracking-widest uppercase text-slate-400 hover:text-white transition-colors mt-2"
        >
          Sign In / Admin
        </Link>
      </motion.div>
    </motion.header>
  );
}
