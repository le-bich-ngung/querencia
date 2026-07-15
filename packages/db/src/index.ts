export * from './schema/users';
export * from './schema/nope';
export * from './schema/cui-bap';
export * from './schema/messages';
export * from './schema/tools';
export * from './schema/payments';
export * from './schema/vectors';
export * from './schema/vocab';

// DB type
import { drizzle } from 'drizzle-orm/node-postgres';
import * as usersSchema    from './schema/users';
import * as nopeSchema     from './schema/nope';
import * as cuiBapSchema   from './schema/cui-bap';
import * as messagesSchema from './schema/messages';
import * as toolsSchema    from './schema/tools';
import * as paymentsSchema from './schema/payments';
import * as vectorsSchema  from './schema/vectors';
import * as vocabSchema    from './schema/vocab';

const schema = {
  ...usersSchema,
  ...nopeSchema,
  ...cuiBapSchema,
  ...messagesSchema,
  ...toolsSchema,
  ...paymentsSchema,
  ...vectorsSchema,
  ...vocabSchema,
};

export type DB = ReturnType<typeof drizzle<typeof schema>>;
