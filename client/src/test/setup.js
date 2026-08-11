import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia; antd's responsive grid/Steps hooks
// call it on mount, so provide a minimal no-op stub for tests.
// jsdom doesn't implement IntersectionObserver either; the shared <Spring>
// wrapper (react-intersection-observer) used by most page components needs it.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
