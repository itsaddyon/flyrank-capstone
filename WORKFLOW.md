# AI Workflow Comparison

## Feature
Scholarship Application Form

## Round 1 – Vague Prompt

Prompt:
A short high-level request to build a scholarship application form.

Outcome:
- Functional implementation
- Modern UI
- Good validation
- Added unrequested features such as an AI SOP Assistant and reasoning panel
- Demonstrated AI assumptions and scope creep

## Round 2 – Structured Prompt

Prompt:
A detailed engineering specification covering fields, validation, accessibility, UI, engineering rules, and prohibited features.

Outcome:
- Implemented only the requested functionality
- Better adherence to requirements
- Improved maintainability
- Cleaner architecture
- Stronger validation and accessibility
- No unnecessary features

## Comparison

| Area | Round 1 | Round 2 |
|------|---------|---------|
| Prompt Detail | Low | High |
| Scope Control | AI-driven | User-defined |
| Extra Features | Yes | No |
| Validation | Good | Comprehensive |
| Accessibility | Basic | Improved |
| Maintainability | Good | Better |

## Key Learnings

- Precise prompts reduce ambiguity.
- Detailed requirements reduce scope creep.
- AI performs best when given explicit engineering constraints.
- Reviewing AI-generated code remains important even with good prompts.