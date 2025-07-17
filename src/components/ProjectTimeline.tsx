import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Calendar, ExternalLink, Github } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface TimelineProject {
  id: string
  title: string
  description: string
  date: string
  category: string
  technologies: string[]
  image: string
  status: 'completed' | 'in-progress' | 'planned'
  impact: string
  demoUrl?: string
  githubUrl?: string
}

const defaultTimelineProjects: TimelineProject[] = [
  {
    id: '1',
    title: 'AI-Powered Medical Diagnosis System',
    description: 'Deep learning model for early disease detection using medical imaging with 94% accuracy.',
    date: '2024-01',
    category: 'Healthcare AI',
    technologies: ['PyTorch', 'OpenCV', 'FastAPI', 'Docker'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
    status: 'completed',
    impact: '10,000+ patients screened',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: '2',
    title: 'Real-time Fraud Detection Engine',
    description: 'Machine learning system processing 1M+ transactions per second with sub-millisecond latency.',
    date: '2023-11',
    category: 'FinTech',
    technologies: ['Apache Kafka', 'TensorFlow', 'Redis', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
    status: 'completed',
    impact: '$2M+ fraud prevented',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: '3',
    title: 'Autonomous Drone Navigation',
    description: 'Computer vision and reinforcement learning for autonomous drone flight in complex environments.',
    date: '2023-08',
    category: 'Robotics',
    technologies: ['ROS', 'OpenCV', 'PyTorch', 'CUDA'],
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=200&fit=crop',
    status: 'completed',
    impact: '99.2% navigation accuracy',
    demoUrl: '#'
  },
  {
    id: '4',
    title: 'Climate Change Prediction Model',
    description: 'Advanced time series forecasting using satellite data and weather patterns.',
    date: '2023-05',
    category: 'Climate Science',
    technologies: ['Prophet', 'Pandas', 'Plotly', 'AWS'],
    image: 'https://images.unsplash.com/photo-1569163139394-de44cb5894c4?w=400&h=200&fit=crop',
    status: 'completed',
    impact: 'Published in Nature AI',
    githubUrl: '#'
  },
  {
    id: '5',
    title: 'Neural Architecture Search Platform',
    description: 'Automated ML pipeline for discovering optimal neural network architectures.',
    date: '2024-03',
    category: 'AutoML',
    technologies: ['PyTorch', 'Ray', 'MLflow', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    status: 'in-progress',
    impact: '40% faster model training',
    githubUrl: '#'
  },
  {
    id: '6',
    title: 'Quantum-Classical Hybrid AI',
    description: 'Exploring quantum computing applications in machine learning optimization.',
    date: '2024-06',
    category: 'Quantum AI',
    technologies: ['Qiskit', 'PennyLane', 'TensorFlow Quantum'],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop',
    status: 'planned',
    impact: 'Research collaboration',
    githubUrl: '#'
  }
]

export function ProjectTimeline() {
  const { t } = useLanguage()
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set())
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [timelineProjects, setTimelineProjects] = useState<TimelineProject[]>(defaultTimelineProjects)

  useEffect(() => {
    try {
      const savedTimeline = localStorage.getItem('portfolio_timeline')
      if (savedTimeline) {
        setTimelineProjects(JSON.parse(savedTimeline))
      }
    } catch (e) {
      setTimelineProjects(defaultTimelineProjects)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = entry.target.getAttribute('data-project-id')
            if (projectId) {
              setVisibleProjects(prev => new Set([...prev, projectId]))
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    const projectElements = timelineRef.current?.querySelectorAll('[data-project-id]')
    projectElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'planned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🚧'
      case 'planned': return '📋'
      default: return '❓'
    }
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('timeline.title') || 'Project Timeline'}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('timeline.description') || 'A chronological journey through my most impactful AI and data science projects, showcasing innovation and real-world applications.'}
          </p>
        </div>

        <div ref={timelineRef} className="relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary opacity-30" />

          {timelineProjects.map((project, index) => {
            const isVisible = visibleProjects.has(project.id)
            const isSelected = selectedProject === project.id
            const isLeft = index % 2 === 0

            return (
              <div
                key={project.id}
                data-project-id={project.id}
                className={`relative flex items-center mb-16 ${
                  isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-6 h-6 rounded-full border-4 border-background transition-all duration-500 ${
                    isVisible ? 'bg-primary animate-pulse-glow' : 'bg-muted'
                  }`} />
                </div>

                {/* Project card */}
                <div className={`w-5/12 ${isLeft ? 'pr-8' : 'pl-8'}`}>
                  <Card 
                    className={`glass hover-lift cursor-pointer transition-all duration-500 ${
                      isVisible ? 'animate-slide-in-up opacity-100' : 'opacity-0'
                    } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedProject(isSelected ? null : project.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)} {project.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {project.date}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="secondary" className="bg-accent/20 text-accent text-xs mb-2">
                          {project.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-primary mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
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

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-accent font-medium">
                          📊 {project.impact}
                        </div>
                        <div className="flex gap-2">
                          {project.demoUrl && (
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-primary/30 text-primary hover:bg-primary/10">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-primary/30 text-primary hover:bg-primary/10">
                              <Github className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-primary">All Technologies:</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs border-accent/30 text-accent">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}