import log from 'loglevel';
import { delay } from '../utils';
import Tab = chrome.tabs.Tab;

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
      log.error(`[createTab {callback}]: something went wrong!`, e);
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
      log.error(`[removeTab {callback}]: something went wrong!`, e);
    });
};
