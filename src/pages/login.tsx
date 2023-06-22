import React from "react"
import { useEffect } from "react"
// next
import Link from "next/link"
import { useRouter } from "next/router"
// icons
import { ArrowPathIcon } from "@heroicons/react/24/solid"


export default function Login() {
  const router = useRouter()

  const authBaseURL = "https://www.strava.com/oauth/authorize"
  const exchangeBaseURL = "https://www.strava.com/oauth/token"

  const [clientId, setClientId] = React.useState(process.env.CLIENT_ID || "")
  const [clientSecret, setClientSecret] = React.useState(process.env.CLIENT_SECRET || "")
  const [clientCode, setClientCode] = React.useState("")
  const [clientAccessToken, setClientAccessToken] = React.useState("")
  const [clientRefreshToken, setClientRefreshToken] = React.useState("")
  const [athleteId, setAthleteId] = React.useState("")
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  useEffect(() => {
    checkHasAuthCode()
  }, [])

  function checkHasAuthCode() {
    const urlParams = new URLSearchParams(window.location.href)
    if (urlParams.has("code")) {
      const clientCode = urlParams.get("code") || ""
      setClientCode(clientCode)
      exchangeToken(clientCode)
    }
  }

  const exchangeToken = async (clientCode: string) => {
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
      setClientAccessToken(data["access_token"])
      setClientRefreshToken(data["refresh_token"])
      setAthleteId(data["athlete"]["id"])
      if (clientAccessToken.length === 0) {
        setIsAuthorized(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  function handleIdInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setClientId(e.target.value)
  }

  function handleSecretInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setClientSecret(e.target.value)
  }

  function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    // build strava oauth url
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: "http://localhost:3000/login",
      approval_prompt: "force",
      scope: "read,activity:read_all"
    })
    const paramsString = params.toString()
    const authURL = `${authBaseURL}?${paramsString}`
    // redirect user to strava oauth page
    router.push(authURL)
  }

  function handleRefresh(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setClientAccessToken("")
    setClientRefreshToken("")
    setClientCode("")
    setIsAuthorized(false)
    router.push("/login")
  }

  return (
    <>
      <div className="h-screen mx-6 my-6">
        <div className="m-auto">
          <h3 className="text-3xl font-bold">
            Login with Strava
          </h3>
          <form className="flex flex-col mt-2 mb-2">
            <div className="mt-2 mb-2">
              <label>client id: </label>
              <input className="bg-gray-300 border rounded p-1" required onChange={handleIdInput} defaultValue={clientId} />
            </div>
            <div className="mt-2 mb-2">
              <label>client secret: </label>
              <input className="bg-gray-300 border rounded p-1" required onChange={handleSecretInput} defaultValue={clientSecret} />
            </div>
          </form>
          {
            isAuthorized ?
              <div className="flex items-center">
                <button className="btn bg-orange-500 rounded p-2 shadow font-bold mr-4" onClick={handleLogin}>
                  Login
                </button>
                <button onClick={handleRefresh}>
                  <ArrowPathIcon className="h-7 w-7" />
                </button>
              </div>
              :
              <div className="">
                <button className="btn bg-orange-500 shadow rounded p-2 font-bold mr-4" onClick={handleLogin}>
                  Login
                </button>
              </div>
          }
          <div>
            {
              isAuthorized ?
                <>
                  <div className="mt-8 mb-2 inline-flex">
                    <p>authorized: </p>
                    <p className="text-green-600 font-bold ml-2">True</p>
                  </div>
                  <div>
                    <p>token: {clientAccessToken}</p>
                  </div>
                  <div className="mt-2 inline-flex">
                    <button className="btn shadow bg-blue-300 rounded p-2 font-bold mr-2">
                      <Link href={{ pathname: "/activities", query: { clientAccessToken, clientRefreshToken, athleteId } }}>Activities</Link>
                    </button>
                  </div>
                  <div className="mt-2 inline-flex">
                    <button className="btn shadow bg-green-300 rounded p-2 font-bold mr-2">
                      <Link href={{ pathname: "/map", query: {} }}>Map</Link>
                    </button>
                  </div>
                </>
                :
                <div className="mt-8 inline-flex">
                  <p>authorized: </p>
                  <p className="text-red-600 font-bold ml-2">False</p>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}