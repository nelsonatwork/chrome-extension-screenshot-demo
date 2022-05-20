import moment from 'moment';
import log from 'loglevel';
import { delay, scrollBy } from '../utils';
import { DEFAULT_FILENAME, DEFAULT_SCROLL_Y_POS } from '../config';
import { ScreenCaptureResponse } from '../types';

/**
 *
 * @param response
 * @param locale
 */
export const downloadScreenCapture = async (response: ScreenCaptureResponse, locale: string) => {
  log.debug(`[downloadScreenCapture]: ***** started *****`);
  await delay();

  const subDir = moment().format('YYYY-MM-DD');
  const ts = moment().format('YYYYMMDD_hhmmss');

  if (response && response.data) {
    await chrome.downloads
      .download({
        filename: `${subDir}/${locale.toUpperCase()}_${DEFAULT_FILENAME}_${ts}.png`,
        url: response.data
      })
      .then(() => {
        log.debug(`[downloadScreenCapture {callback}]: saved successfully`);
      })
      .catch((e) => {
        log.error(`[downloadScreenCapture {callback}]: something went wrong`, e);
      });
  } else {
    log.error(`[downloadScreenCapture]: dataUrl is undefined!`);
  }
};

/**
 *
 * @param tabId
 * @param totalHeight
 */
export const executeScrollByScript = async (tabId: number, totalHeight: number) => {
  log.debug(`[executeScrollByScript]: ***** started tabId=${tabId} *****`);
  const x = Math.round(totalHeight / DEFAULT_SCROLL_Y_POS);
  for (let i = 0; i < x; i++) {
    await delay();
    await chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        func: scrollBy,
        args: [DEFAULT_SCROLL_Y_POS]
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } as any)
      .then((results) => {
        log.debug('[executeScrollByScript {callback}]: executeScript success', results);
      })
      .catch((e) => {
        log.error('[executeScrollByScript {callback}]: something went wrong', e);
      });
  }
};

/**
 *
 * @param width
 */
export const changeWindowWidth = async (width: number) => {
  await chrome.windows
    .getLastFocused({ populate: false })
    .then(async (currWindow) => {
      if (currWindow && currWindow.id) {
        log.debug(`[changeWidth {callback}]: status=success, resizing window to width=${width}`);
        await chrome.windows.update(currWindow.id, { width: width });
      }
    })
    .catch((e) => {
      log.error(`[changeWidth]: something went wrong`, e);
    });
  await delay();
};
