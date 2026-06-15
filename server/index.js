const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { generateRouteDetails } = require('./ai-engine/routingEngine');
const { getSmartCityStats } = require('./analytics/trafficAnalytics');
const { initSocket } = require('./realtime/socketService');

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

initSocket(io);

app.get('/', (req, res) => {
  res.json({
    status: 'RAAHI Backend Running',
    message: 'AI Mobility Operating System Active'
  });
});

app.post('/api/route', (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({
      error: 'Source and destination are required.'
    });
  }

  try {
    const routeData = generateRouteDetails(
      source.name,
      destination.name
    );

    res.json(routeData);
  } catch (error) {
    console.error('Route generation error:', error);

    res.status(500).json({
      error: 'Failed to generate route data.'
    });
  }
});

app.get('/api/analytics', (req, res) => {
  try {
    const stats = getSmartCityStats();
    res.json(stats);
  } catch (error) {
    console.error('Analytics error:', error);

    res.status(500).json({
      error: 'Failed to fetch analytics.'
    });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`RAAHI Server listening on port ${PORT}`);
});