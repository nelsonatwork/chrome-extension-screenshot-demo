import log from 'loglevel';
import { DEFAULT_LOG_LEVEL } from './config';

log.setLevel(DEFAULT_LOG_LEVEL);

// chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
//   log.debug('World', message);
//   senderResponse({ success: true });
//   return true;
// });
//
// document.addEventListener('DOMContentLoaded', function (event) {
//   log.debug('[DOMContentLoaded]: event fired', event);
// });

// log.debug('[content_script.ts]: reet bot!');
//
// const startBtn = document.createElement('button');
// startBtn.textContent = 'start!';
// document.body.insertAdjacentElement('afterbegin', startBtn);
// startBtn.addEventListener('click', () => {
//   chrome.runtime.sendMessage('', {
//     type: 'notification',
//     options: {
//       title: 'Screen capture started',
//       message: 'How great it is!',
//       iconUrl: 'assets/icon-16.png',
//       type: 'basic'
//     }
//   });
// });
//
// const cancelBtn = document.createElement('button');
// cancelBtn.textContent = 'cancel!';
// document.body.insertAdjacentElement('afterbegin', cancelBtn);
// cancelBtn.addEventListener('click', () => {
//   chrome.runtime.sendMessage('', {
//     type: 'notification',
//     options: {
//       title: 'Screen capture canceled',
//       message: 'How great it is!',
//       iconUrl: 'assets/icon-16.png',
//       type: 'basic'
//     }
//   });
// });
