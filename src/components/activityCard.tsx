import React from "react"
// next
import { useRouter } from "next/router"
import Image from "next/image"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
// helpers
import {
  metersConversion,
  secondsConversion,
  speedConversion
} from "@/utils/conversions"

export default function ActivityCard({ activity }: { activity: any }) {
  const router = useRouter()

  // set mapbox access token
  const mapboxAccessToken: string =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.toString() || ""
  mapboxgl.accessToken = mapboxAccessToken

  function goToActivityPage() {
    router.push(`/activities/${activity.id}`)
  }

  const ActivityTitle = () => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl">{activity.name}</div>
          <div className="flex gap-2">
            {activity.athlete_count > 1 && (
              <div className="bg-blue-200 rounded text-sm font-bold text-blue-700 px-1">
                <p>{activity.athlete_count}</p>
              </div>
            )}
            {activity.suffer_score > 0 && (
              <div className="bg-red-200 rounded text-sm font-bold text-red-700 px-1">
                {activity.suffer_score}
              </div>
            )}
            <div className="bg-gray-200 rounded text-sm font-semibold text-gray-800 px-1">
              {activity.sport_type}
            </div>
          </div>
        </div>
        <div className="font-semibold text-gray-500 text-xs">
          <div>{new Date(activity.start_date).toLocaleString()}</div>
        </div>
      </div>
    )
  }

  const ActivityImage = () => {
    return (
      <div className="my-2">
        <Image
          src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s-a+9ed4bd(${
            activity.start_latlng[1]
          },${activity.start_latlng[0]}),pin-s-b+000(${
            activity.end_latlng[1]
          },${activity.end_latlng[0]}),path-5+f44-0.5(${encodeURIComponent(
            polyline.encode(
              polyline.decode(activity["map"]["summary_polyline"])
            )
          )})/auto/600x300?access_token=${mapboxgl.accessToken}&zoom=15`}
          alt="map"
          width={800}
          height={800}
          className="rounded w-full"
        />
      </div>
    )
  }

  const ActivityStats = () => {
    return (
      <div>
        <div className="text-left flex mx-auto justify-center items-center">
          <div className="grid grid-cols-3 gap-x-14 gap-y-2">
            <div>
              <p className="text-xs">Distance</p>
              <p className="text-lg font-semibold">
                {metersConversion(activity.distance, "mile").toFixed(1)} mi
              </p>
            </div>
            <div>
              <p className="text-xs">Elevation</p>
              <p className="text-lg font-semibold">
                {metersConversion(
                  activity.total_elevation_gain,
                  "feet"
                ).toFixed(0)}{" "}
                ft
              </p>
            </div>
            <div>
              <p className="text-xs">Time</p>
              <p className="text-lg font-semibold">
                {secondsConversion(activity.moving_time)}
              </p>
            </div>
            <div>
              <p className="text-xs">Avg Speed</p>
              <p className="text-lg font-semibold">
                {speedConversion(activity.average_speed).toFixed(0)} mph
              </p>
            </div>
            <div>
              <p className="text-xs">Max Speed</p>
              <p className="text-lg font-semibold">
                {speedConversion(activity.max_speed).toFixed(0)} mph
              </p>
            </div>
            <div>
              <p className="text-xs">Avg Watts</p>
              <p className="text-lg font-semibold">
                {(activity.average_watts || 0).toFixed(0)} w
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded border-2 w-full h-fit cursor-pointer p-3"
      onClick={goToActivityPage}
    >
      <ActivityTitle />
      <ActivityImage />
      <ActivityStats />
    </div>
  )
}
