'use client';

import { useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePaperIQ } from '../layout';

// Inject Google Font for monospace display headings
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #000; }

  .aw-root {
    min-height: 100vh;
    background: #000000;
    color: #e0e0e0;
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* NAV */
  .aw-nav {
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

  .aw-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px;
    color: #fff;
    text-decoration: none;
  }

  .aw-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .aw-logo span { color: #00ffe0; }

  .aw-nav-links {
    display: flex;
    gap: 36px;
    list-style: none;
  }

  .aw-nav-links a {
    font-size: 14px;
    color: #aaa;
    text-decoration: none;
    transition: color 0.2s;
  }
  .aw-nav-links a:hover { color: #fff; }
  .aw-nav-links a.active {
    color: #fff;
    border-bottom: 2px solid #00ffe0;
    padding-bottom: 2px;
  }

  .aw-nav-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .aw-btn-ghost {
    background: none;
    border: none;
    color: #ccc;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
  }
  .aw-btn-ghost:hover { color: #fff; }

  .aw-btn-primary {
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
  }
  .aw-btn-primary:hover { opacity: 0.88; transform: scale(1.03); }

  /* HERO */
  .aw-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px 48px 60px;
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeUp 0.7s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .aw-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border: 1px solid rgba(0,255,220,0.3);
    border-radius: 100px;
    font-size: 13px;
    color: #00ffe0;
    margin-bottom: 32px;
    background: rgba(0,255,220,0.06);
    font-family: 'DM Sans', sans-serif;
  }

  .aw-hero-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(42px, 7vw, 88px);
    line-height: 1.05;
    color: #fff;
    margin-bottom: 28px;
    letter-spacing: -1px;
  }

  .aw-hero-title .cyan { color: #00ffe0; }

  .aw-hero-sub {
    font-size: 18px;
    color: #777;
    max-width: 560px;
    line-height: 1.7;
    margin-bottom: 44px;
    font-weight: 300;
  }

  .aw-hero-cta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    align-items: center;
  }

  .aw-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    color: #000;
    font-weight: 700;
    font-size: 15px;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.2s;
    text-decoration: none;
  }
  .aw-cta-primary:hover { opacity: 0.85; transform: scale(1.03); }

  .aw-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 32px;
    background: transparent;
    color: #ccc;
    font-size: 15px;
    border: 1px solid #333;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
    text-decoration: none;
  }
  .aw-cta-secondary:hover { border-color: #00ffe0; color: #fff; }
`;

export default function WelcomePage() {
  const { isAuthenticated } = usePaperIQ();
  
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="aw-root">
      {/* HERO */}
      <section className="aw-hero">
        <div className="aw-badge">
          <Sparkles size={13} />
          AI-Powered Research Assistant
        </div>

        <h1 className="aw-hero-title">
          Decode Research<br />
          <span className="cyan">Papers</span> with Confidence
        </h1>

        <p className="aw-hero-sub">
          PaperIQ is your AI companion for dense academic papers — personalized, precise, and ready anytime.
        </p>

        <div className="aw-hero-cta">
          {!isAuthenticated ? (
            <>
              <a href="/register" className="aw-cta-primary">
                Get Started Free <ArrowRight size={16} />
              </a>
              <a href="/login" className="aw-cta-secondary">
                Sign In
              </a>
            </>
          ) : (
            <a href="/upload" className="aw-cta-primary">
              Upload Your Paper <ArrowRight size={16} />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}