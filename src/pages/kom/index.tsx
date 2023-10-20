import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import { getNearbySegments } from "@/utils/api"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"
import KomMap from "@/components/kom/map"
import Segments from "@/components/kom/segments"
import LoginFirst from "@/components/loginFirst"
// mapbox
import polyline from "@mapbox/polyline"

export default function Kom() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [radius, setRadius] = useState(645) // in meters. ~0.4 miles
  const [minCat, setMinCat] = useState("0")
  const [maxCat, setMaxCat] = useState("5")
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [startCoords, setStartCoords] = useState({
    longitude: -122.43640674612058,
    latitude: 37.77028481277563
  })
  const [coords, setCoords] = useState<any>(null)

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const { data: segments } = useSWR(
    stravaAccessToken && coords
      ? ["nearbySegments", coords, stravaAccessToken]
      : null,
    ([key, coords, token]) => getNearbySegments(coords, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  function handleRadiusInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setRadius(Number(e.target.value))
  }

  function handleMinCatInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setMinCat(e.target.value)
  }

  function handleMaxCatInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setMaxCat(e.target.value)
  }

  function handleSearch(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    calculateBounds()
  }

  // get the top left coordinate and bottom right coordinate of a
  // square surrounding a given center point
  function calculateBounds() {
    // get center point
    const centerLat = startCoords.latitude
    const centerLon = startCoords.longitude

    // calculate distance from center point to each side of the square, in meters
    const sideLength = radius
    const R = 6471000 // radius of the Earch in meters
    const dLat = (sideLength / R) * (180 / Math.PI) // latitude distance in degrees
    const dLon = dLat / Math.cos((centerLat * Math.PI) / 180) // longitude distance in degrees

    // calculate coords of top left and bottom right corners
    const topLeftLat = centerLat - dLat
    const topLeftLon = centerLon - dLat
    const bottomRightLat = centerLat + dLat
    const bottomRightLon = centerLon + dLon

    const boundsStr = `${topLeftLat},${topLeftLon},${bottomRightLat},${bottomRightLon}`
    setCoords(boundsStr)
  }

  const updateStartCoords = (newCoords: any) => {
    setStartCoords(newCoords)
  }

  function getPolyline(pl: string) {
    const geoJson: any = polyline.toGeoJSON(pl)
    setSegmentRoute(geoJson)
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          <PageHeader title="KOM Finder" />
          <PageContent>
            {stravaAccessToken ? (
              <>
                <div className="w-fit">
                  <div className="flex gap-4">
                    <div className="">
                      <label>Radius:</label>
                      <br />
                      <input
                        className="bg-gray-300 border rounded p-1 shadow"
                        required
                        onChange={handleRadiusInput}
                        defaultValue={radius}
                      />
                    </div>
                    <div className="">
                      <label>Min category:</label>
                      <br />
                      <input
                        className="bg-gray-300 border rounded p-1 shadow"
                        required
                        onChange={handleMinCatInput}
                        defaultValue={minCat}
                      />
                    </div>
                    <div className="">
                      <label>Max category:</label>
                      <br />
                      <input
                        className="bg-gray-300 border rounded p-1 shadow"
                        required
                        onChange={handleMaxCatInput}
                        defaultValue={maxCat}
                      />
                    </div>
                  </div>
                  <div className="w-full my-4">
                    <button
                      className="btn bg-green-500 text-white rounded p-2 w-full shadow font-bold"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                </div>
                <div className="w-full h-96">
                  <KomMap
                    segmentRoute={segmentRoute}
                    coords={startCoords}
                    updateStartCoords={updateStartCoords}
                  />
                </div>
                <div className="my-4">
                  <Segments
                    segments={segments?.segments || []}
                    getPolyline={getPolyline}
                  />
                </div>
              </>
            ) : (
              <LoginFirst />
            )}
          </PageContent>
        </div>
      </div>
    </div>
  )
}
