import React from "react"
// next
import Link from "next/link"

interface ActivityDetail {
  name: string
  description: string
  distance: number
  moving_time: number
  average_speed: number
  max_speed: number
  average_watts: number
  max_watts: number
  total_elevation_gain: number
  calories: number
  start_date: number
  average_temp: number
  device_name: string
  segment_efforts: any[]
  start_latlng: any[]
  suffer_score: number
  athlete_count: number
  type: string
}

export default function ActivityHeader({
  activityDetails
}: {
  activityDetails: ActivityDetail
}) {
  return (
    <>
      <div className="mb-4">
        <Link href="/activities">
          <button
            type="button"
            className="text-white bg-black rounded-lg p-2.5 inline-flex items-center mr-2"
          >
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            <span className="sr-only">Back</span>
          </button>
        </Link>
      </div>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h5 className="text-3xl font-bold">{activityDetails.name}</h5>
        <div className="flex">
          {activityDetails.athlete_count > 1 && (
            <span className="inline-block bg-blue-200 rounded-lg px-3 py-1 text-2xl font-bold text-blue-700 m-2">
              {activityDetails.athlete_count}
            </span>
          )}
          {activityDetails.suffer_score && (
            <span className="inline-block bg-red-200 rounded-lg px-3 py-1 text-2xl font-bold text-red-700 m-2">
              {activityDetails.suffer_score}
            </span>
          )}
          <span className="bg-gray-300 rounded-lg px-3 py-1 text-2xl font-bold text-gray-700 m-2">
            {activityDetails.type}
          </span>
        </div>
      </div>
      {/* Description */}
      <h5 className="text-xl font-medium">{activityDetails.description}</h5>
      {/* Date-Weather-Device */}
      <div className="font-bold text-gray-500 text-md py-2">
        {new Date(activityDetails.start_date).toLocaleString()} -{" "}
        {activityDetails.average_temp}&deg;C /{" "}
        {(activityDetails.average_temp * 9) / 5 + 32}&deg;F -{" "}
        {activityDetails.device_name}
      </div>
    </>
  )
}
