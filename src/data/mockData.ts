export interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    district: string;
    state: string;
  };
  currentLevel: number;
  status: 'safe' | 'warning' | 'critical';
  specificYield: number;
  lastUpdated: string;
}

export interface WaterLevelReading {
  timestamp: string;
  level: number;
  temperature: number;
}

export const mockStations: Station[] = [
  {
    id: 'DWLR001',
    name: 'Hyderabad Central',
    location: { lat: 17.3850, lng: 78.4867, district: 'Hyderabad', state: 'Telangana' },
    currentLevel: 25.4,
    status: 'safe',
    specificYield: 0.15,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'DWLR002',
    name: 'Bengaluru North',
    location: { lat: 12.9716, lng: 77.5946, district: 'Bengaluru', state: 'Karnataka' },
    currentLevel: 18.2,
    status: 'warning',
    specificYield: 0.12,
    lastUpdated: '2024-01-15T10:25:00Z'
  },
  {
    id: 'DWLR003',
    name: 'Chennai East',
    location: { lat: 13.0827, lng: 80.2707, district: 'Chennai', state: 'Tamil Nadu' },
    currentLevel: 12.8,
    status: 'critical',
    specificYield: 0.18,
    lastUpdated: '2024-01-15T10:20:00Z'
  },
  {
    id: 'DWLR004',
    name: 'Pune West',
    location: { lat: 18.5204, lng: 73.8567, district: 'Pune', state: 'Maharashtra' },
    currentLevel: 28.7,
    status: 'safe',
    specificYield: 0.14,
    lastUpdated: '2024-01-15T10:35:00Z'
  },
  {
    id: 'DWLR005',
    name: 'Jaipur South',
    location: { lat: 26.9124, lng: 75.7873, district: 'Jaipur', state: 'Rajasthan' },
    currentLevel: 8.3,
    status: 'critical',
    specificYield: 0.08,
    lastUpdated: '2024-01-15T10:15:00Z'
  },
  {
    id: 'DWLR006',
    name: 'Delhi NCR',
    location: { lat: 28.7041, lng: 77.1025, district: 'New Delhi', state: 'Delhi' },
    currentLevel: 22.1,
    status: 'warning',
    specificYield: 0.16,
    lastUpdated: '2024-01-15T10:40:00Z'
  }
];

export const generateMockReadings = (stationId: string, days: number = 30): WaterLevelReading[] => {
  const readings: WaterLevelReading[] = [];
  const station = mockStations.find(s => s.id === stationId);
  const baseLevel = station?.currentLevel || 20;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate seasonal variation and random fluctuation
    const seasonalVariation = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 3;
    const randomVariation = (Math.random() - 0.5) * 2;
    const level = Math.max(0, baseLevel + seasonalVariation + randomVariation);
    
    readings.push({
      timestamp: date.toISOString(),
      level: Math.round(level * 10) / 10,
      temperature: 20 + Math.random() * 15
    });
  }
  
  return readings;
};

export const calculateRecharge = (
  currentLevel: number, 
  previousLevel: number, 
  specificYield: number
): number => {
  // Water table rise method: Recharge ≈ ΔWater Level × Specific Yield
  const deltaLevel = currentLevel - previousLevel;
  const recharge = deltaLevel * specificYield * 1000; // Convert to mm
  return Math.round(recharge * 100) / 100;
};

export const getStatusColor = (status: Station['status']) => {
  switch (status) {
    case 'safe': return 'status-safe';
    case 'warning': return 'status-warning';
    case 'critical': return 'status-critical';
    default: return 'muted';
  }
};

export const getStatusThreshold = (level: number) => {
  if (level > 20) return 'safe';
  if (level > 15) return 'warning';
  return 'critical';
};