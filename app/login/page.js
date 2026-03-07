'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { usePaperIQ } from '../layout';
import Link from 'next/link';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b1120 !important; }

  .login-root {
    min-height: 100vh;
    background: #0b1120;
    font-family: 'DM Sans', sans-serif;
    display: flex; flex-direction: column;
  }

  /* NAV */
  .login-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(11,17,32,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .login-nav-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px; color: #fff;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .login-nav-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .login-nav-links { display: flex; gap: 32px; list-style: none; }
  .login-nav-links a { font-size: 14px; color: #6b7280; text-decoration: none; transition: color 0.2s; }
  .login-nav-links a:hover { color: #fff; }
  .login-nav-links a.active { color: #fff; border-bottom: 2px solid #00ffe0; padding-bottom: 2px; }
  .login-nav-actions { display: flex; gap: 12px; align-items: center; }
  .login-nav-ghost { background: none; border: none; color: #9ca3af; font-size: 14px; cursor: pointer; padding: 8px 16px; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .login-nav-ghost:hover { color: #fff; }
  .login-nav-primary {
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border: none; color: #000; font-weight: 700; font-size: 14px;
    padding: 9px 20px; border-radius: 8px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: opacity 0.2s;
  }
  .login-nav-primary:hover { opacity: 0.88; }

  /* PAGE */
  .login-page {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 80px 24px 40px;
  }

  .login-container { width: 100%; max-width: 480px; }

  /* CARD */
  .login-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 40px 40px 32px;
    position: relative; overflow: hidden;
  }
  .login-card-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #00ffe0, #2a7fff);
    border-radius: 3px 3px 0 0;
  }

  /* HEADER */
  .login-header { text-align: center; margin-bottom: 28px; }
  .login-logo-wrap {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-bottom: 14px;
  }
  .login-logo-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #00ffe0, #2a7fff);
    border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px;
  }
  .login-logo-text {
    font-family: 'Share Tech Mono', monospace; font-size: 22px; color: #fff;
  }
  .login-header h2 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .login-header p { font-size: 13px; color: #6b7280; }

  /* FIELDS */
  .login-fields { display: flex; flex-direction: column; gap: 16px; }

  .login-label {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; color: #6b7280; margin-bottom: 6px;
  }
  .login-label a { color: #00ffe0; text-decoration: none; font-size: 12px; transition: opacity 0.2s; }
  .login-label a:hover { opacity: 0.75; }

  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 14px 44px 14px 16px;
    color: #e0e0e0; font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .login-input:focus { border-color: rgba(0,255,224,0.4); }
  .login-input::placeholder { color: #374151; }
  .login-input:disabled { opacity: 0.5; }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.04) inset !important;
    -webkit-text-fill-color: #e0e0e0 !important;
    box-shadow: 0 0 0 1000px rgba(255,255,255,0.04) inset !important;
    background-color: rgba(255,255,255,0.04) !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  .login-input-wrap { position: relative; }
  .login-eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #4b5563; padding: 0;
    transition: color 0.2s;
  }
  .login-eye-btn:hover { color: #9ca3af; }

  /* REMEMBER */
  .login-remember { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .login-checkbox {
    width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; cursor: pointer;
  }
  .login-checkbox.checked {
    border-color: #00ffe0;
    background: rgba(0,255,224,0.15);
  }
  .login-remember span { font-size: 13px; color: #6b7280; }

  /* ERROR */
  .login-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px; padding: 12px 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .login-error p { font-size: 13px; color: #ef4444; }

  /* INFO MESSAGE */
  .login-info {
    background: rgba(0,255,224,0.08);
    border: 1px solid rgba(0,255,224,0.25);
    border-radius: 10px; padding: 12px 14px;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
  }
  .login-info p { font-size: 13px; color: #00ffe0; }

  /* SUBMIT */
  .login-submit {
    width: 100%; padding: 14px;
    background: linear-gradient(90deg, #00ffe0, #2a7fff);
    border: none; border-radius: 10px;
    color: #000; font-weight: 700; font-size: 15px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
    margin-top: 4px;
  }
  .login-submit:hover:not(:disabled) { opacity: 0.87; transform: scale(1.01); }
  .login-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .dot { width: 7px; height: 7px; background: #000; border-radius: 50%; animation: bounce 0.9s infinite; }
  .dot:nth-child(2) { animation-delay: 0.15s; }
  .dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

  /* DIVIDER */
  .login-divider {
    display: flex; align-items: center; gap: 12px; margin: 20px 0;
  }
  .login-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .login-divider span { font-size: 12px; color: #374151; }


  /* FOOTER */
  .login-footer {
    margin-top: 20px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: center;
    font-size: 13px; color: #6b7280;
  }
  .login-footer a { color: #00ffe0; text-decoration: none; font-weight: 600; }
  .login-footer a:hover { opacity: 0.8; }
`;

export default function LoginPage() {
  const router = useRouter();
  const { setIsAuthenticated, setUser } = usePaperIQ();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  // Check for messages from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const message = params.get('message');
      if (message === 'already_registered') {
        setInfoMessage('You are already registered. Please login with your credentials.');
        // Clear the URL parameter
        window.history.replaceState({}, '', '/login');
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.email || !formData.password) { setError('Please fill in all fields'); return; }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Set user data in context (this will automatically fetch papers)
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">

        {/* NAV */}
        <nav className="login-nav">
          <Link href="/welcome" className="login-nav-logo">
            <div className="login-nav-logo-icon">📄</div>
            <span style={{ color: '#00ffe0' }}>Paper</span>IQ
          </Link>
          <ul className="login-nav-links">
            <li><Link href="/welcome">Home</Link></li>
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
          <div className="login-nav-actions">
            <Link href="/login" className="login-nav-ghost">Login</Link>
            <Link href="/register" className="login-nav-primary">Get Started</Link>
          </div>
        </nav>

        {/* PAGE */}
        <div className="login-page">
          <div className="login-container">

            <div className="login-card">
              <div className="login-card-bar" />

              {/* HEADER */}
              <div className="login-header">
                <div className="login-logo-wrap">
                  <div className="login-logo-icon">📄</div>
                  <span className="login-logo-text">
                    <span style={{ color: '#00ffe0' }}>Paper</span>IQ
                  </span>
                </div>
                <h2>Welcome back</h2>
                <p>Sign in to continue your research</p>
              </div>

              {/* FIELDS */}
              <div className="login-fields">

                {/* Email */}
                <div>
                  <div className="login-label"><span>Email Address</span></div>
                  <div className="login-input-wrap">
                    <input
                      className="login-input"
                      type="email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      onKeyDown={handleKey}
                      placeholder="you@university.edu"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="login-label">
                    <span>Password</span>
                    <a href="#">Forgot password?</a>
                  </div>
                  <div className="login-input-wrap">
                    <input
                      className="login-input"
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyDown={handleKey}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button className="login-eye-btn" type="button" onClick={() => setShowPwd(v => !v)}>
                      {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="login-remember" onClick={() => setRemember(v => !v)}>
                  <div className={`login-checkbox${remember ? ' checked' : ''}`}>
                    {remember && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#00ffe0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span>Remember me for 30 days</span>
                </label>

                {/* Info Message */}
                {infoMessage && (
                  <div className="login-info">
                    <AlertCircle size={16} color="#00ffe0" />
                    <p>{infoMessage}</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="login-error">
                    <AlertCircle size={16} color="#ef4444" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button className="login-submit" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>



                {/* Footer */}
                <div className="login-footer">
                  Don't have an account?{' '}
                  <Link href="/register">Sign up for free</Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}