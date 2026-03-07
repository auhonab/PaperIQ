'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle, Check, X } from 'lucide-react';
import styles from './register.module.css';
import { usePaperIQ } from '../layout';

const EMAIL_DOMAINS = [
  { trigger: ['g', 'gm', 'gma', 'gmai', 'gmail'], domain: 'gmail.com' },
  { trigger: ['y', 'ya', 'yah', 'yaho', 'yahoo'], domain: 'yahoo.com' },
  { trigger: ['o', 'ou', 'out', 'outl', 'outlo', 'outlook'], domain: 'outlook.com' },
  { trigger: ['h', 'ho', 'hot', 'hotm', 'hotma', 'hotmai', 'hotmail'], domain: 'hotmail.com' },
  { trigger: ['i', 'ic', 'icl', 'iclo', 'iclou', 'icloud'], domain: 'icloud.com' },
  { trigger: ['p', 'pr', 'pro', 'prox', 'proxym', 'proton', 'protonm'], domain: 'protonmail.com' },
  { trigger: ['m', 'me'], domain: 'me.com' },
];

function getEmailSuggestion(email) {
  if (!email.includes('@')) return null;
  const [local, afterAt] = email.split('@');
  if (!afterAt || afterAt.length === 0) return null;
  const lower = afterAt.toLowerCase();
  for (const { trigger, domain } of EMAIL_DOMAINS) {
    if (trigger.includes(lower) && domain.startsWith(lower)) {
      return `${local}@${domain}`;
    }
  }
  return null;
}

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character (!@#$...)', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter(c => c.ok).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][score];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#00ffe0'][score];

  if (!password) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i <= score ? strengthColor : '#1e2a3a',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {checks.map(({ label, ok }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {ok
              ? <Check size={12} color="#00ffe0" />
              : <X size={12} color="#374151" />}
            <span style={{ fontSize: 11, color: ok ? '#00ffe0' : '#374151' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { setIsAuthenticated, setUser } = usePaperIQ();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const emailRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    if (name === 'email') setEmailSuggestion(getEmailSuggestion(value));
  };

  const acceptSuggestion = () => {
    if (emailSuggestion) {
      setFormData(prev => ({ ...prev, email: emailSuggestion }));
      setEmailSuggestion(null);
    }
  };

  const handleEmailKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && emailSuggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields'); return;
    }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (!agreed) { setError('Please agree to the Terms & Conditions'); return; }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Set user data in context
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '14px 16px',
    color: '#e0e0e0',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    WebkitBoxShadow: '0 0 0 1000px rgba(255,255,255,0.04) inset',
    WebkitTextFillColor: '#e0e0e0',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 40px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* CARD */}
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '40px 40px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* top gradient bar */}
            <div className={styles.progressBar} />

            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #00ffe0, #2a7fff)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>📄</div>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 22, color: '#fff' }}>
                  <span style={{ color: '#00ffe0' }}>Paper</span>IQ
                </span>
              </div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Create Your PaperIQ Account
              </h2>
              <p style={{ fontSize: 13, color: '#6b7280' }}>Start decoding research papers with AI</p>
            </div>

            {/* FORM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  className={styles.regInput}
                  style={inputStyle}
                  type="text"
                  name="name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  disabled={isLoading}
                />
              </div>

              {/* Email with ghost suggestion */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  {/* Ghost suggestion layer */}
                  {emailSuggestion && (
                    <div className={styles.suggestionGhost} aria-hidden="true">
                      <span className={styles.typed}>{formData.email}</span>
                      <span className={styles.suggested}>{emailSuggestion.slice(formData.email.length)}</span>
                    </div>
                  )}
                  <input
                    ref={emailRef}
                    className={styles.regInput}
                    style={{ ...inputStyle, background: 'transparent', position: 'relative', zIndex: 1 }}
                    type="email"
                    name="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleEmailKeyDown}
                    placeholder="Email Address"
                    disabled={isLoading}
                  />
                  {emailSuggestion && (
                    <button
                      type="button"
                      onClick={acceptSuggestion}
                      style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(0,255,220,0.12)', border: '1px solid rgba(0,255,220,0.25)',
                        borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#00ffe0',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", zIndex: 2,
                      }}
                    >Tab ↹</button>
                  )}
                </div>
                {emailSuggestion && (
                  <p style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>
                    Press Tab or → to accept: <span style={{ color: '#00ffe0' }}>{emailSuggestion}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={styles.regInput}
                    style={{ ...inputStyle, paddingRight: 44 }}
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password (min. 8 characters)"
                    disabled={isLoading}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: 0,
                  }}>
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={styles.regInput}
                    style={{ ...inputStyle, paddingRight: 44,
                      borderColor: formData.confirmPassword && formData.confirmPassword !== formData.password
                        ? 'rgba(239,68,68,0.4)' : undefined
                    }}
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    disabled={isLoading}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: 0,
                  }}>
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                  <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <p style={{ fontSize: 11, color: '#00ffe0', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={11} /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div
                  onClick={() => setAgreed(v => !v)}
                  style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: `1px solid ${agreed ? '#00ffe0' : 'rgba(255,255,255,0.12)'}`,
                    background: agreed ? 'rgba(0,255,220,0.15)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {agreed && <Check size={11} color="#00ffe0" />}
                </div>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: '#00ffe0', textDecoration: 'none' }}>Terms & Conditions</a>
                </span>
              </label>

              {/* Error */}
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <AlertCircle size={16} color="#ef4444" />
                  <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                className={styles.continueBtn}
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ marginTop: 4, gap: 8 }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                  </div>
                ) : (
                  <> Continue <ArrowRight size={16} /> </>
                )}
              </button>



              {/* Sign in link */}
              <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#00ffe0', textDecoration: 'none', fontWeight: 600 }}>Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}