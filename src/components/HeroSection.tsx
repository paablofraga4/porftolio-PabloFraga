import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export function HeroSection() {
  const { language, t } = useLanguage();
  // Leo el perfil desde localStorage
  const [profile, setProfile] = useState({
    name: 'Tu Nombre',
    title: 'AI & Data Science Visionary',
    title_en: '',
    title_es: '',
    description: 'Especialista en inteligencia artificial y ciencia de datos con pasión por crear soluciones innovadoras.',
    description_en: '',
    description_es: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    email: ''
  })
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('portfolio_profile')
      if (savedProfile) {
        setProfile((prev: any) => ({ ...prev, ...JSON.parse(savedProfile) }))
      }
    } catch (e) {
      // Si hay error, dejo los valores por defecto
    }
  }, [])

  // Elegir el título y descripción según idioma
  const currentTitle = language === 'es'
    ? (profile.title_es || profile.title)
    : (profile.title_en || profile.title)
  const currentDescription = language === 'es'
    ? (profile.description_es || profile.description)
    : (profile.description_en || profile.description)

  useEffect(() => {
    let index = 0
    setDisplayText('')
    const timer = setInterval(() => {
      if (index < currentTitle.length) {
        setDisplayText(currentTitle.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [currentTitle])

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Neural network background lines */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`neural-line-${i}`}
            className="neural-line"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 text-center z-10">
        <div className="max-w-4xl mx-auto">
          {/* Glitch effect name */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
            <span className="gradient-text animate-glitch">
              {profile.name}
            </span>
          </h1>
          {/* Typing animation subtitle */}
          <div className="text-2xl md:text-4xl font-light mb-8 h-16 flex items-center justify-center">
            <span className="font-mono text-primary border-r-2 border-primary pr-2">
              {displayText}
            </span>
          </div>
          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {currentDescription}
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg animate-glow hover-lift"
              onClick={scrollToProjects}
            >
              {t('hero.explore')}
            </Button>
            {profile.resumeUrl && (
              <Button 
                variant="outline" 
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg hover-lift"
                asChild
              >
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Descargar CV
                </a>
              </Button>
            )}
          </div>
          {/* Social Links */}
          <div className="flex justify-center space-x-8 mb-16">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full glass hover-lift animate-pulse-glow transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 text-primary" />
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full glass hover-lift animate-pulse-glow transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-primary" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="p-4 rounded-full glass hover-lift animate-pulse-glow transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-6 h-6 text-primary" />
              </a>
            )}
          </div>
          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ChevronDown 
              className="w-8 h-8 text-primary mx-auto cursor-pointer hover:text-accent transition-colors"
              onClick={scrollToProjects}
            />
          </div>
        </div>
      </div>
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-20 h-20 border border-primary/30 rounded-full animate-float" />
      <div className="absolute top-40 right-32 w-16 h-16 border border-accent/30 rounded-lg animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 left-32 w-12 h-12 border border-primary/30 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-accent/30 rounded-lg animate-float" style={{ animationDelay: '1s' }} />
    </section>
  )
}