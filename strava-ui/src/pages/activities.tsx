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
// redis
import cache from "src/cache"


export const getServerSideProps = async ({ query }) => {
  const token = query.clientAccessToken || ""
  const fetcher = async () => {
    const accessToken = token
    const duration = 7
    try {
      const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${duration}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
      const data = await res.json()
      return data
    } catch (err) {
      console.log(err)
      return []
    }
  }

  const key = `allActivities-${new Date().getMonth().toString()}-${new Date().getDate().toString()}`
  const cachedActivities = await cache.fetch(key, fetcher, 60 * 60)

  return { props: { activitiesProp: cachedActivities } }
}

export default function Activities({ activitiesProp }) {
  const router = useRouter()
  const data = router.query

  const [activities, setActivities] = React.useState<any[]>([])
  const [calendarData, setCalendarData] = React.useState<any[]>([])
  const [duration, setDuration] = React.useState(7)
  const [loading, setLoading] = React.useState(false)

  mapboxgl.accessToken = process.env.ACCESS_TOKEN || ""

  useEffect(() => {
    async function fillActivityCalendar() {
      const activities = activitiesProp
      setActivities(activities)

      const allActivities = []
      for (let i = 0; i < (activities || []).length; i++) {
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