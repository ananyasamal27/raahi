import React, { useState, useEffect, useRef } from 'react';
import { useRaahiStore } from '../store/useRaahiStore';
import { Navigation, Clock, ShieldCheck, Leaf, AlertCircle, RefreshCw, Sparkles, Play, Pause, Square, Footprints, Train, Bus, Zap, WifiOff, Award, Phone, UserCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RouteMap from './RouteMap';

const RAAHI_LOCATIONS = [
  { name: "SRM Kattankulathur", lat: 12.8230, lng: 80.0444 },
  { name: "T. Nagar (Chennai)", lat: 13.0418, lng: 80.2341 },
  { name: "Chennai Central", lat: 13.0827, lng: 80.2707 },
  { name: "KSR Bengaluru", lat: 12.9779, lng: 77.5697 },
  { name: "CSMT Mumbai", lat: 18.9400, lng: 72.8354 },
  { name: "Pune Junction", lat: 18.5284, lng: 73.8739 },
  { name: "New Delhi Station", lat: 28.6429, lng: 77.2201 },
  { name: "Cyber City (Gurgaon)", lat: 28.4950, lng: 77.0897 },
  { name: "Kempegowda Airport", lat: 13.1986, lng: 77.7066 },
  { name: "Indiranagar (Bangalore)", lat: 12.9719, lng: 77.6412 }
];

const PRESET_ROUTES = [
  { label: "SRM ➔ T. Nagar (Chennai)", src: "SRM Kattankulathur", dest: "T. Nagar (Chennai)" },
  { label: "Chennai Central ➔ KSR Bengaluru", src: "Chennai Central", dest: "KSR Bengaluru" },
  { label: "CSMT Mumbai ➔ Pune Junction", src: "CSMT Mumbai", dest: "Pune Junction" },
  { label: "New Delhi ➔ Cyber City (Gurgaon)", src: "New Delhi Station", dest: "Cyber City (Gurgaon)" },
  { label: "KIA Airport ➔ Indiranagar (BLR)", src: "Kempegowda Airport", dest: "Indiranagar (Bangalore)" }
];

export default function RoutePlanner() {
  const {
    source,
    destination,
    routeOptions,
    selectedRoute,
    loadingRoutes,
    errorRoutes,
    activeSimulation,
    offlineMode,
    walkCompanionMode,
    setSource,
    setDestination,
    setRouteOptions,
    setSelectedRoute,
    setSafeZones,
    setCrowdZones,
    setLoadingRoutes,
    setErrorRoutes,
    setSimulationState,
    addJourneyHistory,
    setWalkCompanionMode,
    addAiAlert
  } = useRaahiStore();

  const [sourceName, setSourceName] = useState('');
  const [destName, setDestName] = useState('');
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [routeSafetyDrop, setRouteSafetyDrop] = useState(false);
  const [routeDeviated, setRouteDeviated] = useState(false);
  const simulationTimerRef = useRef(null);

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSourceName(val);
    const loc = RAAHI_LOCATIONS.find(l => l.name === val);
    if (loc) setSource(loc);
  };

  const handleDestChange = (e) => {
    const val = e.target.value;
    setDestName(val);
    const loc = RAAHI_LOCATIONS.find(l => l.name === val);
    if (loc) setDestination(loc);
  };

  // Select a preset route automatically
  const handlePresetSelect = (preset) => {
    setSourceName(preset.src);
    setDestName(preset.dest);
    
    const srcLoc = RAAHI_LOCATIONS.find(l => l.name === preset.src);
    const destLoc = RAAHI_LOCATIONS.find(l => l.name === preset.dest);
    
    if (srcLoc) setSource(srcLoc);
    if (destLoc) setDestination(destLoc);
    
    setTimeout(() => {
      findRoutesDirect(srcLoc, destLoc);
    }, 100);
  };

  const findRoutes = async () => {
    if (!source || !destination) {
      setErrorRoutes("Please select a valid source and destination from the list.");
      return;
    }
    await findRoutesDirect(source, destination);
  };

  const findRoutesDirect = async (src, dest) => {
    if (src.name === dest.name) {
      setErrorRoutes("Source and destination cannot be the same location.");
      return;
    }

    setLoadingRoutes(true);
    setErrorRoutes(null);
    setRouteSafetyDrop(false);
    setRouteDeviated(false);

    // Stop active simulation if any
    stopSimulation();

    // OFFLINE FALLBACK MODE: Use local mock coordinates instantly
    if (offlineMode) {
      setTimeout(() => {
        const mockOfflineRoute = getOfflineLocalRoute(src.name, dest.name);
        setRouteOptions(mockOfflineRoute.routes);
        setSafeZones(mockOfflineRoute.safeZones);
        setCrowdZones(mockOfflineRoute.crowdZones);
        setSelectedRoute(mockOfflineRoute.routes[0]);
        setLoadingRoutes(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ source: src, destination: dest })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch routes from server.");
      }

      const data = await response.json();
      setRouteOptions(data.routes);
      setSafeZones(data.safeZones);
      setCrowdZones(data.crowdZones);
      
      const safest = data.routes.find(r => r.type === 'safest') || data.routes[0];
      setSelectedRoute(safest);
    } catch (err) {
      setErrorRoutes(err.message || "Failed connecting to API. Running offline simulation...");
      const mockOfflineRoute = getOfflineLocalRoute(src.name, dest.name);
      setRouteOptions(mockOfflineRoute.routes);
      setSafeZones(mockOfflineRoute.safeZones);
      setCrowdZones(mockOfflineRoute.crowdZones);
      setSelectedRoute(mockOfflineRoute.routes[0]);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const getOfflineLocalRoute = (srcName, destName) => {
    const waypoints = [
      [12.8230, 80.0444],
      [12.8225, 80.0425],
      [12.8222, 80.0416],
      [12.8500, 80.0600],
      [12.9249, 80.1000],
      [12.9700, 80.1500],
      [13.0084, 80.2131],
      [13.0250, 80.2200],
      [13.0418, 80.2341]
    ];
    
    return {
      routes: [
        {
          type: "safest",
          durationMins: 45,
          fareRupees: 65,
          safetyScore: 8.9,
          crowdPercent: 42,
          co2SavedKg: 1.8,
          waypoints: waypoints,
          segments: [
            { mode: 'walk', label: "Offline Walk to local hub", timeMins: 5, waypoints: waypoints.slice(0, 3) },
            { mode: 'train', label: "Offline Sub-rail Local link", timeMins: 25, waypoints: waypoints.slice(2, 6) },
            { mode: 'auto', label: "Offline Auto to destination", timeMins: 15, waypoints: waypoints.slice(5) }
          ]
        }
      ],
      safeZones: [
        { name: "Offline Emergency Shelter Post", lat: 12.8225, lng: 80.0418 }
      ],
      crowdZones: []
    };
  };

  const getActiveSegmentIndex = (route, currentIndex) => {
    if (!route || !route.segments) return 0;
    let count = 0;
    for (let i = 0; i < route.segments.length; i++) {
      const segLen = route.segments[i].waypoints.length;
      const addedCount = i === 0 ? segLen : (segLen - 1);
      count += addedCount;
      if (currentIndex < count) {
        return i;
      }
    }
    return route.segments.length - 1;
  };

  const startSimulation = () => {
    if (!selectedRoute) return;
    setRouteSafetyDrop(false);
    setSimulationState({
      active: true,
      currentIndex: 0,
      elapsedSeconds: 0,
      activeSegmentIndex: 0
    });
  };

  const pauseSimulation = () => {
    setSimulationState({ active: false });
  };

  const stopSimulation = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }
    setRouteSafetyDrop(false);
    setSimulationState({
      active: false,
      currentIndex: 0,
      elapsedSeconds: 0,
      activeSegmentIndex: 0
    });
  };

  // Optimize route when safety drop banner is clicked (simulates AI Rerouting)
  const handleOptimizeRoute = () => {
    setRouteSafetyDrop(false);
    // Find fastest or cheapest to switch to represent detour
    const alternative = routeOptions.find(r => r.type !== selectedRoute.type) || selectedRoute;
    setSelectedRoute(alternative);
    addAiAlert({
      id: Date.now().toString(),
      text: "AI Engine: Detour optimized. Commuter switched to secure alternate link.",
      type: 'info'
    });
  };

  // Simulation timer loop
  useEffect(() => {
    if (activeSimulation.active && selectedRoute) {
      simulationTimerRef.current = setInterval(() => {
        const nextIndex = activeSimulation.currentIndex + 1;
        const totalPoints = selectedRoute.waypoints.length;

        // Trigger dynamic safety score drop at 40% progress (e.g. index 3 or 4)
        if (nextIndex === Math.floor(totalPoints * 0.4)) {
          setRouteSafetyDrop(true);
          addAiAlert({
            id: Date.now().toString(),
            text: "AI Alert: Crowd density surge detected along active segments. Safety index dropped (8.9 ➔ 7.1).",
            type: 'warning'
          });
        }

        if (nextIndex >= totalPoints) {
          clearInterval(simulationTimerRef.current);
          setSimulationState({ active: false });
          
          addJourneyHistory({
            source: source ? source.name : "Starting Hub",
            destination: destination ? destination.name : "Destination Hub",
            durationMins: selectedRoute.durationMins,
            fareRupees: selectedRoute.fareRupees,
            safetyScore: selectedRoute.safetyScore,
            co2SavedKg: selectedRoute.co2SavedKg,
            timestamp: new Date().toLocaleTimeString() + ' · ' + new Date().toLocaleDateString(),
            points: Math.round(selectedRoute.co2SavedKg * 15) + 10
          });

          setShowArrivalModal(true);
        } else {
          const activeSegIdx = getActiveSegmentIndex(selectedRoute, nextIndex);
          setSimulationState({
            currentIndex: nextIndex,
            elapsedSeconds: activeSimulation.elapsedSeconds + 2,
            activeSegmentIndex: activeSegIdx
          });
        }
      }, 500);
    }

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [activeSimulation.active, activeSimulation.currentIndex, selectedRoute]);

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'walk': return <Footprints className="w-4 h-4 text-teal-400" />;
      case 'train': return <Train className="w-4 h-4 text-cyan-400" />;
      case 'bus': return <Bus className="w-4 h-4 text-amber-400" />;
      case 'auto': return <Zap className="w-4 h-4 text-neon-teal animate-pulse" />;
      default: return <Navigation className="w-4 h-4 text-slate-400" />;
    }
  };

  const progressPercent = selectedRoute && selectedRoute.waypoints
    ? Math.round((activeSimulation.currentIndex / (selectedRoute.waypoints.length - 1)) * 100)
    : 0;

  const currentSegment = selectedRoute && selectedRoute.segments
    ? selectedRoute.segments[activeSimulation.activeSegmentIndex]
    : null;

  return (
    <section id="planner" className="py-12 px-6 max-w-7xl mx-auto border-b border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs and Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-deep-indigo border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Glossy top-gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-teal to-electric-cyan" />
            
            <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Navigation className="w-6 h-6 text-neon-teal" />
              <span>Predictive Commute Planner</span>
            </h2>

            {/* Offline Alert Indicator */}
            {offlineMode && (
              <div className="mb-4 p-3 bg-amber/10 border border-amber/20 rounded-xl text-amber text-xs flex items-center gap-2 animate-pulse font-medium">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>Offline Safe Routing Active (broadcasting coordinates via GSM SMS Fallbacks)</span>
              </div>
            )}

            {/* Preset shortcuts */}
            <div className="mb-6 space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Preset Indian Routes</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_ROUTES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(p)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 hover:border-white/20 border border-white/10 rounded-lg px-2.5 py-1.5 transition-all text-slate-300 font-semibold"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Source Point</label>
                <input
                  list="locations"
                  placeholder="Type or select starting location..."
                  value={sourceName}
                  onChange={handleSourceChange}
                  className="w-full bg-matte-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-teal transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Destination Point</label>
                <input
                  list="locations"
                  placeholder="Type or select endpoint..."
                  value={destName}
                  onChange={handleDestChange}
                  className="w-full bg-matte-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-teal transition-colors"
                />
              </div>

              <datalist id="locations">
                {RAAHI_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc.name} />
                ))}
              </datalist>

              <button
                onClick={findRoutes}
                disabled={loadingRoutes}
                className="w-full py-4 bg-neon-teal hover:bg-neon-teal/95 disabled:bg-slate-700 text-matte-black font-bold rounded-lg transition-all hover:scale-[1.01] active:scale-95 shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {loadingRoutes ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing Route Profiles...</span>
                  </>
                ) : (
                  <span>Analyze Safest Routes</span>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorRoutes && (
              <div className="mt-4 p-4 bg-soft-red/10 border border-soft-red/20 rounded-lg text-soft-red text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Routing Analysis Warning</p>
                  <p className="text-slate-300 mt-1">{errorRoutes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Simulation & Smart Safety Controls */}
          {selectedRoute && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-200">Commute Simulation</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Trace moving commuter telemetry live</p>
                </div>
                <div className="flex items-center gap-2">
                  {!activeSimulation.active ? (
                    <button
                      onClick={startSimulation}
                      className="p-2 bg-neon-teal text-matte-black rounded-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseSimulation}
                      className="p-2 bg-amber text-matte-black rounded-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </button>
                  )}
                  <button
                    onClick={stopSimulation}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Real-time safety score drops warning alerts */}
              {routeSafetyDrop && (
                <div 
                  onClick={handleOptimizeRoute}
                  className="p-3 bg-soft-red/10 border border-soft-red/20 text-soft-red rounded-xl text-xs flex items-center justify-between cursor-pointer animate-pulse font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Safety drop (8.9 ➔ 7.1) - Crowd surge ahead</span>
                  </div>
                  <span className="underline text-[10px] font-bold">REROUTE NOW</span>
                </div>
              )}

              {routeDeviated && (
                <div className="p-3 bg-red-600/20 border border-red-500 text-red-500 rounded-xl text-xs flex items-center gap-2 animate-bounce font-extrabold uppercase tracking-wide">
                  <AlertTriangle className="w-5 h-5 shrink-0 animate-ping" />
                  <span>ROUTE DEVIATION DETECTED! Contacts Notified.</span>
                </div>
              )}

              {/* Progress and Live instructions if active */}
              {activeSimulation.currentIndex > 0 && (
                <div className="space-y-3 bg-matte-black/40 border border-white/5 rounded-xl p-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold font-mono">
                      <span>PROGRESS</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-teal to-electric-cyan transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {currentSegment && (
                    <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                        {getModeIcon(currentSegment.mode)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <span>Active Segment ({currentSegment.mode})</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-teal opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-teal"></span>
                          </span>
                        </p>
                        <p className="text-xs text-white font-semibold truncate mt-0.5">{currentSegment.label}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 font-sans">
                          ETA: {currentSegment.timeMins} min remaining · Link mesh active
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RAAHI Smart Women Safety Layer Controls */}
              <div className="p-4 bg-matte-black/30 border border-white/5 rounded-xl space-y-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-neon-teal" />
                  <span>Smart Women Safety Controls</span>
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  {/* Walk with Guardian companion button */}
                  <button
                    onClick={() => setWalkCompanionMode({ companionActive: !walkCompanionMode.companionActive })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                      walkCompanionMode.companionActive
                        ? 'bg-neon-teal/10 border-neon-teal text-neon-teal'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <Footprints className="w-4 h-4 mb-2" />
                    <span>Walk With Companion</span>
                  </button>

                  {/* Request security escort officer */}
                  <button
                    onClick={() => setWalkCompanionMode({ escortRequested: !walkCompanionMode.escortRequested })}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                      walkCompanionMode.escortRequested
                        ? 'bg-electric-cyan/10 border-electric-cyan text-electric-cyan'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mb-2" />
                    <span>Request Escort guard</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  {/* Simulate path deviations warnings */}
                  <button
                    onClick={() => setRouteDeviated(!routeDeviated)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                      routeDeviated
                        ? 'bg-red-500/10 border-red-500 text-red-500'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mb-2" />
                    <span>Simulate Jitter Deviation</span>
                  </button>

                  {/* Trigger Fake Call Escape mechanism */}
                  <button
                    onClick={() => setWalkCompanionMode({ fakeCallTriggered: true })}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 text-left flex flex-col justify-between"
                  >
                    <Phone className="w-4 h-4 mb-2 text-emerald-400" />
                    <span>Trigger Fake Call</span>
                  </button>
                </div>

                {/* Status indicators */}
                <div className="space-y-1.5 text-[9px] text-slate-400 leading-normal font-sans pt-1">
                  {walkCompanionMode.companionActive && (
                    <p className="flex items-center gap-1 text-neon-teal">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-teal animate-ping" />
                      Walk Companion active. Telemetry streaming to Priya & Mom.
                    </p>
                  )}
                  {walkCompanionMode.escortRequested && (
                    <p className="flex items-center gap-1 text-electric-cyan">
                      <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-ping" />
                      Transit escort dispatcher notified. Guard coordinates updated.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Route Cards */}
          {routeOptions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-300">Generated Safe Options</h3>
              <div className="space-y-4">
                {routeOptions.map((route, idx) => {
                  const isSelected = selectedRoute?.type === route.type;
                  
                  let scoreColor = "stroke-soft-red text-soft-red";
                  if (route.safetyScore >= 8) {
                    scoreColor = "stroke-neon-teal text-neon-teal";
                  } else if (route.safetyScore >= 6) {
                    scoreColor = "stroke-amber text-amber";
                  }

                  const strokeCircumference = 113.1;
                  const strokeOffset = strokeCircumference - (route.safetyScore / 10) * strokeCircumference;

                  return (
                    <motion.div
                      key={idx}
                      onClick={() => setSelectedRoute(route)}
                      whileHover={{ y: -4 }}
                      className={`relative cursor-pointer rounded-2xl p-5 bg-white/5 backdrop-blur-md border transition-all ${
                        isSelected 
                          ? 'border-neon-teal shadow-[0_0_20px_rgba(20,184,166,0.2)] bg-deep-indigo/90' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {route.type === 'safest' && (
                        <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-neon-teal text-matte-black text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI Recommended</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md ${
                              route.type === 'safest' 
                                ? 'bg-neon-teal/10 text-neon-teal border border-neon-teal/20'
                                : route.type === 'fastest'
                                ? 'bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20'
                                : 'bg-amber/10 text-amber border border-amber/20'
                            }`}>
                              {route.type}
                            </span>
                            {route.type === 'safest' && <ShieldCheck className="w-4 h-4 text-neon-teal" />}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs">
                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> 
                              {route.durationMins} min
                            </span>
                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5 font-semibold text-slate-200">
                              ₹{route.fareRupees}
                            </span>
                            <span className="flex items-center gap-1 bg-amber/10 text-amber px-2 py-1 rounded-md border border-amber/15 font-semibold">
                              <Leaf className="w-3.5 h-3.5" />
                              -{route.co2SavedKg}kg CO₂
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center select-none relative">
                          <div className="relative flex items-center justify-center w-12 h-12">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="18" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3.5" fill="transparent" />
                              <circle
                                cx="24"
                                cy="24"
                                r="18"
                                className={`transition-all duration-700 ease-out ${scoreColor}`}
                                strokeWidth="3.5"
                                fill="transparent"
                                strokeDasharray={strokeCircumference}
                                strokeDashoffset={strokeOffset}
                              />
                            </svg>
                            <span className="absolute text-xs font-bold text-white font-display mt-0.5">{route.safetyScore}</span>
                          </div>
                          <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Safety Index</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-medium">Predictive Crowd:</span>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((seg) => {
                              let active = false;
                              let color = "bg-neon-teal";
                              
                              if (route.crowdPercent > 70) {
                                active = true;
                                color = "bg-soft-red";
                              } else if (route.crowdPercent > 40) {
                                active = seg <= 2;
                                color = "bg-amber";
                              } else {
                                active = seg <= 1;
                                color = "bg-neon-teal";
                              }

                              return (
                                <div key={seg} className={`w-6 h-1.5 rounded-sm transition-colors ${active ? color : 'bg-slate-800'}`} />
                              );
                            })}
                          </div>
                          <span className="font-semibold text-slate-200 font-mono">{route.crowdPercent}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Map View Column */}
        <div className="lg:col-span-7 h-full min-h-[500px] flex flex-col justify-stretch lg:sticky lg:top-24">
          <div className="flex-1 bg-deep-indigo border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[500px]">
            <RouteMap />
          </div>
        </div>

      </div>

      {/* Arrival Experience Modal Overlay */}
      <AnimatePresence>
        {showArrivalModal && selectedRoute && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-matte-black/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-deep-indigo border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent_70%)] pointer-events-none" />
              
              <div className="text-center py-6 relative z-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neon-teal/10 border border-neon-teal/20 text-neon-teal flex items-center justify-center mx-auto shadow-lg shadow-neon-teal/10 animate-bounce">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-2xl text-white">Destination Reached!</h3>
                  <p className="text-xs text-slate-400 font-light">Commute completed safely and efficiently</p>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-3 gap-3 bg-matte-black/40 border border-white/5 rounded-2xl p-4 mt-6">
                  <div className="space-y-1 text-center">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Safety Score</p>
                    <p className="text-base text-neon-teal font-extrabold font-mono">{selectedRoute.safetyScore}/10</p>
                  </div>
                  <div className="space-y-1 text-center border-x border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">CO₂ Saved</p>
                    <p className="text-base text-amber font-extrabold font-mono">{selectedRoute.co2SavedKg} kg</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Eco Award</p>
                    <p className="text-base text-electric-cyan font-extrabold font-mono">+{Math.round(selectedRoute.co2SavedKg * 15) + 10} Pts</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs text-slate-300 text-left space-y-2 leading-relaxed font-sans">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-neon-teal shrink-0 mt-0.5" />
                    <span>Continuous guardian tracking monitoring cleared. No alerts reported.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-electric-cyan shrink-0 mt-0.5" />
                    <span>Your eco-points have been credited to your decentralized mobility ledger.</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowArrivalModal(false)}
                  className="w-full py-3.5 bg-neon-teal hover:bg-neon-teal/90 text-matte-black font-extrabold rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-neon-teal/10"
                >
                  Close & Log Journey
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
