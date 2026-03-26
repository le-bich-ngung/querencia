import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Modal } from 'react-native';
import { AppNavigator, navigationRef } from './src/navigation';
import { startOfflineQueueListener } from './src/lib/offline-queue';
import { useAuthStore } from './src/store/auth.store';
import { api } from './src/lib/api';
import { MFAApproveScreen } from './src/screens/auth/MFAApproveScreen';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

// Push notification config
PushNotification.configure({
  onRegister: async ({ token }) => {
    try { await api.registerFCM(token); } catch {}
  },
  onNotification: (notification) => {
    // MFA notification → hiện approve screen
    if (notification.data?.type === 'mfa_request') {
      // Handled via Firebase onMessage below
    }
    notification.finish(PushNotification.FetchResult.NoData);
  },
  requestPermissions: true,
});

// Push notification channels
PushNotification.createChannel({
  channelId:   'messages',
  channelName: 'Tin nhắn',
  importance:  4, // HIGH
  soundName:   'notification.wav',
  vibrate:     true,
}, () => {});

PushNotification.createChannel({
  channelId:   'security',
  channelName: 'Bảo mật',
  importance:  5, // MAX
  soundName:   'default',
  vibrate:     true,
}, () => {});

interface MFARequest {
  mfaToken:  string;
  device:    string;
  ipAddress: string;
  location?: string;
  createdAt: string;
}

export default function App() {
  const isLoggedIn  = useAuthStore(s => s.isLoggedIn);
  const [mfaRequest, setMfaRequest] = useState<MFARequest | null>(null);

  useEffect(() => {
    // FCM foreground
    const unsubForeground = messaging().onMessage(async (msg) => {
      const data = msg.data;

      if (data?.type === 'mfa_request') {
        // MFA request → hiện modal ngay
        setMfaRequest({
          mfaToken:  data.mfa_token!,
          device:    data.device    ?? 'Unknown device',
          ipAddress: data.ip_address ?? '',
          location:  data.location,
          createdAt: data.created_at ?? new Date().toISOString(),
        });
        return;
      }

      // Tin nhắn thường → local notification
      PushNotification.localNotification({
        channelId:   'messages',
        title:       msg.notification?.title ?? '🌽 Tin nhắn mới',
        message:     msg.notification?.body  ?? '',
        userInfo:    data,
        soundName:   'notification.wav',
        vibrate:     true,
      });
    });

    // FCM background/quit tap
    // Deep link: tap notification → navigate đến conversation
    const unsubResponse = PushNotification.configure({
      onNotification: (notification) => {
        const data = notification.data;
        if (data?.convId && navigationRef.current?.isReady()) {
          navigationRef.current.navigate('Chat', {
            convId:   data.convId,
            convType: data.convType ?? 'direct',
            name:     data.senderName ?? 'Tin nhắn',
          });
        }
        notification.finish(PushNotification.FetchResult.NoData);
      },
    });

    const unsubBackground = messaging().onNotificationOpenedApp(msg => {
      if (msg.data?.type === 'mfa_request') {
        setMfaRequest({
          mfaToken:  msg.data.mfa_token!,
          device:    msg.data.device    ?? 'Unknown device',
          ipAddress: msg.data.ip_address ?? '',
          location:  msg.data.location,
          createdAt: msg.data.created_at ?? new Date().toISOString(),
        });
      }
    });

    // Start offline queue listener
    const unsubQueue = startOfflineQueueListener();
    return () => { unsubForeground(); unsubBackground(); unsubQueue(); };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0d0f0d"/>
        <AppNavigator/>

        {/* MFA Approve Modal — toàn màn hình, overlay mọi thứ */}
        <Modal
          visible={!!mfaRequest}
          animationType="fade"
          transparent
          onRequestClose={() => setMfaRequest(null)}
        >
          {mfaRequest && (
            <MFAApproveScreen
              request={mfaRequest}
              onDismiss={() => setMfaRequest(null)}
            />
          )}
        </Modal>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
