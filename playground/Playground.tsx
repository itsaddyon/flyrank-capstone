import React, { useState } from 'react';
import { AccessibleModal } from './components/AccessibleModal';
import { AccessibleTabs } from './components/AccessibleTabs';
import { AccessibleDisclosure } from './components/AccessibleDisclosure';
import './playground.css';

/**
 * Playground
 * -----------
 * Demo page for FE-05 "Accessible Component Fundamentals".
 * Renders the three hand-written components with short instructions
 * for keyboard-only evaluation.
 */
export const Playground: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <p>
          This tab panel is only reachable and readable when its tab is
          selected. Focus stays on the active tab; use the panel's own Tab
          stop to read long content if needed.
        </p>
      ),
    },
    {
      id: 'usage',
      label: 'Usage',
      content: (
        <p>
          Try clicking a tab, then use Arrow Left / Arrow Right to move
          between tabs, and Home / End to jump to the first or last tab.
        </p>
      ),
    },
    {
      id: 'a11y',
      label: 'Accessibility',
      content: (
        <p>
          Only the active tab has <code>tabIndex 0</code>; the rest are{' '}
          <code>-1</code>. This "roving tabindex" keeps the tablist a single
          stop in the page's Tab order.
        </p>
      ),
    },
  ];

  return (
    <div className="a11y-playground">
      <h1>Accessible Component Fundamentals</h1>
      <p className="a11y-intro">
        FE-05 playground — Modal, Tabs and Disclosure built from scratch
        following the WAI-ARIA Authoring Practices patterns.
      </p>

      <section className="a11y-section">
        <h2>Modal Dialog</h2>
        <p className="a11y-help">
          Keyboard controls: <kbd>Enter</kbd>/<kbd>Space</kbd> on the button
          to open, <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> to cycle focus
          inside the dialog, <kbd>Escape</kbd> to close. Focus returns to
          this button afterward.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Open modal
        </button>
        <AccessibleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titleId="demo-modal-title"
          title="Example dialog"
        >
          <p style={{ marginBottom: 12 }}>
            Focus was moved here when the dialog opened. Try tabbing through
            the controls below — focus should stay trapped inside this box.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary">
              Secondary action
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsModalOpen(false)}
            >
              Confirm &amp; close
            </button>
          </div>
        </AccessibleModal>
      </section>

      <section className="a11y-section">
        <h2>Tabs</h2>
        <p className="a11y-help">
          Keyboard controls: <kbd>Tab</kbd> into the tablist,{' '}
          <kbd>Arrow Left</kbd> / <kbd>Arrow Right</kbd> to move between
          tabs, <kbd>Home</kbd> / <kbd>End</kbd> to jump to the first/last
          tab.
        </p>
        <AccessibleTabs label="Playground example tabs" tabs={tabs} />
      </section>

      <section className="a11y-section">
        <h2>Disclosure</h2>
        <p className="a11y-help">
          Keyboard controls: <kbd>Tab</kbd> to the trigger,{' '}
          <kbd>Enter</kbd> or <kbd>Space</kbd> to expand/collapse.
        </p>
        <AccessibleDisclosure summary="What is a disclosure widget?">
          <p>
            A disclosure is a button that shows or hides a section of
            content. It uses a native <code>&lt;button&gt;</code> (so
            Enter/Space work automatically) plus{' '}
            <code>aria-expanded</code> and <code>aria-controls</code> to
            describe the relationship to assistive technology.
          </p>
        </AccessibleDisclosure>
      </section>
    </div>
  );
};

export default Playground;
