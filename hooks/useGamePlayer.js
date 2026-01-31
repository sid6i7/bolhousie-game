import { useState, useEffect, useRef, useCallback } from 'react';
import usePeer from './usePeer';

export default function useGamePlayer() {
  const { peer, myId, loading: peerLoading, connectionStatus } = usePeer();
  const [gameState, setGameState] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  
  // Track connection attempt to prevent duplicates
  const connectionAttemptRef = useRef(false);

  // Derived loading state: peer is loading OR we're in the process of connecting
  const loading = peerLoading || connecting;

  const connectToHost = useCallback((hostId, playerName) => {
    // Don't connect if peer isn't ready
    if (!peer) {
      console.log('Player: Cannot connect yet, peer not ready');
      return;
    }
    
    // Don't connect if already connected or connecting
    if (connectionAttemptRef.current || isConnected) {
      console.log('Player: Already connected or connecting');
      return;
    }

    console.log('Player: Connecting to host', hostId);
    setConnecting(true);
    setError(null);
    connectionAttemptRef.current = true;

    const conn = peer.connect(hostId, {
      reliable: true, // Use reliable data channel
      metadata: { playerName }
    });

    // Connection timeout
    const timeoutId = setTimeout(() => {
      if (!conn.open) {
        console.log('Player: Connection timeout');
        setError('Connection timeout - host may not be available');
        setConnecting(false);
        connectionAttemptRef.current = false;
        conn.close();
      }
    }, 10000); // 10 second timeout

    conn.on('open', () => {
      clearTimeout(timeoutId);
      console.log('Player: Connected to host!');
      setIsConnected(true);
      setConnecting(false);
      setConnection(conn);
      
      // Join immediately
      conn.send({ type: 'JOIN', payload: { name: playerName } });
    });

    conn.on('data', (data) => {
      if (data.type === 'STATE_UPDATE') {
        console.log('Player: State update received');
        setGameState(data.state);
      }
    });

    conn.on('close', () => {
      clearTimeout(timeoutId);
      console.log('Player: Disconnected from host');
      setIsConnected(false);
      setConnecting(false);
      setConnection(null);
      connectionAttemptRef.current = false;
      setError('Disconnected from host');
    });

    conn.on('error', (err) => {
      clearTimeout(timeoutId);
      console.error('Player: Connection error', err);
      setError(err.message || 'Connection failed');
      setConnecting(false);
      connectionAttemptRef.current = false;
    });
  }, [peer, isConnected]);

  const sendClaim = useCallback((claimData) => {
    if (connection && connection.open) {
      connection.send({ type: 'CLAIM', payload: claimData });
    } else {
      console.warn('Player: Cannot send claim, not connected');
    }
  }, [connection]);

  return {
    playerId: myId,
    loading,
    peerReady: !peerLoading && connectionStatus === 'connected',
    connectToHost,
    isConnected,
    gameState,
    error,
    sendClaim,
    connectionStatus
  };
}
