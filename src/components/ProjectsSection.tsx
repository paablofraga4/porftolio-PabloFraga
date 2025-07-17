import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ExternalLink, Github, Play } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: 'ML' | 'AI' | 'Data Science' | 'Deep Learning'
  technologies: string[]
  imageUrl?: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
}

// Fallback projects if none are saved in admin panel
const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Neural Style Transfer',
    description: 'AI-powered artistic style transformation using deep neural networks',
    longDescription: 'Advanced implementation of neural style transfer using TensorFlow and PyTorch. Combines content and style images to create unique artistic renditions with real-time processing capabilities.',
    category: 'Deep Learning',
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'Flask'],
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop',
    demoUrl: '#',
    githubUrl: '#',
    featured: true
  },
  {
    id: '2',
    title: 'Predictive Analytics Dashboard',
    description: 'Real-time business intelligence with machine learning predictions',
    longDescription: 'Comprehensive dashboard for business analytics featuring predictive models, real-time data visualization, and automated reporting systems built with modern web technologies.',
    category: 'Data Science',
    technologies: ['React', 'D3.js', 'Python', 'Scikit-learn', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    demoUrl: '#',
    githubUrl: '#',
    featured: true
  }
]

export function ProjectsSection() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>(defaultProjects)

  // Load projects from localStorage (saved in admin panel)
  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = localStorage.getItem('portfolio_projects')
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects)
          setProjects(parsedProjects)
        } catch (error) {
          console.error('Error loading projects:', error)
          setProjects(defaultProjects)
        }
      }
    }

    loadProjects()

    // Listen for storage changes to update projects in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_projects') {
        loadProjects()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-tab updates)
    const handleProjectsUpdate = () => {
      loadProjects()
    }
    
    window.addEventListener('portfolioProjectsUpdated', handleProjectsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('portfolioProjectsUpdated', handleProjectsUpdate)
    }
  }, [])

  const categories = [
    { key: 'All', label: t('category.all') },
    { key: 'ML', label: t('category.ml') },
    { key: 'AI', label: t('category.ai') },
    { key: 'Data Science', label: t('category.data_science') },
    { key: 'Deep Learning', label: t('category.deep_learning') }
  ]

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const featuredProjects = filteredProjects.filter(project => project.featured)
  const otherProjects = filteredProjects.filter(project => !project.featured)

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('projects.title')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('projects.description')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-2 transition-all duration-300 ${
                selectedCategory === category.key 
                  ? 'bg-primary text-primary-foreground animate-glow' 
                  : 'border-primary/30 text-primary hover:bg-primary/10'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Featured Projects Grid */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-primary mb-8 text-center">{t('projects.featured')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="glass hover-lift group cursor-pointer overflow-hidden"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop'} 
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        {project.demoUrl && project.demoUrl !== '#' && (
                          <Button 
                            size="sm" 
                            className="bg-primary/80 hover:bg-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.demoUrl, '_blank')
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {t('projects.demo')}
                          </Button>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.githubUrl, '_blank')
                            }}
                          >
                            <Github className="w-4 h-4 mr-2" />
                            {t('projects.code')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {hoveredProject === project.id ? project.longDescription : project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs border-primary/30 text-primary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects Grid */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-8 text-center">{t('projects.more')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="glass hover-lift group cursor-pointer"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop'} 
                      alt={project.title}
                      className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-accent/20 text-accent"
                    >
                      {project.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs border-primary/30 text-primary">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {project.demoUrl && project.demoUrl !== '#' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.demoUrl, '_blank')
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {t('projects.demo')}
                        </Button>
                      )}
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.githubUrl, '_blank')
                          }}
                        >
                          <Github className="w-3 h-3 mr-1" />
                          {t('projects.code')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t('projects.no_results')}</p>
          </div>
        )}
      </div>
    </section>
  )
}