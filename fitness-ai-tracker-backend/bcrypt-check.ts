import bcrypt from 'bcryptjs';

const hash = '$2b$10$.wUjWwX/QS/M5PjQBCL4.uGllpaY8IwJ0cFD9sE.Ox9gd.mefcceK';
const password = 'test123';

bcrypt.compare(password, hash).then((result) => {
  console.log('✅ Match:', result); // should be true
});
