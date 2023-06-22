import React from "react"
import { useEffect, useRef } from "react"
// mapbox
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
// components
import ActivityModal from "./activitymodal"


export default function Activity({ activity, activityDetails }) {
  // set mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  const [modalOpened, setModalOpened] = React.useState(false)

  const [focused, setFocused] = React.useState(0)

  function openModal(id: number) {
    setModalOpened(true)
    setFocused(id)
  }

  return (
    <div>

      {/* Activity Modal */}
      {
        activity.id &&
        <div>
          <ActivityModal activityId={activity.id} activityDetails={activityDetails} focused={focused} />
        </div>
      }

      {/* Activity Card */}
      <div className="my-6 mx-6 pb-2 min-w-screen">
        <div className="max-w-xl rounded overflow-hidden shadow-lg cursor-pointer bg-white my-4"
          data-te-target={"#exampleModalCenter" + activity.id}
          data-te-toggle="modal"
          onClick={() => openModal(activity.id)}
        >
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-1 pb-1">{activity.name}</div>
            <div className="font-bold text-gray-500 text-xs mb-3 pb-2">{new Date(activity.start_date).toLocaleString()}</div>
            <img src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s-a+9ed4bd(${activity.start_latlng[1]},${activity.start_latlng[0]}),pin-s-b+000(${activity.end_latlng[1]},${activity.end_latlng[0]}),path-5+f44-0.5(${encodeURIComponent(polyline.encode(polyline.decode(activity["map"]["summary_polyline"])))})/auto/600x300?access_token=${mapboxgl.accessToken}&zoom=15`} alt="map" className="mb-4" />
            <div className="grid grid-cols-3 gap-4 content-start">
              <div>
                <p className="text-gray-700 text-base">distance</p>
                <p className="font-bold">{(activity.distance / 1609.344).toFixed(2)} mi</p>
              </div>
              <div>
                <p className="text-gray-700 text-base">time</p>
                <p className="font-bold">{(activity.moving_time / 60).toFixed(0)} mins</p>
              </div>
              <div>
                <p className="text-gray-700 text-base">avg mph</p>
                <p className="font-bold">{(activity.average_speed * 2.23694).toFixed(2)} mph</p>
              </div>
              <div>
                <p className="text-gray-700 text-base">max mph</p>
                <p className="font-bold">{(activity.max_speed * 2.23694).toFixed(2)} mph</p>
              </div>
              <div>
                <p className="text-gray-700 text-base">avg watts</p>
                <p className="font-bold">{(activity.average_watts || 0).toFixed(2)} w</p>
              </div>
              <div>
                <p className="text-gray-700 text-base">max watts</p>
                <p className="font-bold">{(activity.max_watts || 0)} mph</p>
              </div>
            </div>
          </div>
          <div className="px-6 pt-2 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{activity.sport_type}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
