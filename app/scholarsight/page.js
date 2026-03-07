'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePaperIQ } from '../layout';
import { Eye, UploadCloud, AlertTriangle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b1120 !important; }

  .ss-root {
    min-height: 100vh;
    background: #0b1120;
    font-family: 'DM Sans', sans-serif;
    color: #e0e0e0;
  }

  /* NAV */
  .ss-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(11,17,32,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ss-nav-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px; color: #fff;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .ss-nav-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .ss-nav-links { display: flex; gap: 32px; list-style: none; }
  .ss-nav-links a { font-size: 14px; color: #6b7280; text-decoration: none; transition: color 0.2s; }
  .ss-nav-links a:hover { color: #fff; }
  .ss-nav-links a.active { color: #ff4da6; border-bottom: 2px solid #ff4da6; padding-bottom: 2px; }
  .ss-nav-user {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 14px 6px 8px;
    background: rgba(255,77,166,0.08);
    border: 1px solid rgba(255,77,166,0.2);
    border-radius: 100px; cursor: pointer;
  }
  .ss-nav-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #ff4da6, #2a7fff);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .ss-nav-user span { font-size: 13px; color: #e0e0e0; font-weight: 600; }

  /* BODY */
  .ss-body { padding: 90px 48px 60px; max-width: 1100px; margin: 0 auto; }

  /* PAGE HEADER */
  .ss-page-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 36px;
  }
  .ss-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(255,77,166,0.1);
    border: 1px solid rgba(255,77,166,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .ss-page-header h1 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 30px; color: #ff4da6; margin-bottom: 4px;
  }
  .ss-page-header p { font-size: 14px; color: #6b7280; }

  /* CONFIG CARD — split layout */
  .ss-config-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .ss-config-title {
    display: flex; align-items: center; gap: 12px;
    padding: 20px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px; color: #fff;
  }
  .ss-config-title-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,77,166,0.12);
    display: flex; align-items: center; justify-content: center;
  }

  .ss-split {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    min-height: 380px;
  }
  .ss-panel { padding: 28px; }
  .ss-divider {
    background: rgba(255,255,255,0.06);
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .ss-divider-or {
    position: absolute;
    width: 32px; height: 32px;
    background: #151e30;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #6b7280; font-weight: 600;
  }
  .ss-panel-label { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .ss-panel-sub { font-size: 13px; color: #6b7280; margin-bottom: 20px; }

  /* DROPZONE */
  .ss-dropzone {
    border: 2px dashed rgba(255,255,255,0.1);
    border-radius: 14px; min-height: 240px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; cursor: pointer; padding: 32px 24px;
    transition: border-color 0.2s, background 0.2s;
  }
  .ss-dropzone:hover, .ss-dropzone.dragging {
    border-color: #ff4da6;
    background: rgba(255,77,166,0.03);
  }
  .ss-dropzone-icon {
    width: 60px; height: 60px; border-radius: 50%;
    background: rgba(255,77,166,0.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .ss-dropzone h3 { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .ss-dropzone p { font-size: 12px; color: #6b7280; margin-bottom: 20px; line-height: 1.6; }
  .ss-select-btn {
    padding: 10px 22px;
    background: linear-gradient(135deg, #ff4da6, #c026a0);
    border: none; border-radius: 9px;
    color: #fff; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s;
  }
  .ss-select-btn:hover { opacity: 0.85; }

  /* UPLOADED IMAGE */
  .ss-img-preview {
    border: 1px solid rgba(255,77,166,0.25);
    border-radius: 14px; overflow: hidden;
    background: rgba(255,255,255,0.02);
    min-height: 240px;
    display: flex; flex-direction: column;
    position: relative;
  }
  .ss-img-preview img { width: 100%; height: auto; max-height: 280px; object-fit: contain; }
  .ss-remove-img {
    position: absolute; top: 10px; right: 10px;
    padding: 5px 12px;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 7px; color: #9ca3af; font-size: 12px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
  }
  .ss-remove-img:hover { border-color: #ef4444; color: #ef4444; }

  /* HOW IT WORKS */
  .ss-how-step {
    display: flex; align-items: flex-start; gap: 14px;
    margin-bottom: 18px;
  }
  .ss-how-step:last-child { margin-bottom: 28px; }
  .ss-step-num {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,77,166,0.1);
    border: 1px solid rgba(255,77,166,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #ff4da6;
    margin-top: 1px;
  }
  .ss-how-step p { font-size: 14px; color: #9ca3af; line-height: 1.65; }

  .ss-analyze-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(90deg, #ff4da6, #c026a0);
    border: none; border-radius: 10px;
    color: #fff; font-weight: 700; font-size: 14px;
    letter-spacing: 0.5px;
    cursor: pointer; font-family: 'Share Tech Mono', monospace;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: opacity 0.2s;
  }
  .ss-analyze-btn:hover:not(:disabled) { opacity: 0.87; }
  .ss-analyze-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* LOADING */
  .ss-loading {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 64px;
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 24px;
  }
  .ss-dots { display: flex; gap: 8px; margin-bottom: 16px; }
  .ss-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #ff4da6;
    animation: ssBounce 0.9s infinite;
  }
  .ss-dot:nth-child(2) { animation-delay: 0.15s; }
  .ss-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes ssBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
  .ss-loading p { font-size: 14px; color: #6b7280; }

  /* ERROR */
  .ss-error {
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 16px; padding: 28px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; margin-bottom: 24px;
  }
  .ss-error h3 { font-size: 16px; font-weight: 700; color: #ef4444; margin: 12px 0 8px; }
  .ss-error p { font-size: 14px; color: #fca5a5; margin-bottom: 18px; }
  .ss-error-btn {
    padding: 9px 24px;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.35);
    border-radius: 9px; color: #ef4444; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }

  /* RESULTS */
  .ss-results-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  @media (max-width: 860px) { .ss-results-layout { grid-template-columns: 1fr; } }

  .ss-result-img-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; overflow: hidden; padding: 10px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .ss-result-img-card img { width: 100%; height: auto; border-radius: 9px; }
  .ss-reanalyze-btn {
    width: 100%; padding: 10px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 9px; color: #9ca3af; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: border-color 0.2s, color 0.2s;
  }
  .ss-reanalyze-btn:hover { border-color: rgba(255,77,166,0.3); color: #ff4da6; }

  .ss-result-main { display: flex; flex-direction: column; gap: 16px; }

  .ss-headline-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 24px;
  }
  .ss-visual-type {
    display: inline-block;
    padding: 4px 12px; border-radius: 100px;
    background: rgba(255,77,166,0.12);
    border: 1px solid rgba(255,77,166,0.3);
    font-size: 11px; font-weight: 700; color: #ff4da6;
    text-transform: uppercase; letter-spacing: 0.8px;
    margin-bottom: 14px;
  }
  .ss-headline-card h2 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 22px; color: #fff; margin-bottom: 16px;
    line-height: 1.35;
  }
  .ss-explanation { font-size: 14px; color: #d1d5db; line-height: 1.85; white-space: pre-line; }

  .ss-insights-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  @media (max-width: 700px) { .ss-insights-grid { grid-template-columns: 1fr; } }

  .ss-insight-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 18px;
    transition: border-color 0.2s;
  }
  .ss-insight-card:hover { border-color: rgba(255,77,166,0.25); }
  .ss-insight-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(255,77,166,0.1);
    border: 1px solid rgba(255,77,166,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #ff4da6;
    margin-bottom: 12px;
  }
  .ss-insight-card p { font-size: 13px; color: #d1d5db; line-height: 1.65; }

  .ss-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 600px) { .ss-bottom-grid { grid-template-columns: 1fr; } }

  .ss-info-card {
    border-radius: 12px; padding: 18px; border: 1px solid;
  }
  .ss-info-card.cyan  { background: rgba(0,255,224,0.05); border-color: rgba(0,255,224,0.2); }
  .ss-info-card.pink  { background: rgba(255,77,166,0.05); border-color: rgba(255,77,166,0.2); }
  .ss-info-card.green { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.2); }
  .ss-info-title {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px; margin-bottom: 10px;
  }
  .ss-info-title.cyan  { color: #00ffe0; }
  .ss-info-title.pink  { color: #ff4da6; }
  .ss-info-title.green { color: #00ff88; }
  .ss-info-text { font-size: 13px; color: #9ca3af; line-height: 1.7; }
`;

export default function ScholarSightPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { pdfBase64, fileName, imageBase64: contextImageBase64, imageMimeType: contextImageMimeType, imagePreviewUrl: contextImagePreviewUrl, setImageData, incrementScholarSight, user } = usePaperIQ();

  const [imageBase64, setImageBase64] = useState(contextImageBase64);
  const [imageMimeType, setImageMimeType] = useState(contextImageMimeType);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(contextImagePreviewUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef(null);

  // Track when component has mounted to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync with context when context values change
  useEffect(() => {
    if (contextImageBase64) {
      setImageBase64(contextImageBase64);
      setImageMimeType(contextImageMimeType);
      setImagePreviewUrl(contextImagePreviewUrl);
    }
  }, [contextImageBase64, contextImageMimeType, contextImagePreviewUrl]);

  // Auto-analyze when navigating from upload page with autostart
  useEffect(() => {
    const autostart = searchParams.get('autostart');
    if (autostart === 'true' && imageBase64 && !results && !isLoading) {
      handleAnalyze();
    }
  }, [imageBase64]);

  const handleNavClick = (path) => {
    if (path === '/elif') {
      if (!pdfBase64) {
        alert('ELIF requires a PDF. Please upload a PDF first.');
        router.push('/upload');
        return;
      }
      router.push(path);
    } else {
      router.push(path);
    }
  };

  const processImage = (file) => {
    if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result;
        const base64 = reader.result.split(',')[1];
        const mimeType = file.type;
        
        setImagePreviewUrl(previewUrl);
        setImageBase64(base64);
        setImageMimeType(mimeType);
        
        // Also update context
        setImageData(base64, mimeType, previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/scholarsight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64,
          imageMimeType,
          pdfBase64: pdfBase64 || null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze visual');
      }

      setResults(data);
      incrementScholarSight(); // Track successful analysis
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ss-root">

        {/* NAV */}
        <nav className="ss-nav">
          <a className="ss-nav-logo" href="#">
            <div className="ss-nav-logo-icon">📄</div>
            <span style={{ color: '#00ffe0' }}>Paper</span>IQ
          </a>
          <ul className="ss-nav-links">
            <li><a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a></li>
            <li><a onClick={() => router.push('/upload')} style={{ cursor: 'pointer' }}>Upload</a></li>
            <li><a onClick={() => handleNavClick('/elif')} style={{ cursor: 'pointer' }}>ELIF</a></li>
            <li><a className="active" style={{ cursor: 'pointer' }}>ScholarSight</a></li>
            <li><a onClick={() => router.push('/chat')} style={{ cursor: 'pointer' }}>Chat</a></li>
          </ul>
          <div className="ss-nav-user">
            <div className="ss-nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <span>{user?.name || 'User'}</span>
          </div>
        </nav>

        <div className="ss-body">

          {/* PAGE HEADER */}
          <div className="ss-page-header">
            <div className="ss-header-icon">
              <Eye size={24} color="#ff4da6" />
            </div>
            <div>
              <h1>ScholarSight</h1>
              <p>Decode any chart or diagram{isMounted && pdfBase64 ? <> from <strong style={{ color: '#e0e0e0' }}>{fileName}</strong></> : ''}</p>
            </div>
          </div>

          {/* CONFIG */}
          {!results && !isLoading && (
            <div className="ss-config-card">
              <div className="ss-config-title">
                <div className="ss-config-title-icon">
                  <Sparkles size={15} color="#ff4da6" />
                </div>
                Configure Visual Analysis
              </div>

              <div className="ss-split">
                {/* LEFT — upload */}
                <div className="ss-panel">
                  <div className="ss-panel-label">Upload Visual</div>
                  <div className="ss-panel-sub">Screenshot a chart, diagram, table, or equation</div>

                  {!imageBase64 ? (
                    <div
                      className={`ss-dropzone${isDragging ? ' dragging' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); processImage(e.dataTransfer.files[0]); }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="ss-dropzone-icon">
                        <UploadCloud size={26} color="#ff4da6" />
                      </div>
                      <h3>Drop image here</h3>
                      <p>PNG, JPG, or WEBP<br />Charts, tables, equations, diagrams</p>
                      <button className="ss-select-btn">Browse Image</button>
                      <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => processImage(e.target.files[0])} />
                    </div>
                  ) : (
                    <div className="ss-img-preview">
                      <img src={imagePreviewUrl} alt="Visual to analyze" />
                      <button className="ss-remove-img" onClick={() => { 
                        setImageBase64(null); 
                        setImagePreviewUrl(null);
                        setImageMimeType(null);
                        setImageData(null, null, null);
                      }}>Remove</button>
                    </div>
                  )}
                </div>

                {/* DIVIDER */}
                <div className="ss-divider">
                  <div className="ss-divider-or">or</div>
                </div>

                {/* RIGHT — how it works + analyze */}
                <div className="ss-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="ss-panel-label">How It Works</div>
                  <div className="ss-panel-sub" style={{ marginBottom: 24 }}>Three steps to decode any visual</div>

                  <div className="ss-how-step">
                    <div className="ss-step-num">1</div>
                    <p>Take a screenshot of a confusing figure, chart, or diagram from the paper.</p>
                  </div>
                  <div className="ss-how-step">
                    <div className="ss-step-num">2</div>
                    <p>Upload it here. ScholarSight uses the paper's full context alongside the image.</p>
                  </div>
                  <div className="ss-how-step">
                    <div className="ss-step-num">3</div>
                    <p>Get a plain-English breakdown with key insights and common misreadings identified.</p>
                  </div>

                  <button className="ss-analyze-btn" onClick={handleAnalyze} disabled={!imageBase64}>
                    <Eye size={15} /> Analyze Visual
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOADING */}
          {isLoading && (
            <div className="ss-loading">
              <div className="ss-dots">
                <div className="ss-dot" />
                <div className="ss-dot" />
                <div className="ss-dot" />
              </div>
              <p>Gemini is reading the visual...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="ss-error">
              <AlertTriangle size={32} color="#ef4444" />
              <h3>Analysis Failed</h3>
              <p>{error}</p>
              <button className="ss-error-btn" onClick={() => setError(null)}>Try Again</button>
            </div>
          )}

          {/* RESULTS */}
          {results && (
            <div className="ss-results-layout">

              {/* LEFT — image + re-analyze */}
              <div className="ss-result-img-card">
                <img src={imagePreviewUrl} alt="Analyzed visual" />
                <button
                  className="ss-reanalyze-btn"
                  onClick={() => { 
                    setResults(null); 
                    setImageBase64(null); 
                    setImagePreviewUrl(null);
                    setImageMimeType(null);
                    setImageData(null, null, null);
                  }}
                >
                  <RotateCcw size={13} /> Analyze Another
                </button>
              </div>

              {/* RIGHT — analysis */}
              <div className="ss-result-main">

                {/* HEADLINE */}
                <div className="ss-headline-card">
                  <div className="ss-visual-type">{results.visualType}</div>
                  <h2>{results.headline}</h2>
                  <div className="ss-explanation">{results.plainExplanation}</div>
                </div>

                {/* KEY INSIGHTS */}
                <div className="ss-insights-grid">
                  {results.keyInsights.map((insight, idx) => (
                    <div key={idx} className="ss-insight-card">
                      <div className="ss-insight-num">{idx + 1}</div>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>

                {/* BOTTOM INFO CARDS */}
                <div className="ss-bottom-grid">
                  <div className="ss-info-card cyan">
                    <div className="ss-info-title cyan">
                      <Eye size={13} /> What to Look For
                    </div>
                    <div className="ss-info-text">{results.whatToLookFor}</div>
                  </div>
                  <div className="ss-info-card pink">
                    <div className="ss-info-title pink">
                      <AlertTriangle size={13} /> Common Misreading
                    </div>
                    <div className="ss-info-text">{results.commonMisreading}</div>
                  </div>
                </div>

                {results.connectionToThesis && (
                  <div className="ss-info-card green" style={{ gridColumn: '1 / -1' }}>
                    <div className="ss-info-title green">
                      <CheckCircle2 size={13} /> Connection to Paper
                    </div>
                    <div className="ss-info-text" style={{ fontStyle: 'italic' }}>{results.connectionToThesis}</div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}