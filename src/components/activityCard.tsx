import React from "react"
// next
import { useRouter } from "next/router"
import Image from "next/image"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"

export default function ActivityCard({ activity }: { activity: any }) {
  const router = useRouter()

  // set mapbox access token
  const mapboxAccessToken: string =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.toString() || ""
  mapboxgl.accessToken = mapboxAccessToken

  function goToActivityPage() {
    router.push(`/activities/${activity.id}`)
  }

  return (
    <div>
      {/* Activity Card */}
      <div>
        <div
          className="max-w-xl rounded-lg overflow-hidden shadow cursor-pointer bg-white"
          onClick={goToActivityPage}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-2xl mb-1 pb-1 mr-2">
                  {activity.name}
                </div>
              </div>
              <div className="flex gap-2">
                {activity.athlete_count > 1 && (
                  <span className="inline-block bg-blue-200 rounded-lg px-3 py-1 text-sm font-bold text-blue-700 mb-2">
                    {activity.athlete_count}
                  </span>
                )}
                {activity.suffer_score > 0 && (
                  <span className="inline-block bg-red-200 rounded-lg px-3 py-1 text-sm font-bold text-red-700 mb-2">
                    {activity.suffer_score}
                  </span>
                )}
                <span className="inline-block bg-gray-200 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
                  {activity.sport_type}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between font-bold text-gray-500 text-sm mb-2">
              <div>{new Date(activity.start_date).toLocaleString()}</div>
            </div>
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
              className="mb-2"
              width={800}
              height={800}
            />
            <div className="flex items-center justify-center text-center">
              <div className="grid grid-cols-3 gap-2 w-full whitespace-nowrap">
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-base">distance</p>
                  <p className="font-bold text-2xl text-center">
                    {(activity.distance / 1609.344).toFixed(1)}{" "}
                    <span className="text-sm">mi</span>
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-base">elevation</p>
                  <p className="font-bold text-2xl">
                    {(activity.total_elevation_gain * 3.281).toFixed(0) || 0}{" "}
                    <span className="text-sm">ft</span>
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-base">time</p>
                  <p className="font-bold text-2xl">
                    {Math.floor(activity.moving_time / 3600)}:
                    {Math.floor((activity.moving_time % 3600) / 60)}{" "}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-base">avg mph</p>
                  <p className="font-bold text-2xl">
                    {(activity.average_speed * 2.23694).toFixed(0)}{" "}
                    <span className="text-sm">mph</span>
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-base">max mph</p>
                  <p className="font-bold text-2xl">
                    {(activity.max_speed * 2.23694).toFixed(0)}{" "}
                    <span className="text-sm">mph</span>
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-base">avg watts</p>
                  <p className="font-bold text-2xl">
                    {(activity.average_watts || 0).toFixed(0)}{" "}
                    <span className="text-sm">w</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
