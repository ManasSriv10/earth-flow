import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Station, getStatusColor } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingDown, TrendingUp } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StationMapProps {
  stations: Station[];
  onStationSelect: (station: Station) => void;
  selectedStation?: Station;
}

const createCustomIcon = (status: Station['status']) => {
  const color = status === 'safe' ? '#22c55e' : status === 'warning' ? '#eab308' : '#ef4444';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const StationMap = ({ stations, onStationSelect, selectedStation }: StationMapProps) => {
  const center: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="relative h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={center}
            zoom={5}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.location.lat, station.location.lng]}
                icon={createCustomIcon(station.status)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{station.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Location:</strong> {station.location.district}, {station.location.state}</p>
                      <p><strong>Current Level:</strong> {station.currentLevel}m</p>
                      <div className="flex items-center gap-2">
                        <strong>Status:</strong>
                        <Badge 
                          variant="secondary"
                          className={`bg-${getStatusColor(station.status)}/10 text-${getStatusColor(station.status)} border-${getStatusColor(station.status)}/20`}
                        >
                          {station.status.toUpperCase()}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onStationSelect(station)}
                        className="w-full mt-2"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg shadow-soft border">
            <h4 className="font-semibold text-sm mb-2">Status Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-safe"></div>
                <span>Safe (&gt;20m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-warning"></div>
                <span>Warning (15-20m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-critical"></div>
                <span>Critical (&lt;15m)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationMap;