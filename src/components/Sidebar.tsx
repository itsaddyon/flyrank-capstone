import React from 'react';
import { Settings2, Zap, Terminal, ShieldAlert } from 'lucide-react';
import { AIModelConfig } from '../types/ai';

interface SidebarProps {
  isOpen: boolean;
  config: AIModelConfig;
  onConfigChange: (newConfig: Partial<AIModelConfig>) => void;
  onLoadPreset: (presetPrompt: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  config,
  onConfigChange,
  onLoadPreset
}) => {
  if (!isOpen) return null;

  const presets = [
    { label: '🚀 Code Architecture Review', prompt: 'Perform a full TypeScript code architecture review on my component state management.' },
    { label: '⚡ Stream Buffer Optimization', prompt: 'Explain how to optimize token buffer flushing in modern React 18 applications.' },
    { label: '🛠️ Agent Tool Calling', prompt: 'Search the web for top React Vite engineering practices and summarize key findings.' }
  ];

  return (
    <aside style={{
      width: '320px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border-color)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
        <Settings2 size={20} />
        <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Agent Hyperparameters</h2>
      </div>

      {/* Temperature Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Temperature</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{config.temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={config.temperature}
          onChange={(e) => onConfigChange({ temperature: parseFloat(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
        />
      </div>

      {/* Max Tokens Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Max Tokens</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{config.maxTokens}</span>
        </div>
        <input
          type="range"
          min="256"
          max="8192"
          step="256"
          value={config.maxTokens}
          onChange={(e) => onConfigChange({ maxTokens: parseInt(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
        />
      </div>

      {/* Autonomous Tools Checkbox */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Terminal size={16} color="var(--accent-amber)" />
          <span>Enable Agent Tools</span>
        </div>
        <input
          type="checkbox"
          checked={config.enableTools}
          onChange={(e) => onConfigChange({ enableTools: e.target.checked })}
          style={{ width: '16px', height: '16px', accentColor: 'var(--accent-amber)' }}
        />
      </div>

      {/* System Prompt Editor */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          System Persona Prompt
        </label>
        <textarea
          rows={5}
          value={config.systemPrompt}
          onChange={(e) => onConfigChange({ systemPrompt: e.target.value })}
          style={{
            width: '100%',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '10px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      </div>

      {/* Preset Starters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <Zap size={15} color="var(--accent-purple)" />
          <span>Quick Presets</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              className="btn"
              onClick={() => onLoadPreset(p.prompt)}
              style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.8rem', padding: '8px 12px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '10px', background: 'rgba(245, 158, 11, 0.05)', border: '1px dashed var(--accent-amber)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontWeight: 600, marginBottom: '4px' }}>
          <ShieldAlert size={14} /> Agent Guardrails Active
        </div>
        All tool executions are running within safe local sandbox limits defined in <code>AGENTS.md</code>.
      </div>
    </aside>
  );
};
