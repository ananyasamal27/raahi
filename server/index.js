const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Import modular services
const { generateRouteDetails } = require('./ai-engine/routingEngine');
const { getSmartCityStats } = require('./analytics/trafficAnalytics');
const { initSocket } = require('./realtime/socketService');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Production Socket.IO configuration supporting fallback transports
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

// Initialize socket service listeners
initSocket(io);

// 1. Health check endpoint (Defined BEFORE static or wildcard routing)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. Safe Routing Engine API Endpoint
app.post('/api/route', (req, res) => {
  const { source, destination } = req.body;
  if (!source || !destination) {
    return res.status(400).json({ error: 'Source and destination names are required.' });
  }

  try {
    const routeData = generateRouteDetails(source.name, destination.name);
    res.json(routeData);
  } catch (error) {
    console.error("Error generating route coordinates", error);
    res.status(500).json({ error: "Failed to generate route profiles." });
  }
});

// 3. Smart City Telemetry API Endpoint
app.get('/api/analytics', (req, res) => {
  try {
    const stats = getSmartCityStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch smart city stats." });
  }
});

// Serve static compiled assets from client/dist in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// Wildcard fallback redirects non-API paths back to React routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`RAAHI Server listening on port ${PORT}`);
});