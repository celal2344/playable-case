interface SimpleLineChartProps {
  data: Array<{
    label: string
    value: number
  }>
  height?: number
  color?: string
}

export default function SimpleLineChart({ data, height = 200, color = "#3b82f6" }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value))
  const minValue = Math.min(...data.map((item) => item.value))
  const range = maxValue - minValue

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = range === 0 ? 50 : ((maxValue - item.value) / range) * 80 + 10
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
          <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = range === 0 ? 50 : ((maxValue - item.value) / range) * 80 + 10
            return <circle key={index} cx={x} cy={y} r="3" fill={color} vectorEffect="non-scaling-stroke" />
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-4">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-center">
            <div className="text-gray-600">{item.label}</div>
            <div className="font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
