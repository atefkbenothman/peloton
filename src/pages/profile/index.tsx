import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import { getAthlete, getAthleteStats, getAthleteZones } from "@/utils/api"
// next
import Image from "next/image"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"
import LoginFirst from "@/components/loginFirst"
import LoadingIndicator from "@/components/loadingIndicator"
import ErrorCard from "@/components/errorCard"

const zoneInfo: any = {
  0: ["recovery", "gray"],
  1: ["endurance", "blue"],
  2: ["tempo", "green"],
  3: ["threshold", "yellow"],
  4: ["vo2 max", "orange"],
  5: ["anaerobic", "red"],
  6: ["neuromuscular", "purple"]
}

export default function Profile() {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const {
    data: athlete,
    error,
    isLoading
  } = useSWR(
    stravaAccessToken ? ["athlete", stravaAccessToken] : null,
    ([key, token]) => getAthlete(token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  const { data: zones } = useSWR(
    stravaAccessToken ? ["zones", stravaAccessToken] : null,
    ([key, token]) => getAthleteZones(token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  const { data: athleteStats } = useSWR(
    athlete && stravaAccessToken
      ? ["athleteStats", athlete?.id, stravaAccessToken]
      : null,
    ([key, athleteId, token]) => getAthleteStats(athleteId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  if (!stravaAccessToken) {
    return (
      <div>
        <PageHeader
          title="Profile"
          summary="View your profile information"
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
          title="Profile"
          summary="View your profile information"
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
          title="Profile"
          summary="View your profile information"
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
        title="Profile"
        summary="View your profile information"
      />
      <PageContent>
        <div>
          {athlete && zones && athleteStats && (
            <>
              <div className="flex items-start space-x-4 mb-10">
                <Image
                  src={athlete.profile}
                  alt="profile picture"
                  className="w-24 h-24 rounded"
                  width={100}
                  height={100}
                />
                <div>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold">
                      {athlete.firstname} {athlete.lastname}
                    </p>
                  </div>
                  <div className="text-sm font-normal">
                    {athlete.city}, {athlete.state}, {athlete.country}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-3xl font-medium text-black mb-4">Stats</p>
                <div className="flex grid grid-cols-2">
                  <div>
                    <p className="font-medium mb-2">All-Time</p>
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
                        {athleteStats.all_ride_totals.count}
                      </dt>
                      <dd className="font-medium text-gray-600">
                        rides all time
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
                        {(
                          athleteStats.all_ride_totals.distance / 1609.344
                        ).toFixed(0)}
                      </dt>
                      <dd className="font-medium text-gray-600 dark:text-gray-400">
                        miles ridden
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
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
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
                        {(
                          athleteStats.all_ride_totals.elevation_gain * 3.2808
                        ).toFixed(0)}
                      </dt>
                      <dd className="font-medium text-gray-600 dark:text-gray-400">
                        feet climbed
                      </dd>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">This Year</p>
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
                        {athleteStats.ytd_ride_totals.count}
                      </dt>
                      <dd className="font-medium text-gray-600 dark:text-gray-400">
                        rides all time
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
                        {(
                          athleteStats.ytd_ride_totals.distance / 1609.344
                        ).toFixed(0)}
                      </dt>
                      <dd className="font-medium text-gray-600 dark:text-gray-400">
                        miles ridden
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
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
                    <div className="flex flex-col items-center justify-center bg-gray-300 border-4 border-gray-300 rounded-lg w-1/2 my-4">
                      <dt className="text-3xl font-extrabold">
                        {(
                          athleteStats.ytd_ride_totals.elevation_gain * 3.2808
                        ).toFixed(0)}
                      </dt>
                      <dd className="font-medium text-gray-600 dark:text-gray-400">
                        feet climbed
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </PageContent>
    </div>
  )
}
