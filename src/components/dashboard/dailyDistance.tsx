import React from "react"
import { useState, useEffect } from "react"
// components
import LoadingIndicator from "../loadingIndicator"
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

export default function DailyDistance({
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
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0,
    31: 0
  })

  const currentMonthStr = new Date().toLocaleString("en-US", {
    month: "short"
  })
  useEffect(() => {
    function setData() {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      if (data) {
        const acts = { ...weeklyDistance }
        data.forEach((a: any) => {
          const startDate = new Date(a.start_date)
          if (
            startDate.getFullYear() === currentYear &&
            startDate.getMonth() === currentMonth
          ) {
            const dayOfMonth = startDate.getDate()
            acts[dayOfMonth] += a.distance * 0.000621371
          }
        })
        setWeeklyDistance(acts)
      }
    }
    setData()
  }, [data])

  const barData = {
    labels: Object.keys(weeklyDistance),
    datasets: [
      {
        label: "distance",
        data: Object.values(weeklyDistance),
        backgroundColor: "rgba(255, 99, 132, 1)"
      }
    ]
  }

  const options = {
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
          {currentMonthStr} Daily Distance
        </div>
        <div className="flex justify-center items-center">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Bar
              data={barData}
              options={options as any}
            />
          )}
        </div>
      </div>
    </div>
  )
}
