# AGENTS.md — Autonomous Agent Directives & Coding Standards

This document establishes the binding architectural constraints, coding standards, design principles, and verification workflows for any AI coding agent (e.g. Antigravity, Claude Code, Cursor, Copilot) operating within this repository.

---

## 1. Core Architecture & Tech Stack

- **Framework**: React 18+ with Vite and TypeScript (Strict Mode enabled).
- **Styling System**: CSS Variables + Modern Vanilla CSS.
  - Avoid ad-hoc utility clutter.
  - Use modular CSS tokens defined in `src/index.css` (color scales, elevations, typography, animations).
- **Icons**: `lucide-react` for consistent, crisp SVG vector iconography.
- **State Management**: React Hooks (`useState`, `useReducer`, `useCallback`, `useMemo`) + React Context for global AI settings. Keep transient UI state strictly local.
- **AI Streaming Pattern**: Async Generators / ReadableStream handlers with `AbortController` support for user cancellations.

---

## 2. Design & UI/UX Principles (Mandatory Aesthetic Standards)

All visual interfaces created in this project must deliver a modern, premium experience.

1. **Color Palette & Visual Tokens**:
   - Primary dark theme background: Deep obsidian (`#0b0f19` / `hsl(222, 47%, 7%)`).
   - Card Backgrounds: Glassmorphism (`rgba(17, 24, 39, 0.7)` with `backdrop-filter: blur(16px)`).
   - Accents: Vibrant gradients (Electric Cyan `#00f2fe` to Neon Indigo `#4facfe`, Emerald `#10b981` for active AI statuses, Coral `#f43f5e` for errors).
2. **Typography**:
   - Modern clean sans-serif stack (`Inter`, system-ui, `-apple-system`, `BlinkMacSystemFont`).
   - Strict hierarchy: Clear `h1`-`h6` sizing, muted secondary text (`#94a3b8`), monospace fonts (`Fira Code`, `JetBrains Mono`) for prompt variables & code blocks.
3. **Dynamic Feedback & Micro-animations**:
   - Shimmer effects during AI model thinking/streaming.
   - Smooth hover micro-transitions (`transform: translateY(-2px)`, `transition: all 0.2s cubic-bezier(...)`).
   - Pulse animations for active streaming indicators and agent status badges.

---

## 3. TypeScript & Code Structure Standards

1. **Strict Type Definitions**:
   - Define explicit TypeScript interfaces for all AI messages, prompt options, tool calls, model configurations, and streaming state chunks in `src/types/ai.ts`.
   - Never use `any`. Use `unknown` with type guards if types are dynamic.
2. **Component Decomposition**:
   - Keep components focused and single-purpose (< 200 lines per component file).
   - Place UI components under `src/components/` and business logic / AI hooks under `src/hooks/` or `src/services/`.
3. **Props Contract**:
   - Document prop interfaces explicitly:
     ```typescript
     export interface ChatMessageProps {
       message: AIMessage;
       onRetry?: (id: string) => void;
       onCopy?: (content: string) => void;
     }
     ```

---

## 4. AI & LLM Integration Guidelines

1. **Streaming First**:
   - Treat AI outputs as non-blocking streams. Implement chunk-by-chunk buffer appending to prevent UI layout jumps.
   - Provide visual indication for delta tokens (streaming blinking cursor or smooth auto-scroll).
2. **Tool Calling & Thought Reasoning**:
   - Display AI "Reasoning / Chain of Thought" blocks in expandable accordion widgets.
   - Show tool executions (e.g. `execute_query`, `fetch_web_data`) with distinct status badges (`running`, `completed`, `failed`).
3. **Resilience & Graceful Failures**:
   - Handle rate limits (HTTP 429), timeouts, and missing API keys gracefully with clear user notifications and fallback states.
   - Provide an explicit "Stop Generating" button bound to `AbortController.abort()`.

---

## 5. Security & Secret Management

- **API Keys**: NEVER commit API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) or write hardcoded tokens to version control.
- Access configuration strictly via `import.meta.env.VITE_*` environment variables.
- Provide clear setup documentation in `README.md` for `.env.example`.

---

## 6. Empirical Verification Directives for Agents

Before completing any task or marking a pull request / issue as resolved:

1. **Compilation Check**: Run `npm run build` or `npx tsc --noEmit` to verify zero TypeScript or syntax errors.
2. **Linting Check**: Run `npm run lint` (or equivalent code health verification).
3. **Runtime Test**: Verify dev server starts cleanly (`npm run dev`) with no unhandled browser console warnings or network breakage.
4. **Log Inspection**: Inspect error tracebacks thoroughly before forming diagnostic hypotheses. Never suppress errors with empty `try/catch` blocks.

# Project Instructions

## Architecture
- Keep the project in React + TypeScript + Vite.
- Reuse existing components whenever possible.
- Avoid unnecessary dependencies.

## UI
- Maintain the existing dark theme.
- Keep layouts responsive for desktop, tablet, and mobile.
- Do not introduce unrelated pages or features.

## Forms
- Use React Hook Form with Zod for validation.
- Display clear validation messages.
- Validate file types and file size before submission.

## Development
- Run `npm run build` before considering work complete.
- Resolve TypeScript errors before finishing.