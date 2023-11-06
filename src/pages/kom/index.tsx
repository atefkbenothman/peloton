import React from "react"
import { useEffect, useState } from "react"
// api
import { getNearbySegments } from "@/utils/api"
// components
import PageContent from "@/components/pageContent"
import KomMap from "@/components/kom/map"
import Segments from "@/components/kom/segments"
import LoginFirst from "@/components/loginFirst"
import ErrorCard from "@/components/errorCard"
// mapbox
import polyline from "@mapbox/polyline"

export default function Kom() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [radius, setRadius] = useState(645) // in meters. ~0.4 miles
  const [minCat, setMinCat] = useState(0)
  const [maxCat, setMaxCat] = useState(5)
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [startCoords, setStartCoords] = useState({
    longitude: -122.43640674612058,
    latitude: 37.77028481277563
  })
  const [coords, setCoords] = useState<any>(null)
  const [segments, setSegments] = useState<any>([])

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  async function fetchSegments(bounds: string) {
    const res = await getNearbySegments(
      bounds,
      minCat,
      maxCat,
      stravaAccessToken
    )
    setSegments(res)
  }

  function handleRadiusInput(e: any) {
    e.preventDefault()
    setRadius(Number(e.target.value))
  }

  function handleMinCatInput(e: any) {
    e.preventDefault()
    setMinCat(e.target.value)
  }

  function handleMaxCatInput(e: any) {
    e.preventDefault()
    setMaxCat(e.target.value)
  }

  function handleSearch(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const bounds = calculateBounds()
    fetchSegments(bounds)
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

  const updateStartCoords = (newCoords: any) => {
    setStartCoords(newCoords)
  }

  function getPolyline(pl: string) {
    const geoJson: any = polyline.toGeoJSON(pl)
    setSegmentRoute(geoJson)
  }

  if (!stravaAccessToken) {
    return (
      <div>
        <PageContent
          title="KOM Finder"
          summary="Search for kom segments around the world."
        >
          <div>
            <LoginFirst />
          </div>
        </PageContent>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div>
  //       <PageContent
  //         title="KOM Finder"
  //         summary="Search for kom segments around the world."
  //       >
  //         <div>
  //           <ErrorCard error={error} />
  //         </div>
  //       </PageContent>
  //     </div>
  //   )
  // }

  return (
    <div>
      <PageContent
        title="KOM Finder"
        summary="Search for kom segments around the world."
      >
        <div className="mb-4">
          <form className="flex gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Radius
              </label>
              <input
                key="radius"
                type="number"
                className="bg-gray-50 border-1 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                value={radius}
                onChange={handleRadiusInput}
              />
            </div>
            <div>
              <div className="mb-1">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Min Category
                </label>
              </div>
              <select
                name="cars"
                id="cars"
                className="bg-gray-50 border-1 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                defaultValue={minCat}
                onChange={handleMinCatInput}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div>
              <div className="mb-1">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Max Category
                </label>
              </div>
              <select
                name="max-cat"
                id="max-cat"
                className="bg-gray-50 border-1 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                defaultValue={maxCat}
                onChange={handleMaxCatInput}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="text-white bg-blue-700 font-semibold rounded text-sm px-5 py-2 text-center"
                onClick={handleSearch}
              >
                Find
              </button>
            </div>
          </form>
        </div>
        <div className="w-full h-96 border-black border-2">
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
      </PageContent>
    </div>
  )
}
