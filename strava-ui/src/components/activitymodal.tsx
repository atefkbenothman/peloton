import React from "react"
import { useEffect } from "react"
// next
import { useRouter } from "next/router"


interface activityDetails {
  name: "",
  type: "",
  total_elevation_gain: 0,
  start_latlng: [-70.9, 42.35],
  end_latlng: [-70.9, 42.35],
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
}


export default function ActivityModal({ activityId }) {
  // get url queries
  const router = useRouter()
  const urlQueries = router.query

  const [activityDetails, setActivityDetails] = React.useState<Partial<activityDetails>>({})

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
      //     setActivityDetails(data)
      //     const a = polyline.toGeoJSON(data.map.summary_polyline)
      //     console.log(a)
      //     setRoute(polyline.toGeoJSON(data.map.summary_polyline))
      //     console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className="
        modal
        fade
        fixed
        top-0
        left-0
        hidden
        w-full
        h-full
        overflow-x-hidden
        overflow-y-auto
        backdrop-blur-sm
        bg-black/30
        "
        id={"exampleModalCenter" + activityDetails.id}
        tab-index="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="
          modal-dialog
          modal-xl
          modal-dialog-centered
          relative
          w-auto
          pointer-events-none
          "
        >
          <div className="
            modal-content
            border-none
            shadow-lg
            relative
            flex
            flex-col
            w-full pointer-events-auto
            bg-white
            bg-clip-padding
            rounded-md
            outline-none
            text-current
            "
          >
            <div className="
              modal-header
              flex
              flex-shrink-0
              items-center
              justify-between
              p-4
              rounded-t-md
              "
            >
              <h5 className="text-xl font-bold leading-normal text-gray-800" id="exampleModalScrollableLabel">
                {activityDetails.name}
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

{/* <div className="modal fade fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto backdrop-blur-sm bg-black/30"
  id="exampleModalCenterr"
  tab-index="-1"
  aria-labelledby="exampleModalCenterTitle"
  aria-modal="true"
  role="dialog">
  <div className="modal-dialog modal-xl modal-dialog-centered relative w-auto pointer-events-none">
    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
      <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
        <h5 className="text-xl font-bold leading-normal text-gray-800" id="exampleModalScrollableLabel">
          {activityDetail.name}
        </h5>
        <button type="button"
          className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div className="modal-body relative p-4">
        {
          (activityDetail.description | "").length !== 0 ?
            <div>
              <div className="font-bold text-black-800 text-sm mb-2">
                {activityDetail.description}
              </div>
            </div>
            :
            <>
            </>
        }
        <div>
          <div className="font-bold text-gray-500 text-xs mb-2">
            {new Date(activityDetail.start_date).toLocaleString()} - {activityDetail.average_temp}&deg;C / {(activityDetail.average_temp * 9 / 5) + 32}&deg;F - {activityDetail.device_name}
          </div>
        </div>

        <div className="mb-6 w-full h-96">
          {
            activityDetail.start_latlng.length !== 0 ?
              <Map
                mapboxAccessToken={apiToken}
                initialViewState={{
                  longitude: activityDetail.start_latlng[1],
                  latitude: activityDetail.start_latlng[0],
                  zoom: 10
                }}
                style={{
                  width: "100%",
                  height: "100%"
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                <NavigationControl />
                <Source id="polylineLayer" type="geojson" data={route}>
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
                    <>
                    </>
                }
              </Map>
              :
              <>
              </>
          }
        </div>

        <div className="grid grid-cols-3 gap-4 content-start">
          <div>
            <p className="text-gray-700 text-base">distance</p>
            <p className="font-bold">{(activityDetail.distance / 1609.344).toFixed(2)} mi</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">time</p>
            <p className="font-bold">{(activityDetail.moving_time / 60).toFixed(0)} mins</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">avg mph</p>
            <p className="font-bold">{(activityDetail.average_speed * 2.23694).toFixed(2)} mph</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">max mph</p>
            <p className="font-bold">{(activityDetail.max_speed * 2.23694).toFixed(2)} mph</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">avg watts</p>
            <p className="font-bold">{(activityDetail.average_watts || 0).toFixed(2)} w</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">max watts</p>
            <p className="font-bold">{(activityDetail.max_watts || 0)} mph</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">elevation gain</p>
            <p className="font-bold">{((activityDetail.total_elevation_gain || 0) * 3.2808).toFixed(0)} feet</p>
          </div>
          <div>
            <p className="text-gray-700 text-base">calories</p>
            <p className="font-bold">{((activityDetail.calories || 0)).toFixed(0)} cals</p>
          </div>
        </div>
      </div>

      <div className="accordion m-1" id="accordionExample5">
        <div className="accordion-item bg-white border border-gray-200">
          <h2 className="accordion-header mb-0" id="headingOne5">
            <button className="
                            accordion-button
                            relative
                            flex
                            items-center
                            w-full
                            py-4
                            px-5
                            text-base text-gray-800 text-left
                            bg-white
                            border-0
                            rounded-none
                            transition
                            focus:outline-none
                          " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne5" aria-expanded="true"
              aria-controls="collapseOne5">
              Segments
            </button>
          </h2>
          <div id="collapseOne5" className="accordion-collapse collapse show" aria-labelledby="headingOne5">
            <div className="accordion-body py-2">

              <div>
                <div className="flex flex-col">
                  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="overflow-hidden">
                        <table className="min-w-full border text-center table-fixed w-fit">
                          <thead className="border-b bg-gray-50">
                            <tr>
                              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2 border-r">
                                name
                              </th>
                              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2 border-r">
                                time
                              </th>
                              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2 border-r">
                                distance
                              </th>
                              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2 border-r">
                                avg power
                              </th>
                              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2 border-r">
                                avg speed
                              </th>
                            </tr>
                          </thead>
                          <tbody className="border-b">
                            {
                              activityDetail.segment_efforts.map(seg => (
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" onClick={() => getSegment(seg.segment.id)}>
                                  <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                                    {seg.name}
                                  </td>
                                  <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                                    {(seg.moving_time / 60).toFixed(0)} mins
                                  </td>
                                  <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                                    {(seg.distance / 1609.344).toFixed(1)} miles
                                  </td>
                                  <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                                    {(seg.average_watts || 0).toFixed(0)} watts
                                  </td>
                                  <td className="text-xs text-gray-900 font-light px-4 py-1 border-r break-normal">
                                    {((seg.distance / 1609.344) / (seg.moving_time / 3600)).toFixed(0)} mph
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item bg-white border border-gray-200">
          <h2 className="accordion-header mb-0" id="headingOne5">
            <button className="
                            accordion-button
                            relative
                            flex
                            items-center
                            w-full
                            py-4
                            px-5
                            text-base text-gray-800 text-left
                            bg-white
                            border-0
                            rounded-none
                            transition
                            focus:outline-none
                          " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne6" aria-expanded="true"
              aria-controls="collapseOne5">
              Power Zones
            </button>
          </h2>
          <div id="collapseOne6" className="accordion-collapse collapse show" aria-labelledby="headingOne5">
            <div className="accordion-body py-2">

              <div className="flex flex-col">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-neutral-200">
                    Time in Power Zone
                  </div>
                  <Bar data={barData} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div> */}