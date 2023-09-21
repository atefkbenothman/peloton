import React from "react"
import { useEffect, useState } from "react"
// next
import { useRouter } from "next/router"
import Image from "next/image"
// components
import Segments from "@/components/segments"
import PowerZones from "@/components/powerZones"
import Analysis from "@/components/analysis"
// api
import { fetchActivityDetails, fetchActivityPhotos } from "@/utils/api"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
import Map, { Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
// flowbite
import { Tabs, CustomFlowbiteTheme } from "flowbite-react"

const customTheme: CustomFlowbiteTheme["tab"] = {
  tablist: {
    styles: {
      default: ""
    },
    tabitem: {
      base: "flex items-center justify-center p-4 px-10 rounded-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:outline-none",
      styles: {
        default: {
          active: {
            on: "bg-gray-300"
          },
          base: "font-bold text-xl"
        }
      }
    }
  }
}

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

  // set mapbox access token
  const mapboxAccessToken: string =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.toString() || ""
  mapboxgl.accessToken = mapboxAccessToken

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
  const [segmentEffortCount, setSegmentEffortCount] = useState<number>(0)
  const [activityRoute, setActivityRoute] = useState<string>("")
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [activityPhotos, setActivityPhotos] = useState<any[]>([])
  const [activityPhotoCount, setActivityPhotoCount] = useState<number>(0)

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
      setActivityPhotoCount(photos.length)
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
      setSegmentEffortCount(activityDetails.segment_efforts.length)
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
          {/* Title */}
          <div className="mb-6">
            {/* Name */}
            <h5 className="text-3xl font-bold">{activityDetails.name}</h5>
            {/* Description */}
            <h5 className="text-xl font-medium gap-2 my-2">
              {activityDetails.description}
            </h5>
            {/* Date/Weather/Device */}
            <div className="font-bold text-gray-500 text-xs mb-2">
              {new Date(activityDetails.start_date).toLocaleString()} -{" "}
              {activityDetails.average_temp}&deg;C /{" "}
              {(activityDetails.average_temp * 9) / 5 + 32}&deg;F -{" "}
              {activityDetails.device_name}
            </div>
          </div>

          {/* Map */}
          {(activityDetails.start_latlng || []).length !== 0 && (
            <>
              <div className="mb-6 h-96">
                <Map
                  key={activityId}
                  mapboxAccessToken={mapboxgl.accessToken}
                  initialViewState={{
                    longitude: activityDetails.start_latlng[1],
                    latitude: activityDetails.start_latlng[0],
                    zoom: 10
                  }}
                  style={{
                    width: "100%",
                    height: "100%"
                  }}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                  onLoad={(event) => event.target.resize()}
                  onResize={(event) => event.target.resize()}
                >
                  <NavigationControl />
                  <Source
                    id="polylineLayer"
                    type="geojson"
                    data={activityRoute}
                  >
                    <Layer
                      id="lineLayer"
                      type="line"
                      source="my-data"
                      layout={{
                        "line-join": "round",
                        "line-cap": "round"
                      }}
                      paint={{
                        "line-color": "rgba(255, 0, 0, 0.8)",
                        "line-width": 3
                      }}
                    />
                  </Source>
                  {segmentRoute.length !== 0 ? (
                    <Source
                      id="polylineLayer2"
                      type="geojson"
                      data={segmentRoute as any}
                    >
                      <Layer
                        id="lineLayer2"
                        type="line"
                        source="my-data"
                        layout={{
                          "line-join": "round",
                          "line-cap": "round"
                        }}
                        paint={{
                          "line-color": "rgba(15, 10, 222, 1)",
                          "line-width": 3
                        }}
                      />
                    </Source>
                  ) : (
                    <></>
                  )}
                </Map>
              </div>
            </>
          )}
          {/* Stats */}
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
                {((activityDetails.average_speed || 0) * 2.23694).toFixed(2)}{" "}
                mph
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
                {((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(
                  0
                )}{" "}
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
          <div className="my-10">
            <Tabs.Group
              style="default"
              theme={customTheme}
            >
              <Tabs.Item
                active
                title={`Segments (${segmentEffortCount})`}
              >
                <Segments
                  segments={activityDetails.segment_efforts}
                  setSegmentRoute={setSegmentRoute}
                />
              </Tabs.Item>
              <Tabs.Item title="Power Zones">
                <PowerZones segmentEfforts={activityDetails.segment_efforts} />
              </Tabs.Item>
              <Tabs.Item title={`Photos (${activityPhotoCount})`}>
                {activityPhotos.map((photo: any) => (
                  <Image
                    key={photo}
                    src={photo}
                    alt="activityPhoto"
                    className="m-2"
                    width={400}
                    height={400}
                  />
                ))}
              </Tabs.Item>
              <Tabs.Item title="Analysis">
                {activityId && (
                  <>
                    <Analysis activityId={activityId} />
                  </>
                )}
              </Tabs.Item>
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  )
}
