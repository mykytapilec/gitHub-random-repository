import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="welcome-card" aria-labelledby="app-title">
        <p className="eyebrow">GITHUB RANDOM REPOSITORY</p>

        <h1 id="app-title">Discover your next project</h1>

        <p className="description">
          Explore GitHub repositories and find inspiration for your next
          development project.
        </p>

        <p className="status">
          <span className="status-indicator" aria-hidden="true" />
          Project initialized
        </p>
      </section>
    </main>
  )
}

export default App