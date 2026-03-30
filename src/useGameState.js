import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const socketUrl = isDev ? `http://${window.location.hostname}:3000` : window.location.origin; 

export function useGameState() {
  const [syncedState, setSyncedState] = useState({
    screen: 'START',
    players: [],
    host: '',
    currentRound: null,
    currentQuestion: null,
    openedQuestions: [],
    removedSuperTopics: [],
  });

  const [localRole, setLocalRole] = useState(() => {
    return localStorage.getItem('dukatskiy-quiz-role') || 'HOST';
  });
  
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(socketUrl);
    
    socketRef.current.on('state-update', (serverState) => {
      setSyncedState(serverState);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const updateSyncedState = (updater) => {
    const nextPartial = typeof updater === 'function' ? updater(syncedState) : updater;
    // Optimistic update
    setSyncedState(prev => ({ ...prev, ...nextPartial }));
    // Send to server
    socketRef.current.emit('update-state', nextPartial);
  };

  const setRole = (role) => {
    setLocalRole(role);
    localStorage.setItem('dukatskiy-quiz-role', role);
  };

  const resetGame = () => {
    socketRef.current.emit('reset-game');
  };

  return { state: syncedState, updateState: updateSyncedState, role: localRole, setRole, resetGame };
}
