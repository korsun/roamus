declare module '*.module.css';
declare type Dictionary<T> = Record<string, T>;
declare module '*.svg' {
  const value: unknown;
  export default value;
}
declare type AnyFunction = (...args: any[]) => any;
