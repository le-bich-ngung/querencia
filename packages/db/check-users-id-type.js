// check-users-id-type.js
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error('❌ Thiếu DATABASE_URL.'); process.exit(1); }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const res = await client.query(`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id';
  `);
  console.log('Kiểu cột users.id thật trên DB:');
  console.log(res.rows);

  await client.end();
}
main().catch(err => { console.error('❌ Lỗi:', err.message); process.exit(1); });
