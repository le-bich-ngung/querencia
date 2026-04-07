ï»¿/**
 * Apple Sign-In â báº¯t buá»c cho App Store náº¿u app cÃ³ Google Sign-In
 * Package: @invertase/react-native-apple-authentication
 *
 * LÆ°u Ã½:
 * - Chá» hoáº¡t Äá»ng trÃªn iOS 13+ vÃ  macOS 10.15+
 * - Cáº§n Apple Developer account ($99/nÄm) Äá» build iOS
 * - TrÃªn Android: Apple cÅ©ng cung cáº¥p web-based flow (nhÆ°ng Ã­t dÃ¹ng)
 */
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import { api } from './api';

export function isAppleAuthAvailable(): boolean {
  return Platform.OS === 'ios' && appleAuth.isSupported;
}

export interface AppleAuthResult {
  user:         { id: string; name: string; email: string; avatarUrl?: string };
  accessToken:  string;
  refreshToken: string;
}

/**
 * Trigger Apple Sign-In
 * â Apple tráº£ identityToken (JWT)
 * â Gá»­i lÃªn Querencia server verify + táº¡o session
 *
 * LÆ°u Ã½ Äáº·c biá»t cá»§a Apple:
 * - Apple chá» tráº£ email + tÃªn láº§n Äáº¦U TIÃN ÄÄng nháº­p
 * - Nhá»¯ng láº§n sau chá» tráº£ userIdentifier
 * â Server cáº§n lÆ°u email tá»« láº§n Äáº§u
 */
export async function signInWithApple(): Promise<AppleAuthResult> {
  const appleAuthRequest = await appleAuth.performRequest({
    requestedOperation: AppleAuthRequestOperation.LOGIN,
    requestedScopes: [
      AppleAuthRequestScope.EMAIL,
      AppleAuthRequestScope.FULL_NAME,
    ],
  });

  const { identityToken, fullName, email, user: appleUserId } = appleAuthRequest;

  if (!identityToken) throw new Error('Apple Sign-In failed: no identity token');

  // Build full name tá»« Apple (chá» cÃ³ láº§n Äáº§u)
  const name = [fullName?.givenName, fullName?.familyName]
    .filter(Boolean).join(' ') || undefined;

  // Gá»­i lÃªn Querencia server
  const data = await api.appleAuth(identityToken, name, email);

  return {
    user:         data.user,
    accessToken:  data.access_token,
    refreshToken: data.refresh_token,
  };
}
