/**
 * E2EE Key Server — chỉ lưu public keys, KHÔNG bao giờ thấy private keys
 * 
 * Endpoints:
 *   POST /e2ee/keys           → upload public key bundle khi đăng ký
 *   GET  /e2ee/keys/:userId   → fetch public keys của người nhận
 *   POST /e2ee/keys/prekeys   → upload thêm one-time prekeys khi gần hết
 *   DELETE /e2ee/keys/prekey/:keyId → xóa prekey đã dùng
 */
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { DB } from '@querencia/db';
import { DB_TOKEN } from '../../database/database.module';
import { e2eeKeys, e2eePreKeys } from '@querencia/db';

@Injectable()
export class E2eeService {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  // Upload initial key bundle sau khi đăng ký
  async uploadKeyBundle(userId: string, bundle: {
    registrationId: number;
    identityKey:    string;
    signedPreKey:   { keyId: number; publicKey: string; signature: string };
    oneTimePreKeys: { keyId: number; publicKey: string }[];
  }) {
    // Upsert identity key
    await this.db.insert(e2eeKeys).values({
      userId,
      registrationId:   bundle.registrationId,
      identityKey:      bundle.identityKey,
      signedPreKeyId:   bundle.signedPreKey.keyId,
      signedPreKey:     bundle.signedPreKey.publicKey,
      signedPreKeySig:  bundle.signedPreKey.signature,
    }).onConflictDoUpdate({
      target: e2eeKeys.userId,
      set: {
        registrationId:  bundle.registrationId,
        identityKey:     bundle.identityKey,
        signedPreKeyId:  bundle.signedPreKey.keyId,
        signedPreKey:    bundle.signedPreKey.publicKey,
        signedPreKeySig: bundle.signedPreKey.signature,
        updatedAt:       new Date(),
      },
    });

    // Insert one-time prekeys
    if (bundle.oneTimePreKeys.length > 0) {
      await this.db.insert(e2eePreKeys).values(
        bundle.oneTimePreKeys.map(pk => ({
          userId,
          keyId:     pk.keyId,
          publicKey: pk.publicKey,
        }))
      ).onConflictDoNothing();
    }

    return { ok: true, preKeysUploaded: bundle.oneTimePreKeys.length };
  }

  // Fetch public key bundle của người nhận — server consume 1 one-time prekey
  async getKeyBundle(requesterId: string, targetUserId: string) {
    const identity = await this.db.query.e2eeKeys.findFirst({
      where: eq(e2eeKeys.userId, targetUserId),
    });
    if (!identity) {
      throw new NotFoundException('Người dùng chưa setup E2EE');
    }

    // Lấy và xóa 1 one-time prekey (single use)
    const oneTimePreKey = await this.db.query.e2eePreKeys.findFirst({
      where: and(
        eq(e2eePreKeys.userId, targetUserId),
        eq(e2eePreKeys.used, false),
      ),
    });

    if (oneTimePreKey) {
      // Mark as used
      await this.db.update(e2eePreKeys)
        .set({ used: true, usedAt: new Date() })
        .where(eq(e2eePreKeys.id, oneTimePreKey.id));
    }

    // Cảnh báo nếu prekeys gần hết (< 10)
    const remaining = await this.db.query.e2eePreKeys.findMany({
      where: and(
        eq(e2eePreKeys.userId, targetUserId),
        eq(e2eePreKeys.used, false),
      ),
    });

    return {
      registrationId: identity.registrationId,
      identityKey:    identity.identityKey,
      signedPreKey: {
        keyId:     identity.signedPreKeyId,
        publicKey: identity.signedPreKey,
        signature: identity.signedPreKeySig,
      },
      oneTimePreKey: oneTimePreKey
        ? { keyId: oneTimePreKey.keyId, publicKey: oneTimePreKey.publicKey }
        : undefined,
      // Nhắc client upload thêm prekeys
      lowPreKeys: remaining.length < 10,
      remainingPreKeys: remaining.length,
    };
  }

  // Upload thêm prekeys khi gần hết
  async uploadMorePreKeys(userId: string, preKeys: { keyId: number; publicKey: string }[]) {
    await this.db.insert(e2eePreKeys).values(
      preKeys.map(pk => ({ userId, keyId: pk.keyId, publicKey: pk.publicKey }))
    ).onConflictDoNothing();
    return { ok: true, uploaded: preKeys.length };
  }
}
