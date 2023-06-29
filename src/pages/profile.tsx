import React from "react"
import { useEffect } from "react"

export default function Profile() {
  const [stravaAccessToken, setStravaAccessToken] = React.useState("")
  const [athleteData, setAthleteData] = React.useState({
    id: 0,
    firstname: "",
    lastname: "",
    username: ""
  })
  const [athleteStats, setAthleteStats] = React.useState({
    all_ride_totals: {
      count: 0,
      distance: 0
    },
    ytd_ride_totals: {
      count: 0,
      distance: 0
    }
  })
  const [loaded, setLoaded] = React.useState(false)

  useEffect(() => {
    setStravaAccessToken(window.localStorage.getItem("accessToken") || "")
  }, [])

  useEffect(() => {
    getAthleteData()
  }, [stravaAccessToken])

  const getAthleteData = async () => {
    const athleteDataURL = "https://www.strava.com/api/v3/athlete"
    try {
      const res = await fetch(athleteDataURL, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + stravaAccessToken
        }
      })
      const data = await res.json()
      setAthleteData(data)
      // get athlete stats
      getAthleteStats(data.id)
    } catch (err) {
      console.error(err)
    }
  }

  const getAthleteStats = async (id: number) => {
    const athleteStatsURL = `https://www.strava.com/api/v3/athletes/${id}/stats`
    try {
      const res = await fetch(athleteStatsURL, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + stravaAccessToken
        }
      })
      const data = await res.json()
      setAthleteStats(data)
      setLoaded(true)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Profile Section */}
          <div className="mb-10">
            {/* Title */}
            <p className="text-3xl font-bold text-black mb-4">Profile</p>

            {/* Data */}
            <div className="flex items-start space-x-4">
              <img
                className="w-24 h-24 rounded"
                src={athleteData.profile}
                alt=""
              ></img>
              <div className="font-medium dark:text-white">
                <div className="flex items-baseline">
                  <p className="text-xl">
                    {athleteData.firstname} {athleteData.lastname}
                  </p>
                  <p className="text-xs font-normal ml-2"></p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {athleteData.city}, {athleteData.state}, {athleteData.country}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full grid sm:grid-cols-1 md:grid-cols-2">
            {/* Info Section */}
            <div>
              {/* Title */}
              <p className="text-3xl font-medium text-black mb-4">Info</p>
              {/* Data */}
              <div className="grid grid-cols-1">
                <div className="m-2">
                  <p>Weight: {athleteData.weight || "null"} kg</p>
                  <p>FTP: {athleteData.ftp || "null"}</p>
                  <p>Power Zones</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            {athleteStats.all_ride_totals && athleteStats.ytd_ride_totals && (
              <div>
                {/* Title */}
                <p className="text-3xl font-medium text-black mb-4">Stats</p>

                {/* Data */}
                <div className="m-4">
                  {/* All-Time */}
                  <div className="mb-8">
                    <p className="font-medium mb-2">All-Time</p>

                    <dl className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  max-w-screen-md gap-4 text-gray-900 dark:text-white text-center">
                      <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                        <div className="">
                          <dt className="text-3xl md:text-4xl font-extrabold">
                            {athleteStats.all_ride_totals.count}
                          </dt>
                          <dd className="font-medium text-gray-600 dark:text-gray-400">
                            rides all time
                          </dd>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                        <div className="p-2">
                          <dt className="text-3xl md:text-4xl font-extrabold">
                            {(
                              athleteStats.all_ride_totals.distance / 1609.344
                            ).toFixed(0)}
                          </dt>
                          <dd className="font-medium text-gray-600 dark:text-gray-400">
                            miles ridden
                          </dd>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                        <div className="p-2">
                          <dt className="text-3xl md:text-4xl font-extrabold">
                            {(
                              athleteStats.all_ride_totals.elapsed_time /
                              60 /
                              60
                            ).toFixed(0)}
                          </dt>
                          <dd className="font-medium text-gray-600 dark:text-gray-400">
                            hours ridden
                          </dd>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                        <div className="p-2">
                          <dt className="text-3xl md:text-4xl font-extrabold">
                            {(
                              athleteStats.all_ride_totals.elevation_gain *
                              3.2808
                            ).toFixed(0)}
                          </dt>
                          <dd className="font-medium text-gray-600 dark:text-gray-400">
                            feet climbed
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </div>

                  {/* This Year */}
                  <p className="font-medium mb-2">This Year</p>

                  <dl className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  max-w-screen-md gap-4 text-gray-900 dark:text-white text-center">
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                      <div className="p-2">
                        <dt className="text-3xl md:text-4xl font-extrabold">
                          {athleteStats.ytd_ride_totals.count}
                        </dt>
                        <dd className="font-medium text-gray-600 dark:text-gray-400">
                          rides all time
                        </dd>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                      <div className="p-2">
                        <dt className="text-3xl md:text-4xl font-extrabold">
                          {(
                            athleteStats.ytd_ride_totals.distance / 1609.344
                          ).toFixed(0)}
                        </dt>
                        <dd className="font-medium text-gray-600 dark:text-gray-400">
                          miles ridden
                        </dd>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                      <div className="p-2">
                        <dt className="text-3xl md:text-4xl font-extrabold">
                          {(
                            athleteStats.ytd_ride_totals.elapsed_time /
                            60 /
                            60
                          ).toFixed(0)}
                        </dt>
                        <dd className="font-medium text-gray-600 dark:text-gray-400">
                          hours ridden
                        </dd>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg">
                      <div className="p-2">
                        <dt className="text-3xl md:text-4xl font-extrabold">
                          {(
                            athleteStats.ytd_ride_totals.elevation_gain * 3.2808
                          ).toFixed(0)}
                        </dt>
                        <dd className="font-medium text-gray-600 dark:text-gray-400">
                          feet climbed
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
