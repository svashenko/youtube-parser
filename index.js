import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import App from './app/App.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'app/public/')));


// await App('https://www.youtube.com/watch?v=bD1wWY1YD-M');
// await App('https://www.youtube.com/watch?v=Q9Ao_V8-USs');
// await App('https://www.youtube.com/watch?v=qQwmNdYS6W0');


app.post('/process', async (req, res) => {
  const { link } = req.body;
  if (!link) return res.status(400).json({ error: 'Link is required' });

  try {
    const result = await App(link);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));