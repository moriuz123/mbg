const postgres = require('postgres');
const sql = postgres('postgres://postgres:postgres@localhost:5432/mbg');
async function run() {
  const users = await sql`SELECT username, role, sppg_id FROM "user" WHERE username = 'sppg5'`;
  console.log(users);
  process.exit(0);
}
run();
