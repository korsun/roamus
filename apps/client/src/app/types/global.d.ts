import type { FetchMock } from 'vitest-fetch-mock';
declare module '*.module.css';
declare module '*.svg' {
  const value: unknown;
  export default value;
}
declare module '*.svgr.tsx' {
  import { FC, SVGProps } from 'react';
  const Component: FC<SVGProps<SVGSVGElement> & { size?: number | string }>;
  export default Component;
}
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
  type AnyFunction = (...args: any[]) => any;
}
