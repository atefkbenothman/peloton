import React from "react"
import { useEffect } from "react"
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

interface ActivityStream {
  time: number[]
  distance: number[]
  moving: number[]
  velocity: number[]
  altitude: number[]
  grade: number[]
}

export default function Analysis({ activityId }: { activityId: string }) {
  const [stravaAccessToken, setStravaAccessToken] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(true)
  const [activityStreamData, setActivityStreamData] =
    React.useState<ActivityStream>({
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

  // retrieve activity stream
  const getActivityStream = async () => {
    const activityStreamURL: string = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance,velocity_smooth,watts,grade_smooth,moving,altitude&key_by_type=true`
    try {
      const res = await fetch(activityStreamURL, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + stravaAccessToken
        }
      })
      const data = await res.json()
      setActivityStreamData({
        time: data["time"]["data"],
        distance: data["distance"]["data"],
        moving: data["moving"]["data"],
        altitude: data["altitude"]["data"],
        grade: data["grade_smooth"]["data"],
        velocity: data["velocity_smooth"]["data"]
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
      x: {},
      y: {}
    },
    elevationYAxis: {
      // Define options for the "Elevation" dataset's Y-axis scale
      type: "log" // Use 'linear' for a linear scale
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
