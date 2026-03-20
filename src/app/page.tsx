"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Mail, Github, Linkedin, ExternalLink, ChevronDown, Menu, X } from "lucide-react";

const ShaderBackground = dynamic(() => import("@/components/ShaderBackground"), {
  ssr: false,
});

/* ─── Scroll-triggered reveal animation ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal(0.12);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

const career = [
  {
    company: "Mytra",
    role: "EHS Manager",
    industry: "AI Robotics",
    period: "2025 — Present",
    details: [
      "First dedicated EHS hire at an AI robotics startup",
      "Functional safety for autonomous systems and collaborative robots",
      "Hackathon winner — created BOM Watch for chemical compliance",
    ],
  },
  {
    company: "Reyes Coca-Cola Bottling",
    role: "EHS Manager",
    industry: "Manufacturing",
    period: "2024 — 2025",
    details: [
      "Led safety programs across large-scale manufacturing and distribution",
      "Fleet safety and environmental compliance for multi-site operations",
    ],
  },
  {
    company: "AeroVironment",
    role: "EHS Specialist",
    industry: "Aerospace & Defense",
    period: "2023 — 2024",
    details: [
      "Safety programs for aerospace manufacturing operations",
      "Regulatory compliance across classified defense programs",
    ],
  },
  {
    company: "BZL",
    role: "Safety Director",
    industry: "Startup",
    period: "2016 — 2023",
    details: [
      "Created safety infrastructure from the ground up across multiple verticals",
      "Scaled EHS programs through rapid growth phases",
    ],
  },
];

const projects = [
  {
    name: "BOM Watch",
    description: "Chemical compliance tool that scans bills of materials against regulatory databases. Hackathon winner at Mytra.",
    url: "https://bom-watch.vercel.app",
    tags: ["Next.js", "AI", "Compliance"],
    highlight: true,
  },
  {
    name: "TWA Noise Dashboard",
    description: "Real-time noise exposure tracking and time-weighted average calculations for workplace monitoring.",
    url: "https://twa-noise-dashboard.vercel.app",
    tags: ["Dashboard", "Occupational Health"],
  },
  {
    name: "Equipment QR Hub",
    description: "QR-based equipment tracking system for inspection scheduling and maintenance records.",
    url: "https://equipment-qr-hub.vercel.app",
    tags: ["Next.js", "QR", "Asset Management"],
  },
  {
    name: "Red Alarm",
    description: "Emergency notification and incident response coordination platform for rapid mobilization.",
    tags: ["Safety", "Notifications"],
  },
  {
    name: "Digital SDS",
    description: "Digital safety data sheet management system for chemical inventory and GHS compliance.",
    tags: ["GHS", "Chemical Safety"],
  },
  {
    name: "Agentic Compliance",
    description: "AI-powered regulatory compliance monitoring using autonomous agents to flag changes in real time.",
    tags: ["AI Agents", "Compliance"],
  },
  {
    name: "BuyBot",
    description: "Automated procurement assistant for safety equipment and supplies sourcing.",
    tags: ["Automation", "Procurement"],
  },
];

/* ─── Scroll-driven hero opacity ─── */
function useScrollFade() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeEnd = window.innerHeight * 0.6;
      setOpacity(Math.max(0, 1 - scrollY / fadeEnd));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return opacity;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroOpacity = useScrollFade();

  return (
    <>
      <ShaderBackground />

      {/* Main content layer */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">
              Mark<span className="text-emerald-400">Starr</span>
            </span>
            <div className="hidden sm:flex items-center gap-8 text-sm text-white/60">
              <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
              <a href="#career" className="hover:text-white transition-colors duration-200">Career</a>
              <a href="#projects" className="hover:text-white transition-colors duration-200">Projects</a>
              <a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a>
            </div>
            <button
              className="sm:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden backdrop-blur-xl bg-black/80 border-t border-white/5 px-6 py-4 flex flex-col gap-4 text-sm text-white/60">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">About</a>
              <a href="#career" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">Career</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">Projects</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">Contact</a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ opacity: heroOpacity, transform: `translateY(${(1 - heroOpacity) * -30}px)`, transition: "transform 0.05s linear" }}>
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
              Mark <span className="text-emerald-400">Starr</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/70 font-light mb-3">
              Safety Engineer · Systems Thinker · Creator
            </p>
            <p className="text-sm sm:text-base text-white/40 tracking-wide mb-12">
              CSP · ISO Lead Auditor · Designing safer workplaces through technology
            </p>
            <div className="flex items-center justify-center gap-6">
              <a
                href="#projects"
                className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-all duration-200 text-sm font-medium"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <a
            href="#about"
            className="absolute bottom-12 animate-bounce text-white/30 hover:text-white/60 transition-colors"
          >
            <ChevronDown size={28} />
          </a>
        </section>

        {/* About Section */}
        <section id="about" className="py-28 sm:py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
            <div className="backdrop-blur-xl bg-black/70 border border-white/10 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl font-bold mb-8">
                About<span className="text-emerald-400">.</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <Reveal delay={0.15}>
                <div>
                  <p className="text-white/70 leading-relaxed mb-6">
                    EHS professional with a unique trajectory — from electronic music production
                    on Dirtybird Records and BBC Radio 1 to creating safety programs at the
                    frontier of AI robotics. The pattern recognition and systems thinking that
                    made the music work now drive how I approach hazard analysis, regulatory
                    compliance, and program design.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    Currently the first dedicated EHS hire at an AI robotics startup, where I
                    create safety frameworks for autonomous systems navigating novel hazard
                    territory. I do my best work at the intersection of safety engineering and
                    technology — designing tools that make compliance intuitive and data-driven.
                  </p>
                </div>
                </Reveal>
                <Reveal delay={0.3}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                      Certifications
                    </h3>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>Certified Safety Professional (CSP)</li>
                      <li>BSI ISO 14001 Lead Auditor</li>
                      <li>BSI ISO 45001 Lead Auditor</li>
                      <li>BSI ISO 9001 Lead Auditor</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                      AI Fluency
                    </h3>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>Self-hosted AI agent with voice and automation</li>
                      <li>Claude API integration and prompt engineering</li>
                      <li>7+ applications created and deployed on Vercel</li>
                      <li>AI-powered compliance and safety tools creator</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                      Education
                    </h3>
                    <p className="text-white/70 text-sm">BS — Florida State University</p>
                  </div>
                </div>
                </Reveal>
              </div>
            </div>
            </Reveal>
          </div>
        </section>

        {/* Career Section */}
        <section id="career" className="py-28 sm:py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
            <h2 className="text-3xl font-bold mb-12 text-center">
              Career<span className="text-emerald-400">.</span>
            </h2>
            </Reveal>
            <div className="space-y-6">
              {career.map((job, i) => (
                <Reveal key={i} delay={i * 0.1}>
                <div
                  className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/20 hover:bg-black/70 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors">
                        {job.company}
                      </h3>
                      <p className="text-white/50 text-sm">
                        {job.role} · {job.industry}
                      </p>
                    </div>
                    <span className="text-sm text-white/40 whitespace-nowrap">
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {job.details.map((detail, j) => (
                      <li key={j} className="text-white/60 text-sm flex items-start gap-2">
                        <span className="text-emerald-500/60 mt-1.5 flex-shrink-0">▸</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-28 sm:py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal>
            <h2 className="text-3xl font-bold mb-12 text-center">
              Projects<span className="text-emerald-400">.</span>
            </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, i) => (
                <Reveal key={i} delay={i * 0.08}>
                <div
                  className={`backdrop-blur-xl bg-black/60 border rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-black/70 transition-all duration-300 group ${
                    project.highlight
                      ? "border-emerald-500/20 sm:col-span-2 lg:col-span-1"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">
                      {project.name}
                    </h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-emerald-400 transition-colors flex-shrink-0 ml-2"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.highlight && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                      Hackathon Winner
                    </div>
                  )}
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Music Section */}
        <section className="py-28 sm:py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
            <div className="backdrop-blur-xl bg-black/70 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Former Life<span className="text-emerald-400">.</span>
              </h2>
              <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mb-6">
                Before safety engineering, I produced electronic music — released on
                Dirtybird Records and featured on BBC Radio 1. The pattern recognition,
                systems thinking, and obsessive attention to detail carried over completely.
                Different medium, same wiring.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-white/40">
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  Dirtybird Records
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  BBC Radio 1
                </span>
              </div>
            </div>
            </Reveal>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-28 sm:py-32 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
            <div className="backdrop-blur-xl bg-black/70 border border-white/10 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl font-bold mb-4">
                Get in Touch<span className="text-emerald-400">.</span>
              </h2>
              <p className="text-white/50 mb-10">
                Open to conversations about safety at the frontier of AI,
                EHS program design, or interesting problems worth solving.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <a
                  href="mailto:MarkStarr707@gmail.com"
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-500/15 border border-emerald-500/25 rounded-lg text-emerald-400 hover:bg-emerald-500/25 transition-all text-sm"
                >
                  <Mail size={16} />
                  MarkStarr707@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/markstarrcompliance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/MS-707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </div>
            </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <span>© {new Date().getFullYear()} Mark Starr</span>
            <span className="text-white/20">Created with purpose.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
