ï»¿/**
 * Google Sign-In cho React Native
 * Package: @react-native-google-signin/google-signin
 *
 * Setup cáº§n lÃ m:
 * 1. Google Cloud Console â OAuth 2.0 Credentials â Android client
 * 2. Láº¥y SHA-1 fingerprint cá»§a keystore
 * 3. Äiá»n vÃ o google-services.json
 */
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { api } from './api';

// Configure má»t láº§n khi app start (App.tsx)
export function configureGoogleSignIn() {
  GoogleSignin.configure({
    // Web client ID tá»« Google Cloud Console (khÃ´ng pháº£i Android client ID)
    // TÃ¬m táº¡i: console.cloud.google.com â Credentials â Web client
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
 * â Nháº­n idToken tá»« Google
 * â Gá»­i lÃªn Querencia API Äá» verify + táº¡o JWT
 */
export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const userInfo = await GoogleSignin.signIn();
  const { idToken } = await GoogleSignin.getTokens();

  if (!idToken) throw new Error('Google Sign-In failed: no idToken');

  // Gá»­i idToken lÃªn Querencia server â server verify vá»i Google â tráº£ JWT
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
