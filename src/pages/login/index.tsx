import React from "react"
import { useEffect, useState } from "react"
// next
import Image from "next/image"
import { useRouter } from "next/router"
// api
import { generateStravaAuthURL, getAccessToken } from "@/utils/api"
// components
import PageContent from "@/components/pageContent"
// svg
import stravaConnect from "public/strava-connect.svg"

export default function Login() {
  const router = useRouter()

  const [clientAccessToken, setClientAccessToken] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)

  // stay logged in between page loads
  useEffect(() => {
    const access_token = window.sessionStorage.getItem("accessToken") || ""
    if (access_token !== "" && access_token !== "undefined") {
      setClientAccessToken(access_token)
      setIsAuthorized(true)
    }
  }, [])

  useEffect(() => {
    // check if a code has been generated from strava oauth. if it has, exchange the code for a token
    async function checkHasAuthCode() {
      const urlParams = new URLSearchParams(window.location.href)
      if (urlParams.has("code")) {
        const clientCode = urlParams.get("code") || ""
        const accessToken = await getAccessToken(clientCode)
        setClientAccessToken(accessToken)
        setIsAuthorized(true)
        // set access token to sessionStorage
        sessionStorage.setItem("accessToken", accessToken)
      }
    }
    checkHasAuthCode()
  }, [])

  // authorize with strava
  function requestAccess(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    router.push(generateStravaAuthURL())
  }

  // clear the accessToken from sessionStorage
  function handleRefresh(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsAuthorized(false)
    setClientAccessToken("")
    sessionStorage.removeItem("accessToken")
  }

  return (
    <div>
      <PageContent
        title="Login"
        summary="Connect your Strava account to gain access to insights and more."
      >
        <div className="py-4 flex items-center justify-center">
          {isAuthorized && clientAccessToken ? (
            <button
              className="text-white bg-red-600 font-semibold rounded text-sm px-5 py-2.5 text-center"
              onClick={handleRefresh}
            >
              Sign Out
            </button>
          ) : (
            <button onClick={requestAccess}>
              <Image
                className="w-fit"
                src={stravaConnect}
                alt="map"
                width={200}
                height={100}
              />
            </button>
          )}
        </div>
      </PageContent>
    </div>
  )
}
