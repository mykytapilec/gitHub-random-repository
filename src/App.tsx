import { useEffect, useState } from 'react'
import { fetchProgrammingLanguages } from './api/programming-languages'
import type { ProgrammingLanguage } from './api/programming-languages'
import { fetchRandomRepository } from './api/github-repositories'
import type { GitHubRepository } from './api/github-repositories'
import './App.css'

function App() {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const [repository, setRepository] = useState<GitHubRepository | null>(null)
  const [isRepositoryLoading, setIsRepositoryLoading] = useState(false)
  const [repositoryError, setRepositoryError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadLanguages() {
      try {
        const result = await fetchProgrammingLanguages()

        if (isActive) {
          setLanguages(result)
          setSelectedLanguage(
            (current) =>
              current || result[0]?.value || '',
          )
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

  async function findRepository() {
    setIsRepositoryLoading(true)
    setRepositoryError('')
    setRepository(null)

    try {
      const result = await fetchRandomRepository(selectedLanguage)
      setRepository(result)
    } catch {
      setRepositoryError(
        'Unable to load a repository. Please try again.',
      )
    } finally {
      setIsRepositoryLoading(false)
    }
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
            <>
              <select
                id="programming-language"
                value={selectedLanguage}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value)
                  setRepository(null)
                  setRepositoryError('')
                }}
              >
                {languages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.name}
                  </option>
                ))}
              </select>

              <button
                className="find-button"
                type="button"
                onClick={findRepository}
                disabled={!selectedLanguage || isRepositoryLoading}
              >
                {isRepositoryLoading
                  ? 'Finding repository...'
                  : 'Find repository'}
              </button>
            </>
          )}
        </div>

        {isRepositoryLoading && (
          <p className="feedback repository-feedback" role="status">
            Searching GitHub repositories...
          </p>
        )}

        {repositoryError && (
          <div className="error-panel repository-feedback">
            <p className="feedback" role="alert">
              {repositoryError}
            </p>
            <button
              className="retry-button"
              type="button"
              onClick={findRepository}
            >
              Try again
            </button>
          </div>
        )}

        {!isRepositoryLoading && !repositoryError && repository === null && (
          <p className="feedback repository-feedback" aria-live="polite">
            Select a language and find a repository to get started.
          </p>
        )}

        {!isRepositoryLoading &&
          !repositoryError &&
          repository !== null && (
            <article
              className="repository-card"
              aria-labelledby="repository-name"
            >
              <div className="repository-header">
                <p className="repository-label">RECOMMENDED REPOSITORY</p>
                <span className="repository-language">
                  {repository.language || selectedLanguage}
                </span>
              </div>

              <h2 id="repository-name">
                <a
                  href={repository.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {repository.full_name}
                </a>
              </h2>

              <p className="repository-description">
                {repository.description || 'No description provided.'}
              </p>

              <dl className="repository-stats">
                <div>
                  <dt>Stars</dt>
                  <dd>{repository.stargazers_count.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Forks</dt>
                  <dd>{repository.forks_count.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Open issues</dt>
                  <dd>{repository.open_issues_count.toLocaleString()}</dd>
                </div>
              </dl>

              <a
                className="repository-link"
                href={repository.html_url}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          )}
      </section>
    </main>
  )
}

export default App
