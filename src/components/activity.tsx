import React from "react"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"


export default function Activity({ activity }) {

  mapboxgl.accessToken = "pk.eyJ1IjoiYXRlZmthaWJlbm90aG1hbiIsImEiOiJjbGU1Mms1aGQwMzk2M3BwMzhyOWx2dDV2In0.Iqr4f_ZJMostXFJ3NJB1RA"

  function goToActivityPage() {
    window.location.href = `/activities/${activity.id}`
  }

  return (
    <div>

      {/* Activity Card */}
      <div className="my-6 mx-6 pb-2 min-w-screen">
        <div className="max-w-xl rounded overflow-hidden shadow-lg cursor-pointer bg-white my-4" onClick={goToActivityPage}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-2xl mb-1 pb-1">{activity.name}</div>
              {/* <div className="text-sm mb-1 pb-1 ml-2">#{activity.id}</div> */}
              <div className="">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{activity.sport_type}</span>
              </div>
            </div>
            <div className="font-bold text-gray-500 text-xs mb-3 pb-2">{new Date(activity.start_date).toLocaleString()}</div>
            <img src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s-a+9ed4bd(${activity.start_latlng[1]},${activity.start_latlng[0]}),pin-s-b+000(${activity.end_latlng[1]},${activity.end_latlng[0]}),path-5+f44-0.5(${encodeURIComponent(polyline.encode(polyline.decode(activity["map"]["summary_polyline"])))})/auto/600x300?access_token=${mapboxgl.accessToken}&zoom=15`} alt="map" className="mb-4" />
            <div className="grid grid-cols-3 gap-4 content-start">
              <div>
                <p className="text-gray-700 text-base">distance</p>
                <div className="flex items-baseline">
                  <p className="font-bold text-2xl">{(activity.distance / 1609.344).toFixed(2)}</p>
                  <p className="text-sm font-medium ml-2">mi</p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-base">time</p>
                <div className="flex items-baseline">
                  <p className="font-bold text-2xl">{(activity.moving_time / 60).toFixed(0)}</p>
                  <p className="text-sm font-medium ml-2">mins</p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-base">avg mph</p>
                  <div className="flex items-baseline">
                    <p className="font-bold text-2xl">{(activity.average_speed * 2.23694).toFixed(0)}</p>
                    <p className="text-sm font-medium ml-2">mph</p>
                  </div>
              </div>
              <div>
                <p className="text-gray-700 text-base">max mph</p>
                  <div className="flex items-baseline">
                    <p className="font-bold text-2xl">{(activity.max_speed * 2.23694).toFixed(0)}</p>
                    <p className="text-sm font-medium ml-2">mph</p>
                  </div>
              </div>
              <div>
                <p className="text-gray-700 text-base">avg watts</p>
                <div className="flex items-baseline">
                  <p className="font-bold text-2xl">{(activity.average_watts || 0).toFixed(0)}</p>
                  <p className="text-sm font-medium ml-2">w</p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-base">max watts</p>
                <div className="flex items-baseline">
                  <p className="font-bold text-2xl">{(activity.max_watts || 0)}</p>
                  <p className="text-sm font-medium ml-2">w</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
