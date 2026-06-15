const activeTrackings = new Map();

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    socket.on('start-guardian', (data) => {
      console.log(`Guardian mode started for ${socket.id}`, data);
      
      // Prevent stale intervals for the same socket ID
      if (activeTrackings.has(socket.id)) {
        clearInterval(activeTrackings.get(socket.id).interval);
      }

      let { currentLat, currentLng, safeZoneLat, safeZoneLng } = data;
      
      // Fallback coordinates (SRM Kattankulathur)
      if (!currentLat) currentLat = 12.8230;
      if (!currentLng) currentLng = 80.0444;
      if (!safeZoneLat) safeZoneLat = 12.8238;
      if (!safeZoneLng) safeZoneLng = 80.0434;

      let elapsedSeconds = 0;

      const interval = setInterval(() => {
        elapsedSeconds++;

        const dLat = safeZoneLat - currentLat;
        const dLng = safeZoneLng - currentLng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        const step = 0.0006; 
        
        if (dist <= step) {
          currentLat = safeZoneLat;
          currentLng = safeZoneLng;
          clearInterval(interval); // Stop ticking when destination safe zone is reached
        } else {
          currentLat += (dLat / dist) * step;
          currentLng += (dLng / dist) * step;
        }

        // Random signal strength fluctuation: 4 to 5 bars
        const signal = Math.floor(Math.random() * 2) + 4;

        socket.emit('guardian-tick', {
          elapsedSeconds,
          lat: currentLat,
          lng: currentLng,
          signal
        });

        const tracking = activeTrackings.get(socket.id);
        if (tracking) {
          tracking.currentLat = currentLat;
          tracking.currentLng = currentLng;
          tracking.elapsedSeconds = elapsedSeconds;
        }

      }, 1000);

      activeTrackings.set(socket.id, {
        interval,
        currentLat,
        currentLng,
        safeZoneLat,
        safeZoneLng,
        elapsedSeconds
      });
    });

    socket.on('stop-guardian', () => {
      console.log(`Guardian mode stopped for ${socket.id}`);
      if (activeTrackings.has(socket.id)) {
        clearInterval(activeTrackings.get(socket.id).interval);
        activeTrackings.delete(socket.id);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
      if (activeTrackings.has(socket.id)) {
        clearInterval(activeTrackings.get(socket.id).interval);
        activeTrackings.delete(socket.id);
      }
    });
  });
}

module.exports = {
  initSocket
};
