# MedScribe AI - Modern Medical AI Assistant

A comprehensive medical AI assistant combining post-consultation documentation, pre-consultation history collection, and patient-facing digital health assistance.

## 🚀 Features

### For Doctors
- **Post-Consultation Documentation**: Generate SOAP notes, ICD-10/CPT codes, prescriptions, and patient education materials from consultation recordings
- **Pre-Consultation Review**: Review patient-collected histories with AI-generated summaries and risk assessments
- **Real-time Transcription**: Live recording with speaker diarization during consultations

### For Patients
- **Pre-Consultation History Collection**: Conversational chatbot that collects medical history before appointments
- **Digital Health Assistant**: Explain medical reports, schedule appointments, medication reminders, and symptom checking
- **Multi-language Support**: English, Hindi, Tamil, Telugu, Bengali

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **AI**: Llama 3.3 70B via Groq (100% FREE)
- **Speech**: Web Speech API, Groq Whisper
- **State**: React Context + Zustand
- **Storage**: Local Storage (demo mode)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackxgod
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com/
- `GROQ_API_KEY`: Get from https://console.groq.com/

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
/app
  /(dashboard)
    /page.tsx                          # Main dashboard with role selection
    /doctor
      /documentation/page.tsx          # Post-consultation SOAP notes
      /pre-consultation/page.tsx       # Review patient history
    /patient
      /assistant/page.tsx              # Patient chatbot interface
      /history/page.tsx                # Pre-consultation history collection
  /api
    /transcribe/route.ts               # Whisper transcription endpoint
    /generate-docs/route.ts            # Documentation generation
    /chat/route.ts                     # Chat completions
    /patient-history/route.ts          # Patient history management
/components
  /ui                                  # shadcn components
  /chat                                # Chat interface components
  /audio                               # Audio recording components
  /medical                             # Medical-specific components
/lib
  /anthropic.ts                        # Claude API client
  /groq.ts                             # Whisper transcription
  /medical-prompts.ts                  # All AI prompts
  /types.ts                            # TypeScript types
  /utils.ts                            # Utility functions
```

## 🎯 Usage

### Doctor Workflow
1. Select "Doctor" role from dashboard
2. Choose between:
   - **Documentation**: Record/upload consultation audio → Generate SOAP notes
   - **Pre-Consultation**: Review patient histories collected via chatbot

### Patient Workflow
1. Select "Patient" role from dashboard
2. Choose between:
   - **History Collection**: Complete pre-consultation questionnaire via chatbot
   - **Digital Assistant**: Get help with reports, appointments, medications

## 🔒 Privacy & Security

- HIPAA compliance considerations throughout
- No audio stored on servers (client-side processing)
- Session timeouts for security
- Clear privacy disclaimers
- Data encryption indicators

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t medscribe-ai .
docker run -p 3000:3000 medscribe-ai
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📧 Support

For support, email support@medscribe.ai or open an issue.
# Asclepius
