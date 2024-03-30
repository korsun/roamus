declare module '*.module.css';
declare type Dictionary<T> = Record<string, T>;
declare module '*.svg' {
  const value: unknown;
  export default value;
}
declare type AnyFunction = (...args: any[]) => any;
declare global {
  function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

  interface Window {
    fetch: {
      (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
      resetMocks(): void;
    };
  }
}
