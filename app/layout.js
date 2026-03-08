'use client';

import { createContext, useContext, useState, useEffect } from 'react';
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

    // Cached analysis results (persist across page navigation)
    const [elifResults, setElifResults] = useState(null);
    const [elifLevel, setElifLevel] = useState('undergrad');
    const [scholarSightResults, setScholarSightResults] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    // Per-file analysis caches (persisted to localStorage)
    const [elifResultsCache, setElifResultsCache] = useState({});
    const [scholarSightCache, setScholarSightCache] = useState({});

    // Image tracking
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imageFileName, setImageFileName] = useState(null);

    // Prevent hydration mismatch for auth-dependent UI
    const [isMounted, setIsMounted] = useState(false);
    
    // Restore session from localStorage on mount
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('paperiq_user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                    
                    // Fetch user's papers from MongoDB
                    fetch(`/api/papers?userId=${userData.id}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success && data.papers) {
                                const formattedPapers = data.papers.map(p => ({
                                    id: String(p.id),
                                    mongoId: String(p.id),
                                    name: p.fileName,
                                    date: p.uploadedAt
                                }));
                                setUploadedPapers(formattedPapers);
                                localStorage.setItem('paperiq_papers', JSON.stringify(formattedPapers));
                            }
                        })
                        .catch(err => console.error('Failed to fetch papers:', err));
                } catch (e) {
                    console.error('Failed to restore session:', e);
                    localStorage.removeItem('paperiq_user');
                }
            } else {
                // No user logged in, restore papers from localStorage  
                const savedPapers = localStorage.getItem('paperiq_papers');
                if (savedPapers) {
                    try {
                        setUploadedPapers(JSON.parse(savedPapers));
                    } catch (e) {
                        localStorage.removeItem('paperiq_papers');
                    }
                }
            }

            // Restore uploaded images (not user-specific)
            const savedImages = localStorage.getItem('paperiq_images');
            if (savedImages) {
                try { setUploadedImages(JSON.parse(savedImages)); } catch (e) { localStorage.removeItem('paperiq_images'); }
            }

            // Restore per-file analysis caches
            const savedElifCache = localStorage.getItem('paperiq_elif_cache');
            if (savedElifCache) {
                try { setElifResultsCache(JSON.parse(savedElifCache)); } catch (e) { localStorage.removeItem('paperiq_elif_cache'); }
            }
            const savedScholarCache = localStorage.getItem('paperiq_scholar_cache');
            if (savedScholarCache) {
                try { setScholarSightCache(JSON.parse(savedScholarCache)); } catch (e) { localStorage.removeItem('paperiq_scholar_cache'); }
            }
        }
    }, []);
    
    // Function to fetch user's papers from MongoDB
    const fetchUserPapers = async (userId) => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/papers?userId=${userId}`);
            const data = await res.json();
            if (data.success && data.papers) {
                const formattedPapers = data.papers.map(p => ({
                    id: String(p.id),
                    mongoId: String(p.id),
                    name: p.fileName,
                    date: p.uploadedAt
                }));
                setUploadedPapers(formattedPapers);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('paperiq_papers', JSON.stringify(formattedPapers));
                }
            }
        } catch (err) {
            console.error('Failed to fetch papers:', err);
        }
    };
    
    // Custom setUser that saves to localStorage
    const setUserWithPersistence = (userData) => {
        setUser(userData);
        if (typeof window !== 'undefined') {
            if (userData) {
                localStorage.setItem('paperiq_user', JSON.stringify(userData));
                // Fetch user's papers when user is set
                fetchUserPapers(userData.id);
            } else {
                localStorage.removeItem('paperiq_user');
            }
        }
    };
    
    // Custom setIsAuthenticated that syncs with user data
    const setIsAuthenticatedWithPersistence = (isAuth) => {
        setIsAuthenticated(isAuth);
        if (!isAuth && typeof window !== 'undefined') {
            localStorage.removeItem('paperiq_user');
            setUser(null);
        }
    };
    
    // Logout function
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setUploadedPapers([]);
        setUploadedImages([]);
        setElifResultsCache({});
        setScholarSightCache({});
        setElifResults(null);
        setScholarSightResults(null);
        setChatMessages([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('paperiq_user');
            localStorage.removeItem('paperiq_papers');
            localStorage.removeItem('paperiq_images');
            localStorage.removeItem('paperiq_elif_cache');
            localStorage.removeItem('paperiq_scholar_cache');
        }
    };

    // Cache ELIF results per filename
    const cacheElifResults = (name, results, level) => {
        if (!name) return;
        setElifResultsCache(prev => {
            const updated = { ...prev, [name]: { results, level } };
            if (typeof window !== 'undefined') {
                localStorage.setItem('paperiq_elif_cache', JSON.stringify(updated));
            }
            return updated;
        });
    };

    // Cache ScholarSight results per image name
    const cacheScholarSightResults = (name, results) => {
        if (!name) return;
        setScholarSightCache(prev => {
            const updated = { ...prev, [name]: results };
            if (typeof window !== 'undefined') {
                localStorage.setItem('paperiq_scholar_cache', JSON.stringify(updated));
            }
            return updated;
        });
    };

    // Delete a paper (local + MongoDB)
    const deletePaper = (paperId) => {
        setUploadedPapers(prev => {
            const paper = prev.find(p => p.id === paperId);
            const updated = prev.filter(p => p.id !== paperId);
            if (typeof window !== 'undefined') {
                localStorage.setItem('paperiq_papers', JSON.stringify(updated));
            }
            // Clear ELIF cache for this paper
            if (paper) {
                setElifResultsCache(prevCache => {
                    const updatedCache = { ...prevCache };
                    delete updatedCache[paper.name];
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('paperiq_elif_cache', JSON.stringify(updatedCache));
                    }
                    return updatedCache;
                });
                // Delete from MongoDB if we have a mongoId
                if (paper.mongoId) {
                    fetch(`/api/papers?paperId=${paper.mongoId}`, { method: 'DELETE' })
                        .catch(err => console.error('Failed to delete from MongoDB:', err));
                }
            }
            return updated;
        });
    };

    // Delete an image (local only)
    const deleteImage = (imageId) => {
        setUploadedImages(prev => {
            const image = prev.find(i => i.id === imageId);
            const updated = prev.filter(i => i.id !== imageId);
            if (typeof window !== 'undefined') {
                localStorage.setItem('paperiq_images', JSON.stringify(updated));
            }
            if (image) {
                setScholarSightCache(prevCache => {
                    const updatedCache = { ...prevCache };
                    delete updatedCache[image.name];
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('paperiq_scholar_cache', JSON.stringify(updatedCache));
                    }
                    return updatedCache;
                });
            }
            return updated;
        });
    };

    const setPdfData = (base64, name) => {
        setPdfBase64(base64);
        setFileName(name);
        
        // Clear cached results when a new PDF is loaded
        if (base64 && name) {
            setElifResults(null);
            setChatMessages([]);
        }
        
        // Track uploaded paper if it's a new one
        if (base64 && name && !uploadedPapers.some(p => p.name === name)) {
            const localId = Date.now();
            const newPaper = { name, date: new Date().toISOString(), id: localId, mongoId: null };
            const updatedPapers = [newPaper, ...uploadedPapers.slice(0, 9)];
            setUploadedPapers(updatedPapers);

            if (typeof window !== 'undefined') {
                localStorage.setItem('paperiq_papers', JSON.stringify(updatedPapers));

                if (user && user.id) {
                    const fileSize = Math.round((base64.length * 3) / 4);
                    fetch('/api/papers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, fileName: name, fileSize })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.paper) {
                            // Replace local entry with MongoDB ID
                            setUploadedPapers(prev => {
                                const updated = prev.map(p =>
                                    p.id === localId
                                        ? { ...p, id: String(data.paper.id), mongoId: String(data.paper.id) }
                                        : p
                                );
                                localStorage.setItem('paperiq_papers', JSON.stringify(updated));
                                return updated;
                            });
                        }
                    })
                    .catch(err => console.error('Failed to save paper to database:', err));
                }
            }
        }
    };
    
    const setImageData = (base64, mimeType, previewUrl, name) => {
        setImageBase64(base64);
        setImageMimeType(mimeType);
        setImagePreviewUrl(previewUrl);
        setImageFileName(name || null);
        // Clear active ScholarSight result when a new image is loaded
        if (base64) setScholarSightResults(null);
        // Track in uploadedImages list
        if (base64 && name) {
            setUploadedImages(prev => {
                if (prev.some(i => i.name === name)) return prev;
                const newImage = { id: Date.now(), name, date: new Date().toISOString(), mimeType };
                const updated = [newImage, ...prev.slice(0, 9)];
                if (typeof window !== 'undefined') {
                    localStorage.setItem('paperiq_images', JSON.stringify(updated));
                }
                return updated;
            });
        }
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
                    isAuthenticated, setIsAuthenticated: setIsAuthenticatedWithPersistence,
                    user, setUser: setUserWithPersistence,
                    logout,
                    currentPaperId, setCurrentPaperId,
                    imageBase64, imageMimeType, imagePreviewUrl, setImageData,
                    uploadedPapers, setUploadedPapers,
                    elifAnalysisCount, incrementElifAnalysis,
                    scholarSightCount, incrementScholarSight,
                    chatMessageCount, incrementChatMessage,
                    elifResults, setElifResults, elifLevel, setElifLevel,
                    scholarSightResults, setScholarSightResults,
                    chatMessages, setChatMessages,
                    elifResultsCache, cacheElifResults,
                    scholarSightCache, cacheScholarSightResults,
                    uploadedImages, imageFileName,
                    deletePaper, deleteImage,
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
                                {!isMounted ? null : !isAuthenticated ? (
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
