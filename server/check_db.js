const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
    console.log("Connected!");
    conn.end();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
test();
