import React from 'react';
import { Header } from './components/Header';
import { ScholarshipForm } from './components/ScholarshipForm';

export const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{
        flex: 1,
        background: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.04), transparent 60%)',
        paddingBottom: '40px'
      }}>
        <ScholarshipForm />
      </main>
    </div>
  );
};

export default App;
