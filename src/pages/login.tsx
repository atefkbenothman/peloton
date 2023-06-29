import React from "react"
import { useEffect } from "react"
// next
import Link from "next/link"
import { useRouter } from "next/router"

export default function Login() {
  const router = useRouter()

  const [clientId, setClientId] = React.useState("")
  const [clientSecret, setClientSecret] = React.useState("")
  const [clientAccessToken, setClientAccessToken] = React.useState("")
  const [clientRefreshToken, setClientRefreshToken] = React.useState("")
  const [athleteId, setAthleteId] = React.useState("")
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  // retrieve clientId and clientSecret keys from localstorage if it exists
  useEffect(() => {
    setClientId(window.localStorage.getItem("clientId") || "")
    setClientSecret(window.localStorage.getItem("clientSecret") || "")
    // if an accessToken has already been generated, use it
    const access_token = window.localStorage.getItem("accessToken") || ""
    if (access_token !== "") {
      setClientAccessToken(access_token)
      setIsAuthorized(true)
    }
  }, [])

  // once clientId and clientSecret has been retrieved, check has auth code
  useEffect(() => {
    if (clientId && clientSecret) {
      checkHasAuthCode()
    }
  }, [clientId, clientSecret])

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

      const athlete = data["athlete"]
      const athlete_id = athlete["id"]
      setAthleteId(athlete_id)
      setIsAuthorized(true)
    } catch (err) {
      console.error(err)
    }
  }

  // login with strava oauth to retrieve a code
  function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const authBaseURL = "https://www.strava.com/oauth/authorize"
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: "http://localhost:3000/login",
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
    setClientAccessToken("")
    setIsAuthorized(false)
    localStorage.removeItem("accessToken")
  }

  // update clientId
  function handleClientIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setClientId(e.target.value)
    localStorage.setItem("clientId", e.target.value)
  }

  // update clientSecret
  function handleSecretInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setClientSecret(e.target.value)
    localStorage.setItem("clientSecret", e.target.value)
  }

  return (
    <>
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Title */}
          <h3 className="text-3xl font-bold">Login with Strava</h3>

          {/* Login Form */}
          <form className="flex flex-col mt-2 mb-2">
            <div className="mt-2 mb-2">
              <label className="font-bold">client id: </label>
              <br />
              <input
                className="bg-gray-300 border rounded p-1"
                required
                onChange={handleClientIdInput}
                defaultValue={clientId}
              />
            </div>
            <div className="mt-2 mb-2">
              <label className="font-bold">client secret: </label>
              <br />
              <input
                className="bg-gray-300 border rounded p-1"
                required
                onChange={handleSecretInput}
                defaultValue={clientSecret}
              />
            </div>
          </form>

          {/* Login Button */}
          <div className="flex items-center">
            <button
              className="btn bg-orange-500 rounded p-2 shadow font-bold mr-4"
              onClick={handleLogin}
            >
              Login
            </button>
            {isAuthorized && (
              <button
                className="btn bg-purple-300 rounded p-2 shadow font-bold mr-4"
                onClick={handleRefresh}
              >
                Refresh
              </button>
            )}
          </div>

          {/* Extra */}
          <div>
            <div className="mt-8 mb-2 inline-flex">
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
                <div className="flex">
                  <p className="font-bold">token:</p>
                  <p className="ml-2">{clientAccessToken}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
