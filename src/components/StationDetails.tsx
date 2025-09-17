import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Station, WaterLevelReading, calculateRecharge, getStatusColor } from '@/data/mockData';
import { MapPin, Calendar, Droplets, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import WaterLevelChart from './WaterLevelChart';

interface StationDetailsProps {
  station: Station;
  readings: WaterLevelReading[];
  onBack: () => void;
}

const StationDetails = ({ station, readings, onBack }: StationDetailsProps) => {
  const lastWeekReading = readings[readings.length - 7];
  const currentReading = readings[readings.length - 1];
  const recharge = lastWeekReading ? calculateRecharge(
    currentReading.level, 
    lastWeekReading.level, 
    station.specificYield
  ) : 0;

  const getRechargeStatus = (recharge: number) => {
    if (recharge > 5) return { status: 'Positive', color: 'status-safe', icon: '↑' };
    if (recharge > 0) return { status: 'Slight Positive', color: 'status-warning', icon: '↗' };
    if (recharge > -5) return { status: 'Slight Negative', color: 'status-warning', icon: '↘' };
    return { status: 'Negative', color: 'status-critical', icon: '↓' };
  };

  const rechargeStatus = getRechargeStatus(recharge);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Map
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{station.name}</h2>
          <p className="text-muted-foreground">{station.location.district}, {station.location.state}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-chart-primary" />
              <span className="text-2xl font-bold">{station.currentLevel}m</span>
            </div>
            <Badge 
              className={`mt-2 bg-${getStatusColor(station.status)}/10 text-${getStatusColor(station.status)} border-${getStatusColor(station.status)}/20`}
            >
              {station.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recharge Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 text-${rechargeStatus.color}`} />
              <span className="text-2xl font-bold">{Math.abs(recharge)}mm</span>
              <span className="text-lg">{rechargeStatus.icon}</span>
            </div>
            <Badge 
              className={`mt-2 bg-${rechargeStatus.color}/10 text-${rechargeStatus.color} border-${rechargeStatus.color}/20`}
            >
              {rechargeStatus.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Specific Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-chart-secondary"></div>
              <span className="text-2xl font-bold">{station.specificYield}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Aquifer property</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {new Date(station.lastUpdated).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(station.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <WaterLevelChart data={readings} stationName={station.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Station ID: {station.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Latitude</p>
                <p className="font-medium">{station.location.lat}°</p>
              </div>
              <div>
                <p className="text-muted-foreground">Longitude</p>
                <p className="font-medium">{station.location.lng}°</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decision Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-3 rounded-lg bg-${getStatusColor(station.status)}/5 border border-${getStatusColor(station.status)}/20`}>
                <AlertCircle className={`h-5 w-5 text-${getStatusColor(station.status)} mt-0.5`} />
                <div>
                  <p className="font-medium">
                    {station.status === 'safe' ? 'Safe for Extraction' : 
                     station.status === 'warning' ? 'Monitor Closely' : 
                     'Restrict Extraction'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {station.status === 'safe' ? 'Water levels are sustainable for current usage.' :
                     station.status === 'warning' ? 'Implement conservation measures and monitor daily.' :
                     'Immediate action required. Consider alternative water sources.'}
                  </p>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <p><strong>Recommended Action:</strong></p>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  {station.status === 'critical' && (
                    <>
                      <li>• Ban new bore wells within 2km radius</li>
                      <li>• Implement rainwater harvesting</li>
                      <li>• Monitor daily</li>
                    </>
                  )}
                  {station.status === 'warning' && (
                    <>
                      <li>• Monitor weekly</li>
                      <li>• Promote water conservation</li>
                      <li>• Review extraction permits</li>
                    </>
                  )}
                  {station.status === 'safe' && (
                    <>
                      <li>• Continue regular monitoring</li>
                      <li>• Maintain current extraction rates</li>
                      <li>• Plan for seasonal variations</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StationDetails;