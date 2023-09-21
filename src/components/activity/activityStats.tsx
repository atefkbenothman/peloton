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

export default function ActivityStats({
  activityDetails
}: {
  activityDetails: ActivityDetail
}) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div>
          <p className="text-gray-700 text-base">distance</p>
          <p className="font-bold text-2xl">
            {((activityDetails.distance || 0) / 1609.344).toFixed(2)} mi
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">time</p>
          <p className="font-bold text-2xl">
            {((activityDetails.moving_time || 0) / 60).toFixed(0)} mins
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">avg mph</p>
          <p className="font-bold text-2xl">
            {((activityDetails.average_speed || 0) * 2.23694).toFixed(2)} mph
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">max mph</p>
          <p className="font-bold text-2xl">
            {((activityDetails.max_speed || 0) * 2.23694).toFixed(2)} mph
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">avg watts</p>
          <p className="font-bold text-2xl">
            {(activityDetails.average_watts || 0).toFixed(2)} w
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">max watts</p>
          <p className="font-bold text-2xl">
            {activityDetails.max_watts || 0} mph
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">elevation gain</p>
          <p className="font-bold text-2xl">
            {((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(0)}{" "}
            feet
          </p>
        </div>
        <div>
          <p className="text-gray-700 text-base">calories</p>
          <p className="font-bold text-2xl">
            {(activityDetails.calories || 0).toFixed(0)} cals
          </p>
        </div>
      </div>
    </>
  )
}
