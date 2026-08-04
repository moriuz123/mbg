'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function LogoutButtonSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', color: '#ef4444', backgroundColor: '#fef2f2', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
    >
      <LogOut size={18} /> Keluar Sistem
    </button>
  );
}

export function LogoutButtonHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <button 
      onClick={handleLogout}
      title="Keluar Sistem" 
      style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.375rem', borderRadius: '50%', transition: 'all 0.2s', border: 'none', background: 'transparent', cursor: 'pointer' }}
    >
      <LogOut size={18} />
    </button>
  );
}
