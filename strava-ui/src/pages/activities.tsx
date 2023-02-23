import React from "react"
import { useEffect, useRef } from "react"
// next
import { useRouter } from "next/router"
// mapbox
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
// components
import Activity from "../components/activity"
import Calendar from "../components/calendar"


export default function Activities() {
  const router = useRouter()
  const data = router.query

  const [activities, setActivities] = React.useState<any[]>([])
  const [calendarData, setCalendarData] = React.useState<any[]>([])
  const [duration, setDuration] = React.useState(7)
  const [loading, setLoading] = React.useState(false)

  mapboxgl.accessToken = process.env.ACCESS_TOKEN || ""

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
    } catch (err) {
      console.log(err)
    }
  }

  function updateDuration(dur: number) {
    setLoading(true)
    setDuration(dur)
  }

  return (
    <div>
      <div className="h-screen">
        <div className="m-auto">
          <div>
            <div>
              <div className="mx-6 my-6">
                <div className="">
                  <h1 className="text-3xl font-bold mb-6">
                    Activities
                  </h1>
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
                    <Calendar data={calendarData} />
                    :
                    <></>
                }
              </div>
              {
                Array.isArray(activities) ?
                  activities.map(activity => (
                    <Activity key={activity.id} activity={activity} />
                  ))
                  :
                  <></>
              }
            </div>
          </div>
        </div >
      </div >
    </div>
  )
}

{/* {
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
                  } */}