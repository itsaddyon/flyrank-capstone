import React, { useId, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';

/**
 * AccessibleTabs
 * ---------------
 * Hand-written implementation of the WAI-ARIA APG "Tabs" pattern
 * (automatic activation, horizontal): https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Behaviors implemented:
 * - role="tablist" / role="tab" / role="tabpanel"
 * - aria-selected on the active tab, aria-controls -> panel id,
 *   aria-labelledby on the panel -> tab id
 * - Roving tabindex: only the active tab is in the Tab sequence
 *   (tabIndex 0), inactive tabs have tabIndex -1
 * - ArrowLeft / ArrowRight move focus and activate the neighboring tab,
 *   wrapping at the ends
 * - Home / End jump to the first / last tab
 * - Mouse click activates a tab directly
 */

export interface TabItem {
  /** Stable identifier for the tab, used to build unique DOM ids. */
  id: string;
  label: string;
  content: ReactNode;
}

export interface AccessibleTabsProps {
  tabs: TabItem[];
  /** id of the tab that should be active initially. Defaults to the first tab. */
  defaultActiveId?: string;
  label: string;
}

export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  defaultActiveId,
  label,
}) => {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string>(defaultActiveId ?? tabs[0]?.id ?? '');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = tabs.findIndex((t) => t.id === activeId);

  const focusAndActivate = (index: number) => {
    const target = tabs[index];
    if (!target) return;
    setActiveId(target.id);
    tabRefs.current[target.id]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const lastIndex = tabs.length - 1;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusAndActivate(activeIndex === lastIndex ? 0 : activeIndex + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusAndActivate(activeIndex === 0 ? lastIndex : activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAndActivate(0);
        break;
      case 'End':
        event.preventDefault();
        focusAndActivate(lastIndex);
        break;
      default:
        break;
    }
  };

  return (
    <div className="a11y-tabs">
      <div role="tablist" aria-label={label} className="a11y-tablist">
        {tabs.map((tab) => {
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          const isSelected = tab.id === activeId;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              type="button"
              id={tabId}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              className={`a11y-tab${isSelected ? ' a11y-tab--active' : ''}`}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={handleKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const tabId = `${baseId}-tab-${tab.id}`;
        const panelId = `${baseId}-panel-${tab.id}`;
        const isSelected = tab.id === activeId;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!isSelected}
            tabIndex={0}
            className="a11y-tabpanel"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};
