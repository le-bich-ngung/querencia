ï»¿/**
 * E2EE Key Server â chá» lÆ°u public keys, KHÃNG bao giá» tháº¥y private keys
 * 
 * Endpoints:
 *   POST /e2ee/keys           â upload public key bundle khi ÄÄng kÃ½
 *   GET  /e2ee/keys/:userId   â fetch public keys cá»§a ngÆ°á»i nháº­n
 *   POST /e2ee/keys/prekeys   â upload thÃªm one-time prekeys khi gáº§n háº¿t
 *   DELETE /e2ee/keys/prekey/:keyId â xÃ³a prekey ÄÃ£ dÃ¹ng
 */
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { DB } from '@querencia/db';
import { DB_TOKEN } from '../../database/database.module';
import { e2eeKeys, e2eePreKeys } from '@querencia/db';

@Injectable()
export class E2eeService {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  // Upload initial key bundle sau khi ÄÄng kÃ½
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

  // Fetch public key bundle cá»§a ngÆ°á»i nháº­n â server consume 1 one-time prekey
  async getKeyBundle(requesterId: string, targetUserId: string) {
    const identity = await this.db.query.e2eeKeys.findFirst({
      where: eq(e2eeKeys.userId, targetUserId),
    });
    if (!identity) {
      throw new NotFoundException('NgÆ°á»i dÃ¹ng chÆ°a setup E2EE');
    }

    // Láº¥y vÃ  xÃ³a 1 one-time prekey (single use)
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

    // Cáº£nh bÃ¡o náº¿u prekeys gáº§n háº¿t (< 10)
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
      // Nháº¯c client upload thÃªm prekeys
      lowPreKeys: remaining.length < 10,
      remainingPreKeys: remaining.length,
    };
  }

  // Upload thÃªm prekeys khi gáº§n háº¿t
  async uploadMorePreKeys(userId: string, preKeys: { keyId: number; publicKey: string }[]) {
    await this.db.insert(e2eePreKeys).values(
      preKeys.map(pk => ({ userId, keyId: pk.keyId, publicKey: pk.publicKey }))
    ).onConflictDoNothing();
    return { ok: true, uploaded: preKeys.length };
  }
}
