import { toast } from 'sonner';

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
};

export const requestBrowserNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

export const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    icon: '/favicon.ico',
    ...options,
  });
};

export const notifyFloodRisk = (risk: 'low' | 'moderate' | 'high', location: string) => {
  if (risk === 'high') {
    notify.error(`🚨 HIGH flood risk detected at ${location}!`);
    sendBrowserNotification('FloodWatch Alert', {
      body: `HIGH flood risk detected at ${location}!`,
      tag: 'flood-alert',
    });
  } else if (risk === 'moderate') {
    notify.warning(`⚠️ Moderate flood risk at ${location}`);
  }
};
