import { LayoutMetrics, ScreenCaptureResponse } from '../types';
import { delay } from '../utils';
import log from 'loglevel';
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;

/**
 *
 * @param tabId
 * @param changeInfo
 * @param tab
 */
export const attachToDebugger = async (tabId: number, tab: Tab) => {
  log.debug(`[attachToDebugger]: ***** triggered tabId=${tabId} *****`);
  await delay();
  try {
    await chrome.debugger.attach({ tabId: tabId }, '1.0').then(() => {
      if (chrome.runtime.lastError) {
        log.error(`[attachToDebugger {callback}]: debugger attach failed: error=${chrome.runtime.lastError.message}`);
      } else {
        log.debug(`[attachToDebugger {callback}]: debugger attach success: tabId=${tabId}`);
      }
    });
  } catch (e) {
    log.error(`[attachToDebuggerNew]: failed to attach debugger`, e);
  }
};

/**
 *
 * @param tabId
 * @param changeInfo
 * @param tab
 */
export const attachToDebuggerOld = async (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => {
  log.info(`[attachToDebuggerOld]: ***** triggered tabId=${tabId}, changeInfo: `, changeInfo);
  await delay();
  try {
    if (tab.status == 'complete') {
      chrome.debugger.attach({ tabId: tabId }, '1.0', () => {
        if (chrome.runtime.lastError) {
          log.error(
            `[attachToDebuggerOld {callback}]: debugger attach failed: error=${chrome.runtime.lastError.message}`
          );
        } else {
          log.debug(`[attachToDebuggerOld {callback}]: debugger attach success: tabId=${tabId}`);
        }
      });
    }
  } catch (e) {
    log.error(`[attachToDebuggerOld]: failed to attach debugger`, e);
  }
};

export const getLayoutMetrics = async (tabId: number): Promise<LayoutMetrics | undefined> => {
  log.debug(`[getLayoutMetrics]: ***** started tabId=${tabId} ****** `);
  await delay();

  const layoutMetrics = {} as LayoutMetrics;
  const target = {
    tabId: tabId
  };
  const method = 'Page.getLayoutMetrics';
  const commandParams = {};

  await chrome.debugger
    .sendCommand(target, method, commandParams)
    .then(async (object: any) => {
      if (chrome.runtime.lastError) {
        log.error(`[getLayoutMetrics {callback}]: status=failed, tabId=${tabId}`, chrome.runtime.lastError);
      } else {
        if (object) {
          log.debug(`[getLayoutMetrics {callback}]: completed for tabId=${tabId}`, object);
          layoutMetrics.width = object.cssContentSize.width;
          layoutMetrics.height = object.cssContentSize.height;
        } else {
          log.error('[getLayoutMetrics {callback}]: object is undefined');
        }
      }
    })
    .catch((e) => {
      log.error(`[getLayoutMetrics]: something went wrong, tabId=${tabId}\``, e);
    });

  log.debug('[getLayoutMetrics]: returning layoutMetrics', layoutMetrics);
  return layoutMetrics;
};

export const setDeviceMetricsOverride = async (tabId: number, layoutMetrics: LayoutMetrics) => {
  log.debug(`[setDeviceMetricsOverride]: ***** started tabId=${tabId} *****`);
  await delay();
  const target = {
    tabId: tabId
  };
  const commandParams = {
    height: layoutMetrics.height,
    width: layoutMetrics.width,
    deviceScaleFactor: 1,
    mobile: false
  };
  const method = 'Emulation.setDeviceMetricsOverride';
  await chrome.debugger
    .sendCommand(target, method, commandParams)
    .then(async () => {
      if (chrome.runtime.lastError) {
        log.error(`[setDeviceMetricsOverride {callback}]: status=failed, tabId=${tabId}`, chrome.runtime.lastError);
      } else {
        log.debug(`[setDeviceMetricsOverride {callback}]: completed for tabId=${tabId}\``);
      }
    })
    .catch((e) => {
      log.error(`[setDeviceMetricsOverride]: something went wrong on tabId=${tabId}\``);
    });
};

export async function captureScreenshot(tabId: number): Promise<ScreenCaptureResponse> {
  log.debug(`[captureScreenshot]: ***** triggered screen capture on tabId=${tabId} *****`);
  await delay();

  const screenCaptureResponse: ScreenCaptureResponse = { data: '' };
  const target = { tabId: tabId };
  const method = 'Page.captureScreenshot';
  const commandParams = {
    format: 'jpeg',
    quality: 60,
    fromSurface: true
  };

  await chrome.debugger
    .sendCommand(target, method, commandParams)
    .then(async (response: any) => {
      if (chrome.runtime.lastError) {
        log.error(`[captureScreenshot {callback}]: status=failed, tabId=${tabId}`, chrome.runtime.lastError);
      } else {
        screenCaptureResponse.data = 'data:image/jpg;base64,' + response.data;
        log.debug(`[captureScreenshot {callback}]: success`, screenCaptureResponse);
      }
    })
    .catch((e) => {
      log.error('[captureScreenshot]: something went wrong', e);
    });

  return screenCaptureResponse;
}

export const detachDebugger = async (tabId: number) => {
  log.debug(`[detachDebugger]: ***** triggered tabId=${tabId} *****`);
  await delay();
  try {
    await chrome.debugger.detach({ tabId: tabId }).then(() => {
      if (chrome.runtime.lastError) {
        log.error(`[detachDebugger]: debugger detach failed: error=${chrome.runtime.lastError.message}`);
      } else {
        log.debug(`[detachDebugger]: debugger detach success: tabId=${tabId}`);
      }
    });
  } catch (e) {
    log.error(`[detachDebugger]: failed to detach debugger`, e);
  }
};
