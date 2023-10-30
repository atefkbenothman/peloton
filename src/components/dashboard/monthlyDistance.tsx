import React from "react"
import { useState, useEffect } from "react"
// components
import LoadingIndicator from "../loadingIndicator"
// chartjs
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

export default function MonthlyDistance({
  data,
  loading
}: {
  data: any
  loading: boolean
}) {
  const [weeklyDistance, setWeeklyDistance] = useState<any>({
    1: 0,
    2: 0,
    3: 0,
    4: 0
  })

  const currentMonthStr = new Date().toLocaleString("en-US", {
    month: "short"
  })

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    if (data) {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
      const acts = { ...weeklyDistance }
      data.forEach((a: any) => {
        const startDate = new Date(a.start_date)
        const year = startDate.getFullYear()

        if (year === currentYear) {
          if (startDate >= firstDayOfMonth && startDate <= lastDayOfMonth) {
            const weekNumber = Math.ceil(
              (startDate.getDate() + firstDayOfMonth.getDay() - 1) / 7
            )
            acts[weekNumber] += a.distance * 0.000621371
          }
        }
      })
      setWeeklyDistance(acts)
    }
  }, [data])

  const barData = {
    labels: Object.keys(weeklyDistance),
    datasets: [
      {
        fill: true,
        label: "distance",
        data: Object.values(weeklyDistance),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      }
    ]
  }

  const options: any = {
    responsive: true,
    responsiveAnimationDuration: 0,
    animation: false,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart"
      }
    }
  }

  return (
    <div className="w-fit bg-white rounded shadow">
      <div className="px-4 py-4">
        <div className="font-semibold text-lg">
          {currentMonthStr} Weekly Distance
        </div>
        <div className="flex justify-center items-center p-2">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Line
              data={barData}
              options={options}
            />
          )}
        </div>
      </div>
    </div>
  )
}
