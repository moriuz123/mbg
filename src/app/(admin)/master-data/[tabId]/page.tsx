import { redirect } from 'next/navigation';
import { getMasterDataSafe } from '@/app/actions/master';
import MasterDataClient from './client';

const tabMapping = {
  'sumber-gabah': { id: 'sumber-gabah', label: 'Sumber Gabah' },
  'lokus-sppg': { id: 'lokus-sppg', label: 'Lokus SPPG' },
  'jenis-pangan': { id: 'jenis-pangan', label: 'Jenis Pangan' },
  'distributor': { id: 'distributor', label: 'Distributor' },
  'parameter-uji': { id: 'parameter-uji', label: 'Parameter Uji' },
} as const;

export default async function MasterDataPage({ params }: { params: Promise<{ tabId: string }> }) {
  const { tabId } = await params;
  
  const currentTab = tabMapping[tabId as keyof typeof tabMapping];

  if (!currentTab) {
    redirect("/master-data/sumber-gabah");
  }

  const tableData = await getMasterDataSafe(currentTab.id as any);

  return (
    <MasterDataClient 
      activeTab={currentTab.id} 
      activeLabel={currentTab.label} 
      tableData={tableData} 
    />
  );
}
