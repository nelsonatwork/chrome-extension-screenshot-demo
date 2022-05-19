import { DEFAULT_DOC_READY_DELAY, ENABLE_AUTO_SCROLL, URL_MATCH_PATTERN } from '../config';
import Tab = chrome.tabs.Tab;
import { ScreenCaptureResponse } from '../types';
import log from 'loglevel';
import { executeScrollByScript, downloadScreenCapture, removeTab, createTab } from '../commands/chrome';
import {
  attachToDebugger,
  getLayoutMetrics,
  setDeviceMetricsOverride,
  captureScreenshot,
  detachDebugger
} from '../commands/chromeDebugger';
import { LIST_OF_LOCALES } from '../constatns';
import { delay } from '../utils';

async function processTab(tab: Tab, locale: string) {
  log.debug(`[processTab]: ***** started tabId=${tab.id}, locale=${locale} *****`);
  await delay(DEFAULT_DOC_READY_DELAY);

  if (tab && tab.id) {
    await attachToDebugger(tab.id, tab);
    const layoutMetrics = await getLayoutMetrics(tab.id);
    if (layoutMetrics) {
      if (ENABLE_AUTO_SCROLL) {
        await executeScrollByScript(tab.id, layoutMetrics.height);
      }
      await setDeviceMetricsOverride(tab.id, layoutMetrics);
      const result: ScreenCaptureResponse = await captureScreenshot(tab.id!);
      await downloadScreenCapture(result, locale);
    } else {
      log.error('[processUrl]: layoutMetrics is undefined');
    }
    await detachDebugger(tab.id);
    await removeTab(tab.id);
  } else {
    log.error('[processUrl]: Failed to create a new tab');
  }
}

async function processUrl(url: string, locale: string) {
  log.debug(`[processUrl]: ***** started url=${url}, locale=${locale} *****`);
  const tab = await createTab(url, locale);
  await processTab(tab, locale);
}

export function onClickHandler() {
  log.debug(`[onClickHandler]: ***** started *****`);
  return async (tab: Tab) => {
    const currentUrl = tab.url;
    if (currentUrl && currentUrl.match(URL_MATCH_PATTERN)) {
      for (const aLocale of LIST_OF_LOCALES) {
        const url = currentUrl.replace('en', aLocale);
        await processUrl(url, aLocale);
      }
    } else {
      log.warn(`[onClickHandler]: abort, url not found or does not match '${URL_MATCH_PATTERN}'`);
    }
  };
}
