import { useEffect } from 'react'
import { ParticleBackground } from './components/ParticleBackground'
import { Navigation } from './components/Navigation'
import { ScrollProgress } from './components/ScrollProgress'
import { BackToTop } from './components/BackToTop'
import { HeroSection } from './components/HeroSection'
import { ProjectsSection } from './components/ProjectsSection'
import { SkillsSection } from './components/SkillsSection'
import { SkillsRadar } from './components/SkillsRadar'
import { ProjectTimeline } from './components/ProjectTimeline'
import { AIChatDemo } from './components/AIChatDemo'
import { ContactSection } from './components/ContactSection'
import { AdminPanel } from './components/AdminPanel'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { Toaster } from './components/ui/toaster'

function AppContent() {
  const { t } = useLanguage()

  // Scroll automático al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <ParticleBackground />
      
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {/* Back to Top */}
      <BackToTop />
      
      <main className="relative z-10">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="timeline">
          <ProjectTimeline />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="skills-radar" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SkillsRadar />
            </div>
          </div>
        </section>
        <section id="ai-demo">
          <AIChatDemo />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('footer.powered')}
          </p>
        </div>
      </footer>
      
      {/* Admin Panel */}
      <AdminPanel />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App