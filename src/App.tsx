import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { PromptInput } from './components/PromptInput';
import { AIMessage, AIModelConfig, AgentStatusType } from './types/ai';
import { AIService } from './services/aiService';
import { Terminal, Shield, Zap, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [agentStatus, setAgentStatus] = useState<AgentStatusType>('idle');
  const [config, setConfig] = useState<AIModelConfig>({
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: 'You are an expert AI software architect and frontend engineer specializing in React, TypeScript, Vite, and streaming LLM agent integration.',
    enableTools: true
  });

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleConfigChange = (newConfig: Partial<AIModelConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = `asst_${Date.now()}`;
    const assistantMsg: AIMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      reasoning: [],
      toolCalls: []
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setAgentStatus('thinking');

    // Setup abort controller
    abortControllerRef.current = new AbortController();

    try {
      await AIService.streamResponse(
        [...messages, userMsg],
        config,
        abortControllerRef.current.signal,
        (chunk) => {
          if (chunk.type === 'reasoning' && chunk.content) {
            setAgentStatus('thinking');
            setMessages(prev => prev.map(m => {
              if (m.id === assistantMsgId) {
                const currentReasoning = m.reasoning || [];
                return {
                  ...m,
                  reasoning: [...currentReasoning, { id: `r_${Date.now()}`, thought: chunk.content!, timestamp: new Date().toLocaleTimeString() }]
                };
              }
              return m;
            }));
          } else if (chunk.type === 'tool_start' && chunk.toolCall) {
            setAgentStatus('executing_tool');
            setMessages(prev => prev.map(m => {
              if (m.id === assistantMsgId) {
                return {
                  ...m,
                  toolCalls: [...(m.toolCalls || []), chunk.toolCall as any]
                };
              }
              return m;
            }));
          } else if (chunk.type === 'tool_end' && chunk.toolCall) {
            setMessages(prev => prev.map(m => {
              if (m.id === assistantMsgId) {
                return {
                  ...m,
                  toolCalls: (m.toolCalls || []).map(tc => tc.id === chunk.toolCall?.id ? { ...tc, ...chunk.toolCall } : tc)
                };
              }
              return m;
            }));
          } else if (chunk.type === 'token' && chunk.content) {
            setAgentStatus('streaming');
            setMessages(prev => prev.map(m => {
              if (m.id === assistantMsgId) {
                return {
                  ...m,
                  content: m.content + chunk.content
                };
              }
              return m;
            }));
          }
        }
      );
    } catch (err: any) {
      if (err.message !== 'Operation aborted' && err.message !== 'Stream cancelled by user.') {
        console.error('Streaming error:', err);
        setAgentStatus('error');
      }
    } finally {
      setAgentStatus('idle');
      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, isStreaming: false } : m));
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setAgentStatus('idle');
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        config={config}
        agentStatus={agentStatus}
        onConfigChange={handleConfigChange}
        onClearHistory={handleClearHistory}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          isOpen={sidebarOpen}
          config={config}
          onConfigChange={handleConfigChange}
          onLoadPreset={(p) => handleSendMessage(p)}
        />

        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.05), transparent 60%)',
          overflow: 'hidden'
        }}>
          {/* Conversation Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {messages.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                maxWidth: '640px',
                margin: '0 auto'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
                }}>
                  <Sparkles size={32} color="#fff" />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
                  Frontend <span className="gradient-text">AI Engineering</span> Starter
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
                  Production React 18, Vite, and TypeScript workspace equipped with agentic guidelines (<code>AGENTS.md</code>), token streaming, and function tool execution UI.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
                  <div className="glass-panel" style={{ padding: '16px', textAlign: 'left' }}>
                    <Zap size={20} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Token Streaming</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Async generators with cancellation support.</p>
                  </div>
                  <div className="glass-panel" style={{ padding: '16px', textAlign: 'left' }}>
                    <Terminal size={20} color="var(--accent-purple)" style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Agent Tooling</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Visualize autonomous function calls & outputs.</p>
                  </div>
                  <div className="glass-panel" style={{ padding: '16px', textAlign: 'left' }}>
                    <Shield size={20} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>AGENTS.md</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Strict standards for AI assistants.</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
            )}
          </div>

          <PromptInput
            onSendMessage={handleSendMessage}
            onStopStreaming={handleStopStreaming}
            agentStatus={agentStatus}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
