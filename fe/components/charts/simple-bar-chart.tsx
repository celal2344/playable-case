interface SimpleBarChartProps {
  data: Array<{
    label: string
    value: number
    color?: string
  }>
  height?: number
}

export default function SimpleBarChart({ data, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full">
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * (height - 40)}px`,
                backgroundColor: item.color || "#3b82f6",
                minHeight: "4px",
              }}
            />
            <div className="text-xs text-gray-600 mt-2 text-center">{item.label}</div>
            <div className="text-xs font-semibold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
