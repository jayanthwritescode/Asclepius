'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Calendar,
  Users,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  ClipboardList
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppointmentStore } from '@/lib/appointments-store'
import { usePatientStore } from '@/lib/patients-store'

export default function DoctorDashboardPage() {
  const router = useRouter()
  const { getTodayAppointments, getUpcomingAppointments } = useAppointmentStore()
  const { getActivePatients, getRecentPatients } = usePatientStore()

  const todayAppointments = getTodayAppointments()
  const upcomingAppointments = getUpcomingAppointments()
  const activePatients = getActivePatients()
  const recentPatients = getRecentPatients(3)

  const features = [
    {
      icon: FileText,
      title: 'Consultation & Documentation',
      description: 'Record consultations and generate SOAP notes, prescriptions, and medical codes',
      route: '/doctor/consultation',
      color: 'bg-blue-500',
      stats: `${todayAppointments.length} today`
    },
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'Manage your schedule and view upcoming patient appointments',
      route: '/doctor/appointments',
      color: 'bg-purple-500',
      stats: `${upcomingAppointments.length} upcoming`
    },
    {
      icon: Users,
      title: 'Patients',
      description: 'View and manage your registered patients and their medical records',
      route: '/doctor/patients',
      color: 'bg-green-500',
      stats: `${activePatients.length} active`
    }
  ]

  const stats = [
    {
      label: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Total Patients',
      value: activePatients.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Upcoming',
      value: upcomingAppointments.length,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      label: 'This Week',
      value: upcomingAppointments.filter(apt => {
        const aptDate = new Date(apt.date)
        const weekFromNow = new Date()
        weekFromNow.setDate(weekFromNow.getDate() + 7)
        return aptDate <= weekFromNow
      }).length,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ]

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Doctor's Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, Dr. Smith
                </p>
              </div>
            </div>
            <Button onClick={() => router.push('/doctor/consultation')}>
              <FileText className="w-4 h-4 mr-2" />
              New Consultation
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Today's Schedule */}
        {todayAppointments.length > 0 && (
          <Card className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>
                    You have {todayAppointments.length} appointment(s) scheduled for today
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/doctor/appointments')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/doctor/consultation?appointmentId=${apt.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center min-w-[60px]">
                        <div className="text-xl font-bold">{formatTime(apt.time).split(' ')[0]}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(apt.time).split(' ')[1]}</div>
                      </div>
                      <div>
                        <p className="font-semibold">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                      </div>
                    </div>
                    <Badge>{apt.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => router.push(feature.route)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Activity className="w-4 h-4" />
                      {feature.stats}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        {recentPatients.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Recently updated patient records</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/doctor/patients')}>
                  View All Patients
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.totalVisits} visit{patient.totalVisits !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
