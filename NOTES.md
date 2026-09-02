# Accessibility Component Notes

## 1. Hand-written implementation

I built three components from scratch (Modal Dialog, Tabs, and Disclosure) using React and TypeScript in the `playground/components/` directory. The implementations were guided entirely by the WAI-ARIA Authoring Practices Guide (APG) patterns to ensure correct semantic structure, ARIA attribute relationships, and keyboard interactions without relying on external component libraries like Radix or Headless UI.

## 2. What I initially implemented correctly

The handwritten implementations successfully delivered the core accessibility patterns:
- **Modal Dialog:** Focus is successfully moved into the dialog on open, trapped within it using a custom Tab/Shift+Tab interceptor, and restored to the trigger element when closed. It correctly uses `role="dialog"` and `aria-modal="true"`.
- **Tabs:** Roving tabindex is correctly applied (active tab gets `tabIndex={0}`, others `-1`). Arrow navigation seamlessly moves focus and selection left/right with wrapping, and Home/End jump to boundaries. Relationships are properly wired using `aria-controls` and `aria-labelledby`.
- **Disclosure:** Uses semantic `<button>` elements giving us Enter/Space and focusability for free. Correctly maps `aria-expanded` and uses the native `hidden` attribute to fully remove collapsed content from the accessibility tree.

## 3. Comparison with shadcn/ui

After installing and inspecting the generated `shadcn/ui` components (which are wrappers around `@radix-ui/react-dialog` and `@radix-ui/react-tabs`), I noticed several sophisticated mechanisms that handle edge cases our basic implementation missed.

| Area | My implementation | shadcn/ui | What I learned |
|------|-------------------|-----------|----------------|
| **Focus Trapping (Modal)** | Attached a `keydown` listener that queries the DOM for focusable elements (`a, button, input...`) and manually wraps focus. | Radix uses a dedicated `<FocusScope>` component that employs hidden "sentinel" focusable nodes at the start and end of the modal to catch and redirect focus naturally, handling React portals and iframe focus loss much better. | Sentinel nodes are a much more robust pattern than relying on fragile manual DOM queries that might miss `[contenteditable]` elements or custom elements with shadow roots. |
| **DOM Placement (Modal)** | Renders inline where the component is declared in the React tree. | Radix uses a `<Portal>` to mount the dialog at the end of `document.body`. | Using a Portal avoids complex `z-index` stacking context issues and ensures screen readers don't misinterpret the dialog's position relative to the main `aria-hidden` content. |
| **Scroll Locking (Modal)** | Simply set `document.body.style.overflow = 'hidden'`, which causes layout shift if a scrollbar disappears. | Radix uses `react-remove-scroll` which calculates the scrollbar width and adds compensating `padding-right` to the `body` so the layout doesn't jump. | Accessibility isn't just screen readers; visual layout stability during state changes is also a crucial usability factor. |
| **Composition API (Tabs)** | Exposes a rigid API (`<AccessibleTabs tabs={[{ id, label, content }]} />`) limiting flexibility. | Radix uses a highly composable Compound Component pattern (`<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`). | Compound components let consumers freely interleave custom HTML or styling while the parent Context handles the complex ARIA wiring and keyboard state. |

## 4. What I would improve

If I were to rewrite my hand-written components after studying shadcn and Radix UI:
- **Adopt the Compound Component Pattern:** Rewrite the Tabs API to use Context so users can compose `<TabsList>` and `<TabsTrigger>` individually, greatly improving reusability.
- **Implement Portals for Modals:** Always render Modals into a portal to avoid layout and z-index clashes, and explicitly apply `aria-hidden="true"` to the root application div when the modal is open to hide background content from screen readers.
- **Robust Scroll Locking:** Add scrollbar compensation logic so the page doesn't shift when `overflow: hidden` is applied.
- **Better Focus Restoration:** Use a more bulletproof focus restoration strategy that can fallback gracefully if the triggering element was removed from the DOM while the modal was open.

## 5. Key accessibility lessons

- **Focus management is deceptively complex:** Simple `querySelectorAll` approaches for focus trapping are brittle. Production-grade libraries use sentinel nodes and advanced event listeners to handle edge cases like browser window blurs or dynamic content injection.
- **Keyboard interaction requires strict adherence to APG:** It's not enough to just add `onKeyDown`. Expected behaviors like Home/End in Tabs or Shift+Tab wrapping in Modals are critical for power users and assistive tech users.
- **Semantic HTML is better than ARIA:** Our Disclosure component showed that using a native `<button>` is infinitely easier and more reliable than trying to make a `<div>` act like a button with `role="button"` and synthetic keyboard handlers.
- **Reusable component design aligns with Accessibility:** Designing APIs with compound components (like `shadcn` does) makes it much easier to enforce correct ARIA relationships (`aria-controls`, `aria-labelledby`) under the hood via React Context while giving the developer styling freedom.
