import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRaahiStore } from '../store/useRaahiStore';

// Custom icons using CSS DivIcon to bypass Vite marker bundling issues and apply animations
const liveTrackingIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute w-7 h-7 bg-soft-red rounded-full animate-ping opacity-60"></div>
      <div class="relative w-4 h-4 bg-soft-red border-2 border-white rounded-full shadow-lg shadow-soft-red/40 z-10"></div>
    </div>
  `,
  className: 'custom-commuter-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const safeZoneIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute w-7 h-7 bg-neon-teal rounded-full animate-ping opacity-25"></div>
      <div class="flex items-center justify-center w-7 h-7 bg-matte-black border-2 border-neon-teal rounded-full shadow-lg shadow-neon-teal/30 relative z-10">
        <span class="text-xs">🛡️</span>
      </div>
    </div>
  `,
  className: 'custom-safe-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Community Signal Pins
const safeShopIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-6 h-6 bg-emerald-500 border border-white rounded-full shadow-md text-[11px]">🏪</div>`,
  className: 'com-safe-shop', iconSize: [24, 24], iconAnchor: [12, 12]
});
const policeIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-6 h-6 bg-blue-600 border border-white rounded-full shadow-md text-[11px]">👮</div>`,
  className: 'com-police', iconSize: [24, 24], iconAnchor: [12, 12]
});
const hazardIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center w-6 h-6 bg-amber/90 border border-white rounded-full shadow-md text-[11px] animate-pulse">⚠️</div>`,
  className: 'com-hazard', iconSize: [24, 24], iconAnchor: [12, 12]
});

// Digital Twin Icons
const metroTwinIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-7 h-7 bg-indigo-950 border border-cyan-400 rounded-lg shadow-cyan-400/20 shadow-md">
      <span class="text-[10px]">🚇</span>
      <span class="absolute -top-1 -right-1 flex h-1.5 w-1.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
      </span>
    </div>
  `,
  className: 'twin-metro', iconSize: [28, 28], iconAnchor: [14, 14]
});

const busTwinIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-7 h-7 bg-amber-950 border border-amber rounded-lg shadow-amber/20 shadow-md">
      <span class="text-[10px]">🚌</span>
    </div>
  `,
  className: 'twin-bus', iconSize: [28, 28], iconAnchor: [14, 14]
});

const startIcon = new L.DivIcon({
  html: `
    <div class="flex items-center justify-center w-6 h-6 bg-white border-2 border-slate-950 rounded-full shadow-md">
      <span class="text-slate-950 text-xs font-bold">A</span>
    </div>
  `,
  className: 'custom-start-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const endIcon = new L.DivIcon({
  html: `
    <div class="flex items-center justify-center w-6 h-6 bg-neon-teal border-2 border-slate-950 rounded-full shadow-md shadow-neon-teal/20">
      <span class="text-slate-950 text-xs font-bold">B</span>
    </div>
  `,
  className: 'custom-end-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const transitDotIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-5 h-5">
      <div class="absolute w-4 h-4 bg-electric-cyan rounded-full animate-ping opacity-60"></div>
      <div class="relative w-3 h-3 bg-electric-cyan border-2 border-white rounded-full shadow-lg"></div>
    </div>
  `,
  className: 'custom-transit-dot-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Helper component to dynamically fit route bounds
function MapBoundsUpdater({ waypoints, selectedRoute }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      map.fitBounds(waypoints, { padding: [50, 50] });
    }
  }, [waypoints, selectedRoute, map]);
  return null;
}

// Helper component to follow commuter live
function MapLiveFollower({ lat, lng, active }) {
  const map = useMap();
  useEffect(() => {
    if (active && lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.0 });
    }
  }, [lat, lng, active, map]);
  return null;
}

// Helper component to smoothly center simulation commuter without changing zoom
function MapSimulationFollower({ lat, lng, active }) {
  const map = useMap();
  useEffect(() => {
    if (active && lat && lng) {
      map.panTo([lat, lng]);
    }
  }, [lat, lng, active, map]);
  return null;
}

export default function RouteMap() {
  const {
    selectedRoute,
    safeZones,
    crowdZones,
    guardianActive,
    liveTracking,
    activeSimulation,
    communitySignals
  } = useRaahiStore();

  const [transitIndex, setTransitIndex] = useState(0);
  const [twinIndex, setTwinIndex] = useState(0);

  // Digital Twin simulated routes
  const metroTwinCoordinates = [
    [13.0084, 80.2131],
    [13.0180, 80.2200],
    [13.0280, 80.2250],
    [13.0380, 80.2300],
    [13.0418, 80.2341]
  ];
  const busTwinCoordinates = [
    [12.9249, 80.1000],
    [12.9400, 80.1200],
    [12.9600, 80.1500],
    [12.9800, 80.1800],
    [13.0084, 80.2131]
  ];

  // Default coordinate center (Chennai Central region)
  const defaultCenter = [13.0827, 80.2707];
  const defaultZoom = 12;

  const hasRoute = selectedRoute && selectedRoute.waypoints && selectedRoute.waypoints.length > 0;

  // Determine line color by transit mode
  const getSegmentColor = (mode) => {
    switch (mode) {
      case 'walk': return '#0D9488'; // dashed teal
      case 'metro': return '#06B6D4'; // cyan
      case 'bus': return '#F59E0B'; // amber
      case 'train': return '#22D3EE'; // electric-cyan
      case 'auto': return '#14B8A6'; // neon-teal
      default: return '#10B981';
    }
  };

  // Loop animated transit dot along waypoints when idle
  useEffect(() => {
    if (hasRoute && !guardianActive && !activeSimulation.active) {
      const interval = setInterval(() => {
        setTransitIndex((prev) => (prev + 1) % selectedRoute.waypoints.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedRoute, hasRoute, guardianActive, activeSimulation.active]);

  // Loop digital twin transit flows
  useEffect(() => {
    const interval = setInterval(() => {
      setTwinIndex((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Reset transit dot index when route changes
  useEffect(() => {
    setTransitIndex(0);
  }, [selectedRoute]);

  const commuterPosition = activeSimulation.active && selectedRoute && selectedRoute.waypoints[activeSimulation.currentIndex]
    ? selectedRoute.waypoints[activeSimulation.currentIndex]
    : null;

  return (
    <div className="w-full h-full relative min-h-[400px] border border-neon-teal/20 rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.1)] overflow-hidden">
      
      {/* Map Legend (Absolutely positioned overlay in corner) */}
      <div className="absolute top-4 right-4 z-[500] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 text-[10px] md:text-xs text-slate-300 max-w-[200px] flex flex-col gap-1.5 shadow-2xl pointer-events-none select-none">
        <p className="font-bold text-[9px] uppercase tracking-wider text-slate-400 mb-0.5 border-b border-white/5 pb-1">Mobility Telemetry Legend</p>
        
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-1 border-t border-dashed border-[#0D9488] font-bold"></div>
          <span>Walk (Dashed Teal)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-1 bg-[#22D3EE] rounded-full"></div>
          <span>Train (Electric-Cyan)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-1 bg-[#14B8A6] rounded-full"></div>
          <span>Auto Link (Neon-Teal)</span>
        </div>
        
        <div className="border-t border-white/5 my-1" />
        
        <div className="flex items-center gap-2">
          <span className="text-[10px]">🏪</span>
          <span>Verified Safe Shop</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">🚇</span>
          <span>Digital Twin Metro Train</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/10 border border-emerald-500 animate-pulse"></div>
          <span>Well-Lit Safe Heatmap</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600/15 border border-red-600 animate-pulse"></div>
          <span>Incident Risk Hotspot</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full min-h-[400px] z-10"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Dynamic bounds handler */}
        {hasRoute && !guardianActive && (
          <MapBoundsUpdater waypoints={selectedRoute.waypoints} selectedRoute={selectedRoute} />
        )}

        {/* Live track follower */}
        {guardianActive && liveTracking.lat && liveTracking.lng && (
          <MapLiveFollower lat={liveTracking.lat} lng={liveTracking.lng} active={guardianActive} />
        )}

        {/* Simulation follower */}
        {activeSimulation.active && commuterPosition && (
          <MapSimulationFollower lat={commuterPosition[0]} lng={commuterPosition[1]} active={activeSimulation.active} />
        )}

        {/* City Safety Heatmap Grids */}
        {/* Safe Corridor Zone (Chennai SRM area) */}
        <Circle
          center={[12.8235, 80.0450]}
          radius={220}
          pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.08, weight: 1 }}
        />
        {/* Poorly lit warning zone (Suburban line) */}
        <Circle
          center={[12.9238, 80.0988]}
          radius={300}
          pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.12, weight: 1 }}
        />
        {/* High incident zone (Dadar surge) */}
        <Circle
          center={[18.9696, 72.8194]}
          radius={350}
          pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.14, weight: 1, className: 'animate-pulse' }}
        />

        {/* Render Route Polylines segment by segment */}
        {hasRoute && selectedRoute.segments && selectedRoute.segments.map((seg, idx) => {
          const color = getSegmentColor(seg.mode);
          const isDashed = seg.mode === 'walk';
          return (
            <React.Fragment key={`seg-${idx}`}>
              <Polyline
                positions={seg.waypoints}
                color={color}
                weight={8}
                opacity={0.15}
                dashArray={isDashed ? "3, 6" : undefined}
              />
              <Polyline
                positions={seg.waypoints}
                color={color}
                weight={3.5}
                opacity={0.85}
                dashArray={isDashed ? "3, 6" : undefined}
              />
            </React.Fragment>
          );
        })}

        {/* Community Signals Report Pins */}
        {communitySignals.map((signal) => {
          let icon = safeShopIcon;
          if (signal.type === 'police') icon = policeIcon;
          if (signal.type === 'hazard') icon = hazardIcon;

          return (
            <Marker key={signal.id} position={[signal.lat, signal.lng]} icon={icon}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <p className="font-bold text-slate-800">{signal.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    {signal.verified ? "✅ Verified RAAHI Signal" : "⚠️ Citizen Reported"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Digital Twin Passive Nodes */}
        <Marker position={metroTwinCoordinates[twinIndex]} icon={metroTwinIcon}>
          <Popup><p className="font-semibold text-xs text-slate-800">Digital Twin: Metro Train #12</p></Popup>
        </Marker>
        <Marker position={busTwinCoordinates[twinIndex]} icon={busTwinIcon}>
          <Popup><p className="font-semibold text-xs text-slate-800">Digital Twin: MTC Transit Bus #51G</p></Popup>
        </Marker>

        {/* Start and End Markers */}
        {hasRoute && (
          <>
            <Marker position={selectedRoute.waypoints[0]} icon={startIcon}>
              <Popup><p className="font-semibold text-slate-800">Source Point</p></Popup>
            </Marker>
            <Marker position={selectedRoute.waypoints[selectedRoute.waypoints.length - 1]} icon={endIcon}>
              <Popup><p className="font-semibold text-slate-800">Destination Point</p></Popup>
            </Marker>
          </>
        )}

        {/* Render Passive Loop Transit Dot when idle */}
        {hasRoute && !guardianActive && !activeSimulation.active && selectedRoute.waypoints[transitIndex] && (
          <Marker position={selectedRoute.waypoints[transitIndex]} icon={transitDotIcon}>
            <Popup><p className="font-semibold text-slate-800 text-xs">Simulated Transit Node</p></Popup>
          </Marker>
        )}

        {/* Render Active Simulation Commuter Dot */}
        {commuterPosition && (
          <Marker position={commuterPosition} icon={transitDotIcon}>
            <Popup><p className="font-semibold text-slate-800 text-xs">Active Commuter Node</p></Popup>
          </Marker>
        )}

        {/* Render Safe Zones with Pulse animations */}
        {safeZones.map((zone, idx) => (
          <Marker key={`safe-${idx}`} position={[zone.lat, zone.lng]} icon={safeZoneIcon}>
            <Popup>
              <div className="p-1 font-sans">
                <p className="font-bold text-teal-700 text-xs flex items-center gap-1">🛡️ Safe Haven Kiosk</p>
                <p className="font-semibold text-slate-800 text-xs mt-1">{zone.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Continuous CCTV Link & SOS Intercom</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Crowd Danger Zones with Live Opacity Pulse class */}
        {crowdZones.map((zone, idx) => (
          <Circle
            key={`crowd-${idx}`}
            center={[zone.lat, zone.lng]}
            radius={zone.radius || 100}
            pathOptions={{
              color: zone.intensity > 70 ? '#EF4444' : '#F59E0B',
              fillColor: zone.intensity > 70 ? '#EF4444' : '#F59E0B',
              fillOpacity: 0.18,
              weight: 1.5,
              className: "animate-pulse"
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <p className={`font-bold text-xs ${zone.intensity > 70 ? 'text-red-600' : 'text-amber-600'}`}>
                  ⚠️ Crowd Bottleneck ({zone.intensity}%)
                </p>
                <p className="font-semibold text-slate-800 text-xs mt-1">{zone.name}</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Render Guardian Live Marker */}
        {guardianActive && liveTracking.lat && liveTracking.lng && (
          <>
            <Marker position={[liveTracking.lat, liveTracking.lng]} icon={liveTrackingIcon}>
              <Popup>
                <div className="p-1 font-sans">
                  <p className="font-bold text-red-600 text-xs">🔴 Guardian Tracking Active</p>
                  <p className="text-xs text-slate-700 mt-1">Commuter Coordinates</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{liveTracking.lat.toFixed(5)}, {liveTracking.lng.toFixed(5)}</p>
                </div>
              </Popup>
            </Marker>

            {/* Connect live tracking marker to nearest safe zone with visual line */}
            {safeZones.length > 0 && (
              <Polyline
                positions={[
                  [liveTracking.lat, liveTracking.lng],
                  [safeZones[0].lat, safeZones[0].lng]
                ]}
                color="#EF4444"
                weight={2.5}
                dashArray="5, 8"
                opacity={0.8}
              />
            )}
          </>
        )}
      </MapContainer>

      {/* Map Overlay info if no route is loaded */}
      {!hasRoute && !guardianActive && (
        <div className="absolute inset-0 bg-matte-black/75 z-20 flex flex-col items-center justify-center p-6 text-center">
          <p className="font-display font-semibold text-xl text-slate-200">Interactive Map View</p>
          <p className="text-sm text-slate-400 max-w-sm mt-2">
            Plan a route using the side panel to view safety indexes, safe zones, and crowd bottlenecks overlay.
          </p>
        </div>
      )}
    </div>
  );
}
