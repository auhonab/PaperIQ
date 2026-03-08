'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, BookOpen, Eye, MessageSquare, TrendingUp, Clock, Upload, User, BarChart2, Zap, Settings, LogOut } from 'lucide-react';
import { usePaperIQ } from '../layout';
import Link from 'next/link';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .db-root {
    min-height: 100vh;
    background: #000000;
    font-family: 'DM Sans', sans-serif;
    color: #e0e0e0;
  }

  /* LAYOUT */
  .db-body { padding: 100px 48px 60px; max-width: 1300px; margin: 0 auto; }

  /* WELCOME */
  .db-welcome { margin-bottom: 40px; }
  .db-welcome h1 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 34px; color: #00ffe0; margin-bottom: 8px;
  }
  .db-welcome p { font-size: 15px; color: #6b7280; }

  /* SECTION */
  .db-section {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 28px 28px 24px;
    margin-bottom: 28px;
  }
  .db-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .db-section-title {
    display: flex; align-items: center; gap: 12px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px; color: #fff;
  }
  .db-section-icon {
    width: 34px; height: 34px;
    background: rgba(0,255,224,0.12);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
  }
  .db-configure-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    background: rgba(0,255,224,0.08);
    border: 1px solid rgba(0,255,224,0.25);
    border-radius: 8px;
    color: #00ffe0; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .db-configure-btn:hover { background: rgba(0,255,224,0.15); }

  /* STATS */
  .db-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .db-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 20px 22px;
    transition: border-color 0.2s;
  }
  .db-stat-card:hover { border-color: rgba(0,255,224,0.25); }
  .db-stat-top { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .db-stat-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: rgba(0,255,224,0.1);
    display: flex; align-items: center; justify-content: center;
  }
  .db-stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }
  .db-stat-value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 30px; font-weight: 700; color: #fff;
  }

  /* PROFILE COMMAND CENTER */
  .db-profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .db-profile-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 20px;
    transition: border-color 0.2s;
  }
  .db-profile-card-title {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .db-profile-card-title span {
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 600; color: #e0e0e0;
  }
  .db-profile-card-title .icon-wrap {
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(0,255,224,0.1);
    display: flex; align-items: center; justify-content: center;
  }
  .db-field-label { font-size: 11px; color: #00ffe0; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .db-field-value { font-size: 14px; color: #e0e0e0; margin-bottom: 14px; }

  .db-logout-btn {
    width: 100%;
    margin-top: 16px;
    padding: 10px 16px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    color: #ef4444;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }
  .db-logout-btn:hover {
    background: rgba(239,68,68,0.15);
  }

  .db-connection-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px;
    background: rgba(255,255,255,0.03);
    border-radius: 8px; margin-bottom: 8px;
  }
  .db-connection-row .left { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #e0e0e0; }
  .db-connected-badge {
    padding: 3px 10px; border-radius: 100px;
    background: rgba(0,255,224,0.1);
    border: 1px solid rgba(0,255,224,0.25);
    font-size: 11px; color: #00ffe0; font-weight: 600;
  }

  /* CURRENT PAPER */
  .db-current-paper {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(0,255,224,0.2);
    border-radius: 12px; padding: 20px 22px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .db-paper-name { display: flex; align-items: center; gap: 12px; }
  .db-paper-name span { font-size: 15px; font-weight: 600; color: #fff; }
  .db-paper-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .db-paper-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    background: rgba(0,255,224,0.08);
    border: 1px solid rgba(0,255,224,0.2);
    border-radius: 9px; color: #00ffe0;
    font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    transition: background 0.2s;
  }
  .db-paper-btn:hover { background: rgba(0,255,224,0.15); }

  .db-paper-row {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 11px; padding: 14px 18px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .db-paper-row:hover { border-color: rgba(0,255,224,0.2); }
  .db-paper-row-left { display: flex; align-items: center; gap: 12px; }
  .db-paper-row-left .name { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 3px; }
  .db-paper-row-left .date { font-size: 12px; color: #6b7280; }
  .db-status-badge {
    padding: 4px 12px; border-radius: 6px;
    background: rgba(0,255,224,0.1);
    font-size: 12px; color: #00ffe0; font-weight: 600;
  }
  .db-status-badge.analyzed {
    background: rgba(168,85,247,0.12);
    color: #a855f7;
    border: 1px solid rgba(168,85,247,0.25);
  }
  .db-row-right { display: flex; align-items: center; gap: 10px; }
  .db-delete-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 7px; cursor: pointer;
    color: #ef4444; transition: background 0.2s;
    flex-shrink: 0;
  }
  .db-delete-btn:hover { background: rgba(239,68,68,0.18); }

  /* LAUNCH SECTION */
  .db-launch {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 28px;
    margin-bottom: 28px;
  }
  .db-launch p { font-size: 14px; color: #6b7280; margin-bottom: 20px; line-height: 1.6; }
  .db-launch-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(90deg, #00ffe0, #2a7fff);
    border: none; border-radius: 10px;
    color: #000; font-weight: 700; font-size: 14px;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; font-family: 'Share Tech Mono', monospace;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: opacity 0.2s;
  }
  .db-launch-btn:hover { opacity: 0.87; }

  /* CTA */
  .db-upload-cta {
    background: linear-gradient(135deg, rgba(0,255,224,0.07), rgba(42,127,255,0.07));
    border: 1px solid rgba(0,255,224,0.18);
    border-radius: 16px; padding: 36px 40px;
    text-align: center; margin-top: 8px;
  }
  .db-upload-cta h3 { font-family: 'Share Tech Mono', monospace; font-size: 20px; color: #fff; margin-bottom: 10px; }
  .db-upload-cta p { font-size: 14px; color: #9ca3af; margin-bottom: 24px; }
  .db-upload-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 10px; color: #000;
    font-weight: 700; font-size: 14px;
    text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const { 
    pdfBase64, 
    fileName, 
    uploadedPapers,
    uploadedImages,
    elifAnalysisCount,
    scholarSightCount,
    chatMessageCount,
    user,
    logout,
    deletePaper,
    deleteImage,
    elifResultsCache,
    scholarSightCache,
  } = usePaperIQ();
  
  const username = user?.name || 'researcher';
  const userEmail = user?.email || 'researcher@university.edu';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Calculate real stats
  const totalInsights = elifAnalysisCount + scholarSightCount + chatMessageCount;
  const papersAnalyzed = uploadedPapers.length;

  const stats = [
    { label: 'Papers Uploaded', value: papersAnalyzed.toString(), icon: FileText },
    { label: 'Insights Generated', value: totalInsights.toString(), icon: TrendingUp },
    { label: 'ELIF Summaries', value: elifAnalysisCount.toString(), icon: BookOpen },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="db-root">
        <div className="db-body">

          {/* WELCOME */}
          <div className="db-welcome">
            <h1>Welcome back, {username}</h1>
            <p>Your AI-powered research command center</p>
          </div>

          {/* STATS */}
          <div className="db-stats-grid" style={{ marginBottom: 28 }}>
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="db-stat-card">
                <div className="db-stat-top">
                  <div className="db-stat-icon"><Icon size={18} color="#00ffe0" /></div>
                  <span className="db-stat-label">{label}</span>
                </div>
                <div className="db-stat-value">{value}</div>
              </div>
            ))}
          </div>

          {/* PROFILE COMMAND CENTER */}
          <div className="db-section">
            <div className="db-section-header">
              <div className="db-section-title">
                <div className="db-section-icon"><User size={17} color="#00ffe0" /></div>
                Profile Command Center
              </div>
            </div>

            <div className="db-profile-grid">
              {/* Personal Data */}
              <div className="db-profile-card">
                <div className="db-profile-card-title">
                  <span>
                    <span className="icon-wrap"><User size={14} color="#00ffe0" /></span>
                    Personal Data
                  </span>
                </div>
                <div>
                  <div className="db-field-label">Full Name</div>
                  <div className="db-field-value">{username}</div>
                  <div className="db-field-label">Email Address</div>
                  <div className="db-field-value" style={{ color: '#9ca3af' }}>{userEmail}</div>
                  <button className="db-logout-btn" onClick={handleLogout}>
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>

              {/* Tools Hub */}
              <div className="db-profile-card">
                <div className="db-profile-card-title">
                  <span>
                    <span className="icon-wrap"><Zap size={14} color="#00ffe0" /></span>
                    Tools Hub
                  </span>
                </div>
                {[
                  { name: 'ELIF Summarizer', href: '/elif' },
                  { name: 'ScholarSight', href: '/scholarsight' },
                  { name: 'Smart Chat', href: '/chat' },
                ].map(tool => (
                  <div key={tool.name} className="db-connection-row">
                    <span className="left">
                      <BarChart2 size={14} color="#6b7280" />
                      {tool.name}
                    </span>
                    <span className="db-connected-badge">● Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CURRENT PAPER */}
          {pdfBase64 && fileName && (
            <div className="db-section">
              <div className="db-section-header">
                <div className="db-section-title">
                  <div className="db-section-icon"><FileText size={17} color="#00ffe0" /></div>
                  Current Paper
                </div>
              </div>
              <div className="db-current-paper">
                <div className="db-paper-name">
                  <FileText size={20} color="#00ffe0" />
                  <span>{fileName}</span>
                </div>
                <div className="db-paper-actions">
                  <Link href="/elif" className="db-paper-btn"><BookOpen size={14} /> ELIF Summary</Link>
                  <Link href="/scholarsight" className="db-paper-btn"><Eye size={14} /> Visual Analysis</Link>
                  <Link href="/chat" className="db-paper-btn"><MessageSquare size={14} /> Chat</Link>
                </div>
              </div>
            </div>
          )}

          {/* RECENT PAPERS */}
          <div className="db-section">
            <div className="db-section-header">
              <div className="db-section-title">
                <div className="db-section-icon"><Clock size={17} color="#00ffe0" /></div>
                Recent Papers
              </div>
            </div>
            {uploadedPapers.length === 0 ? (
              <div style={{ 
                padding: '32px', 
                textAlign: 'center', 
                color: '#6b7280', 
                fontSize: '14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px'
              }}>
                No papers uploaded yet. Upload your first paper to get started!
              </div>
            ) : (
              uploadedPapers.slice(0, 5).map(paper => (
                <div
                  key={paper.id}
                  className="db-paper-row"
                  onClick={() => router.push(`/elif?paper=${encodeURIComponent(paper.name)}`)}
                >
                  <div className="db-paper-row-left">
                    <FileText size={16} color="#6b7280" />
                    <div>
                      <div className="name">{paper.name}</div>
                      <div className="date">{formatDate(paper.date)}</div>
                    </div>
                  </div>
                  <div className="db-row-right">
                    {elifResultsCache?.[paper.name]
                      ? <span className="db-status-badge analyzed">Analyzed</span>
                      : <span className="db-status-badge">Uploaded</span>
                    }
                    <button
                      className="db-delete-btn"
                      title="Delete paper"
                      onClick={e => { e.stopPropagation(); if (confirm(`Delete "${paper.name}"?`)) deletePaper(paper.id); }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RECENT IMAGES */}
          <div className="db-section">
            <div className="db-section-header">
              <div className="db-section-title">
                <div className="db-section-icon"><Eye size={17} color="#ff4da6" /></div>
                Recent Images
              </div>
            </div>
            {uploadedImages.length === 0 ? (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px'
              }}>
                No images uploaded yet. Upload an image in ScholarSight to visualize charts or diagrams.
              </div>
            ) : (
              uploadedImages.slice(0, 5).map(image => (
                <div
                  key={image.id}
                  className="db-paper-row"
                  onClick={() => router.push(`/scholarsight?image=${encodeURIComponent(image.name)}`)}
                >
                  <div className="db-paper-row-left">
                    <Eye size={16} color="#9ca3af" />
                    <div>
                      <div className="name">{image.name}</div>
                      <div className="date">{formatDate(image.date)}</div>
                    </div>
                  </div>
                  <div className="db-row-right">
                    {scholarSightCache?.[image.name]
                      ? <span className="db-status-badge analyzed">Analyzed</span>
                      : <span className="db-status-badge" style={{ color: '#ff4da6', background: 'rgba(255,77,166,0.1)' }}>Uploaded</span>
                    }
                    <button
                      className="db-delete-btn"
                      title="Delete image"
                      onClick={e => { e.stopPropagation(); if (confirm(`Delete "${image.name}"?`)) deleteImage(image.id); }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* LAUNCH / UPLOAD CTA */}
          {!pdfBase64 ? (
            <div className="db-upload-cta">
              <h3>Ready to decode your next paper?</h3>
              <p>Upload a research paper to get started with AI-powered insights</p>
              <Link href="/upload" className="db-upload-btn">
                <Upload size={15} /> Upload Paper
              </Link>
            </div>
          ) : (
            <div className="db-launch">
              <div className="db-section-title" style={{ marginBottom: 14 }}>
                <div className="db-section-icon"><Zap size={17} color="#00ffe0" /></div>
                Analyze Paper
              </div>
              <p>Use AI-powered tools to decode your research paper. Get summaries, visual breakdowns, and instant answers.</p>
              <Link href="/upload" className="db-launch-btn">
                <Zap size={15} /> Launch Analysis
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}