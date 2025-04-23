import bcrypt from 'bcryptjs';

const password = 'test123';
const hash = bcrypt.hashSync(password, 10);

console.log('🔐 New bcryptjs hash:', hash);
 //npx ts-node generate-hash.ts
