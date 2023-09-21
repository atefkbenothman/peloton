import React from "react"
import { useEffect, useState } from "react"
// next
import { useRouter } from "next/router"
// components
import ActivityHeader from "@/components/activityHeader"
import ActivityMap from "@/components/activityMap"
import ActivityStats from "@/components/activityStats"
import ActivityTabs from "@/components/activityTabs"
// api
import { fetchActivityDetails, fetchActivityPhotos } from "@/utils/api"
// mapbox
import polyline from "@mapbox/polyline"

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

export default function ActivityDetails() {
  const router = useRouter()
  const activityId: string = Array.isArray(router.query.activityId)
    ? router.query.activityId[0]
    : router.query.activityId ?? ""

  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [activityDetails, setActivityDetails] = useState<ActivityDetail>({
    name: "",
    description: "",
    distance: 0,
    moving_time: 0,
    average_speed: 0,
    max_speed: 0,
    average_watts: 0,
    max_watts: 0,
    total_elevation_gain: 0,
    calories: 0,
    start_date: 0,
    average_temp: 0,
    device_name: "",
    segment_efforts: [],
    start_latlng: []
  })
  const [activityRoute, setActivityRoute] = useState<string>("")
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [activityPhotos, setActivityPhotos] = useState<any[]>([])

  // retrive strava accessToken from sessionStorage
  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  // get activityId from url
  useEffect(() => {
    if (stravaAccessToken && activityId) {
      getActivityDetails()
      getActivityPhotos()
    }
  }, [activityId, stravaAccessToken])

  // retrieve activity photos from strava api
  const getActivityPhotos = async () => {
    try {
      const activityPhotos = await fetchActivityPhotos(
        stravaAccessToken,
        activityId
      )
      let photos = []
      for (const photo of activityPhotos) {
        photos.push(photo.urls["2000"])
      }
      setActivityPhotos(photos)
    } catch (err) {
      console.error(err)
    }
  }

  // retrive activity details from strava api
  const getActivityDetails = async () => {
    try {
      const activityDetails = await fetchActivityDetails(
        stravaAccessToken,
        activityId
      )
      setActivityDetails(activityDetails)
      getGeoJson(activityDetails)
    } catch (err) {
      console.error(err)
    }
  }

  // get the polyline of the activity route
  function getGeoJson(data: any) {
    const polylineData: any = polyline.toGeoJSON(data.map.summary_polyline)
    setActivityRoute(polylineData)
  }

  return (
    <div className="bg-gray-100">
      <div className="w-full">
        <div className="mx-6 py-6">
          {/* Header */}
          <div className="mb-6">
            {activityDetails && (
              <ActivityHeader activityDetails={activityDetails} />
            )}
          </div>
          {/* Map */}
          <div className="mb-6 h-96">
            {(activityDetails.start_latlng || []).length !== 0 && (
              <ActivityMap
                activityId={activityId}
                activityDetails={activityDetails}
                activityRoute={activityRoute}
                segmentRoute={segmentRoute}
              />
            )}
          </div>
          {/* Stats */}
          <div>
            {activityDetails && (
              <ActivityStats activityDetails={activityDetails} />
            )}
          </div>
          {/* Tabs */}
          <div className="my-10">
            {activityDetails && (
              <ActivityTabs
                activityId={activityId}
                activityDetails={activityDetails}
                activityPhotos={activityPhotos}
                setSegmentRoute={setSegmentRoute}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
