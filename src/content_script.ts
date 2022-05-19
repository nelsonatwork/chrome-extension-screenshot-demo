import log from 'loglevel';
import { DEFAULT_LOG_LEVEL } from './config';

log.setLevel(DEFAULT_LOG_LEVEL);

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  log.debug('World', message);
  senderResponse({ success: true });
  return true;
});

document.addEventListener('DOMContentLoaded', function (event) {
  log.debug('[DOMContentLoaded]: event fired', event);
});
