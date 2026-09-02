import React, {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

/**
 * AccessibleModal
 * ----------------
 * Hand-written implementation of the WAI-ARIA APG "Dialog (Modal)" pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Behaviors implemented:
 * - role="dialog" + aria-modal="true"
 * - Accessible name via aria-labelledby pointing at the heading
 * - Focus moves into the dialog when it opens (first focusable element,
 *   or the dialog container itself if nothing is focusable)
 * - Focus is trapped inside the dialog while it is open (Tab / Shift+Tab wrap)
 * - Escape closes the dialog
 * - Focus is restored to the element that triggered the dialog on close
 * - Clicking the backdrop closes the dialog (mouse convenience, not required
 *   by the pattern but common practice); the underlying page cannot be
 *   interacted with because the dialog sits above it, traps focus, and the
 *   page scroll is locked while it is open
 */

export interface AccessibleModalProps {
  /** Controls whether the modal is rendered/open. */
  isOpen: boolean;
  /** Called when the modal should close (Escape, backdrop click, close button). */
  onClose: () => void;
  /** Id used to connect the heading to the dialog via aria-labelledby. */
  titleId: string;
  title: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  titleId,
  title,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Capture the trigger element and move focus into the dialog on open.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

    const node = dialogRef.current;
    if (!node) return;

    const focusable = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      node.focus();
    }

    // Prevent the page behind the dialog from scrolling while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      // Restore focus to the trigger once the dialog has closed.
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen]);

  const trapFocus = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const node = dialogRef.current;
    if (!node) return;

    const focusable = Array.from(
      node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null); // only visible elements

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      // Shift+Tab on the first element wraps to the last.
      if (active === first || !node.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab on the last element wraps to the first.
      if (active === last || !node.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      trapFocus(event);
    },
    [onClose, trapFocus]
  );

  if (!isOpen) return null;

  return (
    <div
      className="a11y-modal-backdrop"
      // Mouse-only convenience; keyboard users close via Escape or the close button.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="a11y-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="a11y-modal-header">
          <h2 id={titleId} className="a11y-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="a11y-icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="a11y-modal-body">{children}</div>
      </div>
    </div>
  );
};
