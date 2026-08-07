import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
};

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-[#05112c] via-[#071840] to-[#0a235c] text-white pt-28 pb-12 rounded-b-[2.5rem] mb-10 shadow-[0_8px_30px_rgba(7,24,64,0.1)] relative overflow-hidden">
      {/* Subtle Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[60px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-6">
          <Link href="/" className="hover:text-white transition-colors flex items-center">
            <Home size={14} className="mr-1.5" /> Beranda
          </Link>
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={14} className="opacity-40" />
              {bc.href ? (
                <Link href={bc.href} className="hover:text-white transition-colors">
                  {bc.label}
                </Link>
              ) : (
                <span className="text-white font-semibold">{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title & Desc */}
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white">{title}</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
