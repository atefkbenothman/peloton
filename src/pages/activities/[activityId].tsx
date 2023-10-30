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
import ErrorCard from "@/components/errorCard"
// api
import { getActivity, getActivityPhotos, getSegment } from "@/utils/api"
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

  const {
    data: activity,
    error,
    isLoading
  } = useSWR(
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
    <div className="pt-4 px-4 xl:mx-40">
      {error ? (
        <ErrorCard error={error} />
      ) : (
        <>
          {/* Header */}
          <div className="mb-2">
            {activity && <ActivityHeader activityDetails={activity} />}
          </div>
          {/* Map */}
          {activity && (activity.start_latlng || []).length !== 0 && (
            <div className="mb-6 h-96 border-2 border-black">
              <ActivityMap
                activityId={activity.id}
                activityDetails={activity}
                activityRoute={route}
                segmentRoute={segmentRoute}
              />
            </div>
          )}
          {/* Stats */}
          <div>{activity && <ActivityStats activityDetails={activity} />}</div>
          {/* Tabs */}
          <div className="my-4">
            {activity && (
              <ActivityTabs
                activityId={activity.id}
                activityDetails={activity}
                activityPhotos={photos}
                setSegmentRoute={setSegmentRoute}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
