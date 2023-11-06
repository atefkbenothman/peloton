import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import { getAllAthleteActivities } from "@/utils/api"
// components
import PageContent from "@/components/pageContent"
import LoginFirst from "@/components/loginFirst"
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

  if (!stravaAccessToken) {
    return (
      <div>
        <PageContent
          title="Dashboard"
          summary="View your activity overview."
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
          title="Dashboard"
          summary="View your activities overview."
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
          title="Dashboard"
          summary="View your activity overview"
        >
          <ErrorCard error={error} />
        </PageContent>
      </div>
    )
  }

  return (
    <div>
      <PageContent
        title="Dashboard"
        summary="View your activities overview."
      >
        <div>
          <YearlyCalendar
            data={activities}
            loading={isLoading}
          />
        </div>
      </PageContent>
    </div>
  )
}
