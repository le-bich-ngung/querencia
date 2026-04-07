ï»¿/**
 * Hidden Chat â áº©n conversation, yÃªu cáº§u biometrics Äá» xem
 * DÃ¹ng: expo-local-authentication (hoáº·c react-native-biometrics)
 * Store: MMKV â danh sÃ¡ch convId bá» áº©n
 */
import { MMKV } from 'react-native-mmkv';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const storage = new MMKV({ id: 'hidden-chats' });
const KEY_HIDDEN = 'hidden_conv_ids';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true, // fallback to PIN/password náº¿u khÃ´ng cÃ³ fingerprint
});

// ââ Láº¥y danh sÃ¡ch hidden convIds âââââââââââââââââââââââââââââ
export function getHiddenConvIds(): string[] {
  const raw = storage.getString(KEY_HIDDEN);
  return raw ? JSON.parse(raw) : [];
}

export function isHidden(convId: string): boolean {
  return getHiddenConvIds().includes(convId);
}

// ââ Toggle áº©n/hiá»n conversation ââââââââââââââââââââââââââââââ
export async function toggleHideConversation(convId: string): Promise<boolean> {
  const hidden = getHiddenConvIds();
  const isCurrentlyHidden = hidden.includes(convId);

  if (isCurrentlyHidden) {
    // Unhide: yÃªu cáº§u xÃ¡c thá»±c biometrics trÆ°á»c
    const unlocked = await authenticateForHiddenChat();
    if (!unlocked) return false;
    const updated = hidden.filter(id => id !== convId);
    storage.set(KEY_HIDDEN, JSON.stringify(updated));
    return true;
  } else {
    // Hide: thÃªm vÃ o danh sÃ¡ch
    hidden.push(convId);
    storage.set(KEY_HIDDEN, JSON.stringify(hidden));
    return true;
  }
}

// ââ XÃ¡c thá»±c biometrics Äá» xem hidden chats ââââââââââââââââââ
export async function authenticateForHiddenChat(): Promise<boolean> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      // Fallback: dÃ¹ng PIN há» thá»ng
      return true; // TrÃªn device khÃ´ng cÃ³ biometrics â cho qua
    }

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: 'XÃ¡c thá»±c Äá» xem tin nháº¯n áº©n',
      cancelButtonText: 'Há»§y',
    });
    return success;
  } catch {
    return false;
  }
}

// ââ Kiá»m tra biometrics cÃ³ kháº£ dá»¥ng khÃ´ng âââââââââââââââââââââ
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
