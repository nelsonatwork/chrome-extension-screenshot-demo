import log from 'loglevel';
import NotificationOptions = chrome.notifications.NotificationOptions;

const notificationOpts = {
  title: 'Screen Capture',
  message: 'Proccessing...',
  iconUrl: 'assets/icon-16.png',
  type: 'progress',
  buttons: [{ title: 'Cancel' }]
};

export const createNotification = (notificationId: string) => {
  chrome.notifications.create(notificationId, { ...notificationOpts, progress: 0 } as NotificationOptions<true>, () => {
    log.debug(`[createNotification {callback}]: status=success`);
  });
};

export const updateNotification = (notificationId: string, message: string, progress: number) => {
  chrome.notifications.update(notificationId, { ...notificationOpts, message, progress } as NotificationOptions, () => {
    log.debug(`[updateNotification {callback}]: status=success`);
  });
};

export const closeNotification = (notificationId: string) => {
  chrome.notifications.clear(notificationId, () => {
    log.debug(`[closeNotification {callback}]: status=success`);
  });
};
