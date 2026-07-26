import React from 'react';
import { Bot, Sparkles, SlidersHorizontal, Trash2, Cpu } from 'lucide-react';
import { AIModelConfig, AgentStatusType } from '../types/ai';

interface HeaderProps {
  config: AIModelConfig;
  agentStatus: AgentStatusType;
  onConfigChange: (newConfig: Partial<AIModelConfig>) => void;
  onClearHistory: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  agentStatus,
  onConfigChange,
  onClearHistory,
  onToggleSidebar
}) => {
  const getStatusBadge = () => {
    switch (agentStatus) {
      case 'thinking':
        return <span className="badge badge-purple animate-pulse">🧠 Thinking...</span>;
      case 'executing_tool':
        return <span className="badge badge-amber animate-pulse">⚙️ Tool Executing</span>;
      case 'streaming':
        return <span className="badge badge-cyan animate-pulse">⚡ Streaming Tokens</span>;
      case 'error':
        return <span className="badge badge-amber">⚠️ Error</span>;
      default:
        return <span className="badge badge-emerald">● Agent Ready</span>;
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 10
    }}>
      {/* Brand & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn" onClick={onToggleSidebar} title="Toggle Parameters">
          <SlidersHorizontal size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Frontend <span className="gradient-text">AI Workbench</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              React + Vite + Agentic AI Architecture
            </p>
          </div>
        </div>

        <div style={{ marginLeft: '12px' }}>{getStatusBadge()}</div>
      </div>

      {/* Model Selection & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Cpu size={16} color="var(--accent-cyan)" />
          <select
            value={config.model}
            onChange={(e) => onConfigChange({ model: e.target.value })}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="gpt-4o" style={{ background: '#111827' }}>OpenAI gpt-4o</option>
            <option value="claude-3-5-sonnet" style={{ background: '#111827' }}>Anthropic claude-3.5-sonnet</option>
            <option value="gemini-1.5-pro" style={{ background: '#111827' }}>Google gemini-1.5-pro</option>
            <option value="llama-3-70b" style={{ background: '#111827' }}>Local llama-3-70b</option>
          </select>
        </div>

        <button className="btn" onClick={onClearHistory} title="Clear Conversation">
          <Trash2 size={16} color="var(--accent-rose)" />
          <span>Clear</span>
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <Sparkles size={16} />
          <span>Star Starter</span>
        </a>
      </div>
    </header>
  );
};
