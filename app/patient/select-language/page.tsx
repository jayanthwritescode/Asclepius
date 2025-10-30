'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mic, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SelectLanguagePage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [mode, setMode] = useState<'history' | 'assistant'>('history')

  const languages = [
    { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇮🇳', description: 'Speak in English' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', description: 'हिंदी में बोलें' },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', description: 'தமிழில் பேசுங்கள்' },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', description: 'తెలుగులో మాట్లాడండి' },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', description: 'বাংলায় কথা বলুন' },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', description: 'मराठीत बोला' },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', description: 'ગુજરાતીમાં બોલો' },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', description: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ' }
  ]

  const handleContinue = () => {
    if (!selectedLanguage) return
    
    const targetPage = mode === 'history' 
      ? `/patient/history-voice?lang=${selectedLanguage}`
      : `/patient/assistant-voice?lang=${selectedLanguage}`
    
    router.push(targetPage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Select Your Language</h1>
              <p className="text-sm text-muted-foreground">Choose your preferred language for voice conversation</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Mode Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Mode</CardTitle>
            <CardDescription>Choose what you want to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={mode === 'history' ? 'default' : 'outline'}
                className="h-20"
                onClick={() => setMode('history')}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold">Patient History</div>
                  <div className="text-xs opacity-80">Pre-consultation info</div>
                </div>
              </Button>
              <Button
                variant={mode === 'assistant' ? 'default' : 'outline'}
                className="h-20"
                onClick={() => setMode('assistant')}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold">Health Assistant</div>
                  <div className="text-xs opacity-80">Ask health questions</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Choose Your Language
            </CardTitle>
            <CardDescription>
              Select the language you're most comfortable speaking in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <motion.div
                  key={lang.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedLanguage === lang.code
                        ? 'border-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedLanguage(lang.code)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{lang.flag}</span>
                          <div>
                            <div className="font-semibold text-lg">{lang.nativeName}</div>
                            <div className="text-sm text-muted-foreground">{lang.description}</div>
                          </div>
                        </div>
                        {selectedLanguage === lang.code && (
                          <CheckCircle className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!selectedLanguage}
                className="w-full md:w-auto"
              >
                <Mic className="w-5 h-5 mr-2" />
                Continue to Voice Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="text-blue-600 dark:text-blue-400">ℹ️</div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Voice Mode Features:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Speak naturally in your selected language</li>
                  <li>AI will understand and respond in the same language</li>
                  <li>Automatic speech recognition and text-to-speech</li>
                  <li>You can change language anytime during conversation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
