ï»¿/**
 * E2EE Messaging â wrap gá»­i/nháº­n tin nháº¯n vá»i Signal Protocol
 * TÃ­ch há»£p vÃ o ChatScreen thay tháº¿ gá»i api.sendMsg trá»±c tiáº¿p
 */
import { encryptMessage, decryptMessage, hasSession, generateAndStoreKeys } from './e2ee';
import { api } from './api';

interface SendOptions {
  convId:      string;
  convType:    'direct' | 'group';
  recipientId: string; // userId cá»§a ngÆ°á»i nháº­n (1-1) hoáº·c groupId
  deviceId:    number; // default 1
  plaintext:   string;
  replyToId?:  string;
}

/**
 * Gá»­i tin nháº¯n ÄÆ°á»£c mÃ£ hÃ³a E2EE
 */
export async function sendEncryptedMessage(opts: SendOptions) {
  const { convId, convType, recipientId, plaintext, replyToId } = opts;
  const deviceId = opts.deviceId ?? 1;

  let encryptedBody: string;
  let msgType = 1; // PreKeyWhisperMessage hoáº·c WhisperMessage

  try {
    // Kiá»m tra ÄÃ£ cÃ³ session chÆ°a
    const needsBundle = !hasSession(recipientId, deviceId);

    let recipientBundle;
    if (needsBundle) {
      // Fetch public keys cá»§a ngÆ°á»i nháº­n tá»« server
      recipientBundle = await api.getE2eeKeys(recipientId);
    }

    // Encrypt
    const encrypted = await encryptMessage(
      recipientId,
      deviceId,
      plaintext,
      needsBundle ? recipientBundle : undefined,
    );

    encryptedBody = encrypted.body;
    msgType       = encrypted.type;

    // Check náº¿u server bÃ¡o prekeys gáº§n háº¿t â upload thÃªm
    if (recipientBundle?.lowPreKeys) {
      replenishPreKeys().catch(() => {}); // background, khÃ´ng block gá»­i
    }

  } catch (error) {
    // Fallback: náº¿u E2EE fail â KHÃNG gá»­i plaintext
    // ThÃ´ng bÃ¡o lá»i Äá» user biáº¿t
    throw new Error('E2EE encryption failed. Message not sent.');
  }

  // Gá»­i ciphertext lÃªn server
  const body = {
    content:    encryptedBody,   // ciphertext
    msgType:    'text',
    e2eeType:   msgType,         // 1 = PreKey, 2 = normal
    encrypted:  true,
    replyToId,
  };

  return convType === 'direct'
    ? api.sendMsg(convId, body)
    : api.sendGroupMsg(convId, body);
}

/**
 * Decrypt tin nháº¯n nháº­n ÄÆ°á»£c
 */
export async function decryptIncomingMessage(
  senderId:   string,
  deviceId:   number,
  ciphertext: string,
  e2eeType:   number,
): Promise<string> {
  try {
    return await decryptMessage(senderId, deviceId, {
      type:        e2eeType,
      body:        ciphertext,
      recipientId: senderId,
      deviceId,
    });
  } catch {
    return '[ð KhÃ´ng thá» giáº£i mÃ£ tin nháº¯n]';
  }
}

/**
 * Upload keys sau khi ÄÄng kÃ½ tÃ i khoáº£n (chá» gá»i 1 láº§n)
 */
export async function setupE2EE() {
  const bundle = await generateAndStoreKeys();
  await api.uploadE2eeKeys(bundle);
  return bundle;
}

/**
 * Upload thÃªm prekeys khi gáº§n háº¿t (< 10 cÃ²n láº¡i)
 */
async function replenishPreKeys() {
  const { generateAndStoreKeys: gen } = await import('./e2ee');
  // Chá» generate thÃªm prekeys, khÃ´ng generate láº¡i identity key
  const { KeyHelper } = await import('@privacyresearch/libsignal-protocol-typescript');
  const { MMKV } = await import('react-native-mmkv');
  const storage = new MMKV({ id: 'e2ee-keys' });

  const startId = (storage.getNumber('lastPreKeyId') ?? 100) + 1;
  const newKeys = [];
  for (let i = 0; i < 50; i++) {
    const preKey = await KeyHelper.generatePreKey(startId + i);
    newKeys.push({
      keyId:     startId + i,
      publicKey: btoa(String.fromCharCode(...new Uint8Array(preKey.keyPair.pubKey))),
    });
  }
  storage.set('lastPreKeyId', startId + 49);
  await api.uploadMoreE2eePreKeys(newKeys);
}
