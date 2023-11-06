import React from "react"
import { useState, useEffect } from "react"
// chartjs
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Diagrams({ data }: { data: any }) {
  const [labels, setLabels] = useState<[]>([])
  const [chartData, setChartData] = useState<[]>([])

  useEffect(() => {
    if (data) {
      data = JSON.parse(data)
      const columns = data.line.columns
      const chartData = data.line.data
      const dates = chartData.map((item: any) => item[0])
      const speeds = chartData.map((item: any) => item[1])
      setLabels(dates)
      setChartData(speeds)
    }
  }, [data])

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "distance",
        data: chartData,
        backgroundColor: "rgba(255, 99, 132, 1)"
      }
    ]
  }

  // const options = {
  //   responsive: true,
  //   responsiveAnimationDuration: 0,
  //   animation: false,
  //   plugins: {
  //     legend: {
  //       position: "top" as const
  //     },
  //     title: {
  //       display: false,
  //       text: "Chart.js Bar Chart"
  //     }
  //   }
  // }

  return (
    <div className="my-6">
      <p>diagram</p>
      <p>{labels}</p>
      <p>{chartData}</p>
      <Bar data={barData} />
      <p>diagram</p>
    </div>
  )
}

// <div className="w-fit bg-white rounded shadow">
//   <div className="px-4 py-4">
//     <div className="font-semibold text-lg">
//       {currentMonthStr} Daily Distance
//     </div>
//     <div className="flex justify-center items-center">
//       {loading ? (
//         <LoadingIndicator />
//       ) : (
//         <Bar
//           data={barData}
//           options={options as any}
//         />
//       )}
//     </div>
//   </div>
// </div>
