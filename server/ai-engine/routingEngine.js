// Coordinate interpolator between waypoints
function interpolate(p1, p2, count, jitter = 0) {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    let lat = p1[0] + (p2[0] - p1[0]) * t;
    let lng = p1[1] + (p2[1] - p1[1]) * t;
    if (i > 0 && i < count && jitter !== 0) {
      lat += (Math.random() - 0.5) * jitter;
      lng += (Math.random() - 0.5) * jitter;
    }
    points.push([lat, lng]);
  }
  return points;
}

// 5 Pre-configured multimodal routes across India
const INDIA_ROUTES = {
  "SRM Kattankulathur ➔ T. Nagar (Chennai)": {
    title: "SRM Kattankulathur ➔ T. Nagar (Chennai)",
    sourceName: "SRM Kattankulathur",
    destName: "T. Nagar (Chennai)",
    modes: [
      { mode: 'walk', from: [12.8230, 80.0444], to: [12.8222, 80.0416], label: "Walk to Potheri Station", time: 4 },
      { mode: 'train', from: [12.8222, 80.0416], to: [12.9249, 80.1000], label: "Chennai Suburban Local Train to Tambaram", time: 22 },
      { mode: 'bus', from: [12.9249, 80.1000], to: [13.0084, 80.2131], label: "AC Transit MTC Bus 51G to Guindy", time: 18 },
      { mode: 'auto', from: [13.0084, 80.2131], to: [13.0418, 80.2341], label: "Electric Auto-rickshaw to T. Nagar", time: 10 }
    ],
    safeZones: [
      { name: "Potheri Station CCTV Kiosk", lat: 12.8225, lng: 80.0418 },
      { name: "Guindy Junction Police Desk", lat: 13.0086, lng: 80.2135 }
    ],
    crowdZones: [
      { name: "Tambaram Platform Peak Crowding", lat: 12.9245, lng: 80.0995, intensity: 75, radius: 100 }
    ]
  },
  "Chennai Central ➔ KSR Bengaluru": {
    title: "Chennai Central ➔ KSR Bengaluru",
    sourceName: "Chennai Central",
    destName: "KSR Bengaluru",
    modes: [
      { mode: 'walk', from: [13.0827, 80.2707], to: [13.0815, 80.2730], label: "Walk to Chennai Central Railway station", time: 5 },
      { mode: 'train', from: [13.0815, 80.2730], to: [12.9779, 77.5697], label: "Shatabdi Express (MAS to SBC)", time: 300 },
      { mode: 'metro', from: [12.9779, 77.5697], to: [12.9784, 77.6413], label: "Purple Line Metro to Indiranagar", time: 15 },
      { mode: 'walk', from: [12.9784, 77.6413], to: [12.9750, 77.6420], label: "Walk to destination", time: 3 }
    ],
    safeZones: [
      { name: "KSR Bengaluru RPF Station Desk", lat: 12.9775, lng: 77.5702 },
      { name: "Indiranagar Metro Safe Corridor", lat: 12.9781, lng: 77.6410 }
    ],
    crowdZones: [
      { name: "Majestic Junction Bottleneck", lat: 12.9765, lng: 77.5720, intensity: 85, radius: 150 }
    ]
  },
  "CSMT Mumbai ➔ Pune Junction": {
    title: "CSMT Mumbai ➔ Pune Junction",
    sourceName: "CSMT Mumbai",
    destName: "Pune Junction",
    modes: [
      { mode: 'auto', from: [18.9400, 72.8354], to: [18.9696, 72.8194], label: "Auto/Cab to Dadar Terminus", time: 18 },
      { mode: 'train', from: [18.9696, 72.8194], to: [18.5284, 73.8739], label: "Deccan Queen Express to Pune Junction", time: 190 },
      { mode: 'walk', from: [18.5284, 73.8739], to: [18.5300, 73.8755], label: "Walk to exit gates", time: 4 }
    ],
    safeZones: [
      { name: "CSMT Central Help Desk", lat: 18.9405, lng: 72.8358 },
      { name: "Pune Junction 24/7 Patrol booth", lat: 18.5280, lng: 73.8742 }
    ],
    crowdZones: [
      { name: "Dadar Station Surge Node", lat: 18.9690, lng: 72.8190, intensity: 88, radius: 120 }
    ]
  },
  "New Delhi Station ➔ Cyber City (Gurgaon)": {
    title: "New Delhi Station ➔ Cyber City (Gurgaon)",
    sourceName: "New Delhi Station",
    destName: "Cyber City (Gurgaon)",
    modes: [
      { mode: 'walk', from: [28.6429, 77.2201], to: [28.6418, 77.2215], label: "Walk to NDLS Metro entry point", time: 3 },
      { mode: 'metro', from: [28.6418, 77.2215], to: [28.4797, 77.0801], label: "Yellow Line Metro to MG Road Station", time: 35 },
      { mode: 'auto', from: [28.4797, 77.0801], to: [28.4950, 77.0897], label: "Electric Auto to DLF Cyber City Hub", time: 8 }
    ],
    safeZones: [
      { name: "NDLS Metro Police Post", lat: 28.6415, lng: 77.2218 },
      { name: "Cyber City Corporate Corridor Guard", lat: 28.4948, lng: 77.0890 }
    ],
    crowdZones: [
      { name: "MG Road Traffic Hub Jam", lat: 28.4800, lng: 77.0805, intensity: 78, radius: 110 }
    ]
  },
  "Kempegowda Airport ➔ Indiranagar (Bangalore)": {
    title: "Kempegowda Airport ➔ Indiranagar (Bangalore)",
    sourceName: "Kempegowda Airport",
    destName: "Indiranagar (Bangalore)",
    modes: [
      { mode: 'bus', from: [13.1986, 77.7066], to: [12.9784, 77.6413], label: "Vayu Vajra Volvo AC Bus BIAS-9", time: 55 },
      { mode: 'walk', from: [12.9784, 77.6413], to: [12.9719, 77.6412], label: "Walk down Indiranagar Double Road", time: 6 }
    ],
    safeZones: [
      { name: "KIA Airport Security Box", lat: 13.1980, lng: 77.7060 },
      { name: "Indiranagar Circle Police Booth", lat: 12.9780, lng: 77.6415 }
    ],
    crowdZones: [
      { name: "Hebbal Flyover Congestion", lat: 13.0360, lng: 77.5985, intensity: 70, radius: 140 }
    ]
  }
};

function generateRouteDetails(source, destination) {
  // Find preconfigured route or fallback to SRM to T Nagar
  const routeKey = Object.keys(INDIA_ROUTES).find(key => 
    key.includes(source) && key.includes(destination)
  ) || "SRM Kattankulathur ➔ T. Nagar (Chennai)";

  const routeData = INDIA_ROUTES[routeKey];

  // Procedurally generate 3 route variants: safest, fastest, cheapest
  const routes = ['safest', 'fastest', 'cheapest'].map(type => {
    let safetyScore = 9.2;
    let durationMultiplier = 1.0;
    let fareMultiplier = 1.0;
    let crowdPercent = 35;
    let co2SavedKg = 2.1;

    if (type === 'fastest') {
      safetyScore = 7.1;
      durationMultiplier = 0.8;
      fareMultiplier = 1.4;
      crowdPercent = 82;
      co2SavedKg = 1.2;
    } else if (type === 'cheapest') {
      safetyScore = 7.8;
      durationMultiplier = 1.25;
      fareMultiplier = 0.35;
      crowdPercent = 64;
      co2SavedKg = 2.6;
    }

    let allWaypoints = [];
    const segments = routeData.modes.map((seg, idx) => {
      const jitter = type === 'safest' ? 0.0002 : type === 'fastest' ? -0.0002 : 0.0004;
      const count = seg.mode === 'train' ? 12 : 5;
      const segmentWaypoints = interpolate(seg.from, seg.to, count, jitter);
      
      if (idx === 0) {
        allWaypoints.push(...segmentWaypoints);
      } else {
        allWaypoints.push(...segmentWaypoints.slice(1));
      }

      return {
        mode: seg.mode,
        label: seg.label,
        timeMins: Math.round(seg.time * durationMultiplier),
        waypoints: segmentWaypoints
      };
    });

    const totalDuration = segments.reduce((sum, s) => sum + s.timeMins, 0);
    const baseFare = routeKey.includes("KSR Bengaluru") || routeKey.includes("Pune") ? 420 : 60;
    const totalFare = Math.round(baseFare * fareMultiplier);

    return {
      type,
      durationMins: totalDuration,
      fareRupees: totalFare,
      safetyScore,
      crowdPercent,
      co2SavedKg,
      waypoints: allWaypoints,
      segments,
      safeZones: routeData.safeZones,
      crowdZones: routeData.crowdZones
    };
  });

  return {
    routes,
    safeZones: routeData.safeZones,
    crowdZones: routeData.crowdZones
  };
}

module.exports = {
  generateRouteDetails,
  INDIA_ROUTES
};
