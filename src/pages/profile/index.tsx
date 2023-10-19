import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// next
import Image from "next/image"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"
// api
import { getAthlete, getAthleteStats } from "@/utils/api"

interface Athlete {
  id: number
  firstname: string
  lastname: string
  username: string
  profile: string
  city: string
  state: string
  country: string
  weight: string
  ftp: string
}

interface AthleteStats {
  all_ride_totals: {
    count: number
    distance: number
    elapsed_time: number
    elevation_gain: number
  }
  ytd_ride_totals: {
    count: number
    distance: number
    elapsed_time: number
    elevation_gain: number
  }
}

export default function Profile() {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const { data: athlete } = useSWR(
    stravaAccessToken ? ["athlete", stravaAccessToken] : null,
    ([key, token]) => getAthlete(token),
    {
      revalidateOnFocus: false
    }
  )

  const { data: athleteStats } = useSWR(
    athlete ? ["athleteStats", athlete?.id, stravaAccessToken] : null,
    ([key, athleteId, token]) => getAthleteStats(athleteId, token),
    {
      revalidateOnFocus: false
    }
  )

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          {/* Profile Section */}
          <PageHeader title="Profile" />
          <PageContent>
            {athlete && athleteStats ? (
              <>
                {/* Data */}
                <div className="flex items-start space-x-4 mb-10">
                  <Image
                    src={athlete.profile}
                    alt="profile picture"
                    className="w-24 h-24 rounded"
                    width={100}
                    height={100}
                  />
                  <div className="dark:text-white">
                    <div className="flex items-baseline">
                      <p className="text-xl font-bold">
                        {athlete.firstname} {athlete.lastname}
                      </p>
                    </div>
                    <div className="text-sm font-normal dark:text-gray-400">
                      {athlete.city}, {athlete.state}, {athlete.country}
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-2">
                  <div>
                    {/* Title */}
                    <p className="text-3xl font-medium text-black mb-4">Info</p>
                    {/* Data */}
                    <div className="grid grid-cols-1">
                      <div className="m-2">
                        <p>Weight: {athlete.weight || "null"} kg</p>
                        <p>FTP: {athlete.ftp || "null"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  {athleteStats.all_ride_totals &&
                    athleteStats.ytd_ride_totals && (
                      <div>
                        {/* Title */}
                        <p className="text-3xl font-medium text-black mb-4">
                          Stats
                        </p>

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
                                      athleteStats.all_ride_totals.distance /
                                      1609.344
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
                                      athleteStats.all_ride_totals
                                        .elapsed_time /
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
                                      athleteStats.all_ride_totals
                                        .elevation_gain * 3.2808
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
                                    athleteStats.ytd_ride_totals.distance /
                                    1609.344
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
                                    athleteStats.ytd_ride_totals
                                      .elevation_gain * 3.2808
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
              </>
            ) : (
              <>
                <p className="font-bold text-red-500">Please login first</p>
              </>
            )}
          </PageContent>
        </div>
      </div>
    </div>
  )
}
