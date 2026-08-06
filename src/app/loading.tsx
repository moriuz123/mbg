import React from 'react';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer subtle ring */}
        <div style={{
          position: 'absolute',
          width: '96px',
          height: '96px',
          border: '4px solid #e2e8f0',
          borderRadius: '50%',
        }}></div>
        
        {/* Animated spinning primary ring */}
        <div style={{
          position: 'absolute',
          width: '96px',
          height: '96px',
          border: '4px solid transparent',
          borderTopColor: '#306d29',
          borderRightColor: '#4c8538',
          borderRadius: '50%',
          animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
        }}></div>
        
        {/* Pulsing inner background */}
        <div style={{
          position: 'absolute',
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(48, 109, 41, 0.1)',
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>

        {/* Center Logo */}
        <img 
          src="/LOGO-LEBAK.png" 
          alt="Loading..." 
          style={{ 
            width: '40px', 
            height: '40px', 
            objectFit: 'contain',
            position: 'relative',
            zIndex: 10,
            animation: 'float 3s ease-in-out infinite'
          }} 
        />
      </div>
      
      <h2 style={{
        marginTop: '2.5rem',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#0f172a',
        letterSpacing: '-0.025em'
      }}>
        Menyiapkan Data...
      </h2>
      <p style={{
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#64748b'
      }}>
        Sistem Informasi Makan Bergizi Gratis
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
