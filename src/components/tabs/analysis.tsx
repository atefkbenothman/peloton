import React from "react"
import { useEffect, useState } from "react"
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
      revalidateOnFocus: false
    }
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: "Stream Data"
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    elevationYAxis: {
      type: "linear" // or "log"
    },
    animation: {
      duration: 0
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
          backgroundColor: "rgba(53, 162, 235, 0.5)"
        },
        {
          label: "Grade",
          fill: false,
          pointStyle: false,
          data: Object.values(activityStream.grade_smooth.data),
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.5)"
        },
        {
          label: "Elevation",
          fill: true,
          pointStyle: false,
          data: Object.values(activityStream.altitude.data),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "elevationYAxis"
        }
      ]
    }
  }

  return (
    <div
      className="flex justify-center items-center"
      style={{ width: "99%" }}
    >
      {isLoading ? (
        <>
          <p>loading...</p>
        </>
      ) : (
        <>
          {activityStream && activityStream.time ? (
            <Line
              options={options}
              data={data as any}
            />
          ) : (
            <p>data is missing</p>
          )}
        </>
      )}
    </div>
  )
}
