import app from './app';

import { connectDB } from './config/db';

connectDB().then(() => app.listen(PORT));
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
