import React, { useEffect, useState } from "react"
// mapbox
import polyline from "@mapbox/polyline"
// api
import { getSegment, fetchSegmentDetail } from "@/utils/api"
import useSWR from "swr"

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
    segmentId ? ["segment", segmentId, stravaAccessToken] : null,
    ([key, segmentId, token]) => getSegment(segmentId, token),
    {
      revalidateOnFocus: false
    }
  )

  useEffect(() => {
    if (segmentId && segment) {
      const route = polyline.toGeoJSON(segment.map.polyline)
      setSegmentRoute(route)
    }
  }, [segmentId, segment])

  return (
    <div className="max-h-[400px] overflow-y-auto rounded-lg bg-gray-200 border-4 border">
      <table className="w-full table-fixed bg-gray-200">
        <thead className="sticky top-0 text-xs bg-gray-200">
          <tr>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2"
            >
              name
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2"
            >
              time
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2"
            >
              distance
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2"
            >
              avg power
            </th>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-2"
            >
              avg speed
            </th>
          </tr>
        </thead>
        <tbody className="border-b">
          {segments.map((s: any, idx) => (
            <tr
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
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
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                {(s.moving_time / 60).toFixed(0)} mins
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                {(s.distance / 1609.344).toFixed(1)} miles
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                {(s.average_watts || 0).toFixed(0)} watts
              </td>
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
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
