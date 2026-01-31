import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing PeerJS peer connection.
 * Handles React Strict Mode (double-render), reconnection on disconnect,
 * and provides connection status tracking.
 * 
 * Uses a local PeerJS server at localhost:9000 for development.
 */
export default function usePeer() {
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'disconnected', 'error'
  
  // Use ref to track if we've already initialized (handles React Strict Mode)
  const initRef = useRef(false);
  const peerRef = useRef(null);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    // In Strict Mode, React mounts, unmounts, and re-mounts components
    // The cleanup resets initRef, so reinitializing is allowed
    if (initRef.current) {
      console.log('Peer: Already initializing, skipping...');
      return;
    }
    initRef.current = true;

    let mounted = true;
    console.log('Peer: Initializing...');

    const initPeer = async () => {
      try {
        const { Peer } = await import('peerjs');
        
        // Create peer with configurable server (env vars for production, localhost for dev)
        const peerHost = process.env.NEXT_PUBLIC_PEER_HOST || 'localhost';
        const peerPort = parseInt(process.env.NEXT_PUBLIC_PEER_PORT || '9000', 10);
        const peerSecure = process.env.NEXT_PUBLIC_PEER_SECURE === 'true';
        
        console.log(`Peer: Connecting to ${peerSecure ? 'wss' : 'ws'}://${peerHost}:${peerPort}`);
        
        const newPeer = new Peer({
          host: peerHost,
          port: peerPort,
          path: '/',
          secure: peerSecure,
          debug: 2, // Show warnings and errors
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
            ]
          }
        });

        peerRef.current = newPeer;

        newPeer.on('open', (id) => {
          if (!mounted) return;
          console.log('Peer: Connection opened, ID:', id);
          setMyId(id);
          setLoading(false);
          setConnectionStatus('connected');
          setPeer(newPeer);
        });

        newPeer.on('disconnected', () => {
          if (!mounted) return;
          console.log('Peer: Disconnected from server, attempting reconnect...');
          setConnectionStatus('disconnected');
          
          // Attempt to reconnect
          setTimeout(() => {
            if (peerRef.current && !peerRef.current.destroyed) {
              peerRef.current.reconnect();
            }
          }, 1000);
        });

        newPeer.on('close', () => {
          if (!mounted) return;
          console.log('Peer: Connection closed');
          setConnectionStatus('disconnected');
        });

        newPeer.on('error', (err) => {
          if (!mounted) return;
          console.error('Peer error:', err.type, err.message);
          
          // Handle specific error types
          if (err.type === 'unavailable-id') {
            // ID is taken, let PeerJS assign a new one
            console.log('Peer: ID unavailable, will get new ID');
          } else if (err.type === 'network' || err.type === 'server-error') {
            // Network issues - attempt to reconnect
            setConnectionStatus('error');
            setTimeout(() => {
              if (peerRef.current && !peerRef.current.destroyed) {
                peerRef.current.reconnect();
              }
            }, 2000);
          } else if (err.type === 'peer-unavailable') {
            // The peer we're trying to connect to doesn't exist
            // Don't set error state here, let the connection handle it
            console.warn('Peer: Target peer unavailable');
          } else {
            setConnectionStatus('error');
          }
          
          setLoading(false);
        });

      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load PeerJS', err);
        setLoading(false);
        setConnectionStatus('error');
      }
    };

    initPeer();

    // Cleanup on unmount
    return () => {
      console.log('Peer: Cleanup running');
      mounted = false;
      // Reset initRef so that on next mount, we can reinitialize
      initRef.current = false;
      if (peerRef.current && !peerRef.current.destroyed) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, []);

  return { peer, myId, loading, connectionStatus };
}
