import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Plus, Edit, Trash2, Save, X, Settings, User, Briefcase, Award } from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import { useLanguage } from '../contexts/LanguageContext'
import { SketchPicker } from 'react-color'

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: string
  technologies: string[]
  imageUrl?: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
}

interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon?: string
}

interface ProfileInfo {
  id: string
  name?: string
  title?: string // legacy
  title_en?: string
  title_es?: string
  description?: string // legacy
  description_en?: string
  description_es?: string
  resumeUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  email?: string
  phone?: string
  location?: string
  twitterUrl?: string
}

interface Certification {
  id: string
  title: string
  issuer: string
  year: string
  icon?: string
}

interface RadarSkill {
  id: string
  skill: string
  level: number
  category: string
  color: string
}

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

export function AdminPanel() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true'
  })
  const [loginForm, setLoginForm] = useState({ user: '', password: '' })
  const [loginError, setLoginError] = useState('')

  // Estados para formularios
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [showCertForm, setShowCertForm] = useState(false)

  // Elimino duplicados: solo dejo una declaración de cada uno
  type UseStateTuple<T> = [T, React.Dispatch<React.SetStateAction<T>>];
  const [radarSkills, setRadarSkills]: UseStateTuple<RadarSkill[]> = useState<RadarSkill[]>([]);
  const [editingRadarSkill, setEditingRadarSkill] = useState<RadarSkill | null>(null)
  const [showRadarSkillForm, setShowRadarSkillForm] = useState(false)

  // Mantengo solo una declaración de cada uno:
  const [timelineProjects, setTimelineProjects]: UseStateTuple<TimelineProject[]> = useState<TimelineProject[]>([]);
  const [editingTimelineProject, setEditingTimelineProject] = useState<TimelineProject | null>(null)
  const [showTimelineProjectForm, setShowTimelineProjectForm] = useState(false)

  // Estados de datos
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [profile, setProfile] = useState<ProfileInfo | null>(null)
  const [certifications, setCertifications] = useState<Certification[]>([])

  // Carga de datos centralizada
  const loadData = useCallback(() => {
    try {
      const savedProjects = localStorage.getItem('portfolio_projects')
      const savedSkills = localStorage.getItem('portfolio_skills')
      const savedProfile = localStorage.getItem('portfolio_profile')
      const savedCertifications = localStorage.getItem('portfolio_certifications')
      const savedRadarSkills = localStorage.getItem('portfolio_skills_radar')
      const savedTimeline = localStorage.getItem('portfolio_timeline')
      setProjects(savedProjects ? JSON.parse(savedProjects) : [])
      setSkills(savedSkills ? JSON.parse(savedSkills) : [])
      setProfile(savedProfile ? JSON.parse(savedProfile) : null)
      setCertifications(savedCertifications ? JSON.parse(savedCertifications) : [])
      setRadarSkills(savedRadarSkills ? JSON.parse(savedRadarSkills) : [])
      setTimelineProjects(savedTimeline ? JSON.parse(savedTimeline) : [])
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar los datos', variant: 'destructive' })
    }
  }, [toast])

  // Cargar datos al hacer login
  useEffect(() => {
    if (isLoggedIn) {
      loadData()
    }
  }, [isLoggedIn, loadData])

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminUser = import.meta.env.VITE_ADMIN_USER
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (
      loginForm.user === adminUser &&
      loginForm.password === adminPassword
    ) {
      setIsLoggedIn(true)
      localStorage.setItem('admin_logged_in', 'true')
      setLoginError('')
      setIsOpen(true)
      loadData() // Cargar datos tras login exitoso
    } else {
      setLoginError('Acceso denegado: credenciales incorrectas')
    }
  }

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('admin_logged_in')
    setIsOpen(false)
  }

  // Always show the admin button
  const adminButton = (
    <Button
      className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/80 animate-glow"
      size="lg"
      onClick={() => {
        if (isLoggedIn) setIsOpen(true)
        else setIsOpen(true)
      }}
    >
      <Settings className="w-5 h-5 mr-2" />
      {isLoggedIn ? t('admin.admin_panel') : t('admin.admin_access')}
    </Button>
  )

  // Si no está logueado, mostrar solo el login dialog
  if (!isLoggedIn) {
    return (
      <>
        {adminButton}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Acceso Privado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="user">Usuario (email)</Label>
                <Input
                  id="user"
                  type="email"
                  value={loginForm.user}
                  onChange={e => setLoginForm({ ...loginForm, user: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Función para guardar perfil
  const saveProfile = async (profileData: Partial<ProfileInfo>) => {
    try {
      const updatedProfile = {
        ...profile,
        ...profileData,
        id: profile?.id || `profile_${Date.now()}`
      } as ProfileInfo;
      setProfile(updatedProfile);
      localStorage.setItem('portfolio_profile', JSON.stringify(updatedProfile));
      toast({ title: 'Éxito', description: 'Perfil actualizado' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el perfil', variant: 'destructive' });
    }
  };

  // Funciones para proyectos
  const saveProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = {
        ...projectData,
        id: editingProject?.id || `proj_${Date.now()}`
      } as Project;
      let updatedProjects;
      if (editingProject) {
        updatedProjects = projects.map(p => p.id === editingProject.id ? newProject : p);
        toast({ title: 'Éxito', description: 'Proyecto actualizado' });
      } else {
        updatedProjects = [...projects, newProject];
        toast({ title: 'Éxito', description: 'Proyecto creado' });
      }
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      setShowProjectForm(false);
      setEditingProject(null);
      window.dispatchEvent(new CustomEvent('portfolioProjectsUpdated'));
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar el proyecto', variant: 'destructive' });
    }
  };
  const deleteProject = async (id: string) => {
    try {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      window.dispatchEvent(new CustomEvent('portfolioProjectsUpdated'));
      toast({ title: 'Éxito', description: 'Proyecto eliminado' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el proyecto', variant: 'destructive' });
    }
  };

  // Funciones para skills
  const saveSkill = async (skillData: Partial<Skill>) => {
    try {
      const newSkill = {
        ...skillData,
        id: editingSkill?.id || `skill_${Date.now()}`
      } as Skill;
      let updatedSkills;
      if (editingSkill) {
        updatedSkills = skills.map(s => s.id === editingSkill.id ? newSkill : s);
        toast({ title: 'Éxito', description: 'Skill actualizada' });
      } else {
        updatedSkills = [...skills, newSkill];
        toast({ title: 'Éxito', description: 'Skill creada' });
      }
      setSkills(updatedSkills);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
      setShowSkillForm(false);
      setEditingSkill(null);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar la skill', variant: 'destructive' });
    }
  };
  const deleteSkill = async (id: string) => {
    try {
      const updatedSkills = skills.filter(s => s.id !== id);
      setSkills(updatedSkills);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
      toast({ title: 'Éxito', description: 'Skill eliminada' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la skill', variant: 'destructive' });
    }
  };

  // Funciones para radar
  const saveRadarSkill = async (radarSkillData: Partial<RadarSkill>) => {
    try {
      const newRadarSkill = {
        ...radarSkillData,
        id: editingRadarSkill?.id || `radar_${Date.now()}`
      } as RadarSkill;
      let updatedRadarSkills;
      if (editingRadarSkill) {
        updatedRadarSkills = radarSkills.map(s => s.id === editingRadarSkill.id ? newRadarSkill : s);
        toast({ title: 'Éxito', description: 'Radar skill actualizada' });
      } else {
        updatedRadarSkills = [...radarSkills, newRadarSkill];
        toast({ title: 'Éxito', description: 'Radar skill creada' });
      }
      setRadarSkills(updatedRadarSkills);
      localStorage.setItem('portfolio_skills_radar', JSON.stringify(updatedRadarSkills));
      setShowRadarSkillForm(false);
      setEditingRadarSkill(null);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar la radar skill', variant: 'destructive' });
    }
  };
  const deleteRadarSkill = async (id: string) => {
    try {
      const updatedRadarSkills = radarSkills.filter(s => s.id !== id);
      setRadarSkills(updatedRadarSkills);
      localStorage.setItem('portfolio_skills_radar', JSON.stringify(updatedRadarSkills));
      toast({ title: 'Éxito', description: 'Radar skill eliminada' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la radar skill', variant: 'destructive' });
    }
  };

  // Funciones para timeline
  const saveTimelineProject = async (projectData: Partial<TimelineProject>) => {
    try {
      const newProject = {
        ...projectData,
        id: editingTimelineProject?.id || `timeline_${Date.now()}`
      } as TimelineProject;
      let updatedProjects;
      if (editingTimelineProject) {
        updatedProjects = timelineProjects.map(p => p.id === editingTimelineProject.id ? newProject : p);
        toast({ title: 'Éxito', description: 'Proyecto de timeline actualizado' });
      } else {
        updatedProjects = [...timelineProjects, newProject];
        toast({ title: 'Éxito', description: 'Proyecto de timeline creado' });
      }
      setTimelineProjects(updatedProjects);
      localStorage.setItem('portfolio_timeline', JSON.stringify(updatedProjects));
      setShowTimelineProjectForm(false);
      setEditingTimelineProject(null);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar el proyecto de timeline', variant: 'destructive' });
    }
  };
  const deleteTimelineProject = async (id: string) => {
    try {
      const updatedProjects = timelineProjects.filter(p => p.id !== id);
      setTimelineProjects(updatedProjects);
      localStorage.setItem('portfolio_timeline', JSON.stringify(updatedProjects));
      toast({ title: 'Éxito', description: 'Proyecto de timeline eliminado' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el proyecto de timeline', variant: 'destructive' });
    }
  };

  // Funciones para certificaciones
  const saveCertification = async (certData: Partial<Certification>) => {
    try {
      const newCert = {
        ...certData,
        id: editingCert?.id || `cert_${Date.now()}`
      } as Certification;
      let updatedCerts;
      if (editingCert) {
        updatedCerts = certifications.map(c => c.id === editingCert.id ? newCert : c);
        toast({ title: 'Éxito', description: 'Certificación actualizada' });
      } else {
        updatedCerts = [...certifications, newCert];
        toast({ title: 'Éxito', description: 'Certificación creada' });
      }
      setCertifications(updatedCerts);
      localStorage.setItem('portfolio_certifications', JSON.stringify(updatedCerts));
      setShowCertForm(false);
      setEditingCert(null);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar la certificación', variant: 'destructive' });
    }
  };
  const deleteCertification = async (id: string) => {
    try {
      const updatedCerts = certifications.filter(c => c.id !== id);
      setCertifications(updatedCerts);
      localStorage.setItem('portfolio_certifications', JSON.stringify(updatedCerts));
      toast({ title: 'Éxito', description: 'Certificación eliminada' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la certificación', variant: 'destructive' });
    }
  };

  return (
    <>
      {adminButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('admin.admin_panel')}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {/* user?.email */}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  {t('admin.logout')}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('admin.profile')}
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('admin.projects')}
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('admin.skills')}
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Radar
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('admin.certifications')}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <ProfileForm profile={profile} onSave={saveProfile} />
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mis Proyectos</h3>
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Proyecto
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={(p) => {
                      setEditingProject(p)
                      setShowProjectForm(true)
                    }}
                    onDelete={deleteProject}
                  />
                ))}
              </div>

              {showProjectForm && (
                <ProjectForm
                  project={editingProject}
                  onSave={saveProject}
                  onCancel={() => {
                    setShowProjectForm(false)
                    setEditingProject(null)
                  }}
                />
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mis Skills</h3>
                <Button onClick={() => setShowSkillForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Skill
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={(s) => {
                      setEditingSkill(s)
                      setShowSkillForm(true)
                    }}
                    onDelete={deleteSkill}
                  />
                ))}
              </div>

              {showSkillForm && (
                <SkillForm
                  skill={editingSkill}
                  onSave={saveSkill}
                  onCancel={() => {
                    setShowSkillForm(false)
                    setEditingSkill(null)
                  }}
                />
              )}
            </TabsContent>

            {/* Radar Tab */}
            <TabsContent value="radar" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Radar Skills</h3>
                <Button onClick={() => setShowRadarSkillForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Radar Skill
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {radarSkills.map((skill) => (
                  <Card key={skill.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{skill.skill}</CardTitle>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingRadarSkill(skill); setShowRadarSkillForm(true) }}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteRadarSkill(skill.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Badge variant="secondary" style={{ background: skill.color, color: '#fff' }}>{skill.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Nivel:</span>
                        <Badge variant="outline">{skill.level}%</Badge>
                        <span className="text-xs">Color:</span>
                        <span style={{ background: skill.color, width: 16, height: 16, display: 'inline-block', borderRadius: 4 }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {showRadarSkillForm && (
                <RadarSkillForm
                  radarSkill={editingRadarSkill}
                  onSave={saveRadarSkill}
                  onCancel={() => { setShowRadarSkillForm(false); setEditingRadarSkill(null) }}
                />
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Timeline Projects</h3>
                <Button onClick={() => setShowTimelineProjectForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Proyecto Timeline
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {timelineProjects.map((project) => (
                  <Card key={project.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{project.title}</CardTitle>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingTimelineProject(project); setShowTimelineProjectForm(true) }}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteTimelineProject(project.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Badge variant="secondary">{project.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground mb-2">{project.date}</div>
                      <div className="text-xs mb-2">{project.status}</div>
                      <div className="text-xs mb-2">{project.impact}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {showTimelineProjectForm && (
                <TimelineProjectForm
                  project={editingTimelineProject}
                  onSave={saveTimelineProject}
                  onCancel={() => { setShowTimelineProjectForm(false); setEditingTimelineProject(null) }}
                />
              )}
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mis Certificaciones</h3>
                <Button onClick={() => setShowCertForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Certificación
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {certifications.map((cert) => (
                  <CertificationCard
                    key={cert.id}
                    certification={cert}
                    onEdit={(c) => {
                      setEditingCert(c)
                      setShowCertForm(true)
                    }}
                    onDelete={deleteCertification}
                  />
                ))}
              </div>

              {showCertForm && (
                <CertificationForm
                  certification={editingCert}
                  onSave={saveCertification}
                  onCancel={() => {
                    setShowCertForm(false)
                    setEditingCert(null)
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Componentes auxiliares
function ProfileForm({ profile, onSave }: { profile: ProfileInfo | null, onSave: (data: Partial<ProfileInfo>) => void }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    title_en: profile?.title_en || '',
    title_es: profile?.title_es || '',
    description_en: profile?.description_en || '',
    description_es: profile?.description_es || '',
    resumeUrl: profile?.resumeUrl || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    twitterUrl: profile?.twitterUrl || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre completo"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title_es">Título (Español)</Label>
          <Input
            id="title_es"
            value={formData.title_es}
            onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
            placeholder="Visionario en IA y Ciencia de Datos"
          />
        </div>
        <div>
          <Label htmlFor="title_en">Title (English)</Label>
          <Input
            id="title_en"
            value={formData.title_en}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            placeholder="AI & Data Science Visionary"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description_es">Descripción (Español)</Label>
          <Textarea
            id="description_es"
            value={formData.description_es}
            onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
            placeholder="Descripción profesional en español..."
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="description_en">Description (English)</Label>
          <Textarea
            id="description_en"
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            placeholder="Professional description in English..."
            rows={3}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <Label htmlFor="resumeUrl">URL del CV</Label>
          <Input
            id="resumeUrl"
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input
            id="twitterUrl"
            value={formData.twitterUrl}
            onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
            placeholder="https://twitter.com/..."
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="location">Ubicación</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Ciudad, País"
        />
      </div>
      <Button type="submit" className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Guardar Perfil
      </Button>
    </form>
  )
}

function ProjectCard({ project, onEdit, onDelete }: { 
  project: Project, 
  onEdit: (project: Project) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm">{project.title}</CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(project)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(project.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <Badge variant={project.featured ? "default" : "secondary"}>
          {project.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectForm({ project, onSave, onCancel }: {
  project: Project | null,
  onSave: (data: Partial<Project>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    category: project?.category || 'ML',
    technologies: project?.technologies || [],
    imageUrl: project?.imageUrl || '',
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false
  })

  const [techInput, setTechInput] = useState('')

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ML">ML</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción corta</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Descripción larga</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>Tecnologías</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Agregar tecnología"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button type="button" onClick={addTechnology}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                  {tech} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="demoUrl">URL de demo</Label>
              <Input
                id="demoUrl"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">URL de GitHub</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Proyecto destacado</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function SkillCard({ skill, onEdit, onDelete }: { 
  skill: Skill, 
  onEdit: (skill: Skill) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>{skill.icon}</span>
            {skill.name}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(skill)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(skill.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="mb-2">{skill.category}</Badge>
        <div className="text-sm text-muted-foreground">Nivel: {skill.level}%</div>
      </CardContent>
    </Card>
  )
}

function SkillForm({ skill, onSave, onCancel }: {
  skill: Skill | null,
  onSave: (data: Partial<Skill>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    level: skill?.level || 50,
    category: skill?.category || 'Programming',
    icon: skill?.icon || '⚡'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{skill ? 'Editar Skill' : 'Nueva Skill'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icono (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="⚡"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="ML/AI">ML/AI</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Nivel ({formData.level}%)</Label>
              <Input
                id="level"
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function CertificationCard({ certification, onEdit, onDelete }: { 
  certification: Certification, 
  onEdit: (cert: Certification) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>{certification.icon}</span>
            {certification.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(certification)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(certification.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-1">{certification.issuer}</p>
        <Badge variant="secondary">{certification.year}</Badge>
      </CardContent>
    </Card>
  )
}

function CertificationForm({ certification, onSave, onCancel }: {
  certification: Certification | null,
  onSave: (data: Partial<Certification>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: certification?.title || '',
    issuer: certification?.issuer || '',
    year: certification?.year || new Date().getFullYear().toString(),
    icon: certification?.icon || '🏆'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{certification ? 'Editar Certificación' : 'Nueva Certificación'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icono (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🏆"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issuer">Emisor</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function RadarSkillForm({ radarSkill, onSave, onCancel }: {
  radarSkill: RadarSkill | null,
  onSave: (data: Partial<RadarSkill>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    skill: radarSkill?.skill || '',
    level: radarSkill?.level || 80,
    category: radarSkill?.category || '',
    color: radarSkill?.color || '#00D4FF'
  })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(formData) }} className="space-y-4">
      <div>
        <Label htmlFor="skill">Nombre</Label>
        <Input id="skill" value={formData.skill} onChange={e => setFormData({ ...formData, skill: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="level">Nivel (%)</Label>
        <Input id="level" type="number" min={0} max={100} value={formData.level} onChange={e => setFormData({ ...formData, level: Number(e.target.value) })} required />
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="color">Color</Label>
        <SketchPicker color={formData.color} onChange={color => setFormData({ ...formData, color: color.hex })} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="w-full"><Save className="w-4 h-4 mr-2" />Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancelar</Button>
      </div>
    </form>
  )
}

function TimelineProjectForm({ project, onSave, onCancel }: {
  project: TimelineProject | null,
  onSave: (data: Partial<TimelineProject>) => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    date: project?.date || '',
    category: project?.category || '',
    technologies: project?.technologies || [],
    image: project?.image || '',
    status: project?.status || 'completed',
    impact: project?.impact || '',
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || ''
  })
  const [techInput, setTechInput] = useState('')
  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }
  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="date">Fecha (YYYY-MM)</Label>
        <Input id="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="technologies">Tecnologías</Label>
        <div className="flex gap-2 mb-2">
          <Input id="technologies" value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="Añadir tecnología" />
          <Button type="button" onClick={addTechnology}>Añadir</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map(tech => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech} <Button type="button" size="sm" variant="ghost" onClick={() => removeTechnology(tech)}>x</Button>
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="image">Imagen (URL)</Label>
        <Input id="image" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="status">Estado</Label>
        <select id="status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded p-2">
          <option value="completed">Completado</option>
          <option value="in-progress">En progreso</option>
          <option value="planned">Planeado</option>
        </select>
      </div>
      <div>
        <Label htmlFor="impact">Impacto</Label>
        <Input id="impact" value={formData.impact} onChange={e => setFormData({ ...formData, impact: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="demoUrl">Demo URL</Label>
        <Input id="demoUrl" value={formData.demoUrl} onChange={e => setFormData({ ...formData, demoUrl: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input id="githubUrl" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="w-full"><Save className="w-4 h-4 mr-2" />Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">Cancelar</Button>
      </div>
    </form>
  )
}