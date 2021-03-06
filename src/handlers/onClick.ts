import { DEFAULT_DOC_READY_DELAY, ENABLE_AUTO_SCROLL, EXECUTE_ON_NEW_TAB, URL_MATCH_PATTERN } from '../config';
import Tab = chrome.tabs.Tab;
import { ScreenCaptureResponse } from '../types';
import log from 'loglevel';
import { executeScrollByScript, downloadScreenCapture, changeWindowWidth } from '../commands/misc';
import {
  attachToDebugger,
  getLayoutMetrics,
  setDeviceMetricsOverride,
  captureScreenshot,
  detachDebugger
} from '../commands/debugger';
import { LIST_OF_DEVICE_WIDTHS, LIST_OF_LOCALES } from '../constatns';
import { delay } from '../utils';
import { createNotification, updateNotification } from '../commands/notifications';
import { createTab, removeTab } from '../commands/tabs';

const processTab = async (tab: Tab, locale: string, executeOnNewTab: boolean) => {
  log.debug(`[processTab]: ***** started tabId=${tab.id}, locale=${locale} *****`);
  await delay(DEFAULT_DOC_READY_DELAY);

  if (tab && tab.id) {
    await attachToDebugger(tab.id);
    const layoutMetrics = await getLayoutMetrics(tab.id);
    if (layoutMetrics) {
      if (ENABLE_AUTO_SCROLL) {
        await executeScrollByScript(tab.id, layoutMetrics.height);
      }
      await setDeviceMetricsOverride(tab.id, layoutMetrics);
      const result: ScreenCaptureResponse = await captureScreenshot(tab.id);
      await downloadScreenCapture(result, locale);
    } else {
      log.error('[processUrl]: layoutMetrics is undefined');
    }
    if (executeOnNewTab) {
      await detachDebugger(tab.id);
      await removeTab(tab.id);
    }
  } else {
    log.error('[processUrl]: Failed to create a new tab');
  }
};

const processUrl = async (url: string, locale: string, tab?: Tab) => {
  log.debug(`[processUrl]: ***** started url=${url}, locale=${locale} *****`);
  let targetTab = tab;
  if (EXECUTE_ON_NEW_TAB) {
    targetTab = await createTab(url, locale);
  } else {
    await chrome.tabs.update({ url });
  }
  if (targetTab) {
    await processTab(targetTab, locale, EXECUTE_ON_NEW_TAB);
  } else {
    log.error(`[processUrl]: tab is undefined, unable to proceed`);
  }
};

export const onClickHandler = () => {
  log.debug(`[onClickHandler]: ***** started *****`);
  const notificationId = 'screenCapture';
  return async (activeTab: Tab) => {
    const currentUrl = activeTab.url;
    if (currentUrl && currentUrl.match(URL_MATCH_PATTERN)) {
      createNotification(notificationId);
      const total = LIST_OF_DEVICE_WIDTHS.length * LIST_OF_LOCALES.length;
      let count = 0;
      for (const aWidth of LIST_OF_DEVICE_WIDTHS) {
        await changeWindowWidth(aWidth);
        for (const aLocale of LIST_OF_LOCALES) {
          const url = currentUrl.replace('en', aLocale);
          updateNotification(
            notificationId,
            `Processing...\nurl='${url}'\nwidth='${aWidth}`,
            Math.round((count / total) * 100)
          );
          await processUrl(url, aLocale, activeTab);
          count++;
        }
      }
      updateNotification(notificationId, 'Completed', 100);
    } else {
      log.warn(`[onClickHandler]: abort, url not found or does not match '${URL_MATCH_PATTERN}'`);
    }
  };
};
