import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Caller from '@/components/Caller';
import useGameHost from '@/hooks/useGameHost';

export default function HostGame() {
  const router = useRouter();
  const { 
    hostId, 
    loading,
    connectionStatus,
    gameState, 
    startGame, 
    callNextTagline 
  } = useGameHost();

  const handleCopyId = () => {
    if (hostId) {
      navigator.clipboard.writeText(hostId);
      alert('ID Copied: ' + hostId);
    }
  };

  // Show loading state while peer is initializing
  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #eee',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Creating Game...</h2>
          <p style={{ margin: 0, color: '#666' }}>Setting up your host connection</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Get status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4caf50';
      case 'connecting': return '#ff9800';
      case 'disconnected': return '#f44336';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'CONNECTED';
      case 'connecting': return 'CONNECTING...';
      case 'disconnected': return 'RECONNECTING...';
      case 'error': return 'ERROR';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div style={{ padding: '1rem', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
        <div>
           <button className="retro-btn" style={{ fontSize: '0.8rem', padding: '5px' }} onClick={() => router.push('/')}>
            ← Back
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Connection Status */}
          <span style={{ 
            backgroundColor: getStatusColor(), 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '15px', 
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}>
            {getStatusText()}
          </span>
          
          {/* Game ID */}
          <div style={{ textAlign: 'center', background: '#333', color: '#fff', padding: '10px', borderRadius: '5px' }}>
             <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>GAME ID (Share this)</p>
             <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleCopyId}>
               {hostId || 'Loading...'} 📋
             </p>
          </div>
        </div>
      </header>

      {/* Connection Error Warning */}
      {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
        <div style={{ 
          background: '#fff3e0', 
          color: '#e65100', 
          padding: '10px 20px', 
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #ffcc80',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          ⚠️ Connection issue detected. Attempting to reconnect...
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '20px' }}>
        
        <Caller onCall={callNextTagline} history={gameState?.history || []} />

        {/* Claims Notification Area */}
        {gameState?.claims?.length > 0 && (
          <div style={{ width: '100%', maxWidth: '600px', background: '#e1f5fe', padding: '15px', borderRadius: '10px', border: '2px solid #0288d1' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0277bd' }}>📢 Recent Claims</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {gameState.claims.map(claim => (
                 <li key={claim.id} style={{ 
                   background: '#fff', 
                   padding: '10px', 
                   marginBottom: '5px', 
                   borderRadius: '5px',
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   boxShadow: '0 2px 2px rgba(0,0,0,0.1)'
                 }}>
                    <span><strong>{claim.player}</strong> claims <strong>{claim.type}</strong>!</span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(claim.id).toLocaleTimeString()}</span>
                 </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '600px', background: '#fff', padding: '20px', borderRadius: '10px' }}>
            <h3>Players ({gameState?.players?.length || 0})</h3>
            {gameState?.players?.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Waiting for players to join... Share the Game ID above!
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {gameState?.players?.map(p => (
                  <li key={p.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                    👤 {p.name}
                  </li>
                ))}
              </ul>
            )}
        </div>

      </div>
    </div>
  );
}
