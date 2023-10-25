import React from "react"
// components
import SegmentLayer from "../segmentLayer"
// mapbox
import mapboxgl from "mapbox-gl"
import Map, { Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface ActivityDetail {
  name: string
  description: string
  distance: number
  moving_time: number
  average_speed: number
  max_speed: number
  average_watts: number
  max_watts: number
  total_elevation_gain: number
  calories: number
  start_date: number
  average_temp: number
  device_name: string
  segment_efforts: any[]
  start_latlng: any[]
}

export default function ActivityMap({
  activityId,
  activityDetails,
  activityRoute,
  segmentRoute
}: {
  activityId: string
  activityDetails: ActivityDetail
  activityRoute: any
  segmentRoute: any
}) {
  // set mapbox access token
  const mapboxAccessToken: string =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.toString() || ""
  mapboxgl.accessToken = mapboxAccessToken

  return (
    <>
      <Map
        mapboxAccessToken={mapboxgl.accessToken}
        key={activityId}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          longitude: activityDetails.start_latlng[1],
          latitude: activityDetails.start_latlng[0],
          zoom: 10
        }}
      >
        <NavigationControl />
        <Source
          id="polylineLayer"
          type="geojson"
          data={activityRoute}
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
              "line-color": "rgba(255, 0, 0, 0.8)",
              "line-width": 4
            }}
          />
        </Source>
        {segmentRoute.length !== 0 && (
          <Source
            id="polylineLayer2"
            type="geojson"
            data={segmentRoute as any}
          >
            <Layer
              id="lineLayer2"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "rgba(39, 174, 96, 1)",
                "line-width": 4
              }}
            />
          </Source>
        )}
        {activityDetails.segment_efforts &&
          activityDetails.segment_efforts.map(
            (seg: any, idx: number) =>
              seg.pr_rank === 1 && (
                <SegmentLayer
                  key={idx}
                  segment={seg}
                />
              )
          )}
      </Map>
    </>
  )
}
