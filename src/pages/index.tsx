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
import YearlyCalendar from "@/components/dashboard/yearlyCalendar"
import LoadingIndicator from "@/components/loadingIndicator"

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
    <div>
      <PageHeader
        title="Dashboard"
        summary="View your activity overview"
      />
      <PageContent>
        {error ? (
          <ErrorCard error={error} />
        ) : (
          <>
            {stravaAccessToken ? (
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingIndicator />
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="100 mb-8">
                      <YearlyCalendar
                        data={activities}
                        loading={isLoading}
                      />
                    </div>
                    <div className="flex gap-4">
                      <YearlyDistance
                        data={activities}
                        loading={isLoading}
                      />
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
                )}
              </div>
            ) : (
              <LoginFirst />
            )}
          </>
        )}
      </PageContent>
    </div>
  )
}
