export default function Layout({ children }) {
  return (
    <div className="retro-container">
      {/* Retro TV Antenna */}
      <div className="tv-antenna-container">
        <div className="tv-antenna left">
          <div className="tv-antenna-tip"></div>
        </div>
        <div className="tv-antenna right">
          <div className="tv-antenna-tip"></div>
        </div>
      </div>
      
      <div className="tv-frame">
        <div className="screen">
          <div className="scanlines"></div>
          {children}
        </div>
      </div>
      
      {/* TV Stand */}
      <div className="tv-stand"></div>
      
      <footer style={{ marginTop: '50px', fontFamily: 'var(--font-heading)' }}>
        <p>Bolhousie - 90s Edition</p>
      </footer>
    </div>
  );
}

