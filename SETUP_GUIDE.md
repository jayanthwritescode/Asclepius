# MedScribe AI - Complete Setup Guide

This guide will help you set up and run the MedScribe AI medical assistant application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Groq API key (for both Llama 3.3 70B & Whisper - 100% FREE!)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/jayanth/Desktop/hackxgod
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Anthropic SDK
- Groq SDK
- Zustand (state management)
- Framer Motion (animations)
- And more...

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Groq API Key (FREE!) - for both Llama 3.3 70B & Whisper
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Demo Mode (set to 'true' to enable demo features)
NEXT_PUBLIC_DEMO_MODE=true
```

#### Getting API Keys:

**Groq API Key (Only one needed!):**
1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

The application will start at http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
/Users/jayanth/Desktop/hackxgod/
├── app/
│   ├── (dashboard)/
│   │   └── page.tsx                    # Main landing page
│   ├── doctor/
│   │   ├── documentation/page.tsx      # Post-consultation docs
│   │   └── pre-consultation/page.tsx   # Review patient histories
│   ├── patient/
│   │   ├── assistant/page.tsx          # Patient digital assistant
│   │   └── history/page.tsx            # Pre-consultation chatbot
│   ├── api/
│   │   ├── transcribe/route.ts         # Audio transcription
│   │   ├── generate-docs/route.ts      # Documentation generation
│   │   └── chat/route.ts               # Chat completions
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Global styles
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── audio/                          # Audio recording components
│   ├── chat/                           # Chat interface components
│   └── medical/                        # Medical-specific components
├── lib/
│   ├── anthropic.ts                    # Claude API client
│   ├── groq.ts                         # Whisper transcription
│   ├── medical-prompts.ts              # All AI prompts
│   ├── types.ts                        # TypeScript types
│   ├── utils.ts                        # Utility functions
│   └── store.ts                        # Zustand state management
├── public/                             # Static assets
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── tailwind.config.ts                  # Tailwind config
├── next.config.js                      # Next.js config
└── README.md                           # Project documentation
```

## 🎯 Features Overview

### 1. Post-Consultation Documentation (Doctor)
- **Path:** `/doctor/documentation`
- **Features:**
  - Record consultation audio in real-time
  - Upload existing audio files
  - Automatic transcription using Groq Whisper
  - Generate SOAP notes with Claude Sonnet 4.5
  - ICD-10 and CPT code suggestions
  - Prescription generation
  - Patient education summaries
  - Export to PDF

### 2. Pre-Consultation History Collection (Patient)
- **Path:** `/patient/history`
- **Features:**
  - Conversational AI chatbot
  - Collects comprehensive medical history
  - Voice input support
  - Multi-language support (English, Hindi, Tamil, Telugu, Bengali)
  - Progress tracking
  - Red flag symptom detection
  - Save and continue later

### 3. Patient Digital Assistant
- **Path:** `/patient/assistant`
- **Features:**
  - Medical report explainer
  - Appointment scheduling
  - Medication reminders
  - Symptom checker (with disclaimers)
  - Health information queries
  - 24/7 availability

## 🔧 Development

### Adding New Components

To add a new shadcn/ui component:

```bash
# Example: Adding a dialog component
npx shadcn-ui@latest add dialog
```

### Customizing Prompts

Edit `/lib/medical-prompts.ts` to customize AI behavior:

```typescript
export const POST_CONSULTATION_PROMPT = `
  // Your custom prompt here
`
```

### State Management

The app uses Zustand for state management. Stores are defined in `/lib/store.ts`:

- `useChatStore` - Chat messages
- `usePatientHistoryStore` - Patient histories
- `useDocumentationStore` - Medical documentation
- `useSettingsStore` - User settings
- `useAudioStore` - Audio recording state
- `useAnalyticsStore` - Usage analytics

### Styling

The app uses Tailwind CSS with custom utilities:

```css
/* Glass morphism effect */
.glass {
  @apply bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl;
}

/* Medical gradient */
.gradient-medical {
  @apply bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600;
}
```

## 🧪 Testing

### Manual Testing Checklist

**Doctor Documentation:**
- [ ] Record audio successfully
- [ ] Upload audio file
- [ ] Transcription completes
- [ ] Edit transcript
- [ ] Generate documentation
- [ ] View SOAP notes
- [ ] Check ICD-10/CPT codes
- [ ] Export PDF

**Patient History:**
- [ ] Start conversation
- [ ] Voice input works
- [ ] Text input works
- [ ] Progress updates
- [ ] Language switching
- [ ] Save and resume
- [ ] Red flag detection

**Patient Assistant:**
- [ ] Chat interface responsive
- [ ] Streaming responses work
- [ ] Different features accessible
- [ ] Disclaimers displayed

## 🚨 Troubleshooting

### Common Issues

**1. API Key Errors**
```
Error: Missing ANTHROPIC_API_KEY
```
**Solution:** Ensure `.env.local` exists and contains valid API keys

**2. Transcription Fails**
```
Error: Failed to transcribe audio
```
**Solution:** 
- Check Groq API key is valid
- Ensure audio file is in supported format
- Check file size (max 25MB)

**3. Build Errors**
```
Error: Cannot find module 'X'
```
**Solution:** Run `npm install` again

**4. Port Already in Use**
```
Error: Port 3000 is already in use
```
**Solution:** 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

### TypeScript Errors

All TypeScript errors shown during development are expected until dependencies are installed. Run:

```bash
npm install
```

Then restart your IDE/editor.

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Note:** Web Speech API and MediaRecorder API required for voice features.

## 🔒 Security & Privacy

### HIPAA Compliance Considerations

1. **Data Encryption:** All API calls use HTTPS
2. **No Server Storage:** Audio files processed in memory only
3. **Session Management:** Automatic timeout after inactivity
4. **Access Control:** Role-based access (doctor/patient)
5. **Audit Logging:** Consider implementing for production

### Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use secure API keys (rotate regularly)
- [ ] Enable HTTPS only
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure CORS properly
- [ ] Add database for persistent storage
- [ ] Implement backup strategy
- [ ] Add logging and monitoring
- [ ] Review and test all security measures

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Docker

```bash
# Build image
docker build -t medscribe-ai .

# Run container
docker run -p 3000:3000 --env-file .env.local medscribe-ai
```

## 📊 Performance Optimization

### Production Optimizations

1. **Image Optimization:** Use Next.js Image component
2. **Code Splitting:** Automatic with Next.js
3. **Caching:** Configure CDN caching headers
4. **Bundle Analysis:**
```bash
npm run build
npx @next/bundle-analyzer
```

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive commit messages

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Check GitHub issues
4. Contact support team

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Groq Documentation](https://console.groq.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 🔄 Updates

To update dependencies:

```bash
npm update
```

To check for outdated packages:

```bash
npm outdated
```

## ✅ Next Steps

After setup:

1. **Test all features** with demo mode enabled
2. **Customize prompts** for your specific use case
3. **Add demo data** for presentations
4. **Configure branding** (logo, colors, etc.)
5. **Set up analytics** to track usage
6. **Plan production deployment**
7. **Implement authentication** for real users
8. **Add database** for persistent storage
9. **Set up monitoring** and error tracking
10. **Review security** measures

---

**Happy Coding! 🚀**

For more information, see the main README.md file.
