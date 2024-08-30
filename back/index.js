const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function translateText(inputText, targetLanguage) {
  const prompt = `Translate the following text from its original language to ${targetLanguage}:
  "${inputText}"`;

  try {
    const model = await genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = await response.text();

    return content;
  } catch (error) {
    console.error('Error translating text:', error);
    return 'Error translating text';
  }
}

app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  const translatedText = await translateText(text, targetLanguage);
  res.json({ translatedText });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
