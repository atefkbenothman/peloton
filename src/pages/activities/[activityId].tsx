import React from "react"
import { useEffect } from "react"
// next
import { useRouter } from "next/router"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
import Map, { Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
// components
import Segments from "../../components/segments"
import PowerZones from "../../components/powerzones"
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
  const activityId = router.query.activityId

  mapboxgl.accessToken =
    "pk.eyJ1IjoiYXRlZmthaWJlbm90aG1hbiIsImEiOiJjbGU1Mms1aGQwMzk2M3BwMzhyOWx2dDV2In0.Iqr4f_ZJMostXFJ3NJB1RA"

  const [stravaAccessToken, setStravaAccessToken] = React.useState<string>("")
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const [activityDetails, setActivityDetails] = React.useState<ActivityDetail>({
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
  const [activityRoute, setActivityRoute] = React.useState<string>("")
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])

  // retrive strava accessToken from localstorage
  useEffect(() => {
    setStravaAccessToken(window.localStorage.getItem("accessToken") || "")
  }, [])

  // get activityId from url
  useEffect(() => {
    if (stravaAccessToken && activityId) {
      getActivityDetails()
    }
  }, [activityId, stravaAccessToken])

  // retrive activity details from strava api
  const getActivityDetails = async () => {
    const activityDetailURL: string = `https://www.strava.com/api/v3/activities/${activityId}`
    try {
      const res = await fetch(activityDetailURL, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + stravaAccessToken
        }
      })
      const data = await res.json()
      setActivityDetails(data)
      getGeoJson(data)
      setLoaded(true)
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
                  key={activityId?.toString()}
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
                title="Segments"
              >
                <Segments
                  segments={activityDetails.segment_efforts}
                  setSegmentRoute={setSegmentRoute}
                />
              </Tabs.Item>
              <Tabs.Item title="Power Zones">
                <PowerZones segmentEfforts={activityDetails.segment_efforts} />
              </Tabs.Item>
              <Tabs.Item title="Stats">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </Tabs.Item>
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  )
}
