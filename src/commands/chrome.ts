import moment from 'moment';
import log from 'loglevel';
import { delay, scrollBy } from '../utils';
import { DEFAULT_FILENAME, DEFAULT_SCROLL_Y_POS } from '../config';
import { ScreenCaptureResponse } from '../types';
import Tab = chrome.tabs.Tab;

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

export const createTab = async (url: string, locale: string): Promise<Tab> => {
  log.debug(`[createTab]: ***** started url=${url}, locale=${locale} *****`);
  await delay();

  // const myListener = async (tabId: number, tabChangeInfo: TabChangeInfo, tab: Tab) => {
  //   if (tab.url === url && tabChangeInfo.status === 'complete') {
  //     chrome.tabs.onUpdated.removeListener(myListener);
  //     await processTab(tab, locale);
  //     return;
  //   }
  // };

  let tab = {} as Tab;
  await chrome.tabs
    .create({
      url
    })
    .then(async (t) => {
      log.debug(`[createTab {callback}]: tab created successfully tabId=${t.id}`);
      // chrome.tabs.onUpdated.addListener(myListener);
      tab = t;
    })
    .catch((e) => {
      log.error(`[createTab {callback}]: something went wrong!`);
    });
  return tab;
};

/**
 *
 * @param tabId
 */
export const removeTab = async (tabId: number) => {
  log.debug(`[removeTab]: ***** started tabId=${tabId} *****`);
  await delay();
  await chrome.tabs
    .remove(tabId)
    .then(() => {
      log.debug(`[removeTab {callback}]: tab removed successfully`);
    })
    .catch((e) => {
      log.error(`[removeTab {callback}]: something went wrong!`);
    });
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
      } as any)
      .then((results) => {
        log.debug('[executeScrollByScript {callback}]: executeScript success', results);
      })
      .catch((e) => {
        log.error('[executeScrollByScript {callback}]: something went wrong', e);
      });
  }
};
