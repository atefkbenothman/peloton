import React from "react"
import { useEffect, useState, memo, useMemo } from "react"
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
// csv
import { CSVLink } from "react-csv"

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
        <PageHeader
          title="Search"
          summary="View and search all of your activities"
        />
        <PageContent>
          <LoginFirst />
        </PageContent>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Search"
          summary="View and search all of your activities"
        />
        <PageContent>
          <ErrorCard error={error} />
        </PageContent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Search"
          summary="View and search all of your activities"
        />
        <PageContent>
          <LoadingIndicator />
        </PageContent>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Search"
        summary="View and search all of your activities"
      />
      <PageContent>
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
          {activities && (
            <button className="btn mb-6 bg-blue-500 text-white rounded p-2 shadow font-bold flex gap-3">
              <CSVLink
                data={activities}
                filename={"all-activities"}
              >
                Download All
              </CSVLink>
            </button>
          )}
        </div>
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
                  <th
                    scope="col"
                    className="px-6 py-3"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {allActivities &&
                  allActivities
                    .slice()
                    .reverse()
                    .map((a: any, idx: number) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 border-gray-300 hover:bg-gray-200"
                        key={idx}
                      >
                        <td
                          className="text-sm cursor-pointer text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left"
                          onClick={() => goToActivity(a.id)}
                        >
                          {a.name}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {a.sport_type}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {new Date(a.start_date).toLocaleDateString()}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {(a.moving_time / 60).toFixed(0)} mins
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {(a.distance / 1609.344).toFixed(1)} mi
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {(a.total_elevation_gain * 3.28084).toFixed(0)} ft
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {(a.average_speed * 2.23694).toFixed(0)} mph
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                          {a.suffer_score}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center">
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
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left">
                    Total ({allActivities?.length | 0})
                  </td>
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left"></td>
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left"></td>
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left">
                    {allActivities &&
                      (() => {
                        const totalMovingTimeSeconds = allActivities.reduce(
                          (total: any, activity: any) =>
                            total + activity.moving_time,
                          0
                        )
                        const hours = Math.floor(totalMovingTimeSeconds / 3600)
                        const minutes = Math.floor(
                          (totalMovingTimeSeconds % 3600) / 60
                        )
                        return `${hours}:${minutes}`
                      })()}
                  </td>
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left">
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
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left">
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
                  <td className="text-lg text-black font-bold px-4 py-1 break-normal text-center"></td>
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left"></td>
                  <td className="text-lg text-white font-bold px-4 py-1 break-normal text-left"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </PageContent>
    </div>
  )
}
