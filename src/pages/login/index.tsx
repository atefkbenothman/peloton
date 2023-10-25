import React from "react"
import { useEffect, useState } from "react"
// next
import Image from "next/image"
import { useRouter } from "next/router"
// api
import { generateStravaAuthURL, getAccessToken } from "@/utils/api"
// components
import PageHeader from "@/components/pageHeader"
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
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          {isAuthorized ? (
            <PageHeader title="Logout" />
          ) : (
            <PageHeader title="Login" />
          )}
          <PageContent>
            <section className="bg-white dark:bg-gray-900 shadow-md rounded-lg">
              <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                  {isAuthorized && clientAccessToken ? (
                    <button
                      className="inline-flex text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-md text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                      onClick={handleRefresh}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <div>
                      <button onClick={requestAccess}>
                        <Image
                          src={stravaConnect}
                          alt="map"
                          width={200}
                          height={100}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </PageContent>
        </div>
      </div>
    </div>
  )
}
