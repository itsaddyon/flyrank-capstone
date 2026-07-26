# ⚡ Frontend AI Engineering Starter Kit

> A production-grade, highly polished React + Vite + TypeScript starter repository engineered for building modern **AI Web Applications**, **LLM Workbenches**, and **Agentic Tooling Interfaces**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-cyan.svg)
![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)

---

## 🌟 Key Features

- ⚡ **Token Streaming & Cancellation**: Built-in support for chunk-by-chunk token buffer rendering with explicit `AbortController` cancellation controls.
- ⚙️ **Agent Tool Execution Visualizer**: Collapsible UI widgets for inspecting autonomous AI tool invocations, parameters, and output payloads.
- 🧠 **Chain-of-Thought Drawer**: Display model reasoning blocks and thought processes separate from user-facing answers.
- 🎛️ **Hyperparameter Controls**: Tweak LLM provider options (`gpt-4o`, `claude-3.5-sonnet`, `gemini-1.5-pro`), temperature (`0.0` - `1.0`), max tokens, and system persona prompts in real-time.
- 🤖 **`AGENTS.md` Integration**: Pre-configured with strict coding standards, visual design rules, and verification directives for autonomous AI coding agents.
- 🎨 **Modern Aesthetics**: Built with dark mode, glassmorphism (`backdrop-filter`), glowing CSS status indicators, custom scrollbars, and fluid typography.

---

## 📁 Repository Structure

```text
.
├── .gitignore             # Tailored ignores for Node, Vite, build artifacts & AI runtime logs
├── LICENSE                # MIT Permissive Open Source License
├── AGENTS.md              # Binding standards and guidelines for autonomous AI agents
├── README.md              # Project documentation and quickstart guide
├── package.json           # Node manifest, dependencies & build scripts
├── tsconfig.json          # TypeScript strict compiler configuration
├── vite.config.ts         # Vite bundler & HMR configuration
├── index.html             # Entry HTML with preloaded modern web fonts
└── src/
    ├── main.tsx           # React bootstrap entry point
    ├── App.tsx            # Main state container and workbench layout
    ├── index.css          # Design system CSS tokens, glassmorphism & animations
    ├── types/
    │   └── ai.ts          # TypeScript interfaces for messages, tool calls, and model configs
    ├── services/
    │   └── aiService.ts   # Streaming LLM abstraction layer & mock agent simulator
    └── components/
        ├── Header.tsx     # Application top navbar with status indicators
        ├── Sidebar.tsx    # Hyperparameter tuning & prompt preset drawer
        ├── MessageBubble.tsx # Chat message bubble, tool drawer & reasoning accordion
        └── PromptInput.tsx   # Multiline prompt input with token counter & stop controls
```

---

## 🚀 Quickstart

### 1. Installation
Clone the repository and install dependencies using `npm` or `pnpm`:

```bash
git clone https://github.com/your-username/frontend-ai-starter.git
cd frontend-ai-starter
npm install
```

### 2. Development Mode
Launch the Vite local development server with HMR:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Type Check
Validate TypeScript types and compile production-ready minified bundles:

```bash
npm run build
```

---

## 🔐 Environment Variables & Security

Copy the `.env.example` template to `.env.local` to configure your AI provider API keys locally:

```bash
cp .env.example .env.local
```

### Supported Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_OPENAI_API_KEY` | API Key for OpenAI GPT-4o models | `sk-...` |
| `VITE_ANTHROPIC_API_KEY` | API Key for Anthropic Claude models | `sk-ant-...` |
| `VITE_GEMINI_API_KEY` | API Key for Google Gemini models | `AIzaSy...` |
| `VITE_LOCAL_LLM_ENDPOINT` | Custom base URL for local Ollama server | `http://localhost:11434/v1` |

> [!IMPORTANT]
> Never commit `.env` or `.env.local` files containing live API keys to version control. Keep secrets in `.env.local` which is strictly ignored by [.gitignore](file:///D:/Btech%20Projects/flyrank-capstone/.gitignore).

---

## 🛠️ Extending with Real AI APIs

The `src/services/aiService.ts` module is engineered to easily swap mock responses with live LLM provider APIs:

### Connecting OpenAI API
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const stream = await openai.chat.completions.create({
  model: config.model,
  messages: [{ role: 'system', content: config.systemPrompt }, ...formattedMessages],
  stream: true,
});

for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content || '';
  onChunk({ type: 'token', content: token });
}
```

---

## 📄 License

Distributed under the [MIT License](file:///D:/Btech%20Projects/flyrank-capstone/LICENSE). Free for personal, commercial, and open-source use.
