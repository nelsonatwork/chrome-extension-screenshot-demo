import { onClickHandler } from './handlers/onClick';
import log from 'loglevel';
import { DEFAULT_LOG_LEVEL } from './config';
import { onNotificationButtonClicked } from './handlers/notification.onButtonClicked';

log.setLevel(DEFAULT_LOG_LEVEL);

chrome.action.onClicked.addListener(onClickHandler());

chrome.notifications.onButtonClicked.addListener(onNotificationButtonClicked());

// chrome.tabs.onUpdated.addListener(attachToDebugger);

// chrome.runtime.onMessage.addListener(onMessageHandler());
// chrome.runtime.onMessage.addListener((data) => {
//   if (data.type === 'notification') {
//     chrome.notifications.create('', data.options);
//   }
// });
