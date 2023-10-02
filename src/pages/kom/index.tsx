import React from "react"
import { useEffect, useState } from "react"
// api
import { fetchSegments } from "@/utils/api"
// components
import KomMap from "@/components/kom/map"
import Segments from "@/components/kom/segments"
// mapbox
import polyline from "@mapbox/polyline"

export default function Kom() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [segments, setSegments] = useState<any[]>([])
  const [radius, setRadius] = useState(645) // in meters. ~0.4 miles
  const [minCat, setMinCat] = useState("0")
  const [maxCat, setMaxCat] = useState("5")
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [startCoords, setStartCoords] = useState({
    longitude: -122.43640674612058,
    latitude: 37.77028481277563
  })

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

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
    const boundsStr = calculateBounds()
    searchSegment(boundsStr)
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
    return boundsStr
  }

  function getPolyline(pl: string) {
    const geoJson: any = polyline.toGeoJSON(pl)
    setSegmentRoute(geoJson)
  }

  const updateStartCoords = (newCoords: any) => {
    setStartCoords(newCoords)
  }

  const searchSegment = async (coords: string) => {
    try {
      const allSegments = await fetchSegments(stravaAccessToken, coords)
      setSegments(allSegments.segments)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          <h1 className="text-3xl font-bold mb-6">KOM Search</h1>

          <div className="grid grid-cols-4 gap-6">
            <div className="mt-2 mb-6">
              <label>radius: </label>
              <br />
              <input
                className="bg-gray-300 border rounded p-1"
                required
                onChange={handleRadiusInput}
                defaultValue={radius}
              />
            </div>
            <div className="mt-2 mb-6">
              <label>min cat: </label>
              <br />
              <input
                className="bg-gray-300 border rounded p-1"
                required
                onChange={handleMinCatInput}
                defaultValue={minCat}
              />
            </div>
            <div className="mt-2 mb-6">
              <label>max cat: </label>
              <br />
              <input
                className="bg-gray-300 border rounded p-1"
                required
                onChange={handleMaxCatInput}
                defaultValue={maxCat}
              />
            </div>
            <div className="mt-7 mb-2">
              <button
                className="btn mb-6 bg-green-500 text-white rounded p-2 shadow font-bold"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div className="mb-6 w-full h-96">
            <KomMap
              segmentRoute={segmentRoute}
              coords={startCoords}
              updateStartCoords={updateStartCoords}
            />
          </div>

          <Segments
            segments={segments}
            getPolyline={getPolyline}
          />
        </div>
      </div>
    </div>
  )
}
