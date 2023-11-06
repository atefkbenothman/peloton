import React from "react"
import { useState } from "react"
// mapbox
import mapboxgl from "mapbox-gl"
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"

export default function KomMap({
  segmentRoute,
  coords,
  updateStartCoords
}: {
  segmentRoute: any
  coords: any
  updateStartCoords: any
}) {
  const mapboxAccessToken: string =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.toString() || ""
  mapboxgl.accessToken = mapboxAccessToken

  const [startCoords, setStartCoords] = useState({
    longitude: coords["longitude"],
    latitude: coords["latitude"]
  })

  function handleMarkerDrag(e: any) {
    const newCoords = { longitude: e.lngLat["lng"], latitude: e.lngLat["lat"] }
    updateStartCoords(newCoords)
    setStartCoords(newCoords)
  }

  return (
    <Map
      mapboxAccessToken={mapboxgl.accessToken}
      key={"1"}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      initialViewState={{
        longitude: startCoords.longitude,
        latitude: startCoords.latitude,
        zoom: 10
      }}
      terrain={{ source: "mapbox-dem", exaggeration: 2 }}
    >
      <NavigationControl />
      <Marker
        longitude={startCoords.longitude}
        latitude={startCoords.latitude}
        draggable={true}
        onDragEnd={handleMarkerDrag}
      ></Marker>
      {segmentRoute.length !== 0 && (
        <Source
          id="polylineLayer"
          type="geojson"
          data={segmentRoute as any}
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
              "line-width": 4
            }}
          />
        </Source>
      )}
    </Map>
  )
}
