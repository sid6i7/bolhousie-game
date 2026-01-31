import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [hostId, setHostId] = useState('');

  const handleJoin = () => {
    if (hostId.trim()) {
      router.push(`/game?mode=player&hostId=${hostId.trim()}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '4rem 1rem' }}>
      <h1 className="logo">Bolhousie</h1>
      <h2 style={{ fontFamily: 'var(--font-body)', marginBottom: '3rem', color: '#555' }}>
        Feel the Nostalgia
      </h2>
      
      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', width: '300px' }}>
        <Link href="/game?mode=host" passHref>
          <button className="retro-btn" style={{ width: '100%' }}>Create New Game</button>
        </Link>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', borderTop: '2px dashed #999', paddingTop: '2rem' }}>
          <input 
            type="text" 
            placeholder="Enter Host ID" 
            value={hostId}
            onChange={(e) => setHostId(e.target.value)}
            style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '2px solid #555', fontFamily: 'monospace' }}
          />
          <button className="retro-btn secondary" style={{ width: '100%' }} onClick={handleJoin}>
            Join Existing Game
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '1rem', opacity: 0.6, fontSize: '0.9rem' }}>
        <p>No backend. Browser to Browser.</p>
      </div>
    </div>
  );
}
