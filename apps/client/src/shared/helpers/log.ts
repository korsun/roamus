type Level = 'log' | 'warn' | 'error' | 'info' | 'debug';

const logGeneric = (level: Level, ...args: unknown[]) => {
  // biome-ignore lint/suspicious/noConsole: logging
  console[level](...args);
};

export const log = (...args: unknown[]) => logGeneric('log', ...args);
export const logError = (...args: unknown[]) => logGeneric('error', ...args);
