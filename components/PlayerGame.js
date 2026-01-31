import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Ticket from '@/components/Ticket';
import ClaimPanel from '@/components/ClaimPanel';
import { generateTicket } from '@/utils/gameUtils';
import useGamePlayer from '@/hooks/useGamePlayer';
import bollywoodNames from '@/data/bollywoodNames';

export default function PlayerGame({ hostId }) {
  const router = useRouter();
  
  const { 
    connectToHost, 
    isConnected, 
    gameState, 
    sendClaim, 
    error,
    loading,
    peerReady
  } = useGamePlayer();

  const [ticket, setTicket] = useState(null);
  const [markedIds, setMarkedIds] = useState(new Set());
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  // Generate ticket once on mount
  useEffect(() => {
    setTicket(generateTicket());
  }, []);

  const getRandomBollywoodName = () => {
    const randomIndex = Math.floor(Math.random() * bollywoodNames.length);
    setPlayerName(bollywoodNames[randomIndex]);
  };

  const handleJoinGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }
    setHasJoined(true);
  };

  // Connect to host only when peer is ready and player has joined
  useEffect(() => {
    if (hostId && peerReady && hasJoined && !isConnected && playerName.trim()) {
      console.log('PlayerGame: Peer ready, connecting to host...');
      connectToHost(hostId, playerName.trim());
    }
  }, [hostId, peerReady, hasJoined, isConnected, connectToHost, playerName]);

  const currentTagline = gameState?.currentTagline;

  // Show loading state while peer is initializing
  if (loading && !isConnected && hasJoined) {
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
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Connecting...</h2>
          <p style={{ margin: 0, color: '#666' }}>Joining as {playerName}</p>
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

  // Show name entry screen before joining
  if (!hasJoined) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        padding: '2rem'
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '2rem', color: 'var(--color-primary)' }}>
          Enter Your Name
        </h2>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          width: '100%',
          maxWidth: '350px'
        }}>
          <input 
            type="text"
            placeholder="Your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{
              padding: '15px',
              fontSize: '1.2rem',
              borderRadius: '8px',
              border: '3px solid #333',
              fontFamily: 'var(--font-body)',
              textAlign: 'center'
            }}
            maxLength={20}
          />
          
          <button 
            className="retro-btn secondary"
            onClick={getRandomBollywoodName}
            style={{ width: '100%' }}
          >
            🎲 Randomize Name
          </button>
          
          <button 
            className="retro-btn"
            onClick={handleJoinGame}
            style={{ width: '100%', marginTop: '10px' }}
            disabled={!playerName.trim()}
          >
            Join Game 🎮
          </button>
          
          <button 
            className="retro-btn" 
            style={{ fontSize: '1rem', padding: '10px', background: '#666' }} 
            onClick={() => router.push('/')}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
        <div>
           <button className="retro-btn" style={{ fontSize: '1rem', padding: '8px' }} onClick={() => router.push('/')}>
            ← Back
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>👤 {playerName}</span>
          <span style={{ 
             backgroundColor: isConnected ? 'green' : 'red', 
             color: 'white', 
             padding: '5px 10px', 
             borderRadius: '15px', 
             fontSize: '0.9rem' 
           }}>
             {isConnected ? 'ONLINE' : 'OFFLINE'}
           </span>
        </div>
      </header>

      {/* ERROR DISPLAY */}
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '15px', 
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #ef9a9a',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <strong>⚠️ {error}</strong>
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#c62828',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '20px' }}>
        
        <div style={{ 
            background: '#222', 
            color: '#ffeb3b', 
            padding: '20px', 
            borderRadius: '10px', 
            width: '100%', 
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            minHeight: '120px',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
           <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>
             {currentTagline ? `"${currentTagline}"` : "Waiting for Host..."}
           </h3>
           {gameState?.history?.length > 1 && (
             <p style={{ margin: '10px 0 0 0', color: '#aaa', fontSize: '1rem' }}>
               Last brand: "{gameState.history[gameState.history.length-2].name}"
             </p>
           )}
        </div>

        <Ticket 
          ticket={ticket} 
          markedIds={markedIds} 
          onToggle={(id) => {
            const newSet = new Set(markedIds);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            setMarkedIds(newSet);
          }} 
          isPlayer={true} 
        />

        <ClaimPanel 
          ticket={ticket} 
          markedIds={markedIds} 
          onClaim={(claimType) => sendClaim({ claimType, playerName })}
        />
      </div>
    </div>
  );
}

