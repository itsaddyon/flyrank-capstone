import React, { useState } from 'react';
import { User, Bot, ChevronDown, ChevronRight, Copy, Check, Wrench, BrainCircuit } from 'lucide-react';
import { AIMessage } from '../types/ai';

interface MessageBubbleProps {
  message: AIMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [showReasoning, setShowReasoning] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      marginBottom: '20px',
      alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row'
    }}>
      {/* Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-full)',
        background: isUser ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isUser ? <User size={18} color="var(--text-secondary)" /> : <Bot size={20} color="#fff" />}
      </div>

      {/* Message Content Body */}
      <div style={{
        maxWidth: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}>
        {/* Header line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '6px'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span>{message.timestamp}</span>
        </div>

        <div style={{
          background: isUser ? 'var(--accent-indigo)' : 'var(--bg-glass)',
          border: isUser ? 'none' : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          color: 'var(--text-primary)',
          fontSize: '0.92rem',
          lineHeight: '1.6',
          boxShadow: isUser ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
          position: 'relative'
        }}>
          {/* Reasoning / Chain of Thought accordion */}
          {!isUser && message.reasoning && message.reasoning.length > 0 && (
            <div style={{
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}>
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-purple)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <BrainCircuit size={15} />
                <span>Agent Reasoning Process</span>
                {showReasoning ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {showReasoning && (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                  {message.reasoning.map(r => r.thought).join('\n')}
                </div>
              )}
            </div>
          )}

          {/* Tool Calls accordion */}
          {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
            <div style={{
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}>
              <button
                onClick={() => setShowTools(!showTools)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-amber)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <Wrench size={15} />
                <span>Tool Executions ({message.toolCalls.length})</span>
                {showTools ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {showTools && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {message.toolCalls.map(tc => (
                    <div key={tc.id} style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)', fontWeight: 600 }}>
                        <span>fn: {tc.name}</span>
                        <span>{tc.status}</span>
                      </div>
                      {tc.output && <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Out: {tc.output}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Text Content */}
          <div style={{ whiteSpace: 'pre-wrap' }} className={message.isStreaming ? 'typing-cursor' : ''}>
            {message.content}
          </div>

          {/* Copy Button */}
          {!isUser && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                onClick={handleCopy}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem'
                }}
              >
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
