'use client';

import { createContext, useContext, useState } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, BookOpen, Eye, MessageSquare, AlertTriangle } from 'lucide-react';

const PaperIQContext = createContext();

export function usePaperIQ() {
    return useContext(PaperIQContext);
}

export default function RootLayout({ children }) {
    const [pdfBase64, setPdfBase64] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // User state
    const [user, setUser] = useState(null); // { id, name, email }
    const [currentPaperId, setCurrentPaperId] = useState(null);
    
    // Image state for visual analysis
    const [imageBase64, setImageBase64] = useState(null);
    const [imageMimeType, setImageMimeType] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Usage tracking
    const [uploadedPapers, setUploadedPapers] = useState([]);
    const [elifAnalysisCount, setElifAnalysisCount] = useState(0);
    const [scholarSightCount, setScholarSightCount] = useState(0);
    const [chatMessageCount, setChatMessageCount] = useState(0);

    const setPdfData = (base64, name) => {
        setPdfBase64(base64);
        setFileName(name);
        
        // Track uploaded paper if it's a new one
        if (base64 && name && !uploadedPapers.some(p => p.name === name)) {
            const newPaper = {
                name,
                date: new Date().toISOString(),
                id: Date.now(),
            };
            setUploadedPapers(prev => [newPaper, ...prev.slice(0, 9)]); // Keep last 10
        }
    };
    
    const setImageData = (base64, mimeType, previewUrl) => {
        setImageBase64(base64);
        setImageMimeType(mimeType);
        setImagePreviewUrl(previewUrl);
    };

    const incrementElifAnalysis = () => setElifAnalysisCount(prev => prev + 1);
    const incrementScholarSight = () => setScholarSightCount(prev => prev + 1);
    const incrementChatMessage = () => setChatMessageCount(prev => prev + 1);

    const pathname = usePathname();
    const isHome = pathname === '/upload';
    const isAuthPage = pathname === '/' || pathname === '/welcome' || pathname === '/features' || pathname === '/register' || pathname === '/login';

    return (
        <html lang="en">
            <head>
                <title>PaperIQ - AI Research Paper Decoder</title>
            </head>
            <body>
                <PaperIQContext.Provider value={{ 
                    pdfBase64, fileName, setPdfData, 
                    isAuthenticated, setIsAuthenticated,
                    user, setUser,
                    currentPaperId, setCurrentPaperId,
                    imageBase64, imageMimeType, imagePreviewUrl, setImageData,
                    uploadedPapers, setUploadedPapers,
                    elifAnalysisCount, incrementElifAnalysis,
                    scholarSightCount, incrementScholarSight,
                    chatMessageCount, incrementChatMessage
                }}>
                    <div className="content-wrapper min-h-screen flex flex-col">

                        {/* Unified Navigation Bar */}
                        <header style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 48px',
                            height: '60px',
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(12px)',
                            borderBottom: '1px solid rgba(0,255,220,0.08)',
                        }}>
                            {/* Logo */}
                            <Link href="/welcome" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: '20px',
                                color: '#fff',
                                textDecoration: 'none',
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #00ffe0, #2a7fff)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <FileText size={15} />
                                </div>
                                <span style={{ color: '#00ffe0' }}>Paper</span>IQ
                            </Link>

                            {/* Nav Links */}
                            <nav style={{
                                display: 'flex',
                                gap: '32px',
                                listStyle: 'none',
                            }}>
                                <Link 
                                    href="/welcome" 
                                    style={{
                                        fontSize: '14px',
                                        color: pathname === '/welcome' ? '#fff' : '#6b7280',
                                        textDecoration: 'none',
                                        fontFamily: "'DM Sans', sans-serif",
                                        transition: 'color 0.2s',
                                        borderBottom: pathname === '/welcome' ? '2px solid #00ffe0' : 'none',
                                        paddingBottom: pathname === '/welcome' ? '2px' : '0',
                                    }}
                                >
                                    Home
                                </Link>
                                <Link 
                                    href="/features" 
                                    style={{
                                        fontSize: '14px',
                                        color: pathname === '/features' ? '#fff' : '#6b7280',
                                        textDecoration: 'none',
                                        fontFamily: "'DM Sans', sans-serif",
                                        transition: 'color 0.2s',
                                        borderBottom: pathname === '/features' ? '2px solid #00ffe0' : 'none',
                                        paddingBottom: pathname === '/features' ? '2px' : '0',
                                    }}
                                >
                                    Features
                                </Link>
                                <Link 
                                    href="/dashboard" 
                                    style={{
                                        fontSize: '14px',
                                        color: pathname === '/dashboard' ? '#fff' : '#6b7280',
                                        textDecoration: 'none',
                                        fontFamily: "'DM Sans', sans-serif",
                                        transition: 'color 0.2s',
                                        borderBottom: pathname === '/dashboard' ? '2px solid #00ffe0' : 'none',
                                        paddingBottom: pathname === '/dashboard' ? '2px' : '0',
                                    }}
                                >
                                    Dashboard
                                </Link>
                            </nav>

                            {/* Auth Actions (conditional) */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'center',
                            }}>
                                {!isAuthenticated ? (
                                    <>
                                        <Link 
                                            href="/login" 
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#9ca3af',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                padding: '8px 16px',
                                                fontFamily: "'DM Sans', sans-serif",
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Login
                                        </Link>
                                        <Link 
                                            href="/register" 
                                            style={{
                                                background: 'linear-gradient(135deg, #00ffe0, #2a7fff)',
                                                border: 'none',
                                                color: '#000',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                padding: '9px 20px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontFamily: "'DM Sans', sans-serif",
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                            }}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {fileName && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                background: '#0a0a0a',
                                                border: '1px solid #1a1a1a',
                                                fontSize: '12px',
                                                marginRight: '8px',
                                            }}>
                                                <FileText size={14} className="text-[#00ffe0]" style={{ color: '#00ffe0' }} />
                                                <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
                                            </div>
                                        )}
                                        <Link 
                                            href="/upload" 
                                            style={{
                                                background: 'linear-gradient(135deg, #00ffe0, #2a7fff)',
                                                border: 'none',
                                                color: '#000',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                padding: '9px 20px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontFamily: "'DM Sans', sans-serif",
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                            }}
                                        >
                                            Upload Paper
                                        </Link>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Guard Banner (only on tool pages without PDF) */}
                        {(pathname === '/elif' || pathname === '/scholarsight' || pathname === '/chat') && !pdfBase64 && (
                            <div className="bg-[#ffd000] text-black w-full py-3 px-6 flex items-center justify-center gap-4">
                                <AlertTriangle size={20} />
                                <span className="font-medium">No paper uploaded yet — go back to upload one</span>
                                <Link href="/upload" className="px-4 py-1.5 bg-black text-[#ffd000] rounded-lg text-sm font-semibold ml-4 hover:bg-black/80 transition-colors">
                                    Go to Upload
                                </Link>
                            </div>
                        )}

                        <main className="flex-1 flex flex-col">
                            {children}
                        </main>
                    </div>
                </PaperIQContext.Provider>
            </body>
        </html>
    );
}
