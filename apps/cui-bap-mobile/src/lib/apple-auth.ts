/**
 * Apple Sign-In — bắt buộc cho App Store nếu app có Google Sign-In
 * Package: @invertase/react-native-apple-authentication
 *
 * Lưu ý:
 * - Chỉ hoạt động trên iOS 13+ và macOS 10.15+
 * - Cần Apple Developer account ($99/năm) để build iOS
 * - Trên Android: Apple cũng cung cấp web-based flow (nhưng ít dùng)
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
 * → Apple trả identityToken (JWT)
 * → Gửi lên Querencia server verify + tạo session
 *
 * Lưu ý đặc biệt của Apple:
 * - Apple chỉ trả email + tên lần ĐẦU TIÊN đăng nhập
 * - Những lần sau chỉ trả userIdentifier
 * → Server cần lưu email từ lần đầu
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

  // Build full name từ Apple (chỉ có lần đầu)
  const name = [fullName?.givenName, fullName?.familyName]
    .filter(Boolean).join(' ') || undefined;

  // Gửi lên Querencia server
  const data = await api.appleAuth(identityToken, name, email);

  return {
    user:         data.user,
    accessToken:  data.access_token,
    refreshToken: data.refresh_token,
  };
}
