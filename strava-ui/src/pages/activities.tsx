import React from "react"
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
import { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { ActivityCalendar } from "activity-calendar-react"
import Map, { Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Activities() {
  const router = useRouter()

  const data = router.query

  const [ftp, setFtp] = React.useState(237)
  const [powerZones, setPowerZones] = React.useState({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0
  })
  const [activities, setActivities] = React.useState<any[]>([])
  const [activityDetail, setActivityDetails] = React.useState({
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
  })
  const [calendarData, setCalendarData] = React.useState<any[]>([])
  const [duration, setDuration] = React.useState(7)
  const [loading, setLoading] = React.useState(false)

  mapboxgl.accessToken = process.env.ACCESS_TOKEN || ""
  const [apiToken, setApiToken] = React.useState(process.env.ACCESS_TOKEN || "")
  const [viewPort, setViewPort] = React.useState({
    latitude: 45.4211,
    longitude: -75.4211,
    width: "100",
    height: "100",
    zoom: 10
  })

  const [route, setRoute] = React.useState<any[]>([])
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])

  useEffect(() => {
    async function fillActivityCalendar() {
      const activities = await getAllActivities()
      const allActivities = []
      for (let i = 0; i < activities.length; i++) {
        const startDate = activities[i].start_date.substring(0, 10)
        const data = {
          day: startDate,
          activity: activities[i].distance / 10000
        }
        allActivities.push(data)
      }
      setCalendarData(allActivities)
      setLoading(false)
    }

    fillActivityCalendar()

  }, [duration])

  const getAllActivities = async () => {
    const accessToken = data.clientAccessToken
    try {
      const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${duration}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
      const data = await res.json()
      setActivities(data)
      return data
    } catch (err) {
      console.log(err)
    }
  }

  function toLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    router.push("/login")
  }

  function updateDuration(dur: number) {
    setLoading(true)
    setDuration(dur)
  }

  const getActivityDetails = async (id: number) => {
    const accessToken = data.clientAccessToken
    try {
      const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
      const data = await res.json()
      setActivityDetails(data)
      const a = polyline.toGeoJSON(data.map.summary_polyline)
      console.log(a)
      setRoute(polyline.toGeoJSON(data.map.summary_polyline))
      console.log(data)

      // calculate power zones
      const zoneRanges = [
        {
          zone: "one",
          lower: 95,
          upper: 142
        },
        {
          zone: "two",
          lower: 143,
          upper: 194
        },
        {
          zone: "three",
          lower: 195,
          upper: 225
        },
        {
          zone: "four",
          lower: 226,
          upper: 260
        },
        {
          zone: "five",
          lower: 270,
          upper: 355
        },
        {
          zone: "six",
          lower: 356,
          upper: 999
        },
      ]
      let zones = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0
      }
      // console.log("a", seg.average_watts, seg.moving_time)
      for (let i = 0; i < data.segment_efforts.length; i++) {
        let avgWatts = data.segment_efforts[i].average_watts
        let time = data.segment_efforts[i].moving_time
        for (let j = 0; j < zoneRanges.length; j++) {
          let zone = zoneRanges[j].zone
          let lowerLimit = zoneRanges[j].lower
          let upperLimit = zoneRanges[j].upper
          if (avgWatts >= lowerLimit && avgWatts <= upperLimit) {
            zones[zone] += time / 60
          }
        }
      }
      setPowerZones(zones)
      console.log("zones", powerZones)

      return data
    } catch (err) {
      console.log(err)
    }
  }

  function expandActivity(id: number) {
    setActivityDetails({
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
    getActivityDetails(id)
  }

  const getSegmentDetails = async (id: number) => {
    const accessToken = data.clientAccessToken
    try {
      const res = await fetch(`https://www.strava.com/api/v3/segments/${id}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
      const data = await res.json()
      const segmentPolyline = polyline.toGeoJSON(data.map.polyline)
      setSegmentRoute(segmentPolyline)
      console.log(segmentPolyline)
    } catch (err) {
      console.log(err)
    }
  }

  function getSegment(id: number) {
    getSegmentDetails(id)
    console.log(segmentRoute)
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  }

  const labels = ["1: Recovery (95 - 142)", "2: Endurance (143 - 194)", "3: Sweet Spot (195 - 225)", "4: Lactate (226 - 260)", "5: VO2 (270 - 355)", "6: Neuromuscular (356+)"];
  const barData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: Object.values(powerZones),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }


  return (

    <>
      <div className="h-screen">
        <div className="m-auto">
          <div>
            <div>
              <div className="modal fade fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto backdrop-blur-sm bg-black/30"
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

              </div>

              <div className="mx-6 my-6">
                <div className="">
                  <h1 className="text-3xl font-bold mb-6">
                    Activities
                  </h1>
                  {
                    loading ?
                      <div role="status" className="flex ml-4 pt-10">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600 rounded full" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                      :
                      <div>
                      </div>
                  }
                </div>
                <div className="">
                  <button className="btn bg-gray-300 text-sm rounded-full p-2 font-bold mb-6 mr-2" onClick={() => updateDuration(7)}>
                    7 days
                  </button>
                  <button className="btn bg-gray-300 text-sm rounded-full p-2 font-bold mb-6 mr-2 ml-2" onClick={() => updateDuration(14)}>
                    14 days
                  </button>
                  <button className="btn bg-gray-300 text-sm rounded-full p-2 font-bold mb-6 mr-2 ml-2" onClick={() => updateDuration(21)}>
                    21 days
                  </button>
                  <button className="btn bg-gray-300 text-sm rounded-full p-2 font-bold mb-6 mr-2 ml-2" onClick={() => updateDuration(31)}>
                    month
                  </button>
                  <button className="btn bg-gray-300 text-sm rounded-full p-2 font-bold mb-6 mr-2 ml-2" onClick={() => updateDuration(90)}>
                    3 month
                  </button>
                  <button className="btn bg-gray-300 text-sm rounded-full p-2 font-bold mb-6 mr-2 ml-2" onClick={() => updateDuration(180)}>
                    1/2 year
                  </button>
                </div>
                {
                  calendarData.length !== 0 ?
                    <div className="">
                      <ActivityCalendar key={calendarData} sampleData={calendarData} showMonth={true} showDay={true} />
                    </div>
                    :
                    <div>
                    </div>
                }
              </div>
              <div className="my-6 mx-6 pb-2 min-w-screen">
                {
                  Array.isArray(activities) ?
                    activities.map(act => (
                      <div className="max-w-xl rounded overflow-hidden shadow-lg cursor-pointer bg-white my-4" onClick={() => expandActivity(act.id)} data-bs-toggle="modal" data-bs-target="#exampleModalCenterr">
                        <div className="px-6 py-4">
                          <div className="font-bold text-xl mb-1 pb-1">{act.name}</div>
                          <div className="font-bold text-gray-500 text-xs mb-3 pb-2">{new Date(act.start_date).toLocaleString()}</div>
                          <img src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s-a+9ed4bd(${act.start_latlng[1]},${act.start_latlng[0]}),pin-s-b+000(${act.end_latlng[1]},${act.end_latlng[0]}),path-5+f44-0.5(${encodeURIComponent(polyline.encode(polyline.decode(act["map"]["summary_polyline"])))})/auto/600x300?access_token=${mapboxgl.accessToken}&zoom=15`} alt="map" className="mb-4" />
                          <div className="grid grid-cols-3 gap-4 content-start">
                            <div>
                              <p className="text-gray-700 text-base">distance</p>
                              <p className="font-bold">{(act.distance / 1609.344).toFixed(2)} mi</p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-base">time</p>
                              <p className="font-bold">{(act.moving_time / 60).toFixed(0)} mins</p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-base">avg mph</p>
                              <p className="font-bold">{(act.average_speed * 2.23694).toFixed(2)} mph</p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-base">max mph</p>
                              <p className="font-bold">{(act.max_speed * 2.23694).toFixed(2)} mph</p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-base">avg watts</p>
                              <p className="font-bold">{(act.average_watts || 0).toFixed(2)} w</p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-base">max watts</p>
                              <p className="font-bold">{(act.max_watts || 0)} mph</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 pt-2 pb-2">
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{act.sport_type}</span>
                        </div>
                      </div>
                    ))
                    :
                    <div>
                    </div>
                }
              </div>

            </div>

          </div>

        </div >
      </div >
    </>
  )
}
