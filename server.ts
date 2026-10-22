import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const PORT = Number(process.env.PORT) || 3000;

  // Initialize Gemini AI SDK if API key is present
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API routes
  app.post('/api/ai/parse-quiz', async (req, res) => {
    try {
      const { text, prompt } = req.body;
      if (!ai) {
        return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY trên server.' });
      }

      const systemInstruction = `Bạn là một trợ lý giáo dục AI chuyên nghiệp. Hãy phân tích văn bản hoặc yêu cầu của giáo viên để tạo danh sách câu hỏi trắc nghiệm chuẩn xác.
Hỗ trợ 3 loại câu hỏi:
1. 'multiple_choice': Trắc nghiệm 4 lựa chọn (A, B, C, D). Có 4 options, correctAnswer là index của đáp án đúng (0, 1, 2, 3) hoặc chữ cái ('A', 'B', 'C', 'D').
2. 'true_false': Đúng / Sai. correctAnswer là true hoặc false.
3. 'fill_in_blank': Điền khuyết. correctAnswer là chuỗi đáp án chính xác hoặc các cách viết chấp nhận được.

Hãy trả về kết quả DUY NHẤT dưới định dạng JSON hợp lệ (không kèm markdown thừa code block nếu có thể, hoặc bọc trong json code block), theo cấu trúc mảng sau:
[
  {
    "type": "multiple_choice",
    "content": "Nội dung câu hỏi...",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": 0,
    "explanation": "Giải thích chi tiết vì sao đáp án này đúng..."
  },
  {
    "type": "true_false",
    "content": "Phát biểu đúng hay sai...",
    "correctAnswer": true,
    "explanation": "Giải thích..."
  },
  {
    "type": "fill_in_blank",
    "content": "Thủ đô của Việt Nam là [điền từ]?",
    "correctAnswer": "Hà Nội",
    "explanation": "Hà Nội là thủ đô..."
  }
]`;

      const userPrompt = text ? `Phân tích đoạn văn bản sau thành danh sách câu hỏi trắc nghiệm:\n\n${text}` : prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Không nhận được phản hồi từ AI.');
      }

      const parsedData = JSON.parse(responseText);
      res.json({ success: true, questions: parsedData });
    } catch (error: any) {
      console.error('AI Parse Quiz Error:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi xử lý AI' });
    }
  });

  app.post('/api/ai/generate-quiz', async (req, res) => {
    try {
      const { topic, grade, count, types } = req.body;
      if (!ai) {
        return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY trên server.' });
      }

      const prompt = `Tạo một đề kiểm tra gồm ${count || 10} câu hỏi về chủ đề "${topic}" dành cho học sinh lớp ${grade || '10'}.
Bao gồm các loại câu hỏi: ${types ? types.join(', ') : 'trắc nghiệm 4 lựa chọn, đúng sai, điền khuyết'}.
Hãy trả về JSON thuần túy (không giải thích ngoài lề) theo đúng cấu trúc mảng JSON các câu hỏi như sau:
[
  {
    "type": "multiple_choice",
    "content": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "..."
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('AI không phản hồi');

      const parsedData = JSON.parse(responseText);
      res.json({ success: true, questions: parsedData });
    } catch (error: any) {
      console.error('AI Generate Quiz Error:', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi tạo đề AI' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuizMaster Pro server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
