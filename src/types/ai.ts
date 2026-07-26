export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export type AgentStatusType = 'idle' | 'thinking' | 'executing_tool' | 'streaming' | 'error';

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  executionTimeMs?: number;
}

export interface ReasoningBlock {
  id: string;
  thought: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  reasoning?: ReasoningBlock[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
  error?: string;
}

export interface AIModelConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enableTools: boolean;
}

export interface StreamChunk {
  type: 'token' | 'reasoning' | 'tool_start' | 'tool_end' | 'error';
  content?: string;
  toolCall?: Partial<ToolCall>;
  error?: string;
}
