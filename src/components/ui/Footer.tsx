import Link from "next/link";
import { ArrowUpRight, Globe, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-transparent text-white pt-32 pb-12 overflow-hidden border-t border-white/10 z-10">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none opacity-60"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-24">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="font-serif text-3xl tracking-widest uppercase font-medium mb-6 text-white">
              Lumina
            </h2>
            <p className="font-sans text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              World-class dentistry powered by innovation. Redefining the healthcare experience through technology and luxury.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-gold transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"><Globe size={18} /></a>
              <a href="#" className="hover:text-gold transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"><Share2 size={18} /></a>
              <a href="#" className="hover:text-gold transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"><MessageCircle size={18} /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-sans font-semibold tracking-widest text-xs uppercase text-slate-500 mb-6">Explore</h3>
            <ul className="flex flex-col gap-4 font-sans text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-gold transition-colors font-medium">The Clinic</Link></li>
              <li><Link href="/treatments" className="hover:text-gold transition-colors font-medium">Treatments</Link></li>
              <li><Link href="/technology" className="hover:text-gold transition-colors font-medium">Technology</Link></li>
              <li><Link href="/gallery" className="hover:text-gold transition-colors font-medium">Gallery</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-sans font-semibold tracking-widest text-xs uppercase text-slate-500 mb-6">Treatments</h3>
            <ul className="flex flex-col gap-4 font-sans text-sm text-slate-300">
              <li><Link href="/treatments#invisalign" className="hover:text-gold transition-colors font-medium">Invisalign Elite</Link></li>
              <li><Link href="/treatments#implants" className="hover:text-gold transition-colors font-medium">Precision Implants</Link></li>
              <li><Link href="/treatments#cosmetic" className="hover:text-gold transition-colors font-medium">Cosmetic Dentistry</Link></li>
              <li><Link href="/digital-smile" className="hover:text-gold transition-colors font-medium">Digital Smile Design</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans font-semibold tracking-widest text-xs uppercase text-slate-500 mb-6">Contact</h3>
            <ul className="flex flex-col gap-4 font-sans text-sm text-slate-300">
              <li>
                <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wider">Location</p>
                <p className="font-medium">100 Innovation Drive<br/>Beverly Hills, CA 90210</p>
              </li>
              <li>
                <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wider mt-4">Contact</p>
                <p className="font-medium">concierge@luminadental.com<br/>+1 (310) 555-0199</p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 font-sans text-xs text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Lumina Dental. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
