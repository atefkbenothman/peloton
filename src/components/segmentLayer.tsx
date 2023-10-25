import React from "react"
import { useState, useEffect } from "react"
// swr
import useSWR from "swr"
// api
import { getSegment } from "@/utils/api"
// mapbox
import { Source, Layer } from "react-map-gl"
import polyline from "@mapbox/polyline"
import "mapbox-gl/dist/mapbox-gl.css"

export default function SegmentLayer({ segment }: { segment: any }) {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [segmentRoute, setSegmentRoute] = useState<any>(null)

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const { data: seg } = useSWR(
    segment && stravaAccessToken
      ? ["segment", segment.segment.id, stravaAccessToken]
      : null,
    ([key, segmentId, token]) => getSegment(segmentId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  useEffect(() => {
    if (seg) {
      const pl = polyline.toGeoJSON(seg.map.polyline)
      setSegmentRoute(pl)
    }
  }, [seg])

  return (
    <div>
      <Source
        id={segment.id.toString()}
        type="geojson"
        data={segmentRoute}
      >
        <Layer
          id={segment.id.toString()}
          type="line"
          source="my-data"
          layout={{
            "line-join": "round",
            "line-cap": "round"
          }}
          paint={{
            "line-color": "rgba(93, 63, 211, 1)",
            "line-width": 4
          }}
        />
      </Source>
    </div>
  )
}
