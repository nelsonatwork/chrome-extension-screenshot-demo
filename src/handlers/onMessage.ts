import log from 'loglevel';

export function onMessageHandler() {
  return (message: any, sender: any, senderResponse: any) => {
    log.debug(`[onMessageHandler]: ***** triggered, message.name=${message.name} *****`);
    if (message.name === 'download' && message.url) {
      chrome.downloads.download(
        {
          filename: 'screenshot.png',
          url: message.url
        },
        (downloadId) => {
          senderResponse({ success: true });
        }
      );

      return true;
    }

    if (message.name === 'getLayoutMetrics-completed' && message.tabId) {
      log.debug('HOLA');
      senderResponse({ success: true });

      return true;
    }
  };
}
