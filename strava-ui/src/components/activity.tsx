import React from "react"
import { useEffect } from "react"
// next
import { useRouter } from "next/router"
// mapbox
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
// components
import ActivityModal from "./activityModal"


export default function Activity({ activity }) {
  // set mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  // get url queries
  const router = useRouter()
  const urlQueries = router.query

  const [openActivityModal, setOpenActivityModal] = React.useState(false)

  function openModal(mode: boolean) {
    setOpenActivityModal(mode)
  }

  return (
    <div>

      {/* Activity Modal */}
      {
        activity.id !== 0 ?
          <div>
            <ActivityModal activityId={activity.id} />
          </div>
          :
          <></>
      }

      {/* <div
        data-te-modal-init
        className="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id="exampleModal"
        tab-index="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div
          data-te-modal-dialog-ref
          className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
          <div
            className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
            <div
              className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <h5
                className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-te-modal-dismiss
                aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative flex-auto p-4" data-te-modal-body-ref>
              Modal body text goes here.
            </div>
            <div
              className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <button
                type="button"
                className="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                data-te-modal-dismiss
                data-te-ripple-init
                data-te-ripple-color="light">
                Close
              </button>
              <button
                type="button"
                className="ml-1 inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Activity Card */}
      <div className="my-6 mx-6 pb-2 min-w-screen">
        <div className="max-w-xl rounded overflow-hidden shadow-lg cursor-pointer bg-white my-4"
          // data-te-toggle="modal"
          // data-te-target={"#exampleModalCenter" + activity.id}
          // data-bs-target={"#exampleModalCenter" + activity.id}
          // data-bs-toggle="modal"
          data-te-target={"#exampleModalCenter" + activity.id}
          data-te-toggle="modal"
          // data-te-target="#exampleModal"
          onClick={() => setOpenActivityModal(true)}
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