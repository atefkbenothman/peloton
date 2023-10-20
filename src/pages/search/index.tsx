import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import { getAllAthleteActivities } from "@/utils/api"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"
import LoginFirst from "@/components/loginFirst"
import LoadingIndicator from "@/components/loadingIndicator"
import ErrorCard from "@/components/errorCard"

export default function Search() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [allActivities, setAllActivities] = useState<any>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [totalDistance, setTotalDistance] = useState(0)

  // set activity URL based on dev/prod environment
  let activityURL = "http://localhost:3000/activities"
  if (process.env.NODE_ENV === "production") {
    activityURL = "https://master.d18mtk2j3wua4u.amplifyapp.com/activities"
  }

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const {
    data: activities,
    error,
    isLoading
  } = useSWR(
    stravaAccessToken ? ["allActivities", null, stravaAccessToken] : null,
    ([key, fromDate, token]) => getAllAthleteActivities(fromDate, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  useEffect(() => {
    if (activities) {
      setAllActivities(activities)
    }
  }, [activities])

  const handleSearch = (e: any) => {
    if (activities && date) {
      const acts = activities.filter((a: any) => new Date(a.start_date) > date)
      setAllActivities(acts)
    }
  }

  const handleDateChange = (e: any) => {
    setDate(new Date(e.target.value))
    const selectedDate = new Date(e.target.value)
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          <PageHeader title="Search" />
          <PageContent>
            {error ? (
              <ErrorCard error={error} />
            ) : (
              <>
                {stravaAccessToken ? (
                  isLoading ? (
                    <LoadingIndicator />
                  ) : (
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
                                type
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
                            {allActivities &&
                              allActivities.map(
                                (activity: any, idx: number) => (
                                  <tr
                                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                                    key={activity.id}
                                  >
                                    <td className="text-sm text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left">
                                      <a href={`${activityURL}/${activity.id}`}>
                                        {idx + 1}. {activity.name}
                                      </a>
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                                      {activity.sport_type}
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                                      {new Date(
                                        activity.start_date
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                                      {(activity.moving_time / 60).toFixed(0)}{" "}
                                      mins
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
                                      {(activity.distance / 1609.344).toFixed(
                                        2
                                      )}{" "}
                                      mi
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                          <tfoot className="border-b">
                            <tr className="bg-gray-100 border-b">
                              <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-left">
                                Total ({allActivities?.length | 0})
                              </td>
                              <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-left"></td>
                              <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-left"></td>
                              <td className="text-lg text-gray-900 font-bold px-4 py-1 border-r break-normal text-center">
                                {/* Calculate and display the total moving time in hours and minutes format */}
                                {allActivities &&
                                  (() => {
                                    const totalMovingTimeSeconds =
                                      allActivities.reduce(
                                        (total: any, activity: any) =>
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
                                {allActivities &&
                                  (
                                    allActivities.reduce(
                                      (total: any, activity: any) =>
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
                  )
                ) : (
                  <LoginFirst />
                )}
              </>
            )}
          </PageContent>
        </div>
      </div>
    </div>
  )
}
