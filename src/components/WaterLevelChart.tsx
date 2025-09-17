import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaterLevelReading } from '@/data/mockData';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface WaterLevelChartProps {
  data: WaterLevelReading[];
  stationName: string;
}

const WaterLevelChart = ({ data, stationName }: WaterLevelChartProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateTrend = () => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-7).map(d => d.level);
    const early = data.slice(-14, -7).map(d => d.level);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlyAvg = early.reduce((a, b) => a + b, 0) / early.length;
    
    const diff = recentAvg - earlyAvg;
    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'rising' : 'falling';
  };

  const trend = calculateTrend();
  const TrendIcon = trend === 'rising' ? TrendingUp : trend === 'falling' ? TrendingDown : Minus;
  const trendColor = trend === 'rising' ? 'text-status-safe' : trend === 'falling' ? 'text-destructive' : 'text-muted-foreground';

  const chartData = data.map(reading => ({
    ...reading,
    date: formatDate(reading.timestamp),
    fullDate: reading.timestamp
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Water Level Trend - {stationName}</CardTitle>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium capitalize">{trend}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="waterLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border rounded-lg p-3 shadow-soft">
                        <p className="font-medium">{new Date(data.fullDate).toLocaleDateString()}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-chart-primary">
                            Water Level: <span className="font-medium">{data.level}m</span>
                          </p>
                          <p className="text-muted-foreground">
                            Temperature: <span className="font-medium">{data.temperature.toFixed(1)}°C</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke="hsl(var(--chart-primary))" 
                strokeWidth={2}
                fill="url(#waterLevel)"
                dot={{ fill: 'hsl(var(--chart-primary))', r: 3 }}
                activeDot={{ r: 5, fill: 'hsl(var(--chart-primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterLevelChart;