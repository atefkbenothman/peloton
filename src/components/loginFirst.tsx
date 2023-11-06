import React from "react"
// next
import Image from "next/image"
import { useRouter } from "next/router"
import Link from "next/link"
// api
import { generateStravaAuthURL } from "@/utils/api"
// svg
import stravaConnect from "public/strava-connect.svg"

export default function LoginFirst() {
  const router = useRouter()

  // authorize with strava
  function requestAccess(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    router.push(generateStravaAuthURL())
  }

  return (
    <div className=" w-fit mx-auto p-6 ">
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-md font-semibold text-gray-900">
          Please connect your Strava account first.
        </p>
        <button onClick={requestAccess}>
          <Image
            className="w-fit"
            src={stravaConnect}
            alt="map"
            width={200}
            height={100}
          />
        </button>
      </div>
    </div>
  )
}
