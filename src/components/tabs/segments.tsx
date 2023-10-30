import React, { useEffect, useState } from "react"
import useSWR from "swr"
// mapbox
import polyline from "@mapbox/polyline"
// api
import { getSegment } from "@/utils/api"

export default function Segments({
  segments,
  setSegmentRoute
}: {
  segments: any[]
  setSegmentRoute: any
}) {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [segmentId, setSegmentId] = useState<number | null>(null)

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const { data: segment } = useSWR(
    segmentId && stravaAccessToken
      ? ["segment", segmentId, stravaAccessToken]
      : null,
    ([key, segmentId, token]) => getSegment(segmentId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  useEffect(() => {
    if (segmentId && segment) {
      const route = polyline.toGeoJSON(segment.map.polyline)
      setSegmentRoute(route)
    }
  }, [segmentId, segment])

  return (
    <div className="w-full">
      <div className="overflow-y-auto rounded shadow h-[500px]">
        <table className="w-full table text-sm text-left text-gray-400">
          <thead className="text-xs sticky top-0 uppercase bg-gray-700 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3"
              >
                name
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                distance
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                time
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                power
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                speed
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s: any, idx) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 border-gray-300 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSegmentId(s.segment.id)
                }}
                key={idx + s.segment.id}
              >
                <td
                  className="text-xs text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left"
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
                <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                  {(s.distance / 1609.344).toFixed(1)} miles
                </td>
                <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                  {(s.moving_time / 60).toFixed(0)} mins
                </td>
                <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                  {(s.average_watts || 0).toFixed(0)} watts
                </td>
                <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                  {(s.distance / 1609.344 / (s.moving_time / 3600)).toFixed(0)}{" "}
                  mph
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
