import React from "react"
import { useEffect, useState } from "react"
// next
import Image from "next/image"
// api
import {
  fetchAthleteData,
  fetchAthleteStats,
  fetchLeaderboard
} from "@/utils/api"

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
  const [athleteData, setAthleteData] = useState<Athlete>({
    id: 0,
    firstname: "",
    lastname: "",
    username: "",
    profile: "",
    city: "",
    state: "",
    country: "",
    weight: "",
    ftp: ""
  })
  const [athleteStats, setAthleteStats] = useState<AthleteStats>({
    all_ride_totals: {
      count: 0,
      distance: 0,
      elapsed_time: 0,
      elevation_gain: 0
    },
    ytd_ride_totals: {
      count: 0,
      distance: 0,
      elapsed_time: 0,
      elevation_gain: 0
    }
  })

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  useEffect(() => {
    if (stravaAccessToken) {
      getAthleteData()
    }
  }, [stravaAccessToken])

  const getAthleteData = async () => {
    try {
      const athleteData = await fetchAthleteData(stravaAccessToken)
      setAthleteData(athleteData)
      // get athlete stats
      getAthleteStats(athleteData.id)
      // get segment leaderboard
      getSegmentLeaderboard()
    } catch (err) {
      console.error(err)
    }
  }

  const getAthleteStats = async (athleteId: number) => {
    try {
      const athleteStats = await fetchAthleteStats(stravaAccessToken, athleteId)
      setAthleteStats(athleteStats)
    } catch (err) {
      console.error(err)
    }
  }

  const getSegmentLeaderboard = async () => {
    try {
      const segmentLeaderboard = await fetchLeaderboard(
        stravaAccessToken,
        "123"
      )
      console.log(segmentLeaderboard)
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
            <p className="text-3xl font-bold text-black mb-4">Profile</p>

            {stravaAccessToken ? (
              <>
                {/* Data */}
                <div className="flex items-start space-x-4 mb-10">
                  <Image
                    src={athleteData.profile}
                    alt="profile picture"
                    className="w-24 h-24 rounded"
                    width={100}
                    height={100}
                  />
                  <div className="dark:text-white">
                    <div className="flex items-baseline">
                      <p className="text-xl font-bold">
                        {athleteData.firstname} {athleteData.lastname}
                      </p>
                    </div>
                    <div className="text-sm font-normal dark:text-gray-400">
                      {athleteData.city}, {athleteData.state},{" "}
                      {athleteData.country}
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
                        <p>Weight: {athleteData.weight || "null"} kg</p>
                        <p>FTP: {athleteData.ftp || "null"}</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}
