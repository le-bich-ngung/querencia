ï»¿/**
 * App icon badge â hiá»n sá» tin nháº¯n chÆ°a Äá»c
 * iOS: setApplicationIconBadgeNumber
 * Android: via notification channels (react-native-push-notification)
 */
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

export function updateAppBadge(count: number) {
  if (Platform.OS === 'ios') {
    PushNotification.setApplicationIconBadgeNumber(count);
  } else {
    // Android: badge thÃ´ng qua notification channel
    if (count === 0) {
      PushNotification.cancelAllLocalNotifications();
    }
    // Most Android launchers respect the ShortcutBadger library
    // react-native-push-notification handles this on Android 8+
    PushNotification.setApplicationIconBadgeNumber(count);
  }
}

export function clearBadge() {
  updateAppBadge(0);
}
