// Khai báo kiểu "any" cho TOÀN BỘ export thật của @querencia/db (lấy đầy đủ
// từ tất cả file trong packages/db/src/schema/ ngày 17/7/2026).
// Runtime vẫn dùng đúng packages/db/dist/index.js thật - file này chỉ ảnh
// hưởng type-checking lúc compile, tránh lỗi TS2305/TS2883/TS2709.
declare module '@querencia/db' {
  // users.ts
  export const planEnum: any;
  export const users: any;
  export const accounts: any;
  export type User = any;
  export type NewUser = any;
  export const e2eeKeys: any;
  export const e2eePreKeys: any;
  export const userBlocks: any;
  export const userReports: any;

  // cui-bap.ts
  export const cbMemberRoleEnum: any;
  export const cbMsgTypeEnum: any;
  export const cbConversations: any;
  export const cbMessages: any;
  export const cbGroups: any;
  export const cbGroupMembers: any;
  export const cbGroupMessages: any;
  export const cbReactions: any;
  export const cbGroupReactions: any;
  export const cbReadReceipts: any;
  export const cbPolls: any;
  export const cbPollVotes: any;
  export const cbUserSettings: any;

  // messages.ts
  export const conversations: any;
  export const conversationMembers: any;
  export const messages: any;

  // nope.ts
  export const nopePosts: any;
  export const nopeComments: any;
  export const nopeThanks: any;
  export const nopeSaves: any;
  export const nopeFollows: any;
  export const nopeReports: any;

  // payments.ts
  export const subscriptionStatusEnum: any;
  export const subscriptions: any;
  export const qTypeEnum: any;
  export const qTokens: any;
  export const qUsageLogs: any;
  export const proOrders: any;
  export const qPool: any;

  // tools.ts
  export const toolTierEnum: any;
  export const tools: any;
  export const toolUsageLogs: any;
  export const flashcardDecks: any;
  export const flashcardCards: any;
  export const vaultFiles: any;

  // vectors.ts
  export const embeddings: any;

  // vocab.ts
  export const vocabSets: any;

  // DB type dùng trong @Inject(DB_TOKEN) private db: DB
  export type DB = any;
}
