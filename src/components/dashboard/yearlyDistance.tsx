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
  const [lastMonthlyDistance, setLastMonthlyDistance] = useState<any>({
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
      const lastYear = currentYear - 1
      const acts = { ...monthlyDistance }
      const lastActs = { ...lastMonthlyDistance }
      data.forEach((a: any) => {
        const startDate = new Date(a.start_date)
        const month = startDate.toLocaleString("en-US", { month: "short" })
        const year = startDate.getFullYear()

        if (year === currentYear) {
          acts[month] += a.distance * 0.000621371
        }

        if (year === lastYear) {
          lastActs[month] += a.distance * 0.000621371
        }
      })
      setMonthlyDistance(acts)
      setLastMonthlyDistance(lastActs)
    }
  }, [data])

  const barData = {
    labels: Object.keys(monthlyDistance),
    datasets: [
      {
        label: "2022",
        data: Object.values(lastMonthlyDistance),
        backgroundColor: "rgba(53, 162, 235, 1)"
      },
      {
        label: "2023",
        data: Object.values(monthlyDistance),
        backgroundColor: "rgba(255, 99, 132, 1)"
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
        <div className="font-semibold text-lg">Monthly Distance</div>
        <div className="flex justify-center items-center">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Bar
              data={barData}
              options={options}
            />
          )}
        </div>
      </div>
    </div>
  )
}
