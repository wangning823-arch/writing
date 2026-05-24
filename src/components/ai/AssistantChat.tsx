'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/types'

interface AssistantChatProps {
  subject: 'chinese' | 'english'
  topic: string
  currentContent: string
}

export default function AssistantChat({ subject, topic, currentContent }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        subject === 'chinese'
          ? '你好！我是笔锋写作助手。写作中遇到任何问题都可以问我——审题、构思、词汇、结构，我来帮你！'
          : 'Hi! I\'m your writing assistant. Ask me anything about your essay — topic analysis, structure, vocabulary, or grammar!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (overrideInput?: string) => {
    const text = overrideInput || input.trim()
    if (!text || isStreaming) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
    ])

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          currentContent,
          message: userMsg.content,
        }),
      })

      if (!res.ok) throw new Error('请求失败')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('无响应流')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const { text } = JSON.parse(data)
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + text } : m
                )
              )
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: '抱歉，请求出错了，请重试。' }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const quickQuestions =
    subject === 'chinese'
      ? ['帮我审审题', '给我一些构思角度', '有哪些高级词汇可以用？', '我的论证够有力吗？']
      : ['Help me analyze the topic', 'Suggest some vocabulary', 'Check my grammar', 'How to improve structure?']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="assistant-header">
        <h3 className="assistant-title">AI写作助手</h3>
        <p className="assistant-subtitle">
          {subject === 'chinese' ? '语文' : '英语'}写作辅导
        </p>
      </div>

      <div ref={scrollRef} className="assistant-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="chat-message"
            style={{ marginLeft: msg.role === 'user' ? 'auto' : '0' }}
          >
            <div className={msg.role === 'user' ? 'user-message' : 'ai-message'}>
              <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              {msg.role === 'assistant' && msg.content === '' && isStreaming && (
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 2 && (
        <div className="quick-questions">
          <p className="quick-questions-label">快速提问：</p>
          <div className="quick-questions-buttons">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => {
                  sendMessage(q)
                }}
                className="quick-question-btn"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="assistant-input-area">
        <div className="assistant-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="输入你的问题..."
            disabled={isStreaming}
            className="assistant-input"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isStreaming || !input.trim()}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: isStreaming || !input.trim() ? 0.5 : 1,
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}
