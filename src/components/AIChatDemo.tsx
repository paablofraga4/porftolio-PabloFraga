import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Send, Bot, User, Sparkles, Brain, Zap } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  typing?: boolean
}

const demoResponses = [
  "I'm an AI assistant specialized in data science and machine learning. I can help you understand complex algorithms, analyze data patterns, and provide insights on AI implementations.",
  "That's a great question about neural networks! Deep learning models use multiple layers to learn hierarchical representations of data, making them incredibly powerful for tasks like image recognition and natural language processing.",
  "Machine learning is transforming industries by enabling computers to learn from data without explicit programming. From recommendation systems to autonomous vehicles, ML is everywhere!",
  "Data preprocessing is crucial for ML success. It involves cleaning, transforming, and preparing raw data for analysis. Good data quality leads to better model performance.",
  "Computer vision combines AI with image processing to enable machines to 'see' and interpret visual information. It's used in medical imaging, autonomous driving, and facial recognition.",
  "Natural Language Processing (NLP) helps computers understand and generate human language. Modern transformers like GPT have revolutionized how we interact with AI systems."
]

const quickQuestions = [
  "What is machine learning?",
  "How do neural networks work?",
  "Explain computer vision",
  "What is data preprocessing?",
  "Tell me about NLP",
  "AI in healthcare applications"
]

export function AIChatDemo() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hello! I'm an AI assistant showcasing advanced conversational capabilities. Ask me anything about data science, machine learning, or AI!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateTyping = (response: string) => {
    setIsTyping(true)
    
    // Add typing indicator
    const typingMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: '',
      timestamp: new Date(),
      typing: true
    }
    setMessages(prev => [...prev, typingMessage])

    setTimeout(() => {
      setMessages(prev => prev.filter(msg => !msg.typing))
      
      // Simulate character-by-character typing
      let currentText = ''
      let charIndex = 0
      
      const typeInterval = setInterval(() => {
        if (charIndex < response.length) {
          currentText += response[charIndex]
          charIndex++
          
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.type === 'ai' && !lastMessage.typing) {
              lastMessage.content = currentText
            } else {
              newMessages.push({
                id: Date.now().toString(),
                type: 'ai',
                content: currentText,
                timestamp: new Date()
              })
            }
            return newMessages
          })
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
        }
      }, 30)
    }, 1000)
  }

  const handleSendMessage = (message: string = inputValue) => {
    if (!message.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
    simulateTyping(randomResponse)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('ai_demo.title') || 'AI Assistant Demo'}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('ai_demo.description') || 'Experience the power of conversational AI. This interactive demo showcases advanced natural language processing and machine learning capabilities.'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass hover-lift">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-full bg-primary/20">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <span className="gradient-text">AI Data Science Assistant</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className={`transition-all duration-500 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent ${
                  isExpanded ? 'h-96' : 'h-64'
                }`}
              >
                <div className="space-y-4 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`p-2 rounded-full ${
                        message.type === 'user' 
                          ? 'bg-accent/20' 
                          : 'bg-primary/20'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-accent" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-accent/20 text-accent-foreground'
                          : 'bg-primary/10 text-foreground'
                      }`}>
                        {message.typing ? (
                          <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <div className="text-xs text-muted-foreground mt-2">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Questions */}
              {!isTyping && (
                <div className="mb-4 p-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Quick questions to try:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.slice(0, 3).map((question) => (
                      <Button
                        key={question}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-2 p-4 border-t border-border/50">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about AI, machine learning, or data science..."
                  disabled={isTyping}
                  className="flex-1 bg-background/50 border-primary/30 focus:border-primary"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary hover:bg-primary/80 animate-glow"
                >
                  {isTyping ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Expand/Collapse Button */}
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:bg-primary/10"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isExpanded ? 'Collapse Chat' : 'Expand Chat'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: Brain,
                title: 'Advanced NLP',
                description: 'Natural language understanding with context awareness'
              },
              {
                icon: Zap,
                title: 'Real-time Processing',
                description: 'Instant responses with streaming text generation'
              },
              {
                icon: Sparkles,
                title: 'Domain Expertise',
                description: 'Specialized knowledge in AI and data science'
              }
            ].map((feature) => (
              <Card key={feature.title} className="glass hover-lift text-center">
                <CardContent className="pt-6">
                  <div className="p-3 rounded-full bg-primary/20 w-fit mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}