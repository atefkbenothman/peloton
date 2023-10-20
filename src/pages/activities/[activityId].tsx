import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// next
import { useRouter } from "next/router"
// components
import ActivityHeader from "@/components/activity/activityHeader"
import ActivityMap from "@/components/activity/activityMap"
import ActivityStats from "@/components/activity/activityStats"
import ActivityTabs from "@/components/activity/activityTabs"
// api
import { getActivity, getActivityPhotos } from "@/utils/api"
// mapbox
import polyline from "@mapbox/polyline"

export default function ActivityDetails() {
  const router = useRouter()
  // get activityId from url
  const activityId: string = Array.isArray(router.query.activityId)
    ? router.query.activityId[0]
    : router.query.activityId ?? ""

  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [route, setRoute] = useState<any | null>(null)

  // retrive strava accessToken from sessionStorage
  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const { data: activity } = useSWR(
    activityId && stravaAccessToken
      ? ["activity", activityId, stravaAccessToken]
      : null,
    ([key, activityId, token]) => getActivity(activityId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const { data: photos } = useSWR(
    activityId && stravaAccessToken
      ? ["activityPhotos", activityId, stravaAccessToken]
      : null,
    ([key, activityId, token]) => getActivityPhotos(activityId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  useEffect(() => {
    if (activity && activity.map) {
      setRoute(polyline.toGeoJSON(activity.map.summary_polyline))
    }
  }, [activity])

  return (
    <div className="bg-gray-100">
      <div className="w-full">
        <div className="mx-6 py-6">
          {/* Header */}
          <div className="mb-6">
            {activity && <ActivityHeader activityDetails={activity} />}
          </div>
          {/* Map */}
          <div className="mb-6 h-96">
            {activity && (activity.start_latlng || []).length !== 0 && (
              <ActivityMap
                activityId={activity.id}
                activityDetails={activity}
                activityRoute={route}
                segmentRoute={segmentRoute}
              />
            )}
          </div>
          {/* Stats */}
          <div>{activity && <ActivityStats activityDetails={activity} />}</div>
          {/* Tabs */}
          <div className="my-10">
            {activity && (
              <ActivityTabs
                activityId={activity.id}
                activityDetails={activity}
                activityPhotos={photos}
                setSegmentRoute={setSegmentRoute}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
