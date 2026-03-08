'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePaperIQ } from '../layout';
import { UploadCloud, CheckCircle2, BookOpen, Eye, MessageSquare, FileText, Sparkles, Loader2, X, Image as ImageIcon } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b1120 !important; }

  .up-root {
    min-height: 100vh;
    background: #0b1120;
    font-family: 'DM Sans', sans-serif;
    color: #e0e0e0;
  }

  /* NAV */
  .up-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(11,17,32,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .up-nav-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px; color: #fff;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .up-nav-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
  }
  .up-nav-links { display: flex; gap: 32px; list-style: none; }
  .up-nav-links a { font-size: 14px; color: #6b7280; text-decoration: none; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .up-nav-links a:hover { color: #fff; }
  .up-nav-links a.active { color: #00ffe0; border-bottom: 2px solid #00ffe0; padding-bottom: 2px; }
  .up-nav-user {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 14px 6px 8px;
    background: rgba(0,255,224,0.08);
    border: 1px solid rgba(0,255,224,0.2);
    border-radius: 100px; cursor: pointer;
  }
  .up-nav-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #000;
  }
  .up-nav-user span { font-size: 13px; color: #e0e0e0; font-weight: 600; }

  /* BODY */
  .up-body { padding: 90px 48px 60px; max-width: 1200px; margin: 0 auto; }

  /* HEADER */
  .up-header { text-align: center; margin-bottom: 40px; }
  .up-header h1 {
    font-family: 'Share Tech Mono', monospace;
    font-size: 38px; color: #00ffe0; margin-bottom: 10px;
  }
  .up-header p { font-size: 15px; color: #6b7280; }

  /* MAIN CARD */
  .up-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .up-card-title {
    display: flex; align-items: center; gap: 12px;
    padding: 20px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-family: 'Share Tech Mono', monospace;
    font-size: 17px; color: #fff;
  }
  .up-card-title-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(0,255,224,0.12);
    display: flex; align-items: center; justify-content: center;
  }

  /* SPLIT */
  .up-split {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    min-height: 420px;
  }

  .up-panel { padding: 28px; }

  .up-divider {
    background: rgba(255,255,255,0.06);
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .up-divider-or {
    position: absolute;
    width: 32px; height: 32px;
    background: #151e30;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #6b7280; font-weight: 600;
    z-index: 1;
  }

  /* PANEL LABELS */
  .up-panel-label {
    font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px;
  }
  .up-panel-sub { font-size: 13px; color: #6b7280; margin-bottom: 20px; }

  /* DROP ZONE */
  .up-dropzone {
    border: 2px dashed rgba(255,255,255,0.1);
    border-radius: 14px;
    min-height: 240px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    padding: 32px 24px;
  }
  .up-dropzone:hover, .up-dropzone.dragging {
    border-color: #00ffe0;
    background: rgba(0,255,224,0.03);
  }
  .up-dropzone-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(0,255,224,0.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
  }
  .up-dropzone h3 { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .up-dropzone p { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
  .up-select-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border: none; border-radius: 9px;
    color: #000; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s;
  }
  .up-select-btn:hover { opacity: 0.85; }

  /* UPLOADED STATE */
  .up-uploaded {
    border: 1px solid rgba(0,255,224,0.25);
    border-radius: 14px;
    padding: 20px;
    background: rgba(0,255,224,0.03);
    min-height: 240px;
    display: flex; flex-direction: column;
  }
  .up-uploaded-header {
    display: flex; align-items: center; gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 16px;
  }
  .up-uploaded-name { font-size: 14px; font-weight: 600; color: #fff; }
  .up-uploaded-size { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .up-remove-btn {
    margin-left: auto;
    padding: 5px 14px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 7px; color: #9ca3af; font-size: 12px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
  }
  .up-remove-btn:hover { border-color: #ef4444; color: #ef4444; }
  .up-uploaded-center {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
  }
  .up-uploaded-center p { font-size: 13px; color: #6b7280; margin-top: 10px; }
  .up-uploaded-center span { font-size: 12px; color: #374151; margin-top: 4px; display: block; }

  /* TOOL CARDS */
  .up-tool-card {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 18px 20px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 12px;
    background: rgba(255,255,255,0.02);
  }
  .up-tool-card:hover { background: rgba(255,255,255,0.04); }
  .up-tool-card.selected-cyan  { border-color: #00ffe0; background: rgba(0,255,224,0.04); }
  .up-tool-card.selected-pink  { border-color: #ff4da6; background: rgba(255,77,166,0.04); }
  .up-tool-card.selected-green { border-color: #00ff88; background: rgba(0,255,136,0.04); }

  .up-tool-inner { display: flex; align-items: flex-start; gap: 16px; }
  .up-tool-icon {
    width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .up-tool-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 15px; color: #fff; margin-bottom: 5px;
  }
  .up-tool-desc { font-size: 12px; color: #6b7280; line-height: 1.6; }

  /* SELECT DROPDOWN */
  .up-audience-wrap { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
  .up-audience-label { font-size: 12px; color: #00ffe0; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .up-audience-select {
    width: 100%; padding: 10px 14px;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(0,255,224,0.3);
    border-radius: 8px; color: #e0e0e0; font-size: 13px;
    font-family: 'DM Sans', sans-serif; outline: none;
  }

  /* BOTTOM ACTIONS */
  .up-actions { display: flex; gap: 14px; }
  .up-cancel-btn {
    flex: 1; padding: 14px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #9ca3af;
    font-size: 14px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
  }
  .up-cancel-btn:hover { border-color: rgba(255,255,255,0.25); }
  .up-analyze-btn {
    flex: 2; padding: 14px;
    background: linear-gradient(90deg, #00ffe0, #2a7fff);
    border: none; border-radius: 10px;
    color: #000; font-weight: 700; font-size: 14px;
    letter-spacing: 0.5px;
    cursor: pointer; font-family: 'Share Tech Mono', monospace;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: opacity 0.2s;
  }
  .up-analyze-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .up-analyze-btn:not(:disabled):hover { opacity: 0.87; }

  /* FILE TYPE INDICATOR */
  .up-file-type {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .up-file-type.pdf { background: rgba(0,255,224,0.15); color: #00ffe0; }
  .up-file-type.img { background: rgba(255,77,166,0.15); color: #ff4da6; }

  /* IMAGE PREVIEW */
  .up-image-preview {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 10px;
    margin: 10px 0;
  }
`;

export default function UploadPage() {
  const router = useRouter();
  const { pdfBase64, fileName, setPdfData, imageBase64, imageMimeType, imagePreviewUrl, setImageData, user } = usePaperIQ();
  const [fileSize, setFileSize] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageSize, setImageSize] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [selectedTool, setSelectedTool] = useState(null); // Only one tool at a time
  const [elifAudience, setElifAudience] = useState('undergrad');

  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = (file) => {
    // Reset previous uploads
    setPdfData(null, null);
    setFileSize(null);
    setImageData(null, null, null);
    setImageName(null);
    setImageSize(null);
    setSelectedTool(null); // Reset tool selection

    if (file && file.type === 'application/pdf') {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMB} MB`);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setPdfData(base64String, file.name);
      };
      reader.readAsDataURL(file);
    } else if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setImageSize(`${sizeMB} MB`);
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result;
        const base64String = reader.result.split(',')[1];
        setImageData(base64String, file.type, previewUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTool = (tool) => {
    // Only one tool at a time
    if (selectedTool === tool) {
      setSelectedTool(null);
    } else {
      setSelectedTool(tool);
    }
  };

  const canAnalyze = (pdfBase64 || imageBase64) && selectedTool;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    
    // Navigate to the selected tool with auto-start flag
    if (selectedTool === 'elif') {
      router.push(`/elif?autostart=true&audience=${elifAudience}`);
    } else if (selectedTool === 'visual') {
      router.push('/scholarsight?autostart=true');
    } else if (selectedTool === 'chat') {
      router.push('/chat?autostart=true');
    }
  };

  // Determine which tools are available
  const availableTools = [];
  if (pdfBase64) {
    availableTools.push('elif', 'chat');
  } else if (imageBase64) {
    availableTools.push('visual', 'chat');
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="up-root">

        {/* NAV */}
        <nav className="up-nav">
          <a className="up-nav-logo" href="#">
            <div className="up-nav-logo-icon">
              <FileText size={15} />
            </div>
            <span style={{ color: '#00ffe0' }}>Paper</span>IQ
          </a>
          <ul className="up-nav-links">
            <li><a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a></li>
            <li><a className="active" style={{ cursor: 'pointer' }}>Upload & Analyze</a></li>
          </ul>
          <div className="up-nav-user">
            <div className="up-nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <span>{user?.name || 'User'}</span>
          </div>
        </nav>

        <div className="up-body">

          {/* HEADER */}
          <div className="up-header">
            <h1>Upload & Analyze</h1>
            <p>Upload your research paper and configure your analysis tools</p>
          </div>

          {/* MAIN SPLIT CARD */}
          <div className="up-card">
            <div className="up-card-title">
              <div className="up-card-title-icon">
                <Sparkles size={16} color="#00ffe0" />
              </div>
              Configure Analysis
            </div>

            <div className="up-split">
              {/* LEFT — Upload */}
              <div className="up-panel">
                <div className="up-panel-label">Step 1: Upload File</div>
                <div className="up-panel-sub">Drag & drop a PDF or image (PNG, JPG, WEBP)</div>

                {!pdfBase64 && !imageBase64 ? (
                  <div
                    className={`up-dropzone${isDragging ? ' dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="up-dropzone-icon">
                      <UploadCloud size={28} color="#00ffe0" />
                    </div>
                    <h3>Upload File</h3>
                    <p>PDF for full analysis or Image for visual analysis</p>
                    <button className="up-select-btn">Select File</button>
                    <input 
                      type="file" 
                      accept=".pdf,image/png,image/jpeg,image/webp" 
                      style={{ display: 'none' }} 
                      ref={fileInputRef} 
                      onChange={(e) => processFile(e.target.files[0])} 
                    />
                  </div>
                ) : (
                  <div className="up-uploaded">
                    <div className="up-uploaded-header">
                      <CheckCircle2 size={22} color="#00ff88" />
                      <div>
                        <div className="up-uploaded-name">
                          {pdfBase64 ? fileName : imageName}
                          <span className={`up-file-type ${pdfBase64 ? 'pdf' : 'img'}`} style={{ marginLeft: 8 }}>
                            {pdfBase64 ? 'PDF' : 'Image'}
                          </span>
                        </div>
                        <div className="up-uploaded-size">{pdfBase64 ? fileSize : imageSize}</div>
                      </div>
                      <button className="up-remove-btn" onClick={() => { 
                        setPdfData(null, null); 
                        setFileSize(null);
                        setImageData(null, null, null);
                        setImageName(null);
                        setImageSize(null);
                        setSelectedTool(null);
                      }}>
                        Remove
                      </button>
                    </div>
                    <div className="up-uploaded-center">
                      {pdfBase64 ? (
                        <>
                          <FileText size={56} color="#00ffe0" />
                          <p>PDF uploaded successfully</p>
                        </>
                      ) : (
                        <>
                          <img src={imagePreviewUrl} alt="Uploaded" className="up-image-preview" />
                          <p>Image uploaded successfully</p>
                        </>
                      )}
                      <span>Now select your analysis tool →</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DIVIDER */}
              <div className="up-divider">
                <div className="up-divider-or">or</div>
              </div>

              {/* RIGHT — Tools */}
              <div className="up-panel">
                <div className="up-panel-label">Step 2: Select Tool</div>
                <div className="up-panel-sub">
                  {!pdfBase64 && !imageBase64 ? 'Upload a file first' : 
                   pdfBase64 ? 'Choose ELIF or Chat' : 'Choose Visual Analysis or Chat'}
                </div>

                {/* ELIF - Only for PDF */}
                {availableTools.includes('elif') && (
                  <div className={`up-tool-card${selectedTool === 'elif' ? ' selected-cyan' : ''}`} onClick={() => toggleTool('elif')}>
                  <div className="up-tool-inner">
                    <div className="up-tool-icon" style={{ background: selectedTool === 'elif' ? '#00ffe0' : 'rgba(0,255,224,0.1)' }}>
                      <BookOpen size={20} color={selectedTool === 'elif' ? '#000' : '#00ffe0'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="up-tool-title">ELIF Summarizer</div>
                      <div className="up-tool-desc">Get paper summaries tailored to your expertise level</div>
                      {selectedTool === 'elif' && (
                        <div className="up-audience-wrap">
                          <div className="up-audience-label">Audience Level</div>
                          <select
                            className="up-audience-select"
                            value={elifAudience}
                            onChange={(e) => { e.stopPropagation(); setElifAudience(e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="highschool">High School Student</option>
                            <option value="undergrad">Undergraduate</option>
                            <option value="recruiter">Recruiter/Executive</option>
                            <option value="expert">Expert Researcher</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {/* Visual - Only for images */}
                {availableTools.includes('visual') && (
                  <div className={`up-tool-card${selectedTool === 'visual' ? ' selected-pink' : ''}`} onClick={() => toggleTool('visual')}>
                  <div className="up-tool-inner">
                    <div className="up-tool-icon" style={{ background: selectedTool === 'visual' ? '#ff4da6' : 'rgba(255,77,166,0.1)' }}>
                      <Eye size={20} color={selectedTool === 'visual' ? '#000' : '#ff4da6'} />
                    </div>
                    <div>
                      <div className="up-tool-title">Visual Analysis</div>
                      <div className="up-tool-desc">Decode charts, diagrams, and equations with AI vision</div>
                    </div>
                  </div>
                </div>
                )}

                {/* Chat - Available for both */}
                {availableTools.includes('chat') && (
                  <div className={`up-tool-card${selectedTool === 'chat' ? ' selected-green' : ''}`} onClick={() => toggleTool('chat')}>
                  <div className="up-tool-inner">
                    <div className="up-tool-icon" style={{ background: selectedTool === 'chat' ? '#00ff88' : 'rgba(0,255,136,0.1)' }}>
                      <MessageSquare size={20} color={selectedTool === 'chat' ? '#000' : '#00ff88'} />
                    </div>
                    <div>
                      <div className="up-tool-title">Chat with {pdfBase64 ? 'Paper' : 'Image'}</div>
                      <div className="up-tool-desc">Ask questions and get {pdfBase64 ? 'cited answers from your paper' : 'insights about your image'}</div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="up-actions">
            <button className="up-cancel-btn" onClick={() => {}}>Cancel</button>
            <button className="up-analyze-btn" disabled={!canAnalyze || isProcessing} onClick={handleAnalyze}>
              {isProcessing
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
                : <><Sparkles size={15} /> Start Analysis</>
              }
            </button>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </>
  );
}