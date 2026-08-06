import React from 'react';
import UserManagementClient from '@/components/UserManagementClient';
import { getUserList, getReferenceData } from '@/app/actions/userManagement';

export const metadata = {
  title: 'Manajemen Hak Akses | Admin MBG',
};

export default async function UserManagementPage() {
  const users = await getUserList();
  const referenceData = await getReferenceData();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <UserManagementClient users={users} referenceData={referenceData} />
    </div>
  );
}
