import React from "react"
// helpers
import {
  metersConversion,
  secondsConversion,
  speedConversion
} from "@/utils/conversions"

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
  average_heartrate: number
  elapsed_time: number
  pr_count: number
}

export default function ActivityStats({
  activityDetails
}: {
  activityDetails: ActivityDetail
}) {
  return (
    <div className="text-left flex">
      <div className="grid grid-cols-5 md:gap-x-12 xl:gap-x-24 gap-y-1">
        <div>
          <p className="text-gray-700 text-sm">distance</p>
          <p className="font-bold text-xl">
            {metersConversion(activityDetails.distance, "mile").toFixed(1)} mi
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">elevation gain</p>
          <p className="font-bold text-xl">
            {metersConversion(
              activityDetails.total_elevation_gain,
              "feet"
            ).toFixed(0)}{" "}
            ft
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">moving time</p>
          <p className="font-bold text-xl">
            {secondsConversion(activityDetails.moving_time, "long")}
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">elapsed time</p>
          <p className="font-bold text-xl">
            {secondsConversion(activityDetails.elapsed_time, "long")}
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">calories</p>
          <p className="font-bold text-xl">
            {(activityDetails.calories || 0).toFixed(0)} cals
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">avg mph</p>
          <p className="font-bold text-xl">
            {speedConversion(activityDetails.average_speed).toFixed(1)} mph
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">max mph</p>
          <p className="font-bold text-xl">
            {speedConversion(activityDetails.max_speed).toFixed(1)} mph
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">avg watts</p>
          <p className="font-bold text-xl">
            {(activityDetails.average_watts || 0).toFixed(0)} w
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">avg HR</p>
          <p className="font-bold text-xl">
            {(activityDetails.average_heartrate || 0).toFixed(0)} bpm
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-sm">PRs</p>
          <p className="font-bold text-xl">{activityDetails.pr_count}</p>
        </div>
      </div>
    </div>
  )
}
