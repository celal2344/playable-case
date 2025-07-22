interface SimplePieChartProps {
  data: Array<{
    label: string
    value: number
    color: string
  }>
  size?: number
}

export default function SimplePieChart({ data, size = 200 }: SimplePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle

    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, "Z"].join(" ")

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
    }
  })

  return (
    <div className="flex items-center space-x-6">
      <div style={{ width: size, height: size }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.pathData}
              fill={slice.color}
              stroke="white"
              strokeWidth="1"
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </svg>
      </div>
      <div className="space-y-2">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-sm text-gray-600">
              {slice.label}: {slice.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
