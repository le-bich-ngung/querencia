/**
 * Hidden Chat - ẩn conversation, yêu cầu biometrics để xem
 * Dùng: expo-local-authentication (hoặc react-native-biometrics)
 * Store: MMKV - danh sách convId bị ẩn
 */
import { MMKV } from 'react-native-mmkv';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const storage = new MMKV({ id: 'hidden-chats' });
const KEY_HIDDEN = 'hidden_conv_ids';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true, // fallback to PIN/password nếu không có fingerprint
});

// ── Lấy danh sách hidden convIds ─────────────────────────────
export function getHiddenConvIds(): string[] {
  const raw = storage.getString(KEY_HIDDEN);
  return raw ? JSON.parse(raw) : [];
}

export function isHidden(convId: string): boolean {
  return getHiddenConvIds().includes(convId);
}

// ── Toggle ẩn/hiện conversation ──────────────────────────────
export async function toggleHideConversation(convId: string): Promise<boolean> {
  const hidden = getHiddenConvIds();
  const isCurrentlyHidden = hidden.includes(convId);

  if (isCurrentlyHidden) {
    // Unhide: yêu cầu xác thực biometrics trước
    const unlocked = await authenticateForHiddenChat();
    if (!unlocked) return false;
    const updated = hidden.filter(id => id !== convId);
    storage.set(KEY_HIDDEN, JSON.stringify(updated));
    return true;
  } else {
    // Hide: thêm vào danh sách
    hidden.push(convId);
    storage.set(KEY_HIDDEN, JSON.stringify(hidden));
    return true;
  }
}

// ── Xác thực biometrics để xem hidden chats ──────────────────
export async function authenticateForHiddenChat(): Promise<boolean> {
  try {
    // Don't bypass just because isSensorAvailable() reports no biometric
    // sensor — this device may still have a PIN/pattern/password set,
    // which allowDeviceCredentials lets simplePrompt fall back to. The
    // old code treated "no biometric sensor" as "let them in", which
    // defeated the whole point of this lock on any device without
    // fingerprint/face hardware. Fail closed instead: only grant access
    // on an explicit successful authentication.
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: 'Xác thực để xem tin nhắn ẩn',
      cancelButtonText: 'Hủy',
    });
    return success;
  } catch {
    // No biometric AND no device credential configured, prompt failed to
    // show, or any other error — deny access rather than silently allow.
    return false;
  }
}

// ── Kiểm tra biometrics có khả dụng không ─────────────────────
export async function checkBiometricsAvailable(): Promise<{
  available: boolean;
  biometryType?: string;
}> {
  try {
    const result = await rnBiometrics.isSensorAvailable();
    return {
      available:    result.available,
      biometryType: result.biometryType,
    };
  } catch {
    return { available: false };
  }
}
