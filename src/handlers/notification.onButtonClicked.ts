import log from 'loglevel';

export const onNotificationButtonClicked = () => (notificationId: string, buttonIndex: number) => {
  log.debug(
    `[chrome.notifications.onButtonClicked]: status=success, notificationId${notificationId}, buttonIndex=${buttonIndex}`
  );
};
