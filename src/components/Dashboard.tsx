import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockStations, generateMockReadings, Station, WaterLevelReading } from '@/data/mockData';
import StationMap from './StationMap';
import StationDetails from './StationDetails';
import { Bell, LogOut, Users, AlertTriangle, Droplets, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  user: { role: 'policymaker' | 'researcher'; username: string };
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stationReadings, setStationReadings] = useState<WaterLevelReading[]>([]);
  
  useEffect(() => {
    // Simulate real-time alerts
    const criticalStations = mockStations.filter(s => s.status === 'critical');
    if (criticalStations.length > 0) {
      toast({
        title: "Critical Alert",
        description: `${criticalStations.length} station(s) have critical water levels`,
        variant: "destructive",
      });
    }
  }, []);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setStationReadings(generateMockReadings(station.id));
  };

  const handleBackToMap = () => {
    setSelectedStation(null);
    setStationReadings([]);
  };

  const stats = {
    total: mockStations.length,
    safe: mockStations.filter(s => s.status === 'safe').length,
    warning: mockStations.filter(s => s.status === 'warning').length,
    critical: mockStations.filter(s => s.status === 'critical').length,
  };

  const topDepletedStations = mockStations
    .filter(s => s.status === 'critical')
    .sort((a, b) => a.currentLevel - b.currentLevel)
    .slice(0, 3);

  if (selectedStation) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Droplets className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">AquaWatch DWLR</h1>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{user.role}</Badge>
                <span className="text-sm">{user.username}</span>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <StationDetails 
            station={selectedStation} 
            readings={stationReadings}
            onBack={handleBackToMap}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AquaWatch DWLR</h1>
                <p className="text-sm text-muted-foreground">Groundwater Monitoring Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({stats.critical})
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user.role}</Badge>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-chart-primary" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Safe Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-status-safe"></div>
                <span className="text-2xl font-bold text-status-safe">{stats.safe}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                <span className="text-2xl font-bold text-status-warning">{stats.warning}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-status-critical" />
                <span className="text-2xl font-bold text-status-critical">{stats.critical}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <StationMap 
              stations={mockStations}
              onStationSelect={handleStationSelect}
              selectedStation={selectedStation}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Critical Stations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topDepletedStations.map((station) => (
                  <div 
                    key={station.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20 cursor-pointer hover:bg-destructive/10 transition-colors"
                    onClick={() => handleStationSelect(station)}
                  >
                    <div>
                      <p className="font-medium text-sm">{station.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {station.location.district}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">{station.currentLevel}m</p>
                      <Badge variant="destructive" className="text-xs">
                        CRITICAL
                      </Badge>
                    </div>
                  </div>
                ))}
                {topDepletedStations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No critical stations
                  </p>
                )}
              </CardContent>
            </Card>

            {user.role === 'policymaker' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Issue Water Alert
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Policy Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;