# 🚀 MedScribe AI - Quick Start

Get your medical AI assistant running in 5 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/jayanth/Desktop/hackxgod
npm install
```

This installs all required packages. Grab a coffee while it runs! ☕

## Step 2: Get API Keys (2 minutes)

### Groq API Key (FREE - for both Whisper & Llama 3.3)
1. Visit: https://console.groq.com/
2. Sign up/Login
3. Go to "API Keys"
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

## Step 3: Configure Environment (1 minute)

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your keys:

```env
GROQ_API_KEY=gsk_your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_DEMO_MODE=true
```

## Step 4: Run the App! (30 seconds)

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

## 🎉 You're Done!

### What You Can Do Now:

#### As a Doctor:
1. Click "I'm a Doctor"
2. Record a consultation or upload audio
3. Get instant SOAP notes with ICD-10/CPT codes
4. Export documentation

#### As a Patient:
1. Click "I'm a Patient"
2. Chat with the AI assistant
3. Get help with medical reports
4. Schedule appointments

## 🆘 Troubleshooting

### "Module not found" errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### API errors?
- Check your API keys in `.env.local`
- Make sure they start with `sk-ant-` and `gsk_`
- Restart the dev server after changing `.env.local`

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed documentation
- Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for feature status
- Customize medical prompts in `lib/medical-prompts.ts`
- Add your branding and styling

## 🎯 Key Features

✅ **Working Now:**
- Landing page with role selection
- Doctor documentation generation
- Audio recording and transcription
- SOAP notes with medical codes
- Beautiful UI with dark mode

🚧 **Coming Soon:**
- Pre-consultation patient chatbot
- Doctor review dashboard
- Patient digital assistant
- Demo data and examples

## 💡 Tips

1. **Demo Mode**: Set `NEXT_PUBLIC_DEMO_MODE=true` to enable demo features
2. **Voice Input**: Allow microphone access when prompted
3. **Dark Mode**: Toggle with the moon/sun icon in the header
4. **Mobile**: Fully responsive - works on phones and tablets

## 🔒 Security Note

This is a development setup. For production:
- Use HTTPS only
- Add authentication
- Implement rate limiting
- Review HIPAA compliance
- Set up proper database
- Add monitoring and logging

## 📞 Need Help?

- Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Review error messages in the terminal
- Check browser console for frontend errors
- Ensure API keys are valid

---

**Happy Coding! 🚀**

Built with ❤️ using Next.js, Llama 3.3 70B, and Groq Whisper (100% FREE!)
