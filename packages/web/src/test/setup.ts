import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

afterEach(() => cleanup());

// jsdom has no ResizeObserver; @xyflow/react needs one to mount its panes.
// Anonymous canvas (post optional-sign-in) now renders the full canvas tree
// in more tests than before, so this stub is required for those to run.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;
