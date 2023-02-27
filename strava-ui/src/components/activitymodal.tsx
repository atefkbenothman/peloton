import React from "react"
import { useEffect, useRef } from "react"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
import Map, { Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
// components
import Segments from "../components/segments"
import PowerZones from "../components/powerzones"


export default function ActivityModal({ activityId, activityDetails, focused }) {
  // set mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  const [activityRoute, setActivityRoute] = React.useState<any[]>([])
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])
  const [loaded, setLoaded] = React.useState(false)

  useEffect(() => {
    getGeoJson()
    setLoaded(true)
  }, [])

  function getGeoJson() {
    const polylineData = polyline.toGeoJSON(activityDetails.map.summary_polyline)
    setActivityRoute(polylineData)
  }

  return (
    <div>
      <div
        data-te-modal-init
        className="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id={"exampleModalCenter" + activityId}
        tab-index="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div
          data-te-modal-dialog-ref
          className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] min-[992px]:max-w-[800px] min-[1200px]:max-w-[1140px]">
          <div
            className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none -neutral-600">

            {/* headers */}
            <div
              className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <h5
                className="text-xl font-medium leading-normal text-neutral-800-neutral-200"
                id="exampleModalLabel">
                {activityDetails.name}
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-te-modal-dismiss
                aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* body */}
            <div className="relative flex-auto p-4" data-te-modal-body-ref>

              {/* date/weather/device */}
              <div className="font-bold text-gray-500 text-xs mb-2">
                {new Date(activityDetails.start_date).toLocaleString()} - {activityDetails.average_temp}&deg;C / {(activityDetails.average_temp * 9 / 5) + 32}&deg;F - {activityDetails.device_name}
              </div>

              {/* map */}
              {
                (activityDetails.start_latlng || []).length !== 0 ?
                  <div className="mb-6 w-full h-96">
                    <Map
                      key={focused}
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

            {/* accordions */}
            <div id="accordionExample">

              {/* Segments */}
              <div className="rounded-t-lg border border-neutral-200 bg-white">

                {/* title */}
                <h2 className="mb-0" id="headingOne">
                  <button
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white py-4 px-5 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none ]"
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    data-te-target="#collapseOne"
                    aria-expanded="false"
                    aria-controls="collapseOne">
                    Segments
                    <span
                      className="ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                </h2>

                {/* body */}
                <div
                  id="collapseOne"
                  className="!visible hidden"
                  data-te-collapse-item
                  aria-labelledby="headingOne"
                >
                  <div className="py-4 px-5">
                    <Segments activityDetails={activityDetails} setSegmentRoute={setSegmentRoute} />
                  </div>
                </div>
              </div>

              {/* power zones */}
              <div className="border border-t-0 border-neutral-200 bg-white">

                {/* title */}
                <h2 className="mb-0" id="headingTwo">
                  <button
                    className="group relative flex w-full items-center rounded-none border-0 bg-white py-4 px-5 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none]"
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    data-te-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo">
                    Power Zones
                    <span
                      className="ml-auto -mr-1 h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                </h2>

                {/* body */}
                <div
                  id="collapseTwo"
                  className="!visible hidden"
                  data-te-collapse-item
                  aria-labelledby="headingTwo"
                >
                  <div className="py-4 px-5">
                    <PowerZones segmentEfforts={activityDetails.segment_efforts} />
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div >
  )
}
