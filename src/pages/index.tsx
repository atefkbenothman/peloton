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
        <PageHeader
          title="Dashboard"
          summary="View your activity overview"
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
          title="Dashboard"
          summary="View your activity overview"
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
          title="Dashboard"
          summary="View your activity overview"
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
        title="Dashboard"
        summary="View your activity overview"
      />
      <PageContent>
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
      </PageContent>
    </div>
  )
}
