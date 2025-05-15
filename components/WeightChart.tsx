import { useState, useEffect } from 'react';
import { PregnancyEntry } from '@/types/pregnancy';

interface WeightChartProps {
  entries: PregnancyEntry[];
}

export default function WeightChart({ entries }: WeightChartProps) {
  const [chartData, setChartData] = useState<{date: string; weight: number; week?: number}[]>([]);
  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [minWeight, setMinWeight] = useState<number>(0);
  
  useEffect(() => {
    if (entries.length === 0) return;
    
    // Filter entries with weight data and sort by date
    const weightEntries = entries
      .filter(entry => entry.weight)
      .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());
    
    if (weightEntries.length === 0) return;
    
    // Format data for chart
    const formattedData = weightEntries.map(entry => ({
      date: new Date(entry.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: entry.weight || 0,
      week: entry.pregnancy_week
    }));
    
    // Calculate min and max for scale
    const weights = formattedData.map(d => d.weight);
    const max = Math.ceil(Math.max(...weights) + 2);
    const min = Math.floor(Math.min(...weights) - 2);
    
    setChartData(formattedData);
    setMaxWeight(max);
    setMinWeight(min > 0 ? min : 0);
    
  }, [entries]);
  
  if (chartData.length === 0) {
    return (
      <div className="bg-amber-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No weight data available. Add weight entries to see your progress.</p>
      </div>
    );
  }
  
  // Chart dimensions
  const width = 600;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Calculate scales
  const xScale = (i: number) => padding.left + (i * (chartWidth / (chartData.length - 1 || 1)));
  const yScale = (weight: number) => padding.top + chartHeight - 
    ((weight - minWeight) / (maxWeight - minWeight || 1)) * chartHeight;
  
  // Generate the line path
  const linePath = chartData.map((point, i) => {
    const x = xScale(i);
    const y = yScale(point.weight);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full"
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = padding.top + (i * (chartHeight / 4));
            const weight = maxWeight - i * ((maxWeight - minWeight) / 4);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  fontSize="10"
                  textAnchor="end"
                  fill="#6b7280"
                >
                  {weight.toFixed(0)}kg
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {chartData.map((point, i) => (
            <g key={i}>
              {i % Math.ceil(chartData.length / 7) === 0 && (
                <>
                  <line
                    x1={xScale(i)}
                    y1={height - padding.bottom}
                    x2={xScale(i)}
                    y2={height - padding.bottom + 5}
                    stroke="#6b7280"
                    strokeWidth="1"
                  />
                  <text
                    x={xScale(i)}
                    y={height - padding.bottom + 20}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#6b7280"
                  >
                    {point.date}
                  </text>
                </>
              )}
            </g>
          ))}
          
          {/* Chart line */}
          <path
            d={linePath}
            fill="none"
            stroke="#b45309"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {chartData.map((point, i) => (
            <g key={i}>
              <circle
                cx={xScale(i)}
                cy={yScale(point.weight)}
                r="5"
                fill="#b45309"
                stroke="#fff"
                strokeWidth="2"
              />
              
              {/* Week labels */}
              {point.week && (
                <text
                  x={xScale(i)}
                  y={yScale(point.weight) - 15}
                  fontSize="9"
                  textAnchor="middle"
                  fill="#78350f"
                  fontWeight="bold"
                  className="bg-white p-1 rounded"
                >
                  W{point.week}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
} 