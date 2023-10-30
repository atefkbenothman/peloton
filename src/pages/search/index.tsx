import React from "react"
import { useEffect, useState } from "react"
// next
import { useRouter } from "next/router"
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
  const router = useRouter()

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

  function goToActivity(id: number) {
    const url = `${activityURL}/${id}}`
    router.push(url)
  }

  return (
    <div>
      <div>
        <div>
          <PageHeader
            title="Search"
            summary="View and search all of your activities"
          />
          <PageContent>
            {error ? (
              <ErrorCard error={error} />
            ) : (
              <>
                {stravaAccessToken ? (
                  isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingIndicator />
                    </div>
                  ) : (
                    <>
                      {/* Search */}
                      <div className="flex items-start space-x-4">
                        <p className="text-lg">
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
                        <div>
                          <div className="overflow-y-auto min-w-screen rounded max-h-[750px] shadow mb-8">
                            <table className="table w-full text-sm text-left text-gray-400 rounded">
                              <thead className="text-xs sticky top-0 uppercase bg-gray-700 text-white">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    title
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    type
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    moving time
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    distance
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    elevation gain
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    avg speed
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                  >
                                    tss
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {allActivities &&
                                  allActivities
                                    .slice()
                                    .reverse()
                                    .map((a: any, idx: number) => (
                                      <tr
                                        className="bg-white border-b dark:bg-gray-800 border-gray-300 cursor-pointer hover:bg-gray-200"
                                        key={idx}
                                        onClick={() => goToActivity(a.id)}
                                      >
                                        <td className="text-sm text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left">
                                          {a.name}
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {a.sport_type}
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {new Date(
                                            a.start_date
                                          ).toLocaleDateString()}
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {(a.moving_time / 60).toFixed(0)} mins
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {(a.distance / 1609.344).toFixed(1)}{" "}
                                          mi
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {(
                                            a.total_elevation_gain * 3.28084
                                          ).toFixed(0)}{" "}
                                          ft
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {(a.average_speed * 2.23694).toFixed(
                                            0
                                          )}{" "}
                                          mph
                                        </td>
                                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                                          {a.suffer_score}
                                        </td>
                                      </tr>
                                    ))}
                              </tbody>
                              <tfoot className="rounded">
                                <tr className="bg-black">
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left">
                                    Total ({allActivities?.length | 0})
                                  </td>
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left"></td>
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left"></td>
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left">
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
                                        return `${hours}:${minutes}`
                                      })()}
                                  </td>
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left">
                                    {/* Calculate and display the total distance */}
                                    {allActivities &&
                                      (
                                        allActivities.reduce(
                                          (total: any, activity: any) =>
                                            total + activity.distance,
                                          0
                                        ) / 1609.344
                                      ).toFixed(0)}{" "}
                                    mi
                                  </td>
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left">
                                    {/* Calculate total elevation */}
                                    {allActivities &&
                                      (
                                        allActivities.reduce(
                                          (total: any, activity: any) =>
                                            total +
                                            activity.total_elevation_gain,
                                          0
                                        ) * 3.28084
                                      ).toFixed(0)}{" "}
                                    ft
                                  </td>
                                  <td className="text-lg text-black font-bold px-4 py-1 border-r break-normal text-center"></td>
                                  <td className="text-lg text-white font-bold px-4 py-1 border-r break-normal text-left"></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
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
