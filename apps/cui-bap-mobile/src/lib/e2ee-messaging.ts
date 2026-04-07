/**
 * E2EE Messaging — wrap gửi/nhận tin nhắn với Signal Protocol
 * Tích hợp vào ChatScreen thay thế gọi api.sendMsg trực tiếp
 */
import { encryptMessage, decryptMessage, hasSession, generateAndStoreKeys } from './e2ee';
import { api } from './api';

interface SendOptions {
  convId:      string;
  convType:    'direct' | 'group';
  recipientId: string; // userId của người nhận (1-1) hoặc groupId
  deviceId:    number; // default 1
  plaintext:   string;
  replyToId?:  string;
}

/**
 * Gửi tin nhắn được mã hóa E2EE
 */
export async function sendEncryptedMessage(opts: SendOptions) {
  const { convId, convType, recipientId, plaintext, replyToId } = opts;
  const deviceId = opts.deviceId ?? 1;

  let encryptedBody: string;
  let msgType = 1; // PreKeyWhisperMessage hoặc WhisperMessage

  try {
    // Kiểm tra đã có session chưa
    const needsBundle = !hasSession(recipientId, deviceId);

    let recipientBundle;
    if (needsBundle) {
      // Fetch public keys của người nhận từ server
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

    // Check nếu server báo prekeys gần hết → upload thêm
    if (recipientBundle?.lowPreKeys) {
      replenishPreKeys().catch(() => {}); // background, không block gửi
    }

  } catch (error) {
    // Fallback: nếu E2EE fail → KHÔNG gửi plaintext
    // Thông báo lỗi để user biết
    throw new Error('E2EE encryption failed. Message not sent.');
  }

  // Gửi ciphertext lên server
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
 * Decrypt tin nhắn nhận được
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
    return '[🔒 Không thể giải mã tin nhắn]';
  }
}

/**
 * Upload keys sau khi đăng ký tài khoản (chỉ gọi 1 lần)
 */
export async function setupE2EE() {
  const bundle = await generateAndStoreKeys();
  await api.uploadE2eeKeys(bundle);
  return bundle;
}

/**
 * Upload thêm prekeys khi gần hết (< 10 còn lại)
 */
async function replenishPreKeys() {
  const { generateAndStoreKeys: gen } = await import('./e2ee');
  // Chỉ generate thêm prekeys, không generate lại identity key
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
