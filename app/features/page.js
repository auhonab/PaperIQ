// app/features/page.js
'use client';

import { useState, useEffect } from "react";
import { BookOpen, Eye, MessageSquare, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePaperIQ } from '../layout';

const styles = `
  .feat-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 60px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,255,220,0.08);
  }

  .feat-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px;
    color: #fff;
    text-decoration: none;
  }

  .feat-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .feat-logo span { color: #00ffe0; }

  .feat-nav-links {
    display: flex;
    gap: 36px;
    list-style: none;
  }

  .feat-nav-links a {
    font-size: 14px;
    color: #aaa;
    text-decoration: none;
    transition: color 0.2s;
  }
  .feat-nav-links a:hover { color: #fff; }
  .feat-nav-links a.active {
    color: #fff;
    border-bottom: 2px solid #00ffe0;
    padding-bottom: 2px;
  }

  .feat-nav-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .feat-btn-ghost {
    background: none;
    border: none;
    color: #ccc;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
    text-decoration: none;
  }
  .feat-btn-ghost:hover { color: #fff; }

  .feat-btn-primary {
    background: linear-gradient(135deg, #00ffe0 0%, #2a7fff 100%);
    border: none;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 9px 20px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.2s;
    text-decoration: none;
  }
  .feat-btn-primary:hover { opacity: 0.88; transform: scale(1.03); }

  .feat-root {
    min-height: 100vh;
    padding: 100px 48px 80px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .feat-header {
    text-align: center;
    margin-bottom: 80px;
    animation: fadeUp 0.7s ease both;
  }

  .feat-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border: 1px solid rgba(0,255,220,0.3);
    border-radius: 100px;
    font-size: 13px;
    color: #00ffe0;
    margin-bottom: 24px;
    background: rgba(0,255,220,0.06);
  }

  .feat-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(36px, 5vw, 56px);
    line-height: 1.1;
    color: #fff;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }

  .feat-title .cyan { color: #00ffe0; }

  .feat-subtitle {
    font-size: 17px;
    color: #777;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 100px;
    animation: fadeUp 0.7s ease both 0.2s;
  }

  @media (max-width: 900px) {
    .feat-grid { grid-template-columns: 1fr; }
  }

  .feat-card {
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    padding: 40px 36px;
    transition: border-color 0.25s, transform 0.25s;
  }

  .feat-card:hover {
    transform: translateY(-6px);
  }

  .feat-card.cyan:hover  { border-color: #00ffe0; }
  .feat-card.pink:hover  { border-color: #ff4da6; }
  .feat-card.green:hover { border-color: #00ff88; }

  .feat-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    transition: background 0.25s, transform 0.25s;
  }

  .feat-card.cyan  .feat-icon { background: rgba(0,255,220,0.1); }
  .feat-card.pink  .feat-icon { background: rgba(255,77,166,0.1); }
  .feat-card.green .feat-icon { background: rgba(0,255,136,0.1); }

  .feat-card:hover .feat-icon {
    transform: scale(1.1);
  }

  .feat-card.cyan:hover  .feat-icon { background: #00ffe0; }
  .feat-card.pink:hover  .feat-icon { background: #ff4da6; }
  .feat-card.green:hover .feat-icon { background: #00ff88; }

  .feat-card h3 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 22px;
    color: #fff;
    margin-bottom: 14px;
  }

  .feat-card p {
    font-size: 15px;
    color: #555;
    line-height: 1.8;
  }

  .feat-benefits {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 44px;
    margin-bottom: 100px;
    animation: fadeUp 0.7s ease both 0.4s;
  }

  @media (max-width: 900px) {
    .feat-benefits { grid-template-columns: 1fr; }
  }

  .feat-benefit {
    display: flex;
    gap: 18px;
    align-items: flex-start;
  }

  .feat-benefit-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feat-benefit h4 {
    font-size: 15px;
    font-weight: 600;
    color: #e0e0e0;
    margin-bottom: 8px;
  }

  .feat-benefit p {
    font-size: 14px;
    color: #4a4a4a;
    line-height: 1.7;
  }

  .feat-cta {
    background: linear-gradient(135deg, rgba(0,255,220,0.05), rgba(42,127,255,0.05));
    border: 1px solid rgba(0,255,220,0.15);
    border-radius: 20px;
    padding: 72px 48px;
    text-align: center;
    animation: fadeUp 0.7s ease both 0.6s;
  }

  .feat-cta h2 {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(26px, 4vw, 42px);
    color: #fff;
    margin-bottom: 18px;
  }

  .feat-cta p {
    color: #555;
    font-size: 16px;
    max-width: 560px;
    margin: 0 auto 40px;
    line-height: 1.7;
  }

  .feat-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    color: #000;
    font-weight: 700;
    font-size: 16px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.2s;
    text-decoration: none;
  }

  .feat-cta-btn:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function FeaturesPage() {
  const { isAuthenticated } = usePaperIQ();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const iconColor = (variant) =>
    variant === "cyan" ? "#00ffe0" : variant === "pink" ? "#ff4da6" : "#00ff88";

  return (
    <div className="feat-root">
      {/* Header */}
      <div className="feat-header">
        <div className="feat-badge">
          <Sparkles size={13} />
          Three Powerful AI Tools
        </div>
        <h1 className="feat-title">
          Everything You Need to<br />
          <span className="cyan">Decode Research</span>
        </h1>
        <p className="feat-subtitle">
          PaperIQ combines three specialized AI tools to help you understand, visualize, and interact with complex academic papers.
        </p>
      </div>

      {/* Features Grid */}
      <div className="feat-grid">
        {[
          {
            variant: "cyan",
            Icon: BookOpen,
            title: "ELIF Summarizer",
            desc: "Get paper summaries tailored to your expertise level — from high school to PhD researcher. Complex research, explained your way.",
          },
          {
            variant: "pink",
            Icon: Eye,
            title: "ScholarSight",
            desc: "Decode charts, equations, and diagrams instantly. Turn confusing visuals into crystal-clear explanations with AI vision.",
          },
          {
            variant: "green",
            Icon: MessageSquare,
            title: "Smart Chat",
            desc: "Ask questions about methodology, results, or limitations. Get instant, cited answers from your research papers.",
          },
        ].map(({ variant, Icon, title, desc }) => (
          <div key={title} className={`feat-card ${variant}`}>
            <div className="feat-icon">
              <Icon size={26} color={iconColor(variant)} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="feat-benefits">
        {[
          {
            Icon: Zap,
            bg: "rgba(0,255,220,0.08)",
            color: "#00ffe0",
            title: "Lightning Fast",
            desc: "Powered by Google's Gemini 1.5 Flash for instant analysis",
          },
          {
            Icon: Shield,
            bg: "rgba(0,255,136,0.08)",
            color: "#00ff88",
            title: "Private & Secure",
            desc: "Your papers stay private. No data stored permanently",
          },
          {
            Icon: Sparkles,
            bg: "rgba(255,77,166,0.08)",
            color: "#ff4da6",
            title: "Always Learning",
            desc: "Advanced AI that understands academic language",
          },
        ].map(({ Icon, bg, color, title, desc }) => (
          <div key={title} className="feat-benefit">
            <div className="feat-benefit-icon" style={{ background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="feat-cta">
        <h2>Ready to decode research?</h2>
        <p>
          Join researchers, students, and professionals using PaperIQ to understand complex papers faster.
        </p>
        <Link href={isAuthenticated ? '/dashboard' : '/register'} className="feat-cta-btn">
          Start Using PaperIQ <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
