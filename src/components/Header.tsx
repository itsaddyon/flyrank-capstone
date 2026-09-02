import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)'
        }}>
          <GraduationCap size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Scholarship <span className="gradient-text">Application Portal</span>
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Academic Year 2026-2027
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="badge badge-emerald">
          <ShieldCheck size={14} /> Official Portal
        </span>
      </div>
    </header>
  );
};
