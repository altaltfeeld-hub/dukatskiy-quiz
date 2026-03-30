import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const defaultState = {
  screen: 'START',
  players: [],
  host: '',
  currentRound: null,
  currentQuestion: null,
  openedQuestions: [],
  removedSuperTopics: [],
};

let gameState = { ...defaultState };

io.on('connection', (socket) => {
  socket.emit('state-update', gameState);

  socket.on('update-state', (partialState) => {
    gameState = { ...gameState, ...partialState };
    io.emit('state-update', gameState);
  });

  socket.on('reset-game', () => {
    gameState = { ...defaultState };
    io.emit('state-update', gameState);
  });
});

// Serve static files from the React app (built by Vite)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Catch-all to handle React Router / SPA routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO Server listening on all interfaces at port ${PORT}`);
});
