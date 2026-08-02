// run-vocab-migration.js
// Chạy đúng 1 file SQL migration (0003_vocab_sets.sql), KHÔNG đụng gì khác.
// Cách chạy:
//   $env:DATABASE_URL = "postgres://..."   (lấy từ `fly ssh console -a querencia -C "printenv DATABASE_URL"`)
//   node run-vocab-migration.js

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ Thiếu DATABASE_URL. Chạy: $env:DATABASE_URL = "postgres://..." trước.');
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, 'src', 'migrations', '0003_vocab_sets.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  console.log('Đang kết nối database...');
  await client.connect();

  console.log('Đang kiểm tra bảng vocab_sets đã tồn tại chưa...');
  const check = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'vocab_sets'
    );
  `);
  if (check.rows[0].exists) {
    console.log('⚠️  Bảng vocab_sets đã tồn tại rồi - không cần chạy migration nữa. Dừng lại, không làm gì thêm.');
    await client.end();
    return;
  }

  console.log('Đang tạo bảng vocab_sets...');
  await client.query(sql);
  console.log('✅ Xong! Bảng vocab_sets đã được tạo.');

  await client.end();
}

main().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
