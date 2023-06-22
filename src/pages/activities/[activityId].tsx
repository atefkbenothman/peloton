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


export default function ActivityDetails() {

  const router = useRouter()
  const activityId = router.query.activityId

  mapboxgl.accessToken = "pk.eyJ1IjoiYXRlZmthaWJlbm90aG1hbiIsImEiOiJjbGU1Mms1aGQwMzk2M3BwMzhyOWx2dDV2In0.Iqr4f_ZJMostXFJ3NJB1RA"

  const [stravaAccessToken, setStravaAccessToken] = React.useState("")
  const [loaded, setLoaded] = React.useState(false)
  const [activityDetails, setActivityDetails] = React.useState({
    name: "",
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
    start_latlng: [],
  })
  const [activityRoute, setActivityRoute] = React.useState<any[]>([])
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])

  // retrive strava accessToken from localstorage
  useEffect(() => {
    setStravaAccessToken(window.localStorage.getItem("accessToken") || "")
  }, [])

  // get activityId from url
  useEffect(() => {
    if (!activityId) {
        return
    }
    getActivityDetails()
  }, [activityId, stravaAccessToken])

  // retrive activity details from strava api
  const getActivityDetails = async () => {
    const activityDetailURL = `https://www.strava.com/api/v3/activities/${activityId}`
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
    const polylineData = polyline.toGeoJSON(data.map.summary_polyline)
    setActivityRoute(polylineData)
  }

  return (
      <>
        <div className="min-h-screen mx-6 py-6">
          <div className="m-auto w-fill">

            {
              loaded && (
                <>
                  {/* Title */}
                  <div className="mb-6">

                    {/* Name */}
                    <h5 className="text-3xl font-bold">
                      {activityDetails.name}
                    </h5>

                    {/* Date/Weather/Device */}
                    <div className="font-bold text-gray-500 text-xs mb-2">
                      {new Date(activityDetails.start_date).toLocaleString()} - {activityDetails.average_temp}&deg;C / {(activityDetails.average_temp * 9 / 5) + 32}&deg;F - {activityDetails.device_name}
                    </div>
                  </div>

                  {/* Map */}
                  {
                    (activityDetails.start_latlng || []).length !== 0 && (
                      <>
                        <div className="mb-6 w-full h-96">
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
                              height: "100%",
                            }}
                            mapStyle="mapbox://styles/mapbox/streets-v12"
                            onLoad={(event) => event.target.resize()}
                            onResize={(event) => event.target.resize()}
                          >
                            <NavigationControl />
                            <Source id="polylineLayer" type="geojson" data={activityRoute}>
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
                            {
                              segmentRoute.length !== 0 ?
                                <Source id="polylineLayer2" type="geojson" data={segmentRoute}>
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
                                :
                                <></>
                            }
                          </Map>
                        </div>
                      </>
                    )
                  }

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 content-start">
                    <div>
                      <p className="text-gray-700 text-base">distance</p>
                      <p className="font-bold text-xl">{((activityDetails.distance || 0) / 1609.344).toFixed(2)} mi</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">time</p>
                      <p className="font-bold text-xl">{((activityDetails.moving_time || 0) / 60).toFixed(0)} mins</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">avg mph</p>
                      <p className="font-bold text-xl">{((activityDetails.average_speed || 0) * 2.23694).toFixed(2)} mph</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">max mph</p>
                      <p className="font-bold text-xl">{((activityDetails.max_speed || 0) * 2.23694).toFixed(2)} mph</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">avg watts</p>
                      <p className="font-bold text-xl">{(activityDetails.average_watts || 0).toFixed(2)} w</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">max watts</p>
                      <p className="font-bold text-xl">{(activityDetails.max_watts || 0)} mph</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">elevation gain</p>
                      <p className="font-bold text-xl">{((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(0)} feet</p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-base">calories</p>
                      <p className="font-bold text-xl">{((activityDetails.calories || 0)).toFixed(0)} cals</p>
                    </div>
                  </div>

                  {/* Segments */}
                  <div className="mt-10">

                    {/* Title */}
                    <h2 className="font-bold text-2xl">
                      Segments
                    </h2>

                    {/* Body */}
                    <div className="p-2">
                      <Segments activityDetails={activityDetails} setSegmentRoute={setSegmentRoute} />
                    </div>

                  </div>

                  {/* PowerZones */}
                  <div className="mt-10">

                    {/* Title */}
                    <h2 className="font-bold text-2xl">
                      Power Zones
                    </h2>

                    {/* Body */}
                    <div className="p-2">
                      <PowerZones segmentEfforts={activityDetails.segment_efforts} />
                    </div>

                    </div>

                </>
              )
            }

          </div>
        </div>
      </>
  )
}