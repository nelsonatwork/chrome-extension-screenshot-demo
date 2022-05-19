import log from 'loglevel';

export function onMessageHandler() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return async (message: any, sender: any, senderResponse: any) => {
    log.debug(`[onMessageHandler]: ***** triggered, message.name=${message.name} *****`);
    if (message.name === 'download' && message.url) {
      await chrome.downloads
        .download({
          filename: 'screenshot.png',
          url: message.url
        })
        .then((downloadId) => {
          if (chrome.runtime.lastError) {
            log.error(`[onMessageHandler {download callback}]: status=failed`, chrome.runtime.lastError);
          } else {
            log.debug(
              `[onMessageHandler {download callback}]: status=success, downloadId=${downloadId}, message.name=${message.name} *****`
            );
            senderResponse({ success: true });
          }
        })
        .catch((e) => {
          log.error(`[onMessageHandler]: something went wrong`, e);
        });
      return true;
    }

    if (message.name === 'getLayoutMetrics-completed' && message.tabId) {
      log.debug('HOLA');
      senderResponse({ success: true });

      return true;
    }
  };
}
