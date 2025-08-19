/// <reference types="vite-plugin-svgr/client" />
import type { FetchMock } from 'vitest-fetch-mock';

declare module '*.module.css';
declare global {
  function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

  interface Window {
    fetch: {
      (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
      resetMocks(): void;
    };
  }

  const fetchMock: FetchMock;
  type Dictionary<T> = Record<string, T>;
  // biome-ignore lint/suspicious/noExplicitAny: we need it
  type AnyFunction = (...args: any[]) => any;
}
