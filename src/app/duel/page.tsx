import React from 'react';

export default function DuelPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Düello: Portakal Işığı</h1>
        <p className="text-[#FF5A1F] font-mono tracking-widest uppercase">Tam Güç Aktif</p>
      </div>

      {/* Duel Container */}
      <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(255,90,31,0.2)] border border-white/10" style={{ isolation: 'isolate' }}>
        
        {/* CSS Animation for flickering */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
            25% { opacity: 0.95; }
            75% { opacity: 0.75; }
          }
          .animate-flicker {
            animation: flicker 0.15s infinite;
          }
        `}} />

        {/* Base Image - Untouched, just the raw image */}
        <img 
          src="/images/ado-design.png" 
          alt="ADO Design" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />

        {/* The Orange Light Overlay Container */}
        <div className="absolute inset-0 z-10 pointer-events-none animate-flicker">
          
          {/* Multiply Layer: Colors the white spotlight orange */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-100"
            style={{
              background: 'radial-gradient(circle at 50% 15%, #FF5A1F 0%, #FF5A1F 40%, transparent 80%)'
            }}
          />

          {/* Color Dodge Layer: Makes the core of the light super bright neon orange */}
          <div 
            className="absolute inset-0 mix-blend-color-dodge opacity-90"
            style={{
              background: 'radial-gradient(circle at 50% 5%, #FF5A1F 0%, transparent 40%)'
            }}
          />

          {/* Screen Layer: Adds light beams/haze spreading out */}
          <div 
            className="absolute inset-0 mix-blend-screen opacity-70"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(255,90,31,0.8) 0%, rgba(255,90,31,0.3) 40%, transparent 70%)'
            }}
          />

          {/* A physical glowing "bulb" at the very top center so there's an obvious light source */}
          <div 
            className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-48 h-20 bg-[#FF5A1F] rounded-full blur-[25px] mix-blend-screen opacity-100"
          />
          <div 
            className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-20 h-10 bg-white rounded-full blur-[10px] mix-blend-screen opacity-80"
          />
        </div>
      </div>

      <a href="/" className="mt-12 text-white/50 hover:text-white underline font-mono text-sm transition-colors">
        ← Ana Sayfaya Dön
      </a>
    </div>
  );
}
