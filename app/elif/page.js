'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePaperIQ } from '../layout';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Lightbulb, Sparkles, RotateCcw } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b1120 !important; }

  .elif-root {
    min-height: 100vh;
    background: #0b1120;
    font-family: 'DM Sans', sans-serif;
    color: #e0e0e0;
  }

  /* NAV */
  .elif-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(11,17,32,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .elif-nav-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px; color: #fff;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .elif-nav-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .elif-nav-links { display: flex; gap: 32px; list-style: none; }
  .elif-nav-links a { font-size: 14px; color: #6b7280; text-decoration: none; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .elif-nav-links a:hover { color: #fff; }
  .elif-nav-links a.active { color: #00ffe0; border-bottom: 2px solid #00ffe0; padding-bottom: 2px; }
  .elif-nav-user {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 14px 6px 8px;
    background: rgba(0,255,224,0.08);
    border: 1px solid rgba(0,255,224,0.2);
    border-radius: 100px; cursor: pointer;
  }
  .elif-nav-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #000;
  }
  .elif-nav-user span { font-size: 13px; color: #e0e0e0; font-weight: 600; }

  /* BODY */
  .elif-body { padding: 90px 48px 60px; max-width: 1100px; margin: 0 auto; }

  /* PAGE HEADER */
  .elif-page-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 36px;
  }
  .elif-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(0,255,224,0.1);
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(0,255,224,0.2);
  }
  .elif-page-header h1 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 30px; color: #00ffe0; margin-bottom: 4px;
  }
  .elif-page-header p { font-size: 14px; color: #6b7280; }

  /* LEVEL SELECTOR CARD */
  .elif-config-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px 28px;
    margin-bottom: 24px;
  }
  .elif-config-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px; color: #9ca3af;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .elif-levels-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .elif-level-btn {
    padding: 14px 12px;
    border-radius: 11px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    cursor: pointer; text-align: center;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .elif-level-btn:hover { border-color: rgba(0,255,224,0.3); background: rgba(0,255,224,0.04); }
  .elif-level-btn.active { border-color: #00ffe0; background: rgba(0,255,224,0.08); }
  .elif-level-btn .emoji { font-size: 22px; margin-bottom: 6px; }
  .elif-level-btn .label { font-size: 13px; font-weight: 600; color: #e0e0e0; margin-bottom: 3px; }
  .elif-level-btn.active .label { color: #00ffe0; }
  .elif-level-btn .desc { font-size: 11px; color: #6b7280; line-height: 1.4; }

  .elif-analyze-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(90deg, #00ffe0, #2a7fff);
    border: none; border-radius: 10px;
    color: #000; font-weight: 700; font-size: 14px;
    letter-spacing: 0.5px;
    cursor: pointer; font-family: 'Share Tech Mono', monospace;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: opacity 0.2s;
  }
  .elif-analyze-btn:hover:not(:disabled) { opacity: 0.87; }
  .elif-analyze-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* LOADING */
  .elif-loading {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 64px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    margin-bottom: 24px;
  }
  .elif-dots { display: flex; gap: 8px; margin-bottom: 16px; }
  .elif-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #00ffe0;
    animation: elifBounce 0.9s infinite;
  }
  .elif-dot:nth-child(2) { animation-delay: 0.15s; }
  .elif-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes elifBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
  .elif-loading p { font-size: 14px; color: #6b7280; }

  /* ERROR */
  .elif-error {
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 16px; padding: 28px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; margin-bottom: 24px;
  }
  .elif-error h3 { font-size: 16px; font-weight: 700; color: #ef4444; margin: 12px 0 8px; }
  .elif-error p { font-size: 14px; color: #fca5a5; margin-bottom: 18px; }
  .elif-error-btn {
    padding: 9px 24px;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.35);
    border-radius: 9px; color: #ef4444; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }

  /* RESULTS */
  .elif-one-liner {
    background: rgba(0,255,224,0.06);
    border: 1px solid rgba(0,255,224,0.25);
    border-radius: 16px; padding: 24px 28px;
    margin-bottom: 24px;
    position: relative; overflow: hidden;
  }
  .elif-one-liner::before {
    content: ''; position: absolute;
    top: 0; left: 0; width: 4px; height: 100%;
    background: linear-gradient(180deg, #00ffe0, #2a7fff);
    border-radius: 3px 0 0 3px;
  }
  .elif-one-liner-label {
    font-size: 11px; font-weight: 700; color: #00ffe0;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;
  }
  .elif-one-liner p {
    font-size: 20px; font-weight: 500; color: #fff;
    line-height: 1.6; font-style: italic;
  }

  /* RESULTS GRID */
  .elif-results-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 20px;
    margin-bottom: 24px;
  }
  @media (max-width: 900px) { .elif-results-grid { grid-template-columns: 1fr; } }

  .elif-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 22px 24px;
    margin-bottom: 16px;
  }
  .elif-card:last-child { margin-bottom: 0; }
  .elif-card-title {
    display: flex; align-items: center; gap: 9px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 15px; color: #fff; margin-bottom: 16px;
  }
  .elif-card-title .icon-bg {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .elif-summary-text { font-size: 14px; color: #d1d5db; line-height: 1.8; white-space: pre-line; }

  .elif-contrib-item {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 12px; font-size: 14px; color: #d1d5db; line-height: 1.6;
  }
  .elif-contrib-item:last-child { margin-bottom: 0; }

  /* SIDE CARDS */
  .elif-side-card {
    border-radius: 14px; padding: 20px 22px;
    margin-bottom: 16px;
    border: 1px solid;
  }
  .elif-side-card:last-child { margin-bottom: 0; }
  .elif-side-card.yellow { background: rgba(234,179,8,0.06); border-color: rgba(234,179,8,0.25); }
  .elif-side-card.red    { background: rgba(239,68,68,0.06);  border-color: rgba(239,68,68,0.25); }
  .elif-side-card.dark   { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.07); }

  .elif-side-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700;
    margin-bottom: 12px;
    font-family: 'Share Tech Mono', monospace;
  }
  .elif-side-title.yellow { color: #eab308; }
  .elif-side-title.red    { color: #ef4444; }
  .elif-side-title.white  { color: #fff; }
  .elif-side-text { font-size: 13px; line-height: 1.75; }
  .elif-side-text.yellow { color: rgba(253,224,71,0.8); }
  .elif-side-text.red    { color: rgba(252,165,165,0.8); }

  /* GLOSSARY */
  .elif-glossary-item {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 9px; overflow: hidden; margin-bottom: 8px;
  }
  .elif-glossary-item:last-child { margin-bottom: 0; }
  .elif-glossary-btn {
    width: 100%; padding: 11px 14px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255,255,255,0.02);
    border: none; cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .elif-glossary-btn:hover { background: rgba(255,255,255,0.04); }
  .elif-glossary-btn span { font-size: 13px; font-weight: 600; color: #e0e0e0; }
  .elif-glossary-def {
    padding: 10px 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 13px; color: #9ca3af; line-height: 1.65;
    background: rgba(0,0,0,0.2);
  }

  /* REANALYZE */
  .elif-reanalyze {
    display: flex; justify-content: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .elif-reanalyze-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 24px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #9ca3af;
    font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
  }
  .elif-reanalyze-btn:hover { border-color: rgba(0,255,224,0.3); color: #00ffe0; }

  /* NO PAPER */
  .elif-no-paper {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; text-align: center; opacity: 0.4;
  }
  .elif-no-paper p { font-size: 16px; color: #6b7280; margin-top: 12px; }
`;

export default function ElifPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { pdfBase64, fileName, imageBase64, incrementElifAnalysis, user,
    elifResults, setElifResults, elifLevel, setElifLevel,
    elifResultsCache, cacheElifResults } = usePaperIQ();

  const level = elifLevel;
  const setLevel = setElifLevel;
  const results = elifResults;
  const setResults = setElifResults;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openGlossaryIndex, setOpenGlossaryIndex] = useState(null);

  const handleAnalyze = async (targetLevel) => {
    if (!pdfBase64) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/elif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64, level: targetLevel })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze paper');
      }

      setResults(data);
      cacheElifResults(fileName, data, targetLevel);
      incrementElifAnalysis();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load from cache or auto-start analysis
  useEffect(() => {
    const autostart = searchParams.get('autostart');
    const audience = searchParams.get('audience');
    const viewPaper = searchParams.get('paper');

    // Viewing a specific paper from dashboard — load its cached results
    if (viewPaper && elifResultsCache?.[viewPaper]) {
      const cached = elifResultsCache[viewPaper];
      setResults(cached.results);
      setLevel(cached.level || 'undergrad');
      return;
    }

    // Current file has cached results — restore them without re-analysing
    if (fileName && elifResultsCache?.[fileName] && !elifResults) {
      const cached = elifResultsCache[fileName];
      setResults(cached.results);
      setLevel(cached.level || 'undergrad');
      return;
    }

    // Only auto-analyze if no cached results exist
    if (autostart === 'true' && pdfBase64 && !elifResults) {
      const targetLevel = audience || level;
      handleAnalyze(targetLevel);
    }
  }, []);

  const handleNavClick = (path) => {
    if (path === '/scholarsight') {
      if (!imageBase64) {
        alert('ScholarSight requires an image for visual analysis. Please upload an image first.');
        router.push('/upload');
        return;
      }
      router.push(path);
    } else {
      router.push(path);
    }
  };

  if (!pdfBase64) {
    return (
      <>
        <style>{styles}</style>
        <div className="elif-root">
          <div className="elif-no-paper">
            <BookOpen size={48} color="#6b7280" />
            <p>Select a paper first.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="elif-root">

        {/* NAV */}
        <nav className="elif-nav">
          <a className="elif-nav-logo" href="#">
            <div className="elif-nav-logo-icon">📄</div>
            <span style={{ color: '#00ffe0' }}>Paper</span>IQ
          </a>
          <ul className="elif-nav-links">
            <li><a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a></li>
            <li><a onClick={() => router.push('/upload')} style={{ cursor: 'pointer' }}>Upload</a></li>
            <li><a className="active" style={{ cursor: 'pointer' }}>ELIF</a></li>
            <li><a onClick={() => handleNavClick('/scholarsight')} style={{ cursor: 'pointer' }}>ScholarSight</a></li>
            <li><a onClick={() => router.push('/chat')} style={{ cursor: 'pointer' }}>Chat</a></li>
          </ul>
          <div className="elif-nav-user">
            <div className="elif-nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <span>{user?.name || 'User'}</span>
          </div>
        </nav>

        <div className="elif-body">

          {/* PAGE HEADER */}
          <div className="elif-page-header">
            <div className="elif-header-icon">
              <BookOpen size={24} color="#00ffe0" />
            </div>
            <div>
              <h1>ELIF Summarizer</h1>
              <p>Understand <strong style={{ color: '#e0e0e0' }}>{fileName}</strong> at your level</p>
            </div>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div className="elif-loading">
              <div className="elif-dots">
                <div className="elif-dot" />
                <div className="elif-dot" />
                <div className="elif-dot" />
              </div>
              <p>Reading paper with Gemini...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="elif-error">
              <AlertTriangle size={32} color="#ef4444" />
              <h3>Analysis Failed</h3>
              <p>{error}</p>
              <button className="elif-error-btn" onClick={() => setError(null)}>Try Again</button>
            </div>
          )}

          {/* RESULTS */}
          {results && (
            <>
              {/* ONE LINER */}
              <div className="elif-one-liner">
                <div className="elif-one-liner-label">The One-Liner</div>
                <p>"{results.oneLiner}"</p>
              </div>

              {/* MAIN GRID */}
              <div className="elif-results-grid">

                {/* LEFT COLUMN */}
                <div>
                  <div className="elif-card">
                    <div className="elif-card-title">
                      <div className="icon-bg" style={{ background: 'rgba(0,255,224,0.1)' }}>
                        <BookOpen size={15} color="#00ffe0" />
                      </div>
                      Summary
                    </div>
                    <div className="elif-summary-text">{results.summary}</div>
                  </div>

                  <div className="elif-card">
                    <div className="elif-card-title">
                      <div className="icon-bg" style={{ background: 'rgba(0,255,136,0.1)' }}>
                        <CheckCircle2 size={15} color="#00ff88" />
                      </div>
                      Key Contributions
                    </div>
                    {results.keyContributions.map((item, idx) => (
                      <div key={idx} className="elif-contrib-item">
                        <CheckCircle2 size={16} color="#00ff88" style={{ flexShrink: 0, marginTop: 2 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div>
                  <div className="elif-side-card yellow">
                    <div className="elif-side-title yellow">
                      <Lightbulb size={14} /> Why It Matters
                    </div>
                    <div className="elif-side-text yellow">{results.whyItMatters}</div>
                  </div>

                  <div className="elif-side-card red">
                    <div className="elif-side-title red">
                      <AlertTriangle size={14} /> Limitations
                    </div>
                    <div className="elif-side-text red">{results.limitations}</div>
                  </div>

                  <div className="elif-side-card dark">
                    <div className="elif-side-title white">
                      Jargon Glossary
                    </div>
                    {results.jargonGlossary.map((item, idx) => (
                      <div key={idx} className="elif-glossary-item">
                        <button
                          className="elif-glossary-btn"
                          onClick={() => setOpenGlossaryIndex(openGlossaryIndex === idx ? null : idx)}
                        >
                          <span>{item.term}</span>
                          {openGlossaryIndex === idx
                            ? <ChevronUp size={14} color="#6b7280" />
                            : <ChevronDown size={14} color="#6b7280" />
                          }
                        </button>
                        {openGlossaryIndex === idx && (
                          <div className="elif-glossary-def">{item.plain}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RE-ANALYZE */}
              <div className="elif-reanalyze">
                <button className="elif-reanalyze-btn" onClick={() => router.push('/upload')}>
                  <RotateCcw size={14} />
                  Re-analyze at different level
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}