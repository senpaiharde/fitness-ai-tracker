import bcrypt from 'bcryptjs';

const password = 'slava';
const hash = bcrypt.hashSync(password, 10);

console.log('🔐 New bcryptjs hash:', hash);
 //node generate-hash.js

