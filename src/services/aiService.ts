import { AIMessage, AIModelConfig, StreamChunk, ToolCall } from '../types/ai';

/**
 * Extensible AI Streaming & Agent Execution Service
 */
export class AIService {
  /**
   * Simulates/Executes a streaming response from an AI model/agent
   */
  static async streamResponse(
    messages: AIMessage[],
    config: AIModelConfig,
    signal: AbortSignal,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void> {
    const userMessage = messages[messages.length - 1]?.content || '';

    // Step 1: Chain of thought reasoning block
    onChunk({
      type: 'reasoning',
      content: `Analyzing prompt intent: "${userMessage.slice(0, 40)}..."\nSelect model strategy: ${config.model} (${config.provider})\nChecking tool invocation rules...`
    });

    await this.delay(600, signal);

    // Step 2: Conditionally trigger an autonomous agent tool call if prompt requests data or code
    const requiresTools = config.enableTools && (
      userMessage.toLowerCase().includes('search') ||
      userMessage.toLowerCase().includes('code') ||
      userMessage.toLowerCase().includes('analyze') ||
      userMessage.toLowerCase().includes('data')
    );

    if (requiresTools) {
      const toolCallId = `tool_${Date.now()}`;
      const toolCall: ToolCall = {
        id: toolCallId,
        name: 'web_search_and_code_analysis',
        arguments: { query: userMessage, target: 'frontend_architecture' },
        status: 'running'
      };

      onChunk({
        type: 'tool_start',
        toolCall
      });

      await this.delay(1200, signal);

      onChunk({
        type: 'tool_end',
        toolCall: {
          id: toolCallId,
          status: 'completed',
          output: JSON.stringify({ status: 200, resultsFound: 4, summary: 'Analyzed modern React & Vite streaming patterns.' }),
          executionTimeMs: 1180
        }
      });

      await this.delay(400, signal);
    }

    // Step 3: Stream response tokens
    const sampleResponse = this.generateSampleResponse(userMessage, config);
    const tokens = sampleResponse.split(' ');

    for (let i = 0; i < tokens.length; i++) {
      if (signal.aborted) {
        throw new Error('Stream cancelled by user.');
      }

      onChunk({
        type: 'token',
        content: (i === 0 ? '' : ' ') + tokens[i]
      });

      // Realistic typing variable delay (20ms - 60ms per word)
      await this.delay(35 + Math.floor(Math.random() * 25), signal);
    }
  }

  private static generateSampleResponse(_prompt: string, config: AIModelConfig): string {
    return `### AI Engineering Response (${config.model})

I've processed your request using **${config.provider.toUpperCase()}** (${config.model}).

Here is a breakdown of recommended practices for your query:

1. **Streaming Architecture**: Utilize \`ReadableStream\` with chunked buffer rendering to guarantee responsive UI feedback.
2. **Agentic Resilience**: Always implement exponential backoffs for 429 rate-limiting and wrap tool executions in strict timeout boundaries.
3. **State Hygiene**: Keep prompt inputs, model parameters (\`temperature: ${config.temperature}\`), and message arrays clean with clear TypeScript interfaces.

\`\`\`typescript
// Example streaming handler setup
const controller = new AbortController();
await AIService.streamResponse(messages, config, controller.signal, (chunk) => {
  if (chunk.type === 'token') {
    appendToken(chunk.content);
  }
});
\`\`\`

Let me know if you would like me to extend tool definitions or adjust parameters!`;
  }

  private static delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Operation aborted'));
        });
      }
    });
  }
}
