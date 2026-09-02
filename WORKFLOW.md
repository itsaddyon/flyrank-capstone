# AI Workflow Comparison

## Feature

Scholarship Application Form

---

## Objective

The objective of this assignment was to implement the same feature twice using two different prompt styles and evaluate how prompt quality influences AI-generated software.

---

## Round 1 – Vague Prompt

### Prompt Style

A short, high-level instruction requesting the AI to build a Scholarship Application Form.

### Outcome

The AI successfully produced a polished interface with strong validation and responsive design.

However, because the prompt lacked detailed constraints, the AI also introduced additional features that were never requested, including:

- AI SOP Assistant
- AI Chat Interface
- Model Selector
- Agent Reasoning Panel

Although these features worked, they represented scope creep and increased project complexity.

---

## Round 2 – Structured Prompt

### Prompt Style

A detailed engineering specification defining:

- Required form fields
- Validation rules
- Accessibility requirements
- Responsive layout
- File upload constraints
- UI consistency
- Engineering standards
- Features that must NOT be added

### Outcome

The AI implemented only the requested Scholarship Application Form.

The application contained:

- Personal Information
- Academic Information
- Scholarship Information
- Statement of Purpose
- Document Upload
- Declaration
- Submit and Reset actions

No unnecessary features were introduced.

---

## Comparison

| Area | Round 1 | Round 2 |
|------|----------|----------|
| Prompt Detail | Minimal | Detailed Engineering Specification |
| Scope Control | AI made assumptions | User-defined requirements |
| Extra Features | Yes | None |
| Validation | Good | Comprehensive |
| Accessibility | Basic | Improved |
| Maintainability | Good | Better |
| Requirement Compliance | Partial | High |

---

## Lessons Learned

This experiment demonstrated that AI coding agents are capable of producing high-quality software even from limited instructions.

However, vague prompts encourage the AI to make assumptions and introduce features beyond the requested scope.

Providing detailed engineering requirements resulted in:

- Better requirement compliance
- Improved maintainability
- Reduced scope creep
- More predictable output
- Easier code review

The most important lesson was that prompt engineering directly influences software quality, and AI-generated code should always be reviewed before acceptance.