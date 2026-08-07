import '@testing-library/jest-dom';

// Inject a flag so components can bypass features that crash JSDOM (like dynamic Pagefind imports)
(global as any).__VITEST__ = true;
(window as any).__VITEST__ = true;
