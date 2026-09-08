import React from 'react';
import GeoLogistikDashboard from '@/components/dashboard/GeoLogistikDashboard';
import { getGeoLogistikStats } from '@/app/actions/geoLogistik';

export const metadata = {
  title: 'Matriks Geo-Logistik | Admin MBG',
};

export default async function MatriksLogistikPage() {
  const stats = await getGeoLogistikStats();
  
  return (
    <GeoLogistikDashboard stats={stats} />
  );
}
