/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Gemini SDK with telemetry header requested in the system skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

interface ChatPayload {
  message: string;
  chatHistory: Array<{ role: 'user' | 'model'; content: string }>;
  financialContext: {
    income: number;
    savings: number;
    expensesList: Array<{ name: string; amount: number }>;
    debts: Array<{ name: string; amount: number; rate: number }>;
    emergencyFund: number;
    sipAmount: number;
  };
}

// Secure server-side Gemini API prompt endpoint in Hindi
app.post('/api/gemini/coach', async (req, res): Promise<any> => {
  try {
    const { message, chatHistory, financialContext } = req.body as ChatPayload;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')) {
      return res.status(200).json({
        response: "नमस्ते! ऐसा लगता है कि आपने अभी तक अपना Gemini API Key सेट नहीं किया है। कृपया बगल में दिए गए **Settings > Secrets** पैनल में `GEMINI_API_KEY` को स्थापित करें ताकि मैं आपकी वित्तीय स्थिति की गहराई से समीक्षा कर सकूं। तब तक, आप हमारे अन्य सभी इंटरएक्टिव टूल का पूरी तरह उपयोग कर सकते हैं!"
      });
    }

    // Build standard prompt with script concepts
    const systemPrompt = `आप एक विशेषज्ञ वित्तीय सलाहकार (AI Smart Money Coach) हैं, जो "बचत बनाम निवेश" सिद्धांत में पारंगत हैं। आपका मुख्य उद्देश्य उपयोगकर्ताओं को समझाना है कि बैंक बचत खातों (3-4% ब्याज) में पड़ा पैसा वास्तव में महंगाई (6-7% दर) के कारण धीरे-धीरे मूल्य खो रहा है (अमीर बनने का भ्रम), और उन्हें व्यवस्थित निवेश (SIP) एवं 50-30-20 नियम के माध्यम से अमीर बनाने की दिशा में स्टेप-बाय-स्टेप मार्गदर्शन देना है।

आपसे पूछे गए प्रश्नों का उत्तर मुख्य रूप से हिंदी भाषा (देवनागरी लिपि) में और बहुत ही स्पष्ट, उत्साहवर्धक, तथा सहायक शब्दों में दें।
चर्चा में निम्नलिखित मुख्य 8 चरणों को केंद्र में रखें (विशेष रूप से चरण 3 और चरण 6 सबसे महत्वपूर्ण हैं):
1. असली वित्तीय तस्वीर देखना (Income vs Expenses)
2. कम से कम 3-6 महीने का इमरजेंसी फंड बनाना
3. क्रेडिट कार्ड और महंगे कर्ज को खत्म करना (नियम: उच्च ब्याज वाले डेब्ट को पहले चुकाएं, क्योंकि म्यूचुअल फंड के 12% से ज्यादा क्रेडिट कार्ड का 36% ब्याज आपको गरीब बनाएगा।)
4. पहले स्वयं को भुगतान करें (Pay yourself first)
5. म्यूचुअल फंड SIP, गोल्ड ETF और स्टॉक जैसे ऑप्शंस को समझना
6. 50-30-20 के बजट नियम को समझकर लागू करना (50% आवश्यकताएं, 30% इच्छाएं, 20% निवेश)
7. एसआईपी (SIP) और ऑटो-डेबिट को क्रियान्वित करना
8. दीर्घकालिक धैर्य रखना (Patience)

उपयोगकर्ता की वर्तमान वित्तीय स्थिति यह है:
- मासिक आय: ₹${financialContext.income}
- वर्तमान मासिक बचत: ₹${financialContext.savings}
- प्रमुख मासिक खर्च सूची: ${JSON.stringify(financialContext.expensesList)}
- सक्रिय कर्ज़: ${financialContext.debts.length > 0 ? financialContext.debts.map(d => `${d.name} (${d.amount} रुपये, ब्याज दर ${d.rate}%)`).join(', ') : 'कोई कर्ज़ नहीं'}
- इमरजेंसी फंड लक्ष्य की स्थिति: ₹${financialContext.emergencyFund} (खर्चों का 3-6 गुना)
- नियोजित/सक्रिय एसआईपी (SIP): ₹${financialContext.sipAmount} प्रति माह

उपयोगकर्ता के पिछले संवाद और नए सवाल का जवाब दें। अपनी भाषा में जटिल वित्तीय शब्दों को बेहद साधारण उदाहरणों से समझाएं। यदि उपयोगकर्ता ने कोई प्रश्न नहीं किया है और पहली बार सलाह मांग रहा है, तो उनकी दी गई वित्तीय स्थिति का गहन विश्लेषण करके एक अनुकूलित "स्मार्ट मनी रिपोर्ट" हिंदी में प्रस्तुत करें।`;

    // Map conversation history to Gemini format
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: msg.content }]
    }));

    // Add current user prompt as the latest turn
    contents.push({
      role: 'user' as const,
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    res.status(500).json({
      error: "AI कोच प्रतिक्रिया जनरेट करने में असमर्थ था। कृपया पुनः प्रयास करें।",
      details: error.message
    });
  }
});

// App initialization logic with Vite middleware support
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express Server booted successfully on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
