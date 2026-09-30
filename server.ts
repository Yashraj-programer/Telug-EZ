import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  handleMakeEz,
  handleCheckAnswer,
  handleQuestionDecoder,
  handleDoubt,
} from './src/server/aiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Status check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Telugu EZ',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// API Routes
app.post('/api/ai/make-ez', async (req, res) => {
  try {
    const result = await handleMakeEz(req.body);
    res.json(result);
  } catch (error) {
    console.error('Make EZ route error:', error);
    res.status(500).json({ error: 'Failed to process Make EZ request' });
  }
});

app.post('/api/ai/explain', async (req, res) => {
  try {
    const result = await handleMakeEz(req.body);
    res.json(result);
  } catch (error) {
    console.error('Explain route error:', error);
    res.status(500).json({ error: 'Failed to process Explain request' });
  }
});

app.post('/api/ai/check-answer', async (req, res) => {
  try {
    const result = await handleCheckAnswer(req.body);
    res.json(result);
  } catch (error) {
    console.error('Check answer route error:', error);
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

app.post('/api/ai/question-decoder', async (req, res) => {
  try {
    const result = await handleQuestionDecoder(req.body);
    res.json(result);
  } catch (error) {
    console.error('Question decoder route error:', error);
    res.status(500).json({ error: 'Failed to decode question' });
  }
});

app.post('/api/ai/doubt', async (req, res) => {
  try {
    const result = await handleDoubt(req.body);
    res.json(result);
  } catch (error) {
    console.error('Doubt route error:', error);
    res.status(500).json({ error: 'Failed to process doubt' });
  }
});

// Serve frontend in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

if (process.env.NODE_ENV === 'production' || !process.env.VITE_DEV_SERVER) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Telugu EZ server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
