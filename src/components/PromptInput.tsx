import React, { useState, KeyboardEvent } from 'react';
import { Send, Square, Paperclip, Sparkles, Hash } from 'lucide-react';
import { AgentStatusType } from '../types/ai';

interface PromptInputProps {
  onSendMessage: (text: string) => void;
  onStopStreaming: () => void;
  agentStatus: AgentStatusType;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSendMessage,
  onStopStreaming,
  agentStatus
}) => {
  const [input, setInput] = useState('');

  const isBusy = agentStatus !== 'idle' && agentStatus !== 'error';

  const handleSubmit = () => {
    if (!input.trim() || isBusy) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Rough estimation: ~4 chars per token
  const estimatedTokens = Math.ceil(input.length / 4);

  return (
    <div style={{
      padding: '16px 24px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI agent to write code, review architecture, or run tools (Enter to send, Shift+Enter for newline)..."
          rows={2}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            resize: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
          <button
            type="button"
            className="btn"
            style={{ padding: '8px', borderRadius: 'var(--radius-full)' }}
            title="Attach Context File"
          >
            <Paperclip size={18} color="var(--text-secondary)" />
          </button>

          {isBusy ? (
            <button
              type="button"
              className="btn"
              onClick={onStopStreaming}
              style={{
                background: 'var(--accent-rose)',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Square size={16} />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!input.trim()}
              style={{
                padding: '8px 16px',
                opacity: !input.trim() ? 0.5 : 1,
                cursor: !input.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={13} color="var(--accent-cyan)" />
          <span>Press <code>Shift + Enter</code> for new lines. Agent streaming enabled.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
          <Hash size={13} />
          <span>Est. Tokens: {estimatedTokens}</span>
        </div>
      </div>
    </div>
  );
};
