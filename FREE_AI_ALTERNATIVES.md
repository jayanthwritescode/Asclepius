# 🆓 Free AI API Alternatives for MedScribe AI

## ✅ Current Setup: Using Groq (100% FREE!)

Your project now uses **Groq** for both:
1. **Whisper transcription** (audio → text)
2. **Llama 3.1 70B** (chat completions & documentation)

### Why Groq?
- ✅ **Completely FREE** - Generous free tier
- ✅ **Extremely Fast** - Fastest inference available (18x faster than others)
- ✅ **High Quality** - Llama 3.1 70B rivals GPT-4 and Claude
- ✅ **Medical-Ready** - Excellent for medical applications
- ✅ **Already in Project** - You're already using it for Whisper!

### Get Your Free Groq API Key
1. Visit: https://console.groq.com/
2. Sign up (free)
3. Go to "API Keys"
4. Create new key
5. Copy and paste into `.env.local`

```env
GROQ_API_KEY=gsk_your_free_key_here
```

That's it! One API key for everything! 🎉

---

## 🔄 Other Free Alternatives (If Needed)

### 1. **Google Gemini 1.5 Flash** ⭐ Recommended Alternative
- **Free Tier**: 15 requests/min, 1M requests/day
- **Quality**: Excellent, comparable to Claude
- **Context**: 1M token context window
- **Setup**: https://ai.google.dev/

**To use Gemini instead:**
```bash
npm install @google/generative-ai
```

Create `lib/gemini.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateChatCompletion(messages, options) {
  const chat = model.startChat()
  const result = await chat.sendMessage(messages[messages.length - 1].content)
  return result.response.text()
}
```

### 2. **OpenRouter** - Multiple Free Models
- **Free Models**: Llama 3.1, Mistral, Gemma, etc.
- **Fallback**: Auto-switches if one model fails
- **Setup**: https://openrouter.ai/

```bash
npm install openai # OpenRouter uses OpenAI SDK
```

```typescript
import OpenAI from 'openai'

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Use free models
const response = await openrouter.chat.completions.create({
  model: 'meta-llama/llama-3.1-70b-instruct:free',
  messages: messages,
})
```

### 3. **Hugging Face Inference API**
- **Free Tier**: Limited but usable
- **Models**: Many open-source options
- **Setup**: https://huggingface.co/inference-api

```bash
npm install @huggingface/inference
```

```typescript
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_API_KEY)

const response = await hf.textGeneration({
  model: 'meta-llama/Llama-2-70b-chat-hf',
  inputs: prompt,
})
```

### 4. **Together AI**
- **Free Credits**: $25 free credits on signup
- **Models**: Llama, Mixtral, etc.
- **Setup**: https://together.ai/

```bash
npm install together-ai
```

### 5. **Replicate**
- **Free Tier**: Limited free usage
- **Models**: Many open-source models
- **Setup**: https://replicate.com/

---

## 📊 Comparison Table

| Provider | Free Tier | Speed | Quality | Medical Use | Setup |
|----------|-----------|-------|---------|-------------|-------|
| **Groq** ⭐ | Generous | ⚡ Fastest | Excellent | ✅ Great | Easy |
| Gemini Flash | 1M/day | Fast | Excellent | ✅ Great | Easy |
| OpenRouter | Limited | Medium | Good | ✅ Good | Easy |
| Hugging Face | Limited | Slow | Varies | ⚠️ OK | Medium |
| Together AI | $25 credits | Fast | Good | ✅ Good | Easy |

---

## 🎯 Recommended Setup (Current)

### Single API Key Solution: Groq
```env
# .env.local
GROQ_API_KEY=gsk_your_free_key_here
```

**Benefits:**
- ✅ One API key for everything
- ✅ Completely free
- ✅ Fastest inference
- ✅ Great quality
- ✅ Simple setup

---

## 🔧 How to Switch Providers

### Current: Groq (Default)
Already set up! Just add your Groq API key.

### Switch to Gemini:
1. Install: `npm install @google/generative-ai`
2. Create `lib/gemini.ts` (see above)
3. Update API routes to import from `@/lib/gemini`
4. Add `GEMINI_API_KEY` to `.env.local`

### Switch to OpenRouter:
1. Already have OpenAI SDK installed
2. Update `lib/groq.ts` to use OpenRouter endpoint
3. Add `OPENROUTER_API_KEY` to `.env.local`

---

## 💡 Pro Tips

### 1. Use Groq for Speed
Groq is 18x faster than other providers - perfect for real-time chat!

### 2. Fallback Strategy
```typescript
async function generateWithFallback(messages) {
  try {
    return await groqGenerate(messages)
  } catch (error) {
    console.log('Groq failed, trying Gemini...')
    return await geminiGenerate(messages)
  }
}
```

### 3. Rate Limiting
Free tiers have limits. Implement rate limiting:
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### 4. Caching
Cache common responses to reduce API calls:
```typescript
const cache = new Map()

async function generateWithCache(prompt) {
  if (cache.has(prompt)) {
    return cache.get(prompt)
  }
  const response = await generate(prompt)
  cache.set(prompt, response)
  return response
}
```

---

## 🆘 Troubleshooting

### "Rate limit exceeded"
- Wait a few minutes
- Implement caching
- Use multiple API keys (rotate)
- Switch to different provider

### "API key invalid"
- Check `.env.local` file exists
- Verify key is correct
- Restart dev server after changing `.env.local`

### "Model not found"
- Check model name spelling
- Verify model is available in free tier
- Try different model

---

## 📚 Resources

- **Groq Docs**: https://console.groq.com/docs
- **Gemini Docs**: https://ai.google.dev/docs
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Model Comparison**: https://artificialanalysis.ai/

---

## ✅ Current Project Status

Your MedScribe AI now uses:
- ✅ **Groq Whisper** for transcription (FREE)
- ✅ **Groq Llama 3.1 70B** for chat & documentation (FREE)
- ✅ **One API key** for everything
- ✅ **No paid services required**

**Total Cost: $0** 🎉

---

## 🚀 Next Steps

1. Get your free Groq API key: https://console.groq.com/
2. Add to `.env.local`:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```
3. Run `npm install`
4. Run `npm run dev`
5. Start building! 🎉

**You're all set with 100% free AI!** 🆓✨
