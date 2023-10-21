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
import YearlyActivities from "@/components/dashboard/yearlyActivities"
import YearlyDistance from "@/components/dashboard/yearlyDistance"
import MonthlyDistance from "@/components/dashboard/monthlyDistance"
import DailyDistance from "@/components/dashboard/dailyDistance"
import ErrorCard from "@/components/errorCard"

export default function Home() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")

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

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          <PageHeader title={"Dashboard"} />
          <PageContent>
            {error ? (
              <ErrorCard error={error} />
            ) : (
              <>
                {stravaAccessToken ? (
                  <div className="grid grid-cols-2">
                    <div>
                      <YearlyActivities
                        data={activities}
                        loading={isLoading}
                      />
                      <YearlyDistance
                        data={activities}
                        loading={isLoading}
                      />
                    </div>
                    <div>
                      <MonthlyDistance
                        data={activities}
                        loading={isLoading}
                      />
                      <DailyDistance
                        data={activities}
                        loading={isLoading}
                      />
                    </div>
                  </div>
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
