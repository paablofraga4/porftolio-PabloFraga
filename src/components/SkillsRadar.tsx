import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useLanguage } from '../contexts/LanguageContext'

interface SkillData {
  skill: string
  level: number
  category: string
  color: string
}

const defaultSkillsData: SkillData[] = [
  { skill: 'Machine Learning', level: 95, category: 'AI/ML', color: '#00D4FF' },
  { skill: 'Deep Learning', level: 90, category: 'AI/ML', color: '#FF6B35' },
  { skill: 'Python', level: 95, category: 'Programming', color: '#00D4FF' },
  { skill: 'TensorFlow', level: 88, category: 'Frameworks', color: '#FF6B35' },
  { skill: 'Data Analysis', level: 92, category: 'Data Science', color: '#00D4FF' },
  { skill: 'Computer Vision', level: 85, category: 'AI/ML', color: '#FF6B35' },
  { skill: 'NLP', level: 82, category: 'AI/ML', color: '#00D4FF' },
  { skill: 'Statistics', level: 88, category: 'Mathematics', color: '#FF6B35' }
]

export function SkillsRadar() {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [skillsData, setSkillsData] = useState<SkillData[]>(defaultSkillsData)

  useEffect(() => {
    try {
      const savedSkillsRadar = localStorage.getItem('portfolio_skills_radar')
      if (savedSkillsRadar) {
        setSkillsData(JSON.parse(savedSkillsRadar))
      }
    } catch (e) {
      setSkillsData(defaultSkillsData)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 40

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw concentric circles
      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius / 5) * i
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 + i * 0.05})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw percentage labels
        ctx.fillStyle = 'rgba(0, 212, 255, 0.6)'
        ctx.font = '12px Inter'
        ctx.textAlign = 'center'
        ctx.fillText(`${i * 20}%`, centerX, centerY - radius - 5)
      }

      // Draw skill axes and data points
      skillsData.forEach((skill, index) => {
        const angle = (index / skillsData.length) * Math.PI * 2 - Math.PI / 2
        const endX = centerX + Math.cos(angle) * maxRadius
        const endY = centerY + Math.sin(angle) * maxRadius

        // Draw axis line
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Calculate data point position with animation
        const animatedLevel = skill.level * animationProgress
        const dataRadius = (animatedLevel / 100) * maxRadius
        const dataX = centerX + Math.cos(angle) * dataRadius
        const dataY = centerY + Math.sin(angle) * dataRadius

        // Draw data point
        const isHovered = hoveredSkill === skill.skill
        ctx.beginPath()
        ctx.arc(dataX, dataY, isHovered ? 8 : 6, 0, Math.PI * 2)
        ctx.fillStyle = skill.color
        ctx.fill()
        
        if (isHovered) {
          ctx.strokeStyle = skill.color
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw skill label
        const labelX = centerX + Math.cos(angle) * (maxRadius + 20)
        const labelY = centerY + Math.sin(angle) * (maxRadius + 20)
        
        ctx.fillStyle = isHovered ? skill.color : 'rgba(255, 255, 255, 0.8)'
        ctx.font = isHovered ? 'bold 14px Inter' : '12px Inter'
        ctx.textAlign = labelX > centerX ? 'left' : 'right'
        ctx.fillText(skill.skill, labelX, labelY)
        
        // Draw level percentage
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '10px Inter'
        ctx.fillText(`${Math.round(animatedLevel)}%`, labelX, labelY + 15)
      })

      // Draw connecting lines between data points
      ctx.beginPath()
      skillsData.forEach((skill, index) => {
        const angle = (index / skillsData.length) * Math.PI * 2 - Math.PI / 2
        const animatedLevel = skill.level * animationProgress
        const dataRadius = (animatedLevel / 100) * maxRadius
        const dataX = centerX + Math.cos(angle) * dataRadius
        const dataY = centerY + Math.sin(angle) * dataRadius

        if (index === 0) {
          ctx.moveTo(dataX, dataY)
        } else {
          ctx.lineTo(dataX, dataY)
        }
      })
      ctx.closePath()
      ctx.fillStyle = 'rgba(0, 212, 255, 0.1)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    drawRadar()
  }, [animationProgress, hoveredSkill])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate the radar chart
            let progress = 0
            const animate = () => {
              progress += 0.02
              setAnimationProgress(Math.min(progress, 1))
              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            animate()
          }
        })
      },
      { threshold: 0.3 }
    )

    const canvas = canvasRef.current
    if (canvas) {
      observer.observe(canvas)
    }

    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 40

    let closestSkill: string | null = null
    let minDistance = Infinity

    skillsData.forEach((skill, index) => {
      const angle = (index / skillsData.length) * Math.PI * 2 - Math.PI / 2
      const dataRadius = (skill.level / 100) * maxRadius
      const dataX = centerX + Math.cos(angle) * dataRadius
      const dataY = centerY + Math.sin(angle) * dataRadius

      const distance = Math.sqrt((mouseX - dataX) ** 2 + (mouseY - dataY) ** 2)
      if (distance < 20 && distance < minDistance) {
        minDistance = distance
        closestSkill = skill.skill
      }
    })

    setHoveredSkill(closestSkill)
  }

  return (
    <Card className="glass hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          <span className="gradient-text">{t('skills.radar_title') || 'Skills Radar'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSkill(null)}
        />
      </CardContent>
    </Card>
  )
}