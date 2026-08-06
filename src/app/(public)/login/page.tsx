'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await authClient.signIn.username({
        username,
        password
    });

    if (error) {
        setError(error.message || 'Login gagal. Periksa kembali kredensial Anda.');
        setLoading(false);
    } else {
        router.push('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center animate-fade-in" 
         style={{
           minHeight: '100vh',
           padding: '2rem 1rem',
           backgroundImage: 'radial-gradient(at 0% 0%, hsla(217,100%,94%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(210,100%,94%,1) 0, transparent 50%)',
           backgroundSize: 'cover'
         }}>
      
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="text-center mb-8">
          <img src="/LOGO-LEBAK.png" alt="Logo Lebak" style={{ height: '64px', margin: '0 auto', marginBottom: '1rem' }} />
          <h2 className="text-2xl font-bold">Portal Petugas MBG</h2>
          <p className="text-muted mt-2 text-sm">Masuk untuk mengakses Dasbor Pengawasan</p>
        </div>

        {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2" style={{ display: 'block' }} htmlFor="username">
              Username Petugas
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <Mail size={18} />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none' }}
                placeholder="sppg5"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium mb-2" style={{ display: 'block' }} htmlFor="password">
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="remember-me" className="text-sm" style={{ cursor: 'pointer' }}>
                Ingat saya
              </label>
            </div>
            <a href="#" className="text-sm font-medium" style={{ color: 'var(--primary-600)' }}>
              Lupa sandi?
            </a>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-4" style={{ padding: '0.75rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Memverifikasi...' : <><span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>Masuk Dasbor <ArrowRight size={18} /></span></>}
          </button>
        </form>
      </div>
    </div>
  );
}
