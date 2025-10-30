"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Stethoscope, 
  Users, 
  FileText, 
  MessageSquare, 
  Activity,
  ArrowRight,
  Sparkles,
  Clock,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const features = [
    {
      icon: FileText,
      title: 'Post-Consultation Documentation',
      description: 'Generate SOAP notes, ICD-10/CPT codes, and prescriptions from consultation recordings',
      color: 'from-blue-500 to-cyan-500',
      stats: '5 min saved per patient'
    },
    {
      icon: MessageSquare,
      title: 'Pre-Consultation History',
      description: 'AI chatbot collects patient history before appointments',
      color: 'from-purple-500 to-pink-500',
      stats: '10 min saved per consultation'
    },
    {
      icon: Activity,
      title: 'Patient Digital Assistant',
      description: 'Help patients understand reports, schedule appointments, and manage medications',
      color: 'from-green-500 to-emerald-500',
      stats: '24/7 patient support'
    }
  ]

  const stats = [
    { label: 'Time Saved', value: '15 min', subtext: 'per patient' },
    { label: 'Accuracy', value: '99%', subtext: 'medical coding' },
    { label: 'Languages', value: '5+', subtext: 'supported' },
    { label: 'HIPAA', value: 'Compliant', subtext: 'secure & private' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-medical flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">MedScribe AI</h1>
              <p className="text-xs text-muted-foreground">Modern Medical Assistant</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Llama 3.3 70B
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Medical AI Assistant
            <br />
            <span className="gradient-text">for Modern Healthcare</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Streamline documentation, collect patient histories, and provide 24/7 patient support with AI-powered medical assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="medical"
              className="text-lg px-8 py-6"
              onClick={() => router.push('/doctor/documentation')}
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              I'm a Doctor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => router.push('/patient/assistant')}
            >
              <Users className="w-5 h-5 mr-2" />
              I'm a Patient
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center glass">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.subtext}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Three Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need for modern medical practice</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setHoveredCard(feature.title)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="h-full glass-strong hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass-strong border-2 border-blue-500/50">
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-blue-500" />
            <h2 className="text-3xl font-bold mb-4">HIPAA Compliant & Secure</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your patient data is encrypted and secure. We follow strict HIPAA compliance guidelines to protect sensitive medical information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="medical" onClick={() => router.push('/doctor/documentation')}>
                Get Started as Doctor
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/patient/assistant')}>
                Get Started as Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 MedScribe AI. All rights reserved.</p>
          <p className="mt-2">Powered by Llama 3.3 70B & Groq Whisper</p>
        </div>
      </footer>
    </div>
  )
}
