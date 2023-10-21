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

export default function YearlyDistance({
  data,
  loading
}: {
  data: any
  loading: boolean
}) {
  const [monthlyDistance, setMonthlyDistance] = useState<any>({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0
  })

  useEffect(() => {
    if (data) {
      const currentYear = new Date().getFullYear()
      const acts = { ...monthlyDistance }
      data.forEach((a: any) => {
        const startDate = new Date(a.start_date)
        const month = startDate.toLocaleString("en-US", { month: "short" })
        const year = startDate.getFullYear()

        if (year === currentYear) {
          acts[month] += a.distance * 0.000621371
        }
      })
      setMonthlyDistance(acts)
    }
  }, [data])

  const barData = {
    labels: Object.keys(monthlyDistance),
    datasets: [
      {
        label: "total distance (mi)",
        data: Object.values(monthlyDistance),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }

  return (
    <div className="max-w-xl mx-6 my-4 bg-white rounded-lg shadow-md">
      <div className="px-6 py-4">
        <div className="font-bold text-xl">Yearly Distance</div>
        <div className="flex justify-center items-center p-2">
          {loading ? <LoadingIndicator /> : <Bar data={barData} />}
        </div>
      </div>
    </div>
  )
}
