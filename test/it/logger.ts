import { debug as dbg } from 'debug';

export interface Logger {
  info(message: string): void;
  debug(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function newLogger(namespace: string): Logger {
  return {
    info: dbg(`info:${namespace}`),
    warn: dbg(`warn:${namespace}`),
    debug: dbg(`debug:${namespace}`),
    error: dbg(`error:${namespace}`)
  };
}
