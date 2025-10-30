'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  MessageSquare,
  Calendar,
  FileText,
  Pill
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useVoiceChat } from '@/lib/use-voice-chat'
import { VoiceWaveform, ListeningIndicator, SpeakingIndicator } from '@/components/voice-waveform'

export default function PatientAssistantVoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang') || 'en-IN'
  
  const greetings: Record<string, string> = {
    'en-IN': "Hello! I'm your digital health assistant. I can help you with explaining medical reports, scheduling appointments, medication reminders, symptom checking, and health information. How can I assist you today?",
    'hi-IN': 'नमस्ते! मैं आपका डिजिटल स्वास्थ्य सहायक हूं। मैं मेडिकल रिपोर्ट समझाने, अपॉइंटमेंट शेड्यूल करने, दवा रिमाइंडर, लक्षण जांच और स्वास्थ्य जानकारी में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'ta-IN': 'வணக்கம்! நான் உங்கள் டிஜிட்டல் சுகாதார உதவியாளர். மருத்துவ அறிக்கைகளை விளக்குதல், சந்திப்புகளை திட்டமிடுதல், மருந்து நினைவூட்டல்கள், அறிகுறி சோதனை மற்றும் சுகாதார தகவல்களில் நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    'te-IN': 'నమస్కారం! నేను మీ డిజిటల్ ఆరోగ్య సహాయకుడిని. వైద్య నివేదికలను వివరించడం, అపాయింట్‌మెంట్‌లు షెడ్యూల్ చేయడం, మందుల రిమైండర్‌లు, లక్షణ తనిఖీ మరియు ఆరోగ్య సమాచారంలో నేను మీకు సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
    'bn-IN': 'নমস্কার! আমি আপনার ডিজিটাল স্বাস্থ্য সহায়ক। আমি মেডিকেল রিপোর্ট ব্যাখ্যা করা, অ্যাপয়েন্টমেন্ট শিডিউল করা, ওষুধের অনুস্মারক, লক্ষণ পরীক্ষা এবং স্বাস্থ্য তথ্যে আপনাকে সাহায্য করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    'mr-IN': 'नमस्कार! मी तुमचा डिजिटल आरोग्य सहाय्यक आहे। मी वैद्यकीय अहवाल समजावून सांगणे, भेटी शेड्यूल करणे, औषध स्मरणपत्रे, लक्षण तपासणी आणि आरोग्य माहितीमध्ये तुम्हाला मदत करू शकतो। आज मी तुम्हाला कशी मदत करू शकतो?',
    'gu-IN': 'નમસ્તે! હું તમારો ડિજિટલ આરોગ્ય સહાયક છું. હું તબીબી અહેવાલો સમજાવવા, મુલાકાતો શેડ્યૂલ કરવા, દવા રીમાઇન્ડર્સ, લક્ષણ તપાસ અને આરોગ્ય માહિતીમાં તમને મદદ કરી શકું છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
    'kn-IN': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ಸಹಾಯಕ. ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ವಿವರಿಸುವುದು, ಭೇಟಿಗಳನ್ನು ನಿಗದಿಪಡಿಸುವುದು, ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು, ರೋಗಲಕ್ಷಣ ಪರಿಶೀಲನೆ ಮತ್ತು ಆರೋಗ್ಯ ಮಾಹಿತಿಯಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
  }
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: greetings[langParam] || greetings['en-IN']
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState(langParam)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const { 
    isListening, 
    isSpeaking, 
    isSupported,
    toggleListening, 
    speak, 
    stopSpeaking 
  } = useVoiceChat({
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text)
      if (isFinal && text.trim()) {
        handleVoiceInput(text.trim())
        setCurrentTranscript('')
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
    language: language
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-speak first message
  useEffect(() => {
    if (messages.length === 1 && !isMuted) {
      setTimeout(() => {
        speak(messages[0].content)
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup: Stop speaking when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      // Force stop all speech
      window.speechSynthesis.cancel()
      stopSpeaking()
    }
  }, [stopSpeaking])

  // Stop listening when component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        recognitionRef.current?.stop()
      }
    }
  }, [isListening])

  const handleVoiceInput = async (userMessage: string) => {
    if (isLoading) return

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          type: 'patient-assistant'
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                assistantMessage += parsed.text
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1].content = assistantMessage
                  return newMessages
                })
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Auto-toggle: Stop listening before AI speaks
      if (isListening) {
        toggleListening()
      }

      // Speak the response if not muted
      if (!isMuted && assistantMessage) {
        await new Promise(resolve => setTimeout(resolve, 500))
        await speak(assistantMessage)
        
        // Auto-toggle: Resume listening after AI finishes speaking
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (!isListening && !isMuted) {
          toggleListening()
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
    setIsMuted(!isMuted)
  }

  const features = [
    { icon: FileText, label: 'Medical Reports', color: 'text-blue-600' },
    { icon: Calendar, label: 'Appointments', color: 'text-purple-600' },
    { icon: Pill, label: 'Medications', color: 'text-green-600' }
  ]

  const languages = [
    { code: 'en-IN', name: 'English', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/patient/assistant')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Voice Mode - Health Assistant</h1>
                <p className="text-sm text-muted-foreground">Your AI health companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-background text-sm"
                disabled={isListening || isSpeaking}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={() => router.push('/patient/assistant')}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Switch to Chat
              </Button>
              <Button variant="outline" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                <p className="text-sm font-medium">{feature.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Voice Interface */}
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Waveform */}
              <div className="w-full h-20 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg overflow-hidden">
                <VoiceWaveform isActive={isListening || isSpeaking} color="#3b82f6" />
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-8">
                <ListeningIndicator isListening={isListening} />
                <SpeakingIndicator isSpeaking={isSpeaking} />
              </div>

              {/* Current Transcript */}
              <AnimatePresence>
                {currentTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <p className="text-sm text-muted-foreground mb-1">You're saying:</p>
                    <p className="text-lg">{currentTranscript}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Microphone Button */}
              <Button
                size="lg"
                variant={isListening ? 'destructive' : 'default'}
                className="w-32 h-32 rounded-full text-xl"
                onClick={toggleListening}
                disabled={!isSupported || isLoading || isSpeaking}
              >
                {isListening ? (
                  <MicOff className="w-12 h-12 animate-pulse" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center max-w-md">
                {isListening 
                  ? "I'm listening... Ask me anything about your health"
                  : isSpeaking
                  ? "I'm speaking... Please wait"
                  : isLoading
                  ? "Thinking..."
                  : "Tap the microphone and ask me anything"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">Conversation History</h3>
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'glass border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass border rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
