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
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVoiceChat } from '@/lib/use-voice-chat'
import { VoiceWaveform, ListeningIndicator, SpeakingIndicator } from '@/components/voice-waveform'

export default function PatientHistoryVoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang') || 'en-IN'
  
  const greetings: Record<string, string> = {
    'en-IN': "Hello! I'm here to help collect some information before your appointment. This will help your doctor provide better care. What brings you in today?",
    'hi-IN': 'नमस्ते! मैं आपकी अपॉइंटमेंट से पहले कुछ जानकारी एकत्र करने में मदद करने के लिए यहां हूं। यह आपके डॉक्टर को बेहतर देखभाल प्रदान करने में मदद करेगा। आज आप क्यों आए हैं?',
    'ta-IN': 'வணக்கம்! உங்கள் சந்திப்புக்கு முன் சில தகவல்களை சேகரிக்க நான் இங்கு உதவ வந்துள்ளேன். இது உங்கள் மருத்துவருக்கு சிறந்த சிகிச்சை அளிக்க உதவும். இன்று உங்களுக்கு என்ன பிரச்சனை?',
    'te-IN': 'నమస్కారం! మీ అపాయింట్మెంట్ ముందు కొంత సమాచారం సేకరించడానికి నేను ఇక్కడ సహాయం చేయడానికి వచ్చాను. ఇది మీ డాక్టర్‌కు మెరుగైన సంరక్షణ అందించడంలో సహాయపడుతుంది. ఈరోజు మీకు ఏమి సమస్య?',
    'bn-IN': 'নমস্কার! আপনার অ্যাপয়েন্টমেন্টের আগে কিছু তথ্য সংগ্রহ করতে আমি এখানে সাহায্য করতে এসেছি। এটি আপনার ডাক্তারকে আরও ভাল যত্ন প্রদান করতে সাহায্য করবে। আজ আপনার কী সমস্যা?',
    'mr-IN': 'नमस्कार! तुमच्या भेटीपूर्वी काही माहिती गोळा करण्यात मदत करण्यासाठी मी येथे आहे. यामुळे तुमच्या डॉक्टरांना चांगली काळजी घेण्यास मदत होईल. आज तुम्हाला काय समस्या आहे?',
    'gu-IN': 'નમસ્તે! તમારી મુલાકાત પહેલાં કેટલીક માહિતી એકત્રિત કરવામાં મદદ કરવા હું અહીં છું. આ તમારા ડૉક્ટરને વધુ સારી સંભાળ પૂરી પાડવામાં મદદ કરશે. આજે તમને શું સમસ્યા છે?',
    'kn-IN': 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಭೇಟಿಯ ಮೊದಲು ಕೆಲವು ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲು ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಇದು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ಉತ್ತಮ ಆರೈಕೆ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇಂದು ನಿಮಗೆ ಏನು ಸಮಸ್ಯೆ?'
  }
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: greetings[langParam] || greetings['en-IN']
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
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
    speakFallback,
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
          type: 'patient-history'
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

      // Update progress
      const newProgress = Math.min(100, (messages.length / 20) * 100)
      setProgress(newProgress)

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/patient/history')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Voice Mode - Patient History</h1>
                <p className="text-sm text-muted-foreground">Speak naturally, I'll listen</p>
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
              <Button variant="outline" size="sm" onClick={() => router.push('/patient/history')}>
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
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Conversation Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Voice Interface */}
        <Card className="mb-6 border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Waveform */}
              <div className="w-full h-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden">
                <VoiceWaveform isActive={isListening || isSpeaking} />
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
                    className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
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
                  ? "I'm listening... Speak naturally and I'll understand"
                  : isSpeaking
                  ? "I'm speaking... Please wait"
                  : isLoading
                  ? "Thinking..."
                  : "Tap the microphone and start speaking"}
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
                    ? 'bg-purple-600 text-white'
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
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
