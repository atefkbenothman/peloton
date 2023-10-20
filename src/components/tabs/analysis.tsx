import React from "react"
import { useEffect, useState } from "react"
// components
import LoadingIndicator from "../loadingIndicator"
// swr
import useSWR from "swr"
// api
import { getActivityStream } from "@/utils/api"
// chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Analysis({ activityId }: { activityId: string }) {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const {
    data: activityStream,
    error,
    isLoading
  } = useSWR(
    stravaAccessToken
      ? ["activityStream", activityId, stravaAccessToken]
      : null,
    ([key, activityId, token]) => getActivityStream(activityId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const options = {
    responsive: true,
    elevationYAxis: {
      type: "linear" // or "log"
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    animation: false,
    parsing: true,
    spanGaps: false,
    showLine: true,
    pointRadius: 0,
    xAxes: [
      {
        type: "time",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20
        }
      }
    ],
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 20
        }
      }
    }
  }

  let data = null
  if (activityStream) {
    data = {
      labels: activityStream.time.data.map((t: any) => t),
      datasets: [
        {
          label: "Speed",
          fill: false,
          pointStyle: false,
          data: Object.values(activityStream.velocity_smooth.data),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          normalized: true
        },
        {
          label: "Grade",
          fill: false,
          pointStyle: false,
          data: Object.values(activityStream.grade_smooth.data),
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          normalized: true
        },
        {
          label: "Elevation",
          fill: true,
          pointStyle: false,
          data: Object.values(activityStream.altitude.data),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "elevationYAxis",
          normalized: true
        }
      ]
    }
  }

  return (
    <div>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          {activityStream && activityStream.time ? (
            <div className="grid grid-cols-1 gap-10 w-3/4">
              <div>
                <p className="font-bold text-lg">Stream</p>
                <Line
                  className="bg-gray-200 p-2 rounded-lg border-0"
                  data={data as any}
                  options={options as any}
                />
              </div>
            </div>
          ) : (
            <p>data is missing</p>
          )}
        </>
      )}
    </div>
  )
}
