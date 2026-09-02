import React, { useId, useState, type ReactNode } from 'react';

/**
 * AccessibleDisclosure
 * ---------------------
 * Hand-written implementation of the WAI-ARIA APG "Disclosure (Show/Hide)"
 * pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Behaviors implemented:
 * - A native <button> trigger, so Enter/Space activation and keyboard
 *   focusability come for free from semantic HTML (no ARIA needed for that).
 * - aria-expanded reflects open/closed state on the trigger.
 * - aria-controls points the trigger at the content region's id.
 * - The content is only rendered in the accessibility tree when expanded
 *   (native `hidden` attribute), matching the pattern's recommendation that
 *   collapsed content should not be focusable or announced.
 */

export interface AccessibleDisclosureProps {
  summary: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export const AccessibleDisclosure: React.FC<AccessibleDisclosureProps> = ({
  summary,
  children,
  defaultExpanded = false,
}) => {
  const contentId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="a11y-disclosure">
      <button
        type="button"
        className="a11y-disclosure-trigger"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span
          className={`a11y-disclosure-caret${expanded ? ' a11y-disclosure-caret--open' : ''}`}
          aria-hidden="true"
        >
          ▶
        </span>
        {summary}
      </button>
      <div id={contentId} className="a11y-disclosure-content" hidden={!expanded}>
        {children}
      </div>
    </div>
  );
};
