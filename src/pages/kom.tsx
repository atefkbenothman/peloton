import React from "react"
// mapbox
import mapboxgl from "mapbox-gl"
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl"
import polyline from "@mapbox/polyline"
import "mapbox-gl/dist/mapbox-gl.css"

const skyLayer: SkyLayer = {
  id: "sky",
  type: "sky",
  paint: {
    "sky-type": "atmosphere",
    "sky-atmosphere-sun": [0.0, 0.0],
    "sky-atmosphere-sun-intensity": 15
  }
}

export default function Kom() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYXRlZmthaWJlbm90aG1hbiIsImEiOiJjbGU1Mms1aGQwMzk2M3BwMzhyOWx2dDV2In0.Iqr4f_ZJMostXFJ3NJB1RA"

  const [token, setToken] = React.useState("")
  const [data, setData] = React.useState("")
  const [segments, setSegments] = React.useState<any[]>([])
  const [startCoords, setStartCoords] = React.useState({
    longitude: -122.43640674612058,
    latitude: 37.77028481277563
  })
  const [radius, setRadius] = React.useState(645) // in meters. ~0.4 miles
  const [minCat, setMinCat] = React.useState("0")
  const [maxCat, setMaxCat] = React.useState("5")
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])

  function handleTokenInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setToken(e.target.value)
  }

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

  function handleMarkerDrag(e) {
    setStartCoords({ longitude: e.lngLat["lng"], latitude: e.lngLat["lat"] })
  }

  function getPolyline(pl: string) {
    const geoJson = polyline.toGeoJSON(pl)
    setSegmentRoute(geoJson)
  }

  const searchSegment = async (coords: string) => {
    try {
      const params = new URLSearchParams({
        bounds: coords,
        activity_type: "riding"
      })
      const paramsString = params.toString()
      const URL = `https://www.strava.com/api/v3/segments/explore?${paramsString}`
      const res = await fetch(URL, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      const data = await res.json()
      setSegments(data.segments)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          <div className="mx-6 my-6">
            <h1 className="text-3xl font-bold mb-6">KOM Search</h1>
            <div className="mt-2 mb-6">
              <label>token: </label>
              <br />
              <input
                className="bg-gray-300 border rounded p-1"
                required
                onChange={handleTokenInput}
                defaultValue={""}
              />
            </div>
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
            <div className="mb-6 w-full h-96">
              <Map
                key={"test"}
                mapboxAccessToken={mapboxgl.accessToken}
                initialViewState={{
                  longitude: startCoords.longitude,
                  latitude: startCoords.latitude,
                  zoom: 13,
                  bearing: 80,
                  pitch: 80
                }}
                maxPitch={85}
                style={{
                  width: "100%",
                  height: "100%"
                }}
                terrain={{ source: "mapbox-dem", exaggeration: 2 }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onLoad={(event) => event.target.resize()}
                onResize={(event) => event.target.resize()}
              >
                <NavigationControl />
                <Marker
                  longitude={startCoords.longitude}
                  latitude={startCoords.latitude}
                  draggable={true}
                  onDragEnd={handleMarkerDrag}
                ></Marker>
                <Source
                  id="mapbox-dem"
                  type="raster-dem"
                  url="mapbox://mapbox.mapbox-terrain-dem-v1"
                  tileSize={512}
                  maxzoom={14}
                />
                <Layer {...skyLayer} />
                {segmentRoute.length !== 0 ? (
                  <Source
                    id="polylineLayer"
                    type="geojson"
                    data={segmentRoute}
                  >
                    <Layer
                      id="lineLayer"
                      type="line"
                      source="my-data"
                      layout={{
                        "line-join": "round",
                        "line-cap": "round"
                      }}
                      paint={{
                        "line-color": "rgba(15, 10, 222, 1)",
                        "line-width": 3
                      }}
                    />
                  </Source>
                ) : (
                  <></>
                )}
              </Map>
            </div>
            <button
              className="btn mb-6 bg-green-500 text-white rounded p-2 shadow font-bold"
              onClick={handleSearch}
            >
              Search
            </button>

            {/* table */}
            <table className="min-w-full border text-center table-fixed w-fit">
              {/* head */}
              <thead className="border-b bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                  >
                    name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                  >
                    distance
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                  >
                    elev difference
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                  >
                    climb category
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                  >
                    avg grade
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-2 border-r"
                  >
                    elevation profile
                  </th>
                </tr>
              </thead>

              <tbody className="border-b">
                {segments.map((seg) => (
                  <tr
                    key={seg.id}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    onClick={() => getPolyline(seg.points)}
                  >
                    <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                      {seg.name}
                    </td>
                    <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                      {(seg.distance / 1609.344).toFixed(1)} miles
                    </td>
                    <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                      {seg.elev_difference}
                    </td>
                    <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                      {seg.climb_category}
                    </td>
                    <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                      <p>{seg.avg_grade}%</p>
                    </td>
                    <td className="text-xs text-gray-900 font-medium px-4 py-1 border-r break-normal">
                      <img src={seg.elevation_profile}></img>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
