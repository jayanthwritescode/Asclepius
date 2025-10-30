'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Send, 
  Mic,
  MicOff,
  Loader2,
  FileText,
  Calendar,
  Pill,
  Activity,
  HelpCircle,
  Upload,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAppointmentStore } from '@/lib/appointments-store'
import { useVoiceChat } from '@/lib/use-voice-chat'

export default function PatientAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hello! I'm your digital health assistant. I can help you with:\n\n📄 Explaining medical reports\n📅 Scheduling appointments\n💊 Medication reminders\n🩺 Symptom checking\n❓ Health information\n\nHow can I assist you today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [showScheduler, setShowScheduler] = useState(false)
  const [schedulerData, setSchedulerData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    specialty: 'General Physician',
    date: '',
    time: '',
    type: 'in-person' as 'in-person' | 'video' | 'phone',
    reason: ''
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addAppointment, getUpcomingAppointments } = useAppointmentStore()
  const myAppointments = getUpcomingAppointments()

  const { 
    isListening, 
    isSpeaking, 
    toggleListening, 
    speak, 
    speakFallback 
  } = useVoiceChat({
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setInput(text)
        setTimeout(() => handleSend(), 100)
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
    language: 'en-IN'
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const features = [
    {
      id: 'report',
      icon: FileText,
      title: 'Explain Report',
      description: 'Upload and understand your medical reports'
    },
    {
      id: 'appointment',
      icon: Calendar,
      title: 'Book Appointment',
      description: 'Schedule a visit with your doctor'
    },
    {
      id: 'medication',
      icon: Pill,
      title: 'Medications',
      description: 'Set reminders and check interactions'
    },
    {
      id: 'symptom',
      icon: Activity,
      title: 'Check Symptoms',
      description: 'Understand your symptoms better'
    },
    {
      id: 'info',
      icon: HelpCircle,
      title: 'Health Info',
      description: 'Get answers to health questions'
    }
  ]

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId)
    
    if (featureId === 'appointment') {
      setShowScheduler(true)
    } else {
      const feature = features.find(f => f.id === featureId)
      if (feature) {
        setInput(`I need help with: ${feature.title}`)
      }
    }
  }

  const handleScheduleAppointment = () => {
    if (!schedulerData.patientName || !schedulerData.date || !schedulerData.time || !schedulerData.reason) {
      alert('Please fill in all required fields')
      return
    }

    const appointment = addAppointment({
      patientName: schedulerData.patientName,
      patientEmail: schedulerData.patientEmail,
      patientPhone: schedulerData.patientPhone,
      doctorName: 'Dr. Smith', // In real app, this would be selected
      specialty: schedulerData.specialty,
      date: schedulerData.date,
      time: schedulerData.time,
      duration: 30,
      type: schedulerData.type,
      status: 'scheduled',
      reason: schedulerData.reason,
    })

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `✅ Appointment scheduled successfully!\n\nDetails:\n- Doctor: Dr. Smith (${schedulerData.specialty})\n- Date: ${new Date(schedulerData.date).toLocaleDateString()}\n- Time: ${schedulerData.time}\n- Type: ${schedulerData.type}\n\nYou'll receive a confirmation email shortly. The doctor will review your information before the appointment.`
      }
    ])

    setShowScheduler(false)
    setSchedulerData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      specialty: 'General Physician',
      date: '',
      time: '',
      type: 'in-person',
      reason: ''
    })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
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

      // Speak the assistant's response (automatically falls back to browser TTS if ElevenLabs fails)
      if (assistantMessage) {
        speak(assistantMessage)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Digital Health Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  Your AI health companion
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/patient/select-language?mode=assistant')}>
              <Mic className="w-4 h-4 mr-2" />
              Switch to Voice Mode
            </Button>
          </div>
        </div>
      </header>

      {/* Appointment Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Schedule an Appointment</CardTitle>
                <CardDescription>Fill in the details to book your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Your Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={schedulerData.patientName}
                      onChange={(e) => setSchedulerData({...schedulerData, patientName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={schedulerData.patientEmail}
                      onChange={(e) => setSchedulerData({...schedulerData, patientEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={schedulerData.patientPhone}
                      onChange={(e) => setSchedulerData({...schedulerData, patientPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Specialty *</label>
                    <select
                      value={schedulerData.specialty}
                      onChange={(e) => setSchedulerData({...schedulerData, specialty: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    >
                      <option>General Physician</option>
                      <option>Cardiologist</option>
                      <option>Dermatologist</option>
                      <option>Pediatrician</option>
                      <option>Orthopedic</option>
                      <option>ENT Specialist</option>
                      <option>Gynecologist</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date *</label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={schedulerData.date}
                      onChange={(e) => setSchedulerData({...schedulerData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Time *</label>
                    <Input
                      type="time"
                      value={schedulerData.time}
                      onChange={(e) => setSchedulerData({...schedulerData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Appointment Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['in-person', 'video', 'phone'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSchedulerData({...schedulerData, type: type as any})}
                        className={`p-3 rounded-lg border text-center capitalize ${
                          schedulerData.type === type
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200'
                        }`}
                      >
                        {type === 'in-person' && '🏥'}
                        {type === 'video' && '📹'}
                        {type === 'phone' && '📞'}
                        <div className="text-sm mt-1">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Reason for Visit *</label>
                  <Textarea
                    placeholder="Describe your symptoms or reason for consultation..."
                    value={schedulerData.reason}
                    onChange={(e) => setSchedulerData({...schedulerData, reason: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleScheduleAppointment}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowScheduler(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* My Appointments Section */}
      {myAppointments.length > 0 && messages.length === 1 && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{apt.doctorName} - {apt.specialty}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </p>
                    </div>
                    <Badge>{apt.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Cards */}
      {messages.length === 1 && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <CardContent className="p-4 text-center">
                    <feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Important Disclaimer
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    This AI assistant provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor for medical concerns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Messages */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 mb-32">
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-end gap-2">
            <Button
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              className="shrink-0"
              onClick={toggleListening}
              disabled={isSpeaking}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your health... (Press Enter to send)"
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
