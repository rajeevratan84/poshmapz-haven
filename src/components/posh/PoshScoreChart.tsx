
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface ScoreBreakdown {
  property: number;
  safety: number;
  transport: number;
  lifestyle: number;
  environment: number;
}

interface PoshScoreChartProps {
  scoreBreakdown: ScoreBreakdown;
}

const PoshScoreChart: React.FC<PoshScoreChartProps> = ({ scoreBreakdown }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Format data for the chart
  const chartData = [
    { subject: 'Property', A: scoreBreakdown.property, fullMark: 100 },
    { subject: 'Safety', A: scoreBreakdown.safety, fullMark: 100 },
    { subject: 'Transport', A: scoreBreakdown.transport, fullMark: 100 },
    { subject: 'Lifestyle', A: scoreBreakdown.lifestyle, fullMark: 100 },
    { subject: 'Environment', A: scoreBreakdown.environment, fullMark: 100 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke={isDark ? '#4a5568' : '#e2e8f0'} />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: isDark ? '#a0aec0' : '#4a5568', fontSize: 14 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fill: isDark ? '#a0aec0' : '#4a5568' }}
          tickCount={5}
          stroke={isDark ? '#4a5568' : '#e2e8f0'}
          axisLine={false}
        />
        <Radar
          name="Score"
          dataKey="A"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PoshScoreChart;
