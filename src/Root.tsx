import React from 'react';
import App from './App';
import { Playground } from '../playground/Playground';
import { ShadcnDemo } from './shadcn-demo/ShadcnDemo';

/**
 * Minimal path-based router (no router dependency needed for this project).
 * - "/"            -> the original capstone app (untouched)
 * - "/playground"  -> FE-05 hand-written accessible components demo
 * - "/shadcn-demo" -> shadcn/ui Dialog + Tabs, for comparison in NOTES.md
 */
export const Root: React.FC = () => {
  const path = window.location.pathname;

  if (path.startsWith('/playground')) {
    return <Playground />;
  }

  if (path.startsWith('/shadcn-demo')) {
    return <ShadcnDemo />;
  }

  return <App />;
};

export default Root;
