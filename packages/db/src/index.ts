ï»¿export * from './schema/users';
export * from './schema/nope';
export * from './schema/cui-bap';
export * from './schema/tools';
export * from './schema/payments';
export * from './schema/vectors';

// DB type
import { drizzle } from 'drizzle-orm/node-postgres';
import * as usersSchema    from './schema/users';
import * as nopeSchema     from './schema/nope';
import * as cuiBapSchema   from './schema/cui-bap';
import * as toolsSchema    from './schema/tools';
import * as paymentsSchema from './schema/payments';
import * as vectorsSchema  from './schema/vectors';

const schema = {
  ...usersSchema,
  ...nopeSchema,
  ...cuiBapSchema,
  ...toolsSchema,
  ...paymentsSchema,
  ...vectorsSchema,
};

export type DB = ReturnType<typeof drizzle<typeof schema>>;