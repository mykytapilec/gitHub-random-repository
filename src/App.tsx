import { useEffect, useState } from 'react'
import { fetchProgrammingLanguages } from './api/programming-languages'
import type { ProgrammingLanguage } from './api/programming-languages'
import './App.css'

function App() {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isActive = true

    async function loadLanguages() {
      try {
        const result = await fetchProgrammingLanguages()

        if (isActive) {
          setLanguages(result)
          setSelectedLanguage((current) => current || result[0].value)
          setError('')
        }
      } catch {
        if (isActive) {
          setError(
            'Unable to load programming languages. Please try again.',
          )
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadLanguages()

    return () => {
      isActive = false
    }
  }, [retryCount])

  function retryLoadingLanguages() {
    setIsLoading(true)
    setError('')
    setRetryCount((count) => count + 1)
  }

  return (
    <main className="app-shell">
      <section className="welcome-card" aria-labelledby="app-title">
        <p className="eyebrow">GITHUB RANDOM REPOSITORY</p>

        <h1 id="app-title">Discover your next project</h1>

        <p className="description">
          Explore GitHub repositories and find inspiration for your next
          development project.
        </p>

        <div className="language-field">
          <label htmlFor="programming-language">
            Programming language
          </label>

          {isLoading ? (
            <p className="feedback" role="status">
              Loading programming languages...
            </p>
          ) : error ? (
            <div className="error-panel">
              <p className="feedback" role="alert">
                {error}
              </p>
              <button
                className="retry-button"
                type="button"
                onClick={retryLoadingLanguages}
              >
                Try again
              </button>
            </div>
          ) : (
            <select
              id="programming-language"
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>
    </main>
  )
}

export default App