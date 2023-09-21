import React from "react"

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
}

export default function ActivityHeader({
  activityDetails
}: {
  activityDetails: ActivityDetail
}) {
  return (
    <>
      {/* Title */}
      <h5 className="text-3xl font-bold">{activityDetails.name}</h5>
      {/* Description */}
      <h5 className="text-xl font-medium gap-2 my-2">
        {activityDetails.description}
      </h5>
      {/* Date-Weather-Device */}
      <div className="font-bold text-gray-500 text-sm mb-2">
        {new Date(activityDetails.start_date).toLocaleString()} -{" "}
        {activityDetails.average_temp}&deg;C /{" "}
        {(activityDetails.average_temp * 9) / 5 + 32}&deg;F -{" "}
        {activityDetails.device_name}
      </div>
    </>
  )
}
