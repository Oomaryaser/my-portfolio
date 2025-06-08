#!/usr/bin/env node
const crypto = require('crypto');
const [password, salt] = process.argv.slice(2);
if (!password || !salt) {
  console.error('Usage: node scripts/hash.js <password> <salt>');
  process.exit(1);
}
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
console.log(hash);
