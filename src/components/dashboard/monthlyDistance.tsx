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

        if (startDate >= firstDayOfMonth && startDate <= lastDayOfMonth) {
          const weekNumber = Math.ceil(
            (startDate.getDate() + firstDayOfMonth.getDay() - 1) / 7
          )
          acts[weekNumber] += a.distance * 0.000621371
        }
      })
      setWeeklyDistance(acts)
    }
  }, [data])

  const barData = {
    labels: Object.keys(weeklyDistance),
    datasets: [
      {
        label: "weekly distance (mi)",
        data: Object.values(weeklyDistance),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }

  return (
    <div className="max-w-xl mx-6 my-4 bg-white rounded-lg shadow-md">
      <div className="px-6 py-4">
        <div className="font-bold text-xl">
          {currentMonthStr} Weekly Distance
        </div>
        <div className="flex justify-center items-center p-2">
          {loading ? <LoadingIndicator /> : <Bar data={barData} />}
        </div>
      </div>
    </div>
  )
}
