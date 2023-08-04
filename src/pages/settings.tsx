import React from "react"

export default function Home() {
  const [mapboxAccessToken, setMapboxAccessToken] = React.useState("")

  function handleMapboxAccessTokenInput(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault()
    setMapboxAccessToken(e.target.value)
    localStorage.setItem("mapboxAccessToken", e.target.value)
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Settings</h3>
          </div>
          {/* Info */}
          <div className="flex">
            <p className="font-bold">env: </p>
            <p className="ml-2">{process.env.NODE_ENV}</p>
          </div>
          {/* Form */}
          {/* <form className="flex flex-col mb-2">
            <div className="mt-2 mb-2">
              <label className="font-bold">mapbox access token: </label>
              <br />
              <input
                className="bg-gray-300 rounded p-1 border-0 mt-1"
                required
                onChange={handleMapboxAccessTokenInput}
                defaultValue={mapboxAccessToken}
                type="text"
              />
            </div>
          </form> */}
        </div>
      </div>
    </div>
  )
}
