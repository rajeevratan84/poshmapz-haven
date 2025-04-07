
import React from 'react';
import { MapPin, Banknote, Shield, Train, Tree, Coffee, Footprints, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import PoshScoreChart from './PoshScoreChart';

interface ScoreBreakdown {
  property: number;
  safety: number;
  transport: number;
  lifestyle: number;
  environment: number;
}

interface AreaData {
  name: string;
  poshScore: number;
  averagePrice: number;
  crimeIndex: number;
  transportScore: number;
  greenSpaceAccess: number;
  amenityDensity: number;
  walkability: number;
  priceGrowth: number;
  scoreBreakdown: ScoreBreakdown;
}

interface PoshScoreCardProps {
  areaData: AreaData;
}

const PoshScoreCard: React.FC<PoshScoreCardProps> = ({ areaData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Determine score color based on poshScore value
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Determine score label based on poshScore value
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Ultra-Premium';
    if (score >= 80) return 'Premium';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    return 'Needs Improvement';
  };
  
  const MetricRow = ({ icon, label, value, suffix = '', color = '' }: { icon: React.ReactNode, label: string, value: string | number, suffix?: string, color?: string }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className={color || ''}>{value}{suffix}</span>
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">{areaData.name}</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">PoshScore™</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold mb-2 mt-2">
                <span className={getScoreColor(areaData.poshScore)}>{areaData.poshScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <div className={`text-lg font-medium ${getScoreColor(areaData.poshScore)}`}>
                {getScoreLabel(areaData.poshScore)}
              </div>
              <div className="mt-6 w-full">
                <PoshScoreChart scoreBreakdown={areaData.scoreBreakdown} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Area Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <MetricRow 
                icon={<Banknote className="h-4 w-4 text-green-500" />} 
                label="Average Property Price" 
                value={formatCurrency(areaData.averagePrice)} 
              />
              <MetricRow 
                icon={<Shield className="h-4 w-4 text-blue-500" />} 
                label="Crime Index" 
                value={areaData.crimeIndex} 
                suffix="/100"
                color={areaData.crimeIndex < 40 ? 'text-green-500' : areaData.crimeIndex < 60 ? 'text-amber-500' : 'text-red-500'}
              />
              <MetricRow 
                icon={<Train className="h-4 w-4 text-indigo-500" />} 
                label="Transport Score" 
                value={areaData.transportScore} 
                suffix="/100"
                color={areaData.transportScore > 70 ? 'text-green-500' : areaData.transportScore > 50 ? 'text-amber-500' : 'text-red-500'}
              />
              <MetricRow 
                icon={<TrendingUp className="h-4 w-4 text-purple-500" />} 
                label="5-Year Price Growth" 
                value={areaData.priceGrowth} 
                suffix="%" 
                color="text-primary"
              />
            </div>
            <div>
              <MetricRow 
                icon={<Tree className="h-4 w-4 text-green-600" />} 
                label="Green Space Access" 
                value={areaData.greenSpaceAccess} 
                suffix="/100"
                color={areaData.greenSpaceAccess > 70 ? 'text-green-500' : areaData.greenSpaceAccess > 50 ? 'text-amber-500' : 'text-red-500'}
              />
              <MetricRow 
                icon={<Coffee className="h-4 w-4 text-amber-600" />} 
                label="Amenity Density" 
                value={areaData.amenityDensity} 
                suffix="/100"
                color={areaData.amenityDensity > 70 ? 'text-green-500' : areaData.amenityDensity > 50 ? 'text-amber-500' : 'text-red-500'}
              />
              <MetricRow 
                icon={<Footprints className="h-4 w-4 text-cyan-600" />} 
                label="Walkability" 
                value={areaData.walkability} 
                suffix="/100"
                color={areaData.walkability > 70 ? 'text-green-500' : areaData.walkability > 50 ? 'text-amber-500' : 'text-red-500'}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoshScoreCard;
