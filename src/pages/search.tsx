import React from "react"
import { useEffect } from "react"

export default function Search() {
  const [stravaAccessToken, setStravaAccessToken] = React.useState("")
  const [date, setDate] = React.useState("")
  const [activities, setActivities] = React.useState([])
  const [numActivities, setNumActivities] = React.useState(0)
  const [totalDistance, setTotalDistance] = React.useState(0)

  // set activity URL based on dev/prod environment
  let activityURL = "http://localhost:3000/activities"
  if (process.env.NODE_ENV === "production") {
    activityURL = "https://master.d18mtk2j3wua4u.amplifyapp.com/activities"
  }

  useEffect(() => {
    setStravaAccessToken(window.localStorage.getItem("accessToken") || "")
  }, [])

  const handleDateChange = (e: any) => {
    const date = e.target.value
    setDate(date)
  }

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault
    if (!date) {
      console.log("choose a date first!")
      return
    }
    const baseActivitiesURL = "https://www.strava.com/api/v3/athlete/activities"
    const dateToEpoch = (Date.parse(date) / 1000).toString()
    let page = 1
    let allActivities: any = []
    try {
      while (true) {
        const params = new URLSearchParams({
          after: dateToEpoch,
          page: page.toString(),
          per_page: "200"
        })
        const paramsString = params.toString()
        const activitiesURL = `${baseActivitiesURL}?${paramsString}`
        const res = await fetch(activitiesURL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + stravaAccessToken
          }
        })
        const data = await res.json()
        // check if there are still activities on this page
        if (data.length === 0) {
          // no more activities, break the loop
          break
        }
        // filter activities with type "ride"
        const rideActivities = data.filter(
          (activity: any) => activity.type === "Ride"
        )
        // append activities
        allActivities = [...allActivities, ...rideActivities]
        // move to next page for next request
        page++
      }
      console.log(allActivities)
      setActivities(allActivities)
      setNumActivities(allActivities.length)
      // calculate total distance
      const totalMiles = allActivities.reduce((total: any, activity: any) => {
        return total + activity.distance
      }, 0)
      setTotalDistance(totalMiles)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Profile Section */}
          <div className="mb-10">
            {/* Title */}
            <p className="text-3xl font-bold text-black mb-4">Search</p>
            {/* Search */}
            <div className="flex items-start space-x-4">
              <p>
                How many miles since{" "}
                <input
                  type="date"
                  id="date-picker"
                  onChange={handleDateChange}
                ></input>{" "}
                ?
              </p>
              <button
                className="btn mb-6 bg-green-500 text-white rounded p-2 shadow font-bold"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            {/* Data */}
            <div>
              <ol>
                {/* Activities */}
                {activities.map((activity: any, index) => (
                  <li
                    key={activity.id}
                    className="grid grid-cols-3"
                  >
                    <div className="min-w-[200px]">
                      {index + 1}.{" "}
                      <a
                        href={`${activityURL}/${activity.id}`}
                        className="text-blue-300"
                      >
                        {activity.name}
                      </a>
                    </div>
                    <div className="min-w-[200px]">
                      {new Date(activity.start_date).toLocaleDateString()}
                    </div>
                    <div className="min-w-[200px]">
                      {(activity.distance / 1609.344).toFixed(2)} mi
                    </div>
                  </li>
                ))}
                {/* Total */}
                <li className="grid grid-cols-3 font-bold text-lg">
                  <div className="min-w-[200px]">Total: ({numActivities})</div>
                  <div className="min-w-[200px]"></div>
                  <div className="min-w-[200px]">
                    {(totalDistance / 1609.344).toFixed(2)} mi
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
