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
      className="flex items-center justify-center gap-2 w-full p-3 rounded-xl text-red-600 bg-red-50 font-semibold hover:bg-red-100 transition-colors shadow-sm"
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
      className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
    >
      <LogOut size={18} />
    </button>
  );
}
