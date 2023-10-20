import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"
import ActivityCard from "@/components/activityCard"
import LoginFirst from "@/components/loginFirst"
import LoadingIndicator from "@/components/loadingIndicator"
import ErrorCard from "@/components/errorCard"
// api
import { getAthleteActivities } from "@/utils/api"

export default function Activities() {
  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>("")

  // retrive strava accessToken from sessionStorage
  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || null)
  }, [])

  const {
    data: activities,
    error,
    isLoading
  } = useSWR(
    stravaAccessToken ? ["activities", stravaAccessToken] : null,
    ([key, token]) => getAthleteActivities(token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen m-auto">
        <PageHeader title="Activities" />
        <PageContent>
          {error ? (
            <ErrorCard error={error} />
          ) : (
            <>
              {stravaAccessToken ? (
                <div>
                  {isLoading ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="w-full px-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                      {Array.isArray(activities) &&
                        activities.map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                          />
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <LoginFirst />
              )}
            </>
          )}
        </PageContent>
      </div>
    </div>
  )
}
