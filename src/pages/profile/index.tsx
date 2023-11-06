import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import { getAthlete, getAthleteStats, getAthleteZones } from "@/utils/api"
// next
import Image from "next/image"
// components
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
        <PageContent
          title="Profile"
          summary="View your profile information."
        >
          <div>
            <LoginFirst />
          </div>
        </PageContent>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageContent
          title="Profile"
          summary="View your profile information."
        >
          <ErrorCard error={error} />
        </PageContent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <PageContent
          title="Profile"
          summary="View your profile information."
        >
          <div className="w-fit mx-auto">
            <LoadingIndicator />
          </div>
        </PageContent>
      </div>
    )
  }

  const AthleteProfile = () => {
    return (
      <div>
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
      </div>
    )
  }

  return (
    <div>
      <PageContent
        title="Profile"
        summary="View your profile information."
      >
        <div>{athlete && <AthleteProfile />}</div>
      </PageContent>
    </div>
  )
}
