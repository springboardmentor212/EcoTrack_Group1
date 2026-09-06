function Layout({ children }) {

  return (
    <div className="app-layout">
      <header className="app-header">
        <h2>EcoTrack</h2>
      </header>

      <main className="app-content">
        {children}
      </main>
    </div>
  )
}

export default Layout