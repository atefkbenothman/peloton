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
import Segments from "./segments"
import PowerZones from "./powerzones"


export default function ActivityModal({ activityId }) {
  // set mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  // get url queries
  const router = useRouter()
  const urlQueries = router.query

  const [activityDetails, setActivityDetails] = React.useState({
    name: "",
    type: "",
    total_elevation_gain: 0,
    start_latlng: [],
    end_latlng: [],
    start_date: "",
    moving_time: 0,
    distance: 0,
    average_speed: 0,
    average_watts: 0,
    max_watts: 0,
    max_speed: 0,
    map: {
      summary_polyline: ""
    },
    achievement_count: 0,
    calories: 0,
    description: "",
    device_name: "",
    elapsed_time: 0,
    elev_high: 0,
    elev_low: 0,
    id: 0,
    kilojoules: 0,
    average_temp: 0,
    segment_efforts: [{
      id: 0,
      average_watts: 0,
      distance: 0,
      elapsed_time: 0,
      end_index: 0,
      moving_time: 0,
      name: "",
      segment: {
        average_grade: 0,
        city: "",
        climb_category: 0,
        country: "",
        distance: 0,
        id: 0,
        maximum_grade: 0,
        name: "",
      }
    }],
  })
  const [activityRoute, setActivityRoute] = React.useState<any[]>([])
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])
  const [renderMap, setRenderMap] = React.useState(false)

  useEffect(() => {
    getActivityDetails(activityId)
  }, [activityId])

  const getActivityDetails = async (id: number) => {
    const accessToken = urlQueries.clientAccessToken
    try {
      const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
      const data = await res.json()
      setActivityDetails(data)
      // convert polyline to GeoJson
      const pl = polyline.toGeoJSON(data.map.summary_polyline)
      setActivityRoute(pl)
      setRenderMap(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className="modal fade fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto backdrop-blur-sm bg-black/30"
        id={"exampleModalCenter" + activityDetails.id}
        tab-index="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-non shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">

            {/* header */}
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
              <h5 className="text-xl font-bold leading-normal text-gray-800" id="exampleModalScrollableLabel">
                {activityDetails.name}
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>

            {/* body */}
            <div className="modal-body relative p-4">

              {/* description */}
              {
                (activityDetails.description || "").length !== 0 ?
                  <div className="font-bold text-black-800 text-sm mb-2">
                    {activityDetails.description}
                  </div>
                  :
                  <></>
              }

              {/* date/weather/device */}
              <div className="font-bold text-gray-500 text-xs mb-2">
                {new Date(activityDetails.start_date).toLocaleString()} - {activityDetails.average_temp}&deg;C / {(activityDetails.average_temp * 9 / 5) + 32}&deg;F - {activityDetails.device_name}
              </div>

              {/* map */}
              {
                activityDetails.start_latlng.length !== 0 && renderMap === true ?
                  <div className="mb-6 w-full h-96">
                    <Map
                      mapboxAccessToken={mapboxgl.accessToken}
                      initialViewState={{
                        longitude: activityDetails.start_latlng[1],
                        latitude: activityDetails.start_latlng[0],
                        zoom: 11
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      onRender={(event) => event.target.resize()}
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
                  :
                  <></>
              }

              {/* list activity statistics */}
              <div className="grid grid-cols-3 gap-4 content-start">
                <div>
                  <p className="text-gray-700 text-base">distance</p>
                  <p className="font-bold">{((activityDetails.distance || 0) / 1609.344).toFixed(2)} mi</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">time</p>
                  <p className="font-bold">{((activityDetails.moving_time || 0) / 60).toFixed(0)} mins</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">avg mph</p>
                  <p className="font-bold">{((activityDetails.average_speed || 0) * 2.23694).toFixed(2)} mph</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">max mph</p>
                  <p className="font-bold">{((activityDetails.max_speed || 0) * 2.23694).toFixed(2)} mph</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">avg watts</p>
                  <p className="font-bold">{(activityDetails.average_watts || 0).toFixed(2)} w</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">max watts</p>
                  <p className="font-bold">{(activityDetails.max_watts || 0)} mph</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">elevation gain</p>
                  <p className="font-bold">{((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(0)} feet</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">calories</p>
                  <p className="font-bold">{((activityDetails.calories || 0)).toFixed(0)} cals</p>
                </div>
              </div>

            </div>

            {/* below body */}
            <div>

              {/* accordions */}
              <div className="accordion m-1" id="accordionExample5">

                {/* segments */}
                <div className="accordion-item bg-white border border-gray-200">

                  {/* title */}
                  <h2 className="accordion-header mb-0" id="headingOne5">
                    <button className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne5"
                      aria-expanded="true"
                      aria-controls="collapseOne5"
                    >
                      Segments
                    </button>
                  </h2>

                  {/* body */}
                  <div id="collapseOne5" className="accordion-collapse collapse show" aria-labelledby="headingOne5">
                    <div className="accordion-body py-2">
                      <Segments activityDetails={activityDetails} setSegmentRoute={setSegmentRoute} />
                    </div>
                  </div>

                </div>

                {/* power zones */}
                <div className="accordion-item bg-white border border-gray-200">

                  {/* title */}
                  <h2 className="accordion-header mb-0" id="headingOne6">
                    <button className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne6"
                      aria-expanded="true"
                      aria-controls="collapseOne6"
                    >
                      Power Zones
                    </button>
                  </h2>

                  {/* body */}
                  <div id="collapseOne6" className="accordion-collapse collapse show" aria-labelledby="headingOne6">
                    <div className="accordion-body py-2">

                      {/* bar graph */}
                      <div className="flex flex-col">
                        <div className="overflow-hidden rounded-lg shadow-lg">
                          <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-neutral-200">
                            Time in Power Zone
                          </div>
                          <PowerZones segmentEfforts={activityDetails.segment_efforts} />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div >
    </div >
  )
}

              // <div className="mb-6 w-full h-96"></div>