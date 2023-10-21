import React from "react"
import { useEffect, useState } from "react"
// api
import { getAthleteZones } from "@/utils/api"
// swr
import useSWR from "swr"
// chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const zoneInfo: any = {
  0: ["recovery", "gray"],
  1: ["endurance", "blue"],
  2: ["tempo", "green"],
  3: ["threshold", "yellow"],
  4: ["vo2 max", "orange"],
  5: ["anaerobic", "red"],
  6: ["neuromuscular", "purple"]
}

export default function PowerZones({
  segmentEfforts
}: {
  segmentEfforts: any[]
}) {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [powerZonesTotal, setPowerZonesTotal] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  })
  const [heartrateZonesTotal, setHeartrateZonesTotal] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0
  })

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const { data: zones } = useSWR(
    stravaAccessToken && segmentEfforts ? ["zones", stravaAccessToken] : null,
    ([key, token]) => getAthleteZones(token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  useEffect(() => {
    if (zones && segmentEfforts) {
      const pZones: any = { ...powerZonesTotal }
      const hrZones: any = { ...heartrateZonesTotal }
      segmentEfforts.forEach((s: any) => {
        const avgPower = s.average_watts
        const avgHeartrate = s.average_heartrate
        const movingTime = s.moving_time
        zones.power.zones.forEach((z: any, idx: number) => {
          if (avgPower >= z.min && avgPower <= z.max) {
            pZones[idx] += movingTime
          }
        })
        zones.heart_rate.zones.forEach((z: any, idx: number) => {
          if (avgHeartrate >= z.min && avgHeartrate <= z.max) {
            hrZones[idx] += movingTime
          }
        })
      })
      setPowerZonesTotal(pZones)
      setHeartrateZonesTotal(hrZones)
    }
  }, [zones, segmentEfforts])

  const labels = Object.values(zoneInfo).map((z: any) => z[0])

  const barDataPower: any = {
    labels: labels,
    datasets: [
      {
        label: "power zones",
        data: Object.values(powerZonesTotal),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }

  const barDataHR: any = {
    labels: labels,
    datasets: [
      {
        label: "heart rate zones",
        data: Object.values(heartrateZonesTotal),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }

  return (
    <>
      {segmentEfforts && zones ? (
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <div className="mx-6 my-4 bg-white rounded-lg shadow-md">
            <div className="px-6 py-4">
              <div className="font-bold text-xl">Power Zones</div>
              <div
                className="flex justify-center items-center p-2"
                style={{ width: "99%" }}
              >
                <Bar data={barDataPower} />
              </div>
            </div>
          </div>
          <div className="mx-6 my-4 bg-white rounded-lg shadow-md">
            <div className="px-6 py-4">
              <div className="font-bold text-xl">Heart Rate Zones</div>
              <div
                className="flex justify-center items-center p-2 w-fill"
                style={{ width: "99%" }}
              >
                <Bar data={barDataHR} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </>
  )
}
