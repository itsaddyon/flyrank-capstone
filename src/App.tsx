import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { PromptInput } from './components/PromptInput';
import { ScholarshipForm } from './components/ScholarshipForm';
import { AIMessage, AIModelConfig, AgentStatusType } from './types/ai';
import { AIService } from './services/aiService';
import { Terminal, Shield, Zap, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'assistant'>('form');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatusType>('idle');
  const [config, setConfig] = useState<AIModelConfig>({
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: 'You are an expert scholarship advisor and AI SOP consultant helping students write compelling academic essays and application statements.',
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        config={config}
        agentStatus={agentStatus}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onConfigChange={handleConfigChange}
        onClearHistory={handleClearHistory}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {activeTab === 'assistant' && (
          <Sidebar
            isOpen={sidebarOpen}
            config={config}
            onConfigChange={handleConfigChange}
            onLoadPreset={(p) => handleSendMessage(p)}
          />
        )}

        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.05), transparent 60%)',
          overflowY: 'auto'
        }}>
          {activeTab === 'form' ? (
            <ScholarshipForm />
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* AI Assistant View */}
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
                      AI SOP & Scholarship <span className="gradient-text">Advisor</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
                      Need help writing your Statement of Purpose or checking grant eligibility criteria? Ask our AI assistant.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
                      <div className="glass-panel" style={{ padding: '16px', textAlign: 'left' }}>
                        <Zap size={20} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>SOP Drafting</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generate customized grant application essays.</p>
                      </div>
                      <div className="glass-panel" style={{ padding: '16px', textAlign: 'left' }}>
                        <Terminal size={20} color="var(--accent-purple)" style={{ marginBottom: '8px' }} />
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Eligibility Check</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Analyze CGPA and income cutoffs.</p>
                      </div>
                      <div className="glass-panel" style={{ padding: '16px', textAlign: 'left' }}>
                        <Shield size={20} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Doc Review</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verify certificate requirements.</p>
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
