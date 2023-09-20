import React, { useEffect } from "react"
// mapbox
import polyline from "@mapbox/polyline"

interface SegmentEffort {
  average_watts: number
  distance: number
  elapsed_time: number
  moving_time: number
  name: string
  pr_rank: number
  segment: Segment
}

interface Segment {
  average_grade: number
  climb_category: number
  distance: number
  id: number
  maximum_grade: number
  name: string
}

export default function Segments({
  segments,
  setSegmentRoute
}: {
  segments: SegmentEffort[]
  setSegmentRoute: any
}) {
  const [stravaAccessToken, setStravaAccessToken] = React.useState<string>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const getSegmentDetails = async (id: number) => {
    try {
      const res = await fetch(`https://www.strava.com/api/v3/segments/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + stravaAccessToken
        }
      })
      const data = await res.json()
      const segmentPolyline = polyline.toGeoJSON(data.map.polyline)
      setSegmentRoute(segmentPolyline)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      {/* table */}
      <table className="w-full border text-center table-fixed">
        {/* head */}
        <thead className="text-xs bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2 border-r"
            >
              name
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2 border-r"
            >
              time
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2 border-r"
            >
              distance
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2 border-r"
            >
              avg power
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2 border-r"
            >
              avg speed
            </th>
          </tr>
        </thead>

        {/* body */}
        <tbody className="border-b">
          {segments.map((s: SegmentEffort) => (
            <tr
              key={s.segment.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              onClick={() => {
                getSegmentDetails(s.segment.id)
              }}
            >
              <td
                className="text-xs text-gray-900 font-semibold px-4 py-1 border-r break-normal"
                style={{
                  backgroundColor:
                    s.pr_rank === 3
                      ? "rgba(210, 105, 30, 0.75" // bronze
                      : s.pr_rank === 2
                      ? "rgba(182, 192, 192, 0.75)" // silver
                      : s.pr_rank === 1
                      ? "rgba(255, 215, 0, 0.75)" // gold
                      : ""
                }}
              >
                {s.name}
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal">
                {(s.moving_time / 60).toFixed(0)} mins
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal">
                {(s.distance / 1609.344).toFixed(1)} miles
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal">
                {(s.average_watts || 0).toFixed(0)} watts
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal">
                {(s.distance / 1609.344 / (s.moving_time / 3600)).toFixed(0)}{" "}
                mph
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
