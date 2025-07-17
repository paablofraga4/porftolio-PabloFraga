import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export function ContactSection() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Leo datos de contacto desde localStorage
  const [profile, setProfile] = useState<{
    email: string
    phone: string
    location: string
    githubUrl: string
    linkedinUrl: string
    twitterUrl: string
  }>({
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: ''
  })

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('portfolio_profile')
      if (savedProfile) {
        setProfile((prev: typeof profile) => ({ ...prev, ...JSON.parse(savedProfile) }))
      }
    } catch (e) {
      // Si hay error, dejo los valores por defecto
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
    alert('Message sent successfully!')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('contact.title')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('contact.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass hover-lift">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{t('contact.get_in_touch')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('contact.email')}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('contact.phone')}</p>
                    <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t('contact.location')}</p>
                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Social Links */}
            <Card className="glass hover-lift">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Follow Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                      <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        <Github className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">GitHub</p>
                        <p className="text-sm text-muted-foreground">{profile.githubUrl.replace('https://github.com/', '@')}</p>
                      </div>
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                      <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        <Linkedin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">{profile.linkedinUrl.replace('https://linkedin.com/in/', '/in/')}</p>
                      </div>
                    </a>
                  )}
                  {profile.twitterUrl && (
                    <a
                      href={profile.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                      <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        <Twitter className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Twitter</p>
                        <p className="text-sm text-muted-foreground">{profile.twitterUrl.replace('https://twitter.com/', '@')}</p>
                      </div>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Availability (sin cambios) */}
            <Card className="glass hover-lift">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Freelance Projects</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Full-time Roles</span>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                      Open to Offers
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consulting</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Contact Form (sin cambios) */}
          <div className="lg:col-span-2">
            <Card className="glass hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-primary/30 focus:border-primary"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-primary/30 focus:border-primary"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-primary/30 focus:border-primary"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-background/50 border-primary/30 focus:border-primary resize-none"
                      placeholder="Tell me about your project, ideas, or just say hello..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground animate-glow hover-lift"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Call to Action (sin cambios) */}
        <div className="text-center mt-16">
          <Card className="glass max-w-4xl mx-auto">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4">
                <span className="gradient-text">Ready to Build Something Amazing?</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you need AI consulting, data science solutions, or want to collaborate 
                on cutting-edge research, I'm here to help turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/80 animate-glow">
                  Schedule a Call
                </Button>
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  View My Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}