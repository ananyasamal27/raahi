import { create } from 'zustand';

// Load journey history from localStorage
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('raahi_journey_history');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading journey history", e);
    return [];
  }
};

export const useRaahiStore = create((set) => ({
  // Active Navigation Tab
  activeTab: 'nav', // 'nav', 'smart-city', 'profile', 'voice'

  // Route selection states
  source: null,
  destination: null,
  routeOptions: [],
  selectedRoute: null,
  safeZones: [],
  crowdZones: [],
  loadingRoutes: false,
  errorRoutes: null,

  // Guardian tracking states
  guardianActive: false,
  liveTracking: {
    lat: null,
    lng: null,
    elapsedSeconds: 0,
    signal: 4
  },

  // Phase 3 States
  activeSimulation: {
    active: false,
    currentIndex: 0,
    elapsedSeconds: 0,
    activeSegmentIndex: 0
  },
  offlineMode: false,
  ussdOpen: false,
  journeyHistory: loadHistory(),
  aiAlerts: [
    { id: '1', text: "AI Alert: Crowd surge detected at Dadar Platform 3. Rerouting safest path...", type: 'warning' },
    { id: '2', text: "Guardian Signal Check: Seamless connection via GSM Fallback active.", type: 'info' }
  ],

  // RAAHI X Startup states
  userProfile: {
    name: "Ananya Samal",
    reputation: 98,
    level: 12,
    ecoPoints: 480,
    savedRoutes: [
      { id: '1', title: "SRM to T. Nagar", src: "SRM Kattankulathur", dest: "T. Nagar (Chennai)" }
    ],
    achievements: [
      { id: 'a1', title: "Night Sentinel", desc: "Completed 5 night commutes safely", icon: "🛡️" },
      { id: 'a2', title: "Eco Warrior", desc: "Saved over 15kg of CO₂ emissions", icon: "🌱" },
      { id: 'a3', title: "Reputable Guide", desc: "Contributed 10 safe route validations", icon: "⭐" }
    ]
  },

  communitySignals: [
    { id: 'c1', type: 'safe_shop', name: "24/7 Apollo Pharmacy (Verified Safe)", lat: 12.8227, lng: 80.0435, verified: true },
    { id: 'c2', type: 'hazard', name: "Streetlight outage reported (Low visibility)", lat: 12.9238, lng: 80.0988, verified: false },
    { id: 'c3', type: 'police', name: "Transit Police Patrol Desk", lat: 13.0084, lng: 80.2131, verified: true }
  ],

  voiceState: {
    waveActive: false,
    textQuery: "",
    assistantResponse: "Hello! I am RAAHI, your safety co-pilot. How can I guide your journey safely today?"
  },

  walkCompanionMode: {
    companionActive: false, // Walk with Guardian Companion Dot
    escortRequested: false, // Security Guard Escort request
    fakeCallTriggered: false // Simulated fake call overlay trigger
  },

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSource: (src) => set({ source: src }),
  setDestination: (dest) => set({ destination: dest }),
  setRouteOptions: (routes) => set({ routeOptions: routes }),
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  setSafeZones: (zones) => set({ safeZones: zones }),
  setCrowdZones: (zones) => set({ crowdZones: zones }),
  setLoadingRoutes: (loading) => set({ loadingRoutes: loading }),
  setErrorRoutes: (err) => set({ errorRoutes: err }),

  setGuardianActive: (active) => set({ guardianActive: active }),
  setLiveTracking: (tracking) => set((state) => ({
    liveTracking: { ...state.liveTracking, ...tracking }
  })),

  // Simulation actions
  setSimulationState: (simState) => set((state) => ({
    activeSimulation: { ...state.activeSimulation, ...simState }
  })),

  // Offline / USSD actions
  setOfflineMode: (offline) => set({ offlineMode: offline }),
  setUssdOpen: (open) => set({ ussdOpen: open }),

  // Journey History actions
  addJourneyHistory: (journey) => set((state) => {
    const updated = [journey, ...state.journeyHistory].slice(0, 20); // Keep last 20
    try {
      localStorage.setItem('raahi_journey_history', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving journey history", e);
    }
    // Boost points in profile on complete
    const ptsAwarded = journey.points || 25;
    const newPoints = state.userProfile.ecoPoints + ptsAwarded;
    return { 
      journeyHistory: updated,
      userProfile: { ...state.userProfile, ecoPoints: newPoints }
    };
  }),
  clearJourneyHistory: () => set(() => {
    try {
      localStorage.removeItem('raahi_journey_history');
    } catch (e) {
      console.error("Error clearing journey history", e);
    }
    return { journeyHistory: [] };
  }),

  // AI Alerts actions
  setAiAlerts: (alerts) => set({ aiAlerts: alerts }),
  addAiAlert: (alert) => set((state) => ({
    aiAlerts: [alert, ...state.aiAlerts].slice(0, 10) // Keep last 10
  })),
  removeAiAlert: (id) => set((state) => ({
    aiAlerts: state.aiAlerts.filter(a => a.id !== id)
  })),

  // RAAHI X Actions
  addCommunitySignal: (signal) => set((state) => ({
    communitySignals: [signal, ...state.communitySignals]
  })),
  setVoiceState: (voice) => set((state) => ({
    voiceState: { ...state.voiceState, ...voice }
  })),
  setWalkCompanionMode: (companion) => set((state) => ({
    walkCompanionMode: { ...state.walkCompanionMode, ...companion }
  })),
  updateUserProfile: (profile) => set((state) => ({
    userProfile: { ...state.userProfile, ...profile }
  })),
  
  resetStore: () => set({
    activeTab: 'nav',
    source: null,
    destination: null,
    routeOptions: [],
    selectedRoute: null,
    safeZones: [],
    crowdZones: [],
    guardianActive: false,
    liveTracking: { lat: null, lng: null, elapsedSeconds: 0, signal: 4 },
    activeSimulation: { active: false, currentIndex: 0, elapsedSeconds: 0, activeSegmentIndex: 0 },
    offlineMode: false,
    ussdOpen: false,
    walkCompanionMode: { companionActive: false, escortRequested: false, fakeCallTriggered: false }
  })
}));
