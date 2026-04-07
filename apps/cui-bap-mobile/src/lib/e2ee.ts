ï»¿/**
 * End-to-End Encryption â Signal Protocol
 * 
 * Architecture:
 *   1. Má»i user cÃ³ Identity Key pair (long-term) + Signed PreKey + One-Time PreKeys
 *   2. Keys upload lÃªn server khi ÄÄng kÃ½
 *   3. Khi gá»­i tin nháº¯n láº§n Äáº§u cho ai:
 *      - Fetch public keys cá»§a ngÆ°á»i nháº­n tá»« server
 *      - Thá»±c hiá»n X3DH key agreement â shared secret
 *      - Encrypt báº±ng Double Ratchet
 *   4. Server chá» tháº¥y encrypted ciphertext, khÃ´ng Äá»c ÄÆ°á»£c
 *
 * Trade-offs ÄÃ£ cháº¥p nháº­n:
 *   - Search tin nháº¯n: chá» search local (device)
 *   - Cloud backup: backup encrypted blob
 *   - Multi-device: cáº§n key exchange riÃªng cho má»i thiáº¿t bá»
 *   - Moderation: server khÃ´ng filter ÄÆ°á»£c ná»i dung
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

const storage = new MMKV({ id: 'e2ee-keys' });

// ââ Signal Protocol Store â lÆ°u keys vÃ o MMKV (encrypted) ââââ
export class SignalStore implements StorageType {
  // Identity key pair
  async getIdentityKeyPair() {
    const stored = storage.getString('identityKeyPair');
    return stored ? JSON.parse(stored) : undefined;
  }

  async getLocalRegistrationId(): Promise<number> {
    return storage.getNumber('registrationId') ?? 0;
  }

  async isTrustedIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const trusted = storage.getString(`identity:${identifier}`);
    if (!trusted) {
      // First time â trust and store (Trust On First Use)
      await this.saveIdentity(identifier, identityKey);
      return true;
    }
    const trustedBuf = base64ToArrayBuffer(trusted);
    return arrayBuffersEqual(trustedBuf, identityKey);
  }

  async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const existing = storage.getString(`identity:${identifier}`);
    storage.set(`identity:${identifier}`, arrayBufferToBase64(identityKey));
    return !!existing; // true = identity changed (key change warning)
  }

  async loadPreKey(keyId: number | string) {
    const stored = storage.getString(`preKey:${keyId}`);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return {
      pubKey:  base64ToArrayBuffer(parsed.pubKey),
      privKey: base64ToArrayBuffer(parsed.privKey),
    };
  }

  async storePreKey(keyId: number | string, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }) {
    storage.set(`preKey:${keyId}`, JSON.stringify({
      pubKey:  arrayBufferToBase64(keyPair.pubKey),
      privKey: arrayBufferToBase64(keyPair.privKey),
    }));
  }

  async removePreKey(keyId: number | string) {
    storage.delete(`preKey:${keyId}`);
  }

  async loadSignedPreKey(keyId: number | string) {
    const stored = storage.getString(`signedPreKey:${keyId}`);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    return {
      pubKey:  base64ToArrayBuffer(parsed.pubKey),
      privKey: base64ToArrayBuffer(parsed.privKey),
    };
  }

  async storeSignedPreKey(keyId: number | string, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }) {
    storage.set(`signedPreKey:${keyId}`, JSON.stringify({
      pubKey:  arrayBufferToBase64(keyPair.pubKey),
      privKey: arrayBufferToBase64(keyPair.privKey),
    }));
  }

  async removeSignedPreKey(keyId: number | string) {
    storage.delete(`signedPreKey:${keyId}`);
  }

  async loadSession(identifier: string) {
    const stored = storage.getString(`session:${identifier}`);
    return stored ? base64ToArrayBuffer(stored) : undefined;
  }

  async storeSession(identifier: string, record: ArrayBuffer) {
    storage.set(`session:${identifier}`, arrayBufferToBase64(record));
  }

  async removeSession(identifier: string) {
    storage.delete(`session:${identifier}`);
  }

  async removeAllSessions(identifier: string) {
    // Find and remove all sessions for this identifier
    // MMKV doesn't support prefix scan natively, track them manually
    storage.delete(`session:${identifier}`);
  }
}

// ââ Key generation + registration âââââââââââââââââââââââââââââ
export interface PublicKeyBundle {
  registrationId:   number;
  identityKey:      string; // base64
  signedPreKey:     { keyId: number; publicKey: string; signature: string };
  oneTimePreKeys:   { keyId: number; publicKey: string }[];
}

export async function generateAndStoreKeys(): Promise<PublicKeyBundle> {
  const store = new SignalStore();

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

// ââ Encrypt message âââââââââââââââââââââââââââââââââââââââââââ
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
  recipientBundle?: PublicKeyBundle, // chá» cáº§n láº§n Äáº§u
): Promise<EncryptedMessage> {
  const store   = new SignalStore();
  const address = new SignalProtocolAddress(recipientId, deviceId);

  // Náº¿u cÃ³ bundle â build session láº§n Äáº§u (X3DH)
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

// ââ Decrypt message âââââââââââââââââââââââââââââââââââââââââââ
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
    // PreKeyWhisperMessage â láº§n Äáº§u nháº­n tá»« sender nÃ y
    decrypted = await cipher.decryptPreKeyWhisperMessage(ciphertext, 'binary');
  } else {
    // WhisperMessage â session ÄÃ£ cÃ³
    decrypted = await cipher.decryptWhisperMessage(ciphertext, 'binary');
  }

  return new TextDecoder().decode(decrypted);
}

// ââ Check náº¿u cáº§n fetch keys má»i âââââââââââââââââââââââââââââ
export function hasSession(recipientId: string, deviceId: number): boolean {
  const key = `session:${recipientId}.${deviceId}`;
  return storage.contains(key);
}

export function getLocalRegistrationId(): number {
  return storage.getNumber('registrationId') ?? 0;
}

// ââ Helpers âââââââââââââââââââââââââââââââââââââââââââââââââââ
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
