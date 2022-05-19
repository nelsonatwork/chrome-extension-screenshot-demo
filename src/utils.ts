import { DEFAULT_DELAY } from './config';
import log from 'loglevel';

/**
 *
 * @param ms
 */
export const delay = (ms?: number): Promise<void> => {
  return new Promise((resolve) => {
    log.debug(`[delay]: pausing for ${ms ? ms : DEFAULT_DELAY}ms`);
    setTimeout(resolve, ms ? ms : DEFAULT_DELAY);
  });
};

/**
 *
 * @param y
 */
export const scrollBy = (y: number) => {
  window.scrollBy(0, y);
};
