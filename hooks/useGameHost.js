import { useState, useEffect, useRef, useCallback } from 'react';
import usePeer from './usePeer';
import brands from '@/data/brands.json';

// Initial Game State
const INITIAL_STATE = {
  status: 'LOBBY', // LOBBY, PLAYING, ENDED
  currentTagline: null,
  history: [],
  players: [], // { id, name, score }
  winner: null
};

export default function useGameHost() {
  const { peer, myId, loading, connectionStatus } = usePeer();
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const gameStateRef = useRef(gameState); // Keep ref synced
  const connectionsRef = useRef([]); // Keep track of all player connections
  
  // Sync Ref
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // pool of brands to call
  const [pool, setPool] = useState([]);

  // Broadcast state to all players
  const broadcast = useCallback((state) => {
    const payload = { type: 'STATE_UPDATE', state };
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        conn.send(payload);
      }
    });
  }, []);

  // Update state and broadcast
  const updateGameState = useCallback((updates) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      broadcast(newState);
      return newState;
    });
  }, [broadcast]);

  const handlePlayerMessage = useCallback((conn, data) => {
    const currentState = gameStateRef.current; // access latest state via ref
    
    switch (data.type) {
      case 'JOIN':
        const newPlayer = { id: conn.peer, name: data.payload.name || 'Anonymous', score: 0 };
        const exists = currentState.players.find(p => p.id === conn.peer);
        if (!exists) {
          updateGameState({ players: [...currentState.players, newPlayer] });
        }
        break;
      
      case 'CLAIM':
        const newClaim = {
          id: Date.now(),
          playerId: conn.peer,
          player: data.payload.playerName || 'Unknown',
          type: data.payload.claimType,
          status: 'PENDING'
        };
        updateGameState({ claims: [newClaim, ...currentState.claims || []] });
        break;
        
      default:
        console.log('Host: Unknown message', data);
    }
  }, [updateGameState]); // check if updateGameState is stable (it is)

  useEffect(() => {
    if (!peer) return;

    peer.on('connection', (conn) => {
      console.log('Host: Player connected', conn.peer);
      
      conn.on('open', () => {
        connectionsRef.current.push(conn);
        
        // Send current state immediately (using ref)
        conn.send({ type: 'STATE_UPDATE', state: gameStateRef.current });
      });

      conn.on('data', (data) => {
        handlePlayerMessage(conn, data);
      });

      conn.on('close', () => {
        console.log('Host: Player disconnected', conn.peer);
        connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
        
        // Remove player from game state when they disconnect
        const currentState = gameStateRef.current;
        const updatedPlayers = currentState.players.filter(p => p.id !== conn.peer);
        updateGameState({ players: updatedPlayers });
      });
    });
  }, [peer, handlePlayerMessage]);

  // Actions
  const startGame = () => {
    setPool([...brands]); // Reset pool
    updateGameState({ status: 'PLAYING', history: [], currentTagline: null });
  };

  const callNextTagline = (callData) => {
    // callData comes from Caller component which picks random
    // We update state
    const newHistory = [...gameState.history, callData];
    updateGameState({ 
      currentTagline: callData.tagline,
      history: newHistory
    });
  };

  return {
    hostId: myId,
    loading,
    connectionStatus,
    gameState,
    startGame,
    callNextTagline
  };
}
