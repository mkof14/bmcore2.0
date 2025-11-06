interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type?: 'bar' | 'line';
  height?: number;
}

export default function SimpleChart({ data, type = 'bar', height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full">
      <div className="flex items-end justify-around gap-2" style={{ height }}>
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          const color = item.color || '#2563eb';

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {item.value}
              </div>
              <div
                className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  minHeight: '4px',
                }}
              />
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LineChart({ data, height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data.map((item, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  });

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((item, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              fill="#2563eb"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((item, i) => (
          <div key={i} className="text-xs text-gray-600 dark:text-gray-400">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
