import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from './useGameState';
import StartScreen from './components/StartScreen';
import LobbyScreen from './components/LobbyScreen';
import RoundSelect from './components/RoundSelect';
import GameTable from './components/GameTable';
import QuestionScreen from './components/QuestionScreen';
import SuperGame from './components/SuperGame';
import WinnerScreen from './components/WinnerScreen';

export default function App() {
  const { state, updateState, role, setRole, resetGame } = useGameState();

  const renderScreen = () => {
    switch (state.screen) {
      case 'START':
        return <StartScreen updateState={updateState} />;
      case 'LOBBY':
        return <LobbyScreen state={state} updateState={updateState} role={role} setRole={setRole} />;
      case 'ROUND_SELECT':
        return <RoundSelect state={state} updateState={updateState} />;
      case 'TABLE':
        return <GameTable state={state} updateState={updateState} role={role} />;
      case 'QUESTION':
        return <QuestionScreen state={state} updateState={updateState} role={role} />;
      case 'SUPER_GAME':
        return <SuperGame state={state} updateState={updateState} role={role} />;
      case 'WINNER_SCREEN':
        return <WinnerScreen state={state} updateState={updateState} />;
      default:
        return <div>404</div>;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 1.02, y: -10 }
  };

  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePos({ x, y });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Modern Reactive Background */}
      <div 
        className="dynamic-bg" 
        style={{ 
          background: `
            radial-gradient(at ${mousePos.x}% ${mousePos.y}%, hsla(338, 78%, 64%, 0.2) 0px, transparent 40%),
            radial-gradient(at 0% 0%, hsla(172, 59%, 67%, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, hsla(276, 33%, 21%, 0.4) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(172, 59%, 67%, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, hsla(338, 78%, 64%, 0.15) 0px, transparent 50%)
          `
        }} 
      />
    </div>
  );
}
