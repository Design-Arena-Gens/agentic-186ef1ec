'use client'

import { useState } from 'react'

interface AnalysisResult {
  emails: string[]
  discord: string[]
  socialMedia: {
    twitter: string[]
    facebook: string[]
    instagram: string[]
    linkedin: string[]
    youtube: string[]
    tiktok: string[]
    github: string[]
  }
}

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeChannel = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Channel Analyzer
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Extract emails, Discord handles, and social media links from any text
        </p>

        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste channel content, URLs, or text to analyze..."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>

        <button
          onClick={analyzeChannel}
          disabled={loading || !input.trim()}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            background: loading || !input.trim()
              ? '#ccc'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Channel'}
        </button>

        {result && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#333'
            }}>
              Analysis Results
            </h2>

            <Section title="📧 Email Addresses" items={result.emails} />
            <Section title="💬 Discord Handles" items={result.discord} />

            <div style={{ marginTop: '20px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#555'
              }}>
                🌐 Social Media
              </h3>
              <div style={{ paddingLeft: '15px' }}>
                <SubSection title="Twitter" items={result.socialMedia.twitter} />
                <SubSection title="Facebook" items={result.socialMedia.facebook} />
                <SubSection title="Instagram" items={result.socialMedia.instagram} />
                <SubSection title="LinkedIn" items={result.socialMedia.linkedin} />
                <SubSection title="YouTube" items={result.socialMedia.youtube} />
                <SubSection title="TikTok" items={result.socialMedia.tiktok} />
                <SubSection title="GitHub" items={result.socialMedia.github} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#555'
      }}>
        {title}
      </h3>
      {items.length > 0 ? (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {items.map((item, idx) => (
            <li key={idx} style={{
              padding: '8px 12px',
              background: 'white',
              borderRadius: '4px',
              marginBottom: '6px',
              fontSize: '14px',
              color: '#333',
              border: '1px solid #e0e0e0'
            }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
          None found
        </p>
      )}
    </div>
  )
}

function SubSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null

  return (
    <div style={{ marginBottom: '15px' }}>
      <h4 style={{
        fontSize: '15px',
        fontWeight: '500',
        marginBottom: '8px',
        color: '#666'
      }}>
        {title}
      </h4>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {items.map((item, idx) => (
          <li key={idx} style={{
            padding: '6px 10px',
            background: 'white',
            borderRadius: '4px',
            marginBottom: '4px',
            fontSize: '13px',
            color: '#333',
            border: '1px solid #e0e0e0'
          }}>
            <a href={item} target="_blank" rel="noopener noreferrer" style={{
              color: '#667eea',
              textDecoration: 'none'
            }}>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
