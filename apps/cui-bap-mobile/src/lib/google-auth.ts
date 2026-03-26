/**
 * Google Sign-In cho React Native
 * Package: @react-native-google-signin/google-signin
 *
 * Setup cần làm:
 * 1. Google Cloud Console → OAuth 2.0 Credentials → Android client
 * 2. Lấy SHA-1 fingerprint của keystore
 * 3. Điền vào google-services.json
 */
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { api } from './api';

// Configure một lần khi app start (App.tsx)
export function configureGoogleSignIn() {
  GoogleSignin.configure({
    // Web client ID từ Google Cloud Console (không phải Android client ID)
    // Tìm tại: console.cloud.google.com → Credentials → Web client
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['email', 'profile'],
  });
}

export interface GoogleAuthResult {
  user:         { id: string; name: string; email: string; avatarUrl?: string };
  accessToken:  string;
  refreshToken: string;
}

/**
 * Trigger Google Sign-In flow
 * → Nhận idToken từ Google
 * → Gửi lên Querencia API để verify + tạo JWT
 */
export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const userInfo = await GoogleSignin.signIn();
  const { idToken } = await GoogleSignin.getTokens();

  if (!idToken) throw new Error('Google Sign-In failed: no idToken');

  // Gửi idToken lên Querencia server → server verify với Google → trả JWT
  const data = await api.googleAuth(idToken);

  return {
    user:        data.user,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch {}
}

export { GoogleSigninButton };
