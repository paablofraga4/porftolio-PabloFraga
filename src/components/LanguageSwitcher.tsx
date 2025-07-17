import { Button } from './ui/button'
import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'es' : 'en'
    console.log('🔄 Switching language from', language, 'to', newLanguage)
    
    // Show a brief visual feedback
    const button = document.querySelector('[data-language-switcher]') as HTMLElement
    if (button) {
      button.style.transform = 'scale(0.95)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 150)
    }

    // Change the language
    setLanguage(newLanguage)
    
    // Show toast notification
    toast({
      title: newLanguage === 'es' ? 'Idioma cambiado' : 'Language changed',
      description: newLanguage === 'es' ? 'Cambiado a Español' : 'Changed to English',
      duration: 2000,
    })
  }

  return (
    <div className="fixed top-20 right-6 z-50 md:top-6 md:right-auto md:left-6">
      <Button
        data-language-switcher
        variant="outline"
        size="sm"
        onClick={handleLanguageToggle}
        className="glass border-primary/30 text-primary hover:bg-primary/10 backdrop-blur-sm transition-all duration-200 shadow-lg cursor-pointer"
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="font-medium">
          {language === 'en' ? 'ES' : 'EN'}
        </span>
      </Button>
    </div>
  )
}