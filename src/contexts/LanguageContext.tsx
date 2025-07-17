import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Hero Section
    'hero.name': 'Pablo Fraga',
    'hero.title': 'AI & Data Science Visionary',
    'hero.description': 'Transforming data into intelligence, building the future with machine learning, neural networks, and cutting-edge AI.',
    'hero.explore': 'Explore My Work',
    'hero.resume': 'Download Resume',
    'hero.admin_hint': 'Are you the owner? Look for the "Private Area" button in the bottom right corner',
    
    // Projects Section
    'projects.title': 'Featured Projects',
    'projects.description': 'Explore my latest work in artificial intelligence, machine learning, and data science. Each project represents a unique challenge solved with cutting-edge technology.',
    'projects.featured': 'Featured Work',
    'projects.more': 'More Projects',
    'projects.demo': 'Demo',
    'projects.code': 'Code',
    'projects.no_results': 'No projects found in this category.',
    
    // Skills Section
    'skills.title': 'Skills & Expertise',
    'skills.description': 'A comprehensive toolkit spanning machine learning, data science, and software engineering. Constantly evolving with the latest technologies and methodologies.',
    'skills.additional': 'Additional Technologies',
    'skills.certifications': 'Certifications & Achievements',
    
    // Contact Section
    'contact.title': "Let's Connect",
    'contact.description': "Ready to collaborate on your next AI project? Let's discuss how we can transform your data into actionable insights and build the future together.",
    'contact.get_in_touch': 'Get in Touch',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.follow': 'Follow Me',
    'contact.availability': 'Availability',
    'contact.freelance': 'Freelance Projects',
    'contact.fulltime': 'Full-time Roles',
    'contact.consulting': 'Consulting',
    'contact.available': 'Available',
    'contact.open_offers': 'Open to Offers',
    'contact.send_message': 'Send a Message',
    'contact.name': 'Name',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.name_placeholder': 'Your full name',
    'contact.email_placeholder': 'your.email@example.com',
    'contact.subject_placeholder': "What's this about?",
    'contact.message_placeholder': 'Tell me about your project, ideas, or just say hello...',
    'contact.sending': 'Sending...',
    'contact.send': 'Send Message',
    'contact.cta_title': 'Ready to Build Something Amazing?',
    'contact.cta_description': 'Whether you need AI consulting, data science solutions, or want to collaborate on cutting-edge research, I\'m here to help turn your vision into reality.',
    'contact.schedule_call': 'Schedule a Call',
    'contact.view_resume': 'View My Resume',
    
    // Footer
    'footer.copyright': '© 2025 Pablo Fraga.',
    'footer.powered': 'Powered by AI, directed by innovation.',
    
    // Admin Panel
    'admin.private_area': 'Private Area',
    'admin.admin_panel': 'Administration Panel',
    'admin.admin_access': 'Admin Access',
    'admin.access_denied': 'Access Denied',
    'admin.access_denied_description': 'This area is private. Only the owner can access.',
    'admin.login': 'Sign In',
    'admin.login_description': 'Sign in to access the administration panel and manage your portfolio',
    'admin.cancel': 'Cancel',
    'admin.logout': 'Sign Out',
    'admin.profile': 'Profile',
    'admin.projects': 'Projects',
    'admin.skills': 'Skills',
    'admin.certifications': 'Certifications',
    
    // Categories
    'category.all': 'All',
    'category.ml': 'ML',
    'category.ai': 'AI',
    'category.data_science': 'Data Science',
    'category.deep_learning': 'Deep Learning',
    
    // Skills Categories
    'skills.programming': 'Programming',
    'skills.ml_ai': 'ML/AI',
    'skills.tools': 'Tools',
    'skills.data': 'Data',
    
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.timeline': 'Timeline',
    'nav.skills': 'Skills',
    'nav.ai_demo': 'AI Demo',
    'nav.contact': 'Contact',
    
    // Timeline
    'timeline.title': 'Project Timeline',
    'timeline.description': 'A chronological journey through my most impactful AI and data science projects, showcasing innovation and real-world applications.',
    
    // AI Demo
    'ai_demo.title': 'AI Assistant Demo',
    'ai_demo.description': 'Experience the power of conversational AI. This interactive demo showcases advanced natural language processing and machine learning capabilities.',
    
    // Skills Radar
    'skills.radar_title': 'Skills Radar',
    
    // Common
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update',
  },
  es: {
    // Hero Section
    'hero.name': 'Pablo Fraga',
    'hero.title': 'Visionario en IA y Ciencia de Datos',
    'hero.description': 'Transformando datos en inteligencia, construyendo el futuro con aprendizaje automático, redes neuronales e IA de vanguardia.',
    'hero.explore': 'Explorar Mi Trabajo',
    'hero.resume': 'Descargar CV',
    'hero.admin_hint': '¿Eres el propietario? Busca el botón "Área Privada" en la esquina inferior derecha',
    
    // Projects Section
    'projects.title': 'Proyectos Destacados',
    'projects.description': 'Explora mi trabajo más reciente en inteligencia artificial, aprendizaje automático y ciencia de datos. Cada proyecto representa un desafío único resuelto con tecnología de vanguardia.',
    'projects.featured': 'Trabajo Destacado',
    'projects.more': 'Más Proyectos',
    'projects.demo': 'Demo',
    'projects.code': 'Código',
    'projects.no_results': 'No se encontraron proyectos en esta categoría.',
    
    // Skills Section
    'skills.title': 'Habilidades y Experiencia',
    'skills.description': 'Un conjunto integral de herramientas que abarca aprendizaje automático, ciencia de datos e ingeniería de software. En constante evolución con las últimas tecnologías y metodologías.',
    'skills.additional': 'Tecnologías Adicionales',
    'skills.certifications': 'Certificaciones y Logros',
    
    // Contact Section
    'contact.title': 'Conectemos',
    'contact.description': '¿Listo para colaborar en tu próximo proyecto de IA? Hablemos sobre cómo podemos transformar tus datos en insights accionables y construir el futuro juntos.',
    'contact.get_in_touch': 'Ponte en Contacto',
    'contact.email': 'Email',
    'contact.phone': 'Teléfono',
    'contact.location': 'Ubicación',
    'contact.follow': 'Sígueme',
    'contact.availability': 'Disponibilidad',
    'contact.freelance': 'Proyectos Freelance',
    'contact.fulltime': 'Roles de Tiempo Completo',
    'contact.consulting': 'Consultoría',
    'contact.available': 'Disponible',
    'contact.open_offers': 'Abierto a Ofertas',
    'contact.send_message': 'Enviar Mensaje',
    'contact.name': 'Nombre',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.name_placeholder': 'Tu nombre completo',
    'contact.email_placeholder': 'tu.email@ejemplo.com',
    'contact.subject_placeholder': '¿De qué se trata?',
    'contact.message_placeholder': 'Cuéntame sobre tu proyecto, ideas, o simplemente saluda...',
    'contact.sending': 'Enviando...',
    'contact.send': 'Enviar Mensaje',
    'contact.cta_title': '¿Listo para Construir Algo Increíble?',
    'contact.cta_description': 'Ya sea que necesites consultoría en IA, soluciones de ciencia de datos, o quieras colaborar en investigación de vanguardia, estoy aquí para ayudar a convertir tu visión en realidad.',
    'contact.schedule_call': 'Programar una Llamada',
    'contact.view_resume': 'Ver Mi CV',
    
    // Footer
    'footer.copyright': '© 2025 Pablo Fraga.',
    'footer.powered': 'Impulsado por IA, perfeccionado por la innovación',
    
    // Admin Panel
    'admin.private_area': 'Área Privada',
    'admin.admin_panel': 'Panel de Administración',
    'admin.admin_access': 'Acceso Admin',
    'admin.access_denied': 'Acceso Denegado',
    'admin.access_denied_description': 'Esta área es privada. Solo el propietario puede acceder.',
    'admin.login': 'Iniciar Sesión',
    'admin.login_description': 'Inicia sesión para acceder al panel de administración y gestionar tu portfolio',
    'admin.cancel': 'Cancelar',
    'admin.logout': 'Cerrar Sesión',
    'admin.profile': 'Perfil',
    'admin.projects': 'Proyectos',
    'admin.skills': 'Habilidades',
    'admin.certifications': 'Certificaciones',
    
    // Categories
    'category.all': 'Todos',
    'category.ml': 'ML',
    'category.ai': 'IA',
    'category.data_science': 'Ciencia de Datos',
    'category.deep_learning': 'Aprendizaje Profundo',
    
    // Skills Categories
    'skills.programming': 'Programación',
    'skills.ml_ai': 'ML/IA',
    'skills.tools': 'Herramientas',
    'skills.data': 'Datos',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.projects': 'Proyectos',
    'nav.timeline': 'Cronología',
    'nav.skills': 'Habilidades',
    'nav.ai_demo': 'Demo IA',
    'nav.contact': 'Contacto',
    
    // Timeline
    'timeline.title': 'Cronología de Proyectos',
    'timeline.description': 'Un viaje cronológico a través de mis proyectos más impactantes de IA y ciencia de datos, mostrando innovación y aplicaciones del mundo real.',
    
    // AI Demo
    'ai_demo.title': 'Demo de Asistente IA',
    'ai_demo.description': 'Experimenta el poder de la IA conversacional. Esta demo interactiva muestra capacidades avanzadas de procesamiento de lenguaje natural y aprendizaje automático.',
    
    // Skills Radar
    'skills.radar_title': 'Radar de Habilidades',
    
    // Common
    'common.loading': 'Cargando...',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage or default to Spanish since you're Pablo Fraga
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('portfolio-language')
      const validLanguage = saved === 'en' || saved === 'es' ? saved : 'es'
      console.log('Initial language loaded:', validLanguage)
      return validLanguage
    } catch (error) {
      console.warn('Error reading language from localStorage:', error)
      return 'es'
    }
  })

  // Force re-render when language changes
  const [, forceUpdate] = useState({})

  // Save language preference to localStorage
  const handleSetLanguage = (lang: Language) => {
    try {
      console.log('🌐 Setting language to:', lang)
      setLanguage(lang)
      localStorage.setItem('portfolio-language', lang)
      console.log('✅ Language successfully changed to:', lang)
      
      // Force a re-render
      forceUpdate({})
      
      // Also dispatch custom event for any components that need it
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
      
      // Add a small delay to ensure state has updated
      setTimeout(() => {
        console.log('🔄 Current language after update:', language)
      }, 100)
    } catch (error) {
      console.error('❌ Error saving language to localStorage:', error)
      setLanguage(lang) // Still update state even if localStorage fails
      forceUpdate({}) // Force update even if localStorage fails
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}