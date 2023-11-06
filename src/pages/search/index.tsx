import React from "react"
import { useEffect, useState, memo, useMemo } from "react"
// next
import { useRouter } from "next/router"
// swr
import useSWR from "swr"
// api
import { getAllAthleteActivities } from "@/utils/api"
// components
import PageContent from "@/components/pageContent"
import LoginFirst from "@/components/loginFirst"
import LoadingIndicator from "@/components/loadingIndicator"
import ErrorCard from "@/components/errorCard"
// csv
import { CSVLink } from "react-csv"
import {
  metersConversion,
  secondsConversion,
  speedConversion
} from "@/utils/conversions"

export default function Search() {
  const router = useRouter()

  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [allActivities, setAllActivities] = useState<any>(null)
  const [date, setDate] = useState<Date | string>("")

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
  }

  function goToActivity(id: number) {
    router.push("/activities/" + id.toString())
  }

  if (!stravaAccessToken) {
    return (
      <div>
        <PageContent
          title="Search"
          summary="View and search all of your activities."
        >
          <div>
            <LoginFirst />
          </div>
        </PageContent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <PageContent
          title="Search"
          summary="View and search all of your activities."
        >
          <div className="w-fit mx-auto">
            <LoadingIndicator />
          </div>
        </PageContent>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageContent
          title="Search"
          summary="View and search all of your activities."
        >
          <div>
            <ErrorCard error={error} />
          </div>
        </PageContent>
      </div>
    )
  }

  return (
    <div>
      <PageContent
        title="Search"
        summary="View and search all of your activities."
      >
        <div>
          {/* Filter Options */}
          <div className="flex items-center gap-2 ">
            <p className="text-lg">How many miles since</p>
            <input
              type="date"
              id="date-picker"
              className="rounded"
              onChange={handleDateChange}
            />
            <p className="text-lg">?</p>
            <button
              className="text-white bg-blue-700 font-semibold rounded text-sm px-5 py-2.5 text-center ml-2"
              onClick={handleSearch}
            >
              Search
            </button>
            <button className="ml-auto text-white bg-blue-900 font-semibold rounded text-sm px-5 py-2.5 text-center">
              <CSVLink
                data={allActivities || []}
                filename={"all-activities"}
              >
                Download All
              </CSVLink>
            </button>
          </div>
          {/* Table */}
          <div className="my-6">
            <div className="rounded overflow-y-auto h-[calc(100vh-260px)] overscroll-y-none">
              <table className="table-auto w-full border-l-2 border-r-2 border-b-2">
                <thead className="text-xs text-white bg-black text-left sticky top-0">
                  <tr>
                    <th className="px-6 py-2">Title</th>
                    <th className="px-6 py-2">Type</th>
                    <th className="px-6 py-2">Date</th>
                    <th className="px-6 py-2">Moving Time</th>
                    <th className="px-6 py-2">Elapsed Time</th>
                    <th className="px-6 py-2">Distance</th>
                    <th className="px-6 py-2">Elevation Gain</th>
                    <th className="px-6 py-2">Avg Speed</th>
                    <th className="px-6 py-2">Max Speed</th>
                    <th className="px-6 py-2">Avg Watts</th>
                    <th className="px-6 py-2">Max Watts</th>
                    <th className="px-6 py-2">TSS</th>
                    <th className="px-6 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {allActivities &&
                    allActivities
                      .slice()
                      .reverse()
                      .map((a: any, idx: number) => (
                        <tr
                          className="bg-white border dark:bg-gray-800 border-gray-300 hover:bg-gray-200"
                          key={idx}
                        >
                          <td
                            className="text-sm cursor-pointer border text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left"
                            onClick={() => goToActivity(a.id)}
                          >
                            {a.name}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {a.sport_type}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {new Date(a.start_date).toLocaleDateString()}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {secondsConversion(a.moving_time)}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {secondsConversion(a.elapsed_time)}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {metersConversion(a.distance, "mile").toFixed(1)} mi
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {metersConversion(
                              a.total_elevation_gain,
                              "feet"
                            ).toFixed(0)}{" "}
                            ft
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {speedConversion(a.average_speed).toFixed(0)} mph
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {speedConversion(a.max_speed).toFixed(0)} mph
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {(a.average_watts || 0).toFixed(0)}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {(a.max_watts || 0).toFixed(0)}
                          </td>
                          <td className="text-sm text-gray-900 border font-normal px-4 py-1 break-normal text-left">
                            {a.suffer_score}
                          </td>
                          <td className="break-normal text-center">
                            <CSVLink
                              data={[a]}
                              filename={a.name}
                            >
                              <button>
                                <svg
                                  className="w-4 h-4 text-blue-600"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 19"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 15h.01M4 12H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-3M9.5 1v10.93m4-3.93-4 4-4-4"
                                  />
                                </svg>
                              </button>
                            </CSVLink>
                          </td>
                        </tr>
                      ))}
                </tbody>
                <tfoot className="rounded">
                  <tr className="bg-black">
                    <td className="text-nd text-white font-bold px-4 py-1 break-normal text-left">
                      Total ({allActivities?.length | 0})
                    </td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left"></td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left"></td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left">
                      {allActivities &&
                        (() => {
                          const totalMovingTimeSeconds = allActivities.reduce(
                            (total: any, activity: any) =>
                              total + activity.moving_time,
                            0
                          )
                          return secondsConversion(totalMovingTimeSeconds)
                        })()}
                    </td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left">
                      {allActivities &&
                        (() => {
                          const totalElapsedTimeSeconds = allActivities.reduce(
                            (total: any, activity: any) =>
                              total + activity.elapsed_time,
                            0
                          )
                          return secondsConversion(totalElapsedTimeSeconds)
                        })()}
                    </td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left">
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
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left">
                      {allActivities &&
                        (
                          allActivities.reduce(
                            (total: any, activity: any) =>
                              total + activity.total_elevation_gain,
                            0
                          ) * 3.28084
                        ).toFixed(0)}{" "}
                      ft
                    </td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left"></td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left"></td>
                    <td className="text-md text-black font-bold px-4 py-1 break-normal text-center"></td>
                    <td className="text-md text-black font-bold px-4 py-1 break-normal text-center"></td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left"></td>
                    <td className="text-md text-white font-bold px-4 py-1 break-normal text-left"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  )
}
