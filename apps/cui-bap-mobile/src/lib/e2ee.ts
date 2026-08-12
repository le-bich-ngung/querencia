/**
 * End-to-End Encryption - Signal Protocol
 * 
 * Architecture:
 *   1. Mỗi user có Identity Key pair (long-term) + Signed PreKey + One-Time PreKeys
 *   2. Keys upload lên server khi đăng ký
 *   3. Khi gửi tin nhắn lần đầu cho ai:
 *      - Fetch public keys của người nhận từ server
 *      - Thực hiện X3DH key agreement → shared secret
 *      - Encrypt bằng Double Ratchet
 *   4. Server chỉ thấy encrypted ciphertext, không đọc được
 *
 * Trade-offs đã chấp nhận:
 *   - Search tin nhắn: chỉ search local (device)
 *   - Cloud backup: backup encrypted blob
 *   - Multi-device: cần key exchange riêng cho mỗi thiết bị
 *   - Moderation: server không filter được nội dung
 */

import {
  KeyHelper,
  SignalProtocolAddress,
  SessionBuilder,
  SessionCipher,
  PreKeyBundle,
  StorageType,
} from '@privacyresearch/libsignal-protocol-typescript';
import { MMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

// ── Encrypted MMKV instance ────────────────────────────────────
// Long-term identity keys, prekeys, and Double Ratchet session state
// are the crown jewels of E2EE — if they leak, past/future messages
// can be decrypted. MMKV is NOT encrypted at rest by default, so we
// generate a random 256-bit key, store *that* key in the OS Keychain
// / Keystore (hardware-backed where available), and hand it to MMKV
// as `encryptionKey`. This mirrors the pattern already used for the
// auth token store (see auth.store.ts).
const MMKV_KEY_SERVICE = 'e2ee-mmkv-encryption-key';
let storagePromise: Promise<MMKV> | null = null;

async function getOrCreateEncryptionKey(): Promise<string> {
  const existing = await Keychain.getGenericPassword({ service: MMKV_KEY_SERVICE });
  if (existing) return existing.password;

  const randomBytes = new Uint8Array(32);
  // libsignal-protocol-typescript already requires a WebCrypto-grade
  // CSPRNG to be present globally for its own key generation, so we
  // reuse the same source here rather than introducing a new one.
  (globalThis as any).crypto.getRandomValues(randomBytes);
  let binary = '';
  for (let i = 0; i < randomBytes.length; i++) binary += String.fromCharCode(randomBytes[i]);
  const key = btoa(binary);

  await Keychain.setGenericPassword('querencia-e2ee', key, { service: MMKV_KEY_SERVICE });
  return key;
}

async function getStorage(): Promise<MMKV> {
  if (!storagePromise) {
    storagePromise = getOrCreateEncryptionKey().then(
      (encryptionKey) => new MMKV({ id: 'e2ee-keys', encryptionKey }),
    );
  }
  return storagePromise;
}

export const getE2eeStorage = getStorage;

/**
 * Call once at app startup (before any E2EE key generation, encrypt,
 * or decrypt call) so the Keychain round-trip happens up front instead
 * of stalling the first message.
 */
export async function initE2EEStorage(): Promise<void> {
  await getStorage();
}

// ── Signal Protocol Store - lưu keys vào MMKV (encrypted) ────
export class SignalStore implements StorageType {
  // Identity key pair
  async getIdentityKeyPair() {
    const storage = await getStorage();
    const stored = storage.getString('identityKeyPair');
    return stored ? JSON.parse(stored) : undefined;
  }

  async getLocalRegistrationId(): Promise<number> {
    const storage = await getStorage();
    return storage.getNumber('registrationId') ?? 0;
  }

  async isTrustedIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const storage = await getStorage();
    const trusted = storage.getString(`identity:${identifier}`);
    if (!trusted) {
      // First time - trust and store (Trust On First Use)
      await this.saveIdentity(identifier, identityKey);
      return true;
    }
    const trustedBuf = base64ToArrayBuffer(trusted);
    return arrayBuffersEqual(trustedBuf, identityKey);
  }

  async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const storage = await getStorage();
    const existing = storage.getString(`identity:${identifier}`);
    storage.set(`identity:${identifier}`, arrayBufferToBase64(identityKey));
    return !!existing; // true = identity changed (key change warning)
  }

  async loadPreKey(keyId: number | string) {
    const storage = await getStorage();
    const stored = storage.getString(`preKey:${keyId}`);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return {
      pubKey:  base64ToArrayBuffer(parsed.pubKey),
      privKey: base64ToArrayBuffer(parsed.privKey),
    };
  }

  async storePreKey(keyId: number | string, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }) {
    const storage = await getStorage();
    storage.set(`preKey:${keyId}`, JSON.stringify({
      pubKey:  arrayBufferToBase64(keyPair.pubKey),
      privKey: arrayBufferToBase64(keyPair.privKey),
    }));
  }

  async removePreKey(keyId: number | string) {
    const storage = await getStorage();
    storage.delete(`preKey:${keyId}`);
  }

  async loadSignedPreKey(keyId: number | string) {
    const storage = await getStorage();
    const stored = storage.getString(`signedPreKey:${keyId}`);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return {
      pubKey:  base64ToArrayBuffer(parsed.pubKey),
      privKey: base64ToArrayBuffer(parsed.privKey),
    };
  }

  async storeSignedPreKey(keyId: number | string, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }) {
    const storage = await getStorage();
    storage.set(`signedPreKey:${keyId}`, JSON.stringify({
      pubKey:  arrayBufferToBase64(keyPair.pubKey),
      privKey: arrayBufferToBase64(keyPair.privKey),
    }));
  }

  async removeSignedPreKey(keyId: number | string) {
    const storage = await getStorage();
    storage.delete(`signedPreKey:${keyId}`);
  }

  async loadSession(identifier: string) {
    const storage = await getStorage();
    const stored = storage.getString(`session:${identifier}`);
    return stored ? base64ToArrayBuffer(stored) : undefined;
  }

  async storeSession(identifier: string, record: ArrayBuffer) {
    const storage = await getStorage();
    storage.set(`session:${identifier}`, arrayBufferToBase64(record));
  }

  async removeSession(identifier: string) {
    const storage = await getStorage();
    storage.delete(`session:${identifier}`);
  }

  async removeAllSessions(identifier: string) {
    // Find and remove all sessions for this identifier
    // MMKV doesn't support prefix scan natively, track them manually
    const storage = await getStorage();
    storage.delete(`session:${identifier}`);
  }
}

// ── Key generation + registration ─────────────────────────────
export interface PublicKeyBundle {
  registrationId:   number;
  identityKey:      string; // base64
  signedPreKey:     { keyId: number; publicKey: string; signature: string };
  oneTimePreKeys:   { keyId: number; publicKey: string }[];
}

export async function generateAndStoreKeys(): Promise<PublicKeyBundle> {
  const store = new SignalStore();
  const storage = await getStorage();

  // Identity key pair
  const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
  storage.set('identityKeyPair', JSON.stringify({
    pubKey:  arrayBufferToBase64(identityKeyPair.pubKey),
    privKey: arrayBufferToBase64(identityKeyPair.privKey),
  }));

  // Registration ID
  const registrationId = KeyHelper.generateRegistrationId();
  storage.set('registrationId', registrationId);

  // Signed PreKey
  const signedPreKeyId   = 1;
  const signedPreKey     = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
  await store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

  // One-Time PreKeys (100 keys)
  const oneTimePreKeys: { keyId: number; publicKey: string }[] = [];
  for (let i = 0; i < 100; i++) {
    const preKey = await KeyHelper.generatePreKey(i + 1);
    await store.storePreKey(i + 1, preKey.keyPair);
    oneTimePreKeys.push({
      keyId:     i + 1,
      publicKey: arrayBufferToBase64(preKey.keyPair.pubKey),
    });
  }

  return {
    registrationId,
    identityKey: arrayBufferToBase64(identityKeyPair.pubKey),
    signedPreKey: {
      keyId:      signedPreKeyId,
      publicKey:  arrayBufferToBase64(signedPreKey.keyPair.pubKey),
      signature:  arrayBufferToBase64(signedPreKey.signature),
    },
    oneTimePreKeys,
  };
}

// ── Encrypt message ───────────────────────────────────────────
export interface EncryptedMessage {
  type:       number;  // 1 = PreKeyWhisperMessage, 2 = WhisperMessage
  body:       string;  // base64 ciphertext
  recipientId: string;
  deviceId:    number;
}

export async function encryptMessage(
  recipientId:  string,
  deviceId:     number,
  plaintext:    string,
  recipientBundle?: PublicKeyBundle, // chỉ cần lần đầu
): Promise<EncryptedMessage> {
  const store   = new SignalStore();
  const address = new SignalProtocolAddress(recipientId, deviceId);

  // Nếu có bundle → build session lần đầu (X3DH)
  if (recipientBundle) {
    const sessionBuilder = new SessionBuilder(store, address);
    const preKeyBundle: PreKeyBundle = {
      registrationId:  recipientBundle.registrationId,
      identityKey:     base64ToArrayBuffer(recipientBundle.identityKey),
      signedPreKey:    {
        keyId:     recipientBundle.signedPreKey.keyId,
        publicKey: base64ToArrayBuffer(recipientBundle.signedPreKey.publicKey),
        signature: base64ToArrayBuffer(recipientBundle.signedPreKey.signature),
      },
      preKey: recipientBundle.oneTimePreKeys[0] ? {
        keyId:     recipientBundle.oneTimePreKeys[0].keyId,
        publicKey: base64ToArrayBuffer(recipientBundle.oneTimePreKeys[0].publicKey),
      } : undefined,
    };
    await sessionBuilder.processPreKey(preKeyBundle);
  }

  const sessionCipher = new SessionCipher(store, address);
  const encrypted     = await sessionCipher.encrypt(
    new TextEncoder().encode(plaintext).buffer
  );

  return {
    type:        encrypted.type,
    body:        arrayBufferToBase64(encrypted.body as ArrayBuffer),
    recipientId,
    deviceId,
  };
}

// ── Decrypt message ───────────────────────────────────────────
export async function decryptMessage(
  senderId:  string,
  deviceId:  number,
  encrypted: EncryptedMessage,
): Promise<string> {
  const store   = new SignalStore();
  const address = new SignalProtocolAddress(senderId, deviceId);
  const cipher  = new SessionCipher(store, address);

  const ciphertext = base64ToArrayBuffer(encrypted.body);
  let decrypted: ArrayBuffer;

  if (encrypted.type === 3) {
    // PreKeyWhisperMessage - lần đầu nhận từ sender này
    decrypted = await cipher.decryptPreKeyWhisperMessage(ciphertext, 'binary');
  } else {
    // WhisperMessage - session đã có
    decrypted = await cipher.decryptWhisperMessage(ciphertext, 'binary');
  }

  return new TextDecoder().decode(decrypted);
}

// ── Check nếu cần fetch keys mới ─────────────────────────────
export async function hasSession(recipientId: string, deviceId: number): Promise<boolean> {
  const storage = await getStorage();
  const key = `session:${recipientId}.${deviceId}`;
  return storage.contains(key);
}

export async function getLocalRegistrationId(): Promise<number> {
  const storage = await getStorage();
  return storage.getNumber('registrationId') ?? 0;
}

// ── Helpers ───────────────────────────────────────────────────
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary  = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBuffersEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  const viewA = new Uint8Array(a);
  const viewB = new Uint8Array(b);
  for (let i = 0; i < viewA.length; i++) {
    if (viewA[i] !== viewB[i]) return false;
  }
  return true;
}
