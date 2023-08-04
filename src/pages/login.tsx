import React from "react"
import { useEffect } from "react"
// next
import Image from "next/image"
import { useRouter } from "next/router"
// svg
import stravaConnect from "public/strava-connect.svg"

export default function Login() {
  const router = useRouter()

  const [clientAccessToken, setClientAccessToken] = React.useState("")
  const [clientRefreshToken, setClientRefreshToken] = React.useState("")
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  // stay logged in between page loads
  useEffect(() => {
    const access_token = window.localStorage.getItem("accessToken") || ""
    if (access_token !== "" && access_token !== "undefined") {
      setClientAccessToken(access_token)
      setIsAuthorized(true)
    }
  }, [])

  // check if we have been redirected
  useEffect(() => {
    checkHasAuthCode()
  }, [])

  // check if a code has been generated from strava oauth. if it has, exchange the code for a token
  function checkHasAuthCode() {
    const urlParams = new URLSearchParams(window.location.href)
    if (urlParams.has("code")) {
      const clientCode = urlParams.get("code") || ""
      exchangeToken(clientCode)
    }
  }

  // exchange the code generated from strava oauth for an access token
  const exchangeToken = async (clientCode: string) => {
    const exchangeBaseURL = "https://www.strava.com/oauth/token"
    const clientId: string = process.env.NEXT_PUBLIC_CLIENT_ID?.toString() || ""
    const clientSecret: string =
      process.env.NEXT_PUBLIC_CLIENT_SECRET?.toString() || ""
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: clientCode,
        grant_type: "authorization_code"
      })
      const paramsString = params.toString()
      const exchangeURL = `${exchangeBaseURL}?${paramsString}`
      const res = await fetch(exchangeURL, {
        method: "POST"
      })
      const data = await res.json()
      const access_token = data["access_token"]
      const refresh_token = data["refreshToken"]
      setClientAccessToken(access_token)
      setClientRefreshToken(refresh_token)
      // set access token to localstorage
      localStorage.setItem("accessToken", access_token)
      setIsAuthorized(true)
    } catch (err) {
      console.error(err)
    }
  }

  // authorize with strava
  function requestAccess(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const clientId: string = process.env.NEXT_PUBLIC_CLIENT_ID?.toString() || ""
    const authBaseURL: string = "https://www.strava.com/oauth/authorize"
    // set the redirect uri based on development environment
    let redirect_uri_link: string = "http://localhost:3000/login"
    if (process.env.NODE_ENV === "production") {
      redirect_uri_link = "https://master.d18mtk2j3wua4u.amplifyapp.com/login"
    }
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirect_uri_link,
      approval_prompt: "force",
      scope: "read,activity:read_all"
    })
    const paramsString = params.toString()
    const authURL = `${authBaseURL}?${paramsString}`
    router.push(authURL)
  }

  // clear the accessToken from localstorage
  function handleRefresh(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsAuthorized(false)
    setClientAccessToken("")
    localStorage.removeItem("accessToken")
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Connect Button */}
          <div className="mb-4">
            <button onClick={requestAccess}>
              <Image
                src={stravaConnect}
                alt="map"
                className="rounded-lg"
                width={200}
                height={100}
              />
            </button>
          </div>
          {/* Debug */}
          <div className="inline-flex m-2">
            <p className="font-bold">authorized: </p>
            {isAuthorized ? (
              <>
                <p className="text-green-600 font-bold ml-2">
                  {isAuthorized.toString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-red-600 font-bold ml-2">
                  {isAuthorized.toString()}
                </p>
              </>
            )}
          </div>
          <div>
            {clientAccessToken && (
              <div>
                <div className="flex mx-2">
                  <p className="font-bold">token:</p>
                  <p className="ml-2">{clientAccessToken}</p>
                </div>
                {isAuthorized && (
                  <div className="mx-2 my-4">
                    <button
                      className="btn bg-blue-300 rounded p-2 shadow font-bold text-white"
                      onClick={handleRefresh}
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
