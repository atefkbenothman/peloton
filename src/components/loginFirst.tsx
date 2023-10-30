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
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto py-6 max-w-screen-sm text-center bg-white shadow rounded">
        <p className="mb-6 text-lg tracking-tight font-semibold text-gray-900">
          Please connect your Strava account first
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

// <Link
//   href="/login"
//   className="inline-flex text-white bg-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
// >
//   <p>Sign In</p>
// </Link>
