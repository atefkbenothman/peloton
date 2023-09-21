import React from "react"
import { useEffect, useState } from "react"
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
// api
import { fetchActivityStream } from "@/utils/api"

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

interface ActivityStream {
  time: number[]
  distance: number[]
  moving: number[]
  velocity: number[]
  altitude: number[]
  grade: number[]
}

export default function Analysis({ activityId }: { activityId: string }) {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [activityStreamData, setActivityStreamData] = useState<ActivityStream>({
    time: [],
    distance: [],
    moving: [],
    velocity: [],
    altitude: [],
    grade: []
  })

  // retrive strava accessToken from sessionStorage
  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  useEffect(() => {
    if (stravaAccessToken) {
      getActivityStream()
    }
  }, [stravaAccessToken])

  const getActivityStream = async () => {
    try {
      const activityStream = await fetchActivityStream(
        stravaAccessToken,
        activityId
      )
      setActivityStreamData({
        time: activityStream["time"]["data"],
        distance: activityStream["distance"]["data"],
        moving: activityStream["moving"]["data"],
        altitude: activityStream["altitude"]["data"],
        grade: activityStream["grade_smooth"]["data"],
        velocity: activityStream["velocity_smooth"]["data"]
      })
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  // line graph options
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

  const data = {
    labels: activityStreamData.time.map((t) => t),
    datasets: [
      {
        label: "Speed",
        fill: false,
        pointStyle: false,
        data: Object.values(activityStreamData.velocity),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      },
      {
        label: "Grade",
        fill: false,
        pointStyle: false,
        data: Object.values(activityStreamData.grade),
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)"
      },
      {
        label: "Elevation",
        fill: true,
        pointStyle: false,
        data: Object.values(activityStreamData.altitude),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "elevationYAxis"
      }
    ]
  }

  return (
    <div
      className="flex justify-center items-center"
      style={{ width: "99%" }}
    >
      {loading ? (
        <>
          <p>loading...</p>
        </>
      ) : (
        <>
          <Line
            options={options}
            data={data as any}
          />
        </>
      )}
    </div>
  )
}
