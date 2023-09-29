import React from "react"
import { useEffect, useState } from "react"

export default function Search() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [date, setDate] = useState("")
  const [activities, setActivities] = useState([])
  const [numActivities, setNumActivities] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)

  // set activity URL based on dev/prod environment
  let activityURL = "http://localhost:3000/activities"
  if (process.env.NODE_ENV === "production") {
    activityURL = "https://master.d18mtk2j3wua4u.amplifyapp.com/activities"
  }

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
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

            {stravaAccessToken ? (
              <>
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
                <div
                  className="overflow-y-auto rounded-lg bg-gray-200 border-4 border"
                  style={{ maxHeight: "80vh" }}
                >
                  <table className="w-full table-fixed bg-gray-200">
                    <thead className="sticky top-0 text-xs bg-gray-200">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm text-gray-900 px-6 py-2"
                        >
                          title
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-gray-900 px-6 py-2"
                        >
                          date
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-gray-900 px-6 py-2"
                        >
                          moving time
                        </th>
                        <th
                          scope="col"
                          className="text-sm text-gray-900 px-6 py-2"
                        >
                          distance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-b">
                      {activities.map((activity: any, idx) => (
                        <tr
                          className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                          key={activity.id}
                        >
                          <td className="text-sm text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left">
                            <a href={`${activityURL}/${activity.id}`}>
                              {activity.name}
                            </a>
                          </td>
                          <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                            {new Date(activity.start_date).toLocaleDateString()}
                          </td>
                          <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                            {(activity.moving_time / 60).toFixed(0)} mins
                          </td>
                          <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                            {(activity.distance / 1609.344).toFixed(2)} mi
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-b">
                      <tr className="bg-gray-100 border-b">
                        <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-left">
                          Total ({numActivities})
                        </td>
                        <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-left"></td>
                        <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-center">
                          {/* Calculate and display the total moving time in hours and minutes format */}
                          {(() => {
                            const totalMovingTimeSeconds = activities.reduce(
                              (total, activity: any) =>
                                total + activity.moving_time,
                              0
                            )
                            const hours = Math.floor(
                              totalMovingTimeSeconds / 3600
                            )
                            const minutes = Math.floor(
                              (totalMovingTimeSeconds % 3600) / 60
                            )
                            return `${hours} hr ${minutes} mins`
                          })()}
                        </td>
                        <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-center">
                          {/* Calculate and display the total distance */}
                          {(
                            activities.reduce(
                              (total, activity: any) =>
                                total + activity.distance,
                              0
                            ) / 1609.344
                          ).toFixed(2)}{" "}
                          mi
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            ) : (
              <>
                <p className="font-bold text-red-500">Please login first</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
