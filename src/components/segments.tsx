import React, { useEffect } from "react"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"

export default function Segments({ activityDetails, setSegmentRoute }) {
  const [stravaAccessToken, setStravaAccessToken] = React.useState("")

  useEffect(() => {
    setStravaAccessToken(window.localStorage.getItem("accessToken") || "")
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

  function getSegment(id: number) {
    getSegmentDetails(id)
  }

  return (
    <div className="">
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
          {activityDetails.segment_efforts.map((seg) => (
            <tr
              key={activityDetails.id + seg.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              onClick={() => getSegment(seg.segment.id)}
            >
              <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal">
                {seg.name}
              </td>
              <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                {(seg.moving_time / 60).toFixed(0)} mins
              </td>
              <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                {(seg.distance / 1609.344).toFixed(1)} miles
              </td>
              <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                {(seg.average_watts || 0).toFixed(0)} watts
              </td>
              <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                {(seg.distance / 1609.344 / (seg.moving_time / 3600)).toFixed(
                  0
                )}{" "}
                mph
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
