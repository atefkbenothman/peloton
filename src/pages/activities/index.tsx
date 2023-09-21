import React from "react"
import { useEffect, useState } from "react"
// components
import ActivityCard from "@/components/activityCard"
// api
import { fetchAthleteActivities } from "@/utils/api"

export default function Activities() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [activities, setActivities] = useState<any[]>([])

  // retrive strava accessToken from sessionStorage
  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  // once the access token has been retrieved, get all activities
  useEffect(() => {
    if (stravaAccessToken) {
      getAllActivities()
    }
  }, [stravaAccessToken])

  // retrive last 15 activities from strava api
  const getAllActivities = async () => {
    try {
      const athleteActivities = await fetchAthleteActivities(stravaAccessToken)
      setActivities(athleteActivities)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          {/* Title */}
          <div className="mb-2 px-6 sticky top-0 bg-gray-100 py-6">
            <h1 className="text-3xl font-bold">Activities</h1>
          </div>
          {/* Activity List */}
          <div className="w-full px-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {stravaAccessToken ? (
              Array.isArray(activities) &&
              activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                />
              ))
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
