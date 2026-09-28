import React from 'react';
import AccountSettingsClient from '@/components/AccountSettingsClient';

export const metadata = {
  title: 'Pengaturan Akun | MBG',
};

export default function AccountSettingsPage() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <AccountSettingsClient />
    </div>
  );
}
