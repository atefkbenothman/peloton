import React from "react"
import { useEffect } from "react"
// next
import { useRouter } from "next/router"
// mapbox
import mapboxgl from "mapbox-gl"
import polyline from "@mapbox/polyline"
import Map, { Source, Layer, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
// components
import Segments from "./segments"
import PowerZones from "./powerzones"


export default function ActivityModal({ activityId }) {
  // set mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN || ""

  // get url queries
  const router = useRouter()
  const urlQueries = router.query

  const [activityDetails, setActivityDetails] = React.useState({
    name: "",
    type: "",
    total_elevation_gain: 0,
    start_latlng: [],
    end_latlng: [],
    start_date: "",
    moving_time: 0,
    distance: 0,
    average_speed: 0,
    average_watts: 0,
    max_watts: 0,
    max_speed: 0,
    map: {
      summary_polyline: ""
    },
    achievement_count: 0,
    calories: 0,
    description: "",
    device_name: "",
    elapsed_time: 0,
    elev_high: 0,
    elev_low: 0,
    id: 0,
    kilojoules: 0,
    average_temp: 0,
    segment_efforts: [{
      id: 0,
      average_watts: 0,
      distance: 0,
      elapsed_time: 0,
      end_index: 0,
      moving_time: 0,
      name: "",
      segment: {
        average_grade: 0,
        city: "",
        climb_category: 0,
        country: "",
        distance: 0,
        id: 0,
        maximum_grade: 0,
        name: "",
      }
    }],
  })
  const [activityRoute, setActivityRoute] = React.useState<any[]>([])
  const [segmentRoute, setSegmentRoute] = React.useState<any[]>([])
  const [renderMap, setRenderMap] = React.useState(false)

  useEffect(() => {
    console.log("useeffect activitymodal")
    getActivityDetails(activityId)
  }, [activityId])

  const getActivityDetails = async (id: number) => {
    const accessToken = urlQueries.clientAccessToken
    try {
      const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
      const data = await res.json()
      setActivityDetails(data)
      // convert polyline to GeoJson
      const pl = polyline.toGeoJSON(data.map.summary_polyline)
      setActivityRoute(pl)
      setRenderMap(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div
        data-te-modal-init
        className="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id={"exampleModalCenter" + activityId}
        tab-index="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div
          data-te-modal-dialog-ref
          className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
          <div
            className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">

            {/* headers */}
            <div
              className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <h5
                className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                id="exampleModalLabel">
                {activityDetails.name}
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
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* body */}
            <div className="relative flex-auto p-4" data-te-modal-body-ref>

              {/* list activity statistics */}
              <div className="grid grid-cols-3 gap-4 content-start">
                <div>
                  <p className="text-gray-700 text-base">distance</p>
                  <p className="font-bold">{((activityDetails.distance || 0) / 1609.344).toFixed(2)} mi</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">time</p>
                  <p className="font-bold">{((activityDetails.moving_time || 0) / 60).toFixed(0)} mins</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">avg mph</p>
                  <p className="font-bold">{((activityDetails.average_speed || 0) * 2.23694).toFixed(2)} mph</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">max mph</p>
                  <p className="font-bold">{((activityDetails.max_speed || 0) * 2.23694).toFixed(2)} mph</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">avg watts</p>
                  <p className="font-bold">{(activityDetails.average_watts || 0).toFixed(2)} w</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">max watts</p>
                  <p className="font-bold">{(activityDetails.max_watts || 0)} mph</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">elevation gain</p>
                  <p className="font-bold">{((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(0)} feet</p>
                </div>
                <div>
                  <p className="text-gray-700 text-base">calories</p>
                  <p className="font-bold">{((activityDetails.calories || 0)).toFixed(0)} cals</p>
                </div>
              </div>

            </div>

            {/* below body */}

            {/* accordions */}
            <div id="accordionExample">

              {/* Segments */}
              <div
                className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">

                {/* title */}
                <h2 className="mb-0" id="headingOne">
                  <button
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white py-4 px-5 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                    type="button"
                    data-te-collapse-init
                    data-te-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne">
                    Segments
                    <span
                      className="ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
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
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                </h2>

                {/* body */}
                <div
                  id="collapseOne"
                  className="!visible"
                  data-te-collapse-item
                  data-te-collapse-show
                  aria-labelledby="headingOne"
                  data-te-parent="#accordionExample">
                  <div className="py-4 px-5">
                    <Segments activityDetails={activityDetails} setSegmentRoute={setSegmentRoute} />
                  </div>
                </div>
              </div>

              {/* power zones */}
              <div
                className="border border-t-0 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">

                {/* title */}
                <h2 className="mb-0" id="headingTwo">
                  <button
                    className="group relative flex w-full items-center rounded-none border-0 bg-white py-4 px-5 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    data-te-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo">
                    Power Zones
                    <span
                      className="ml-auto -mr-1 h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
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
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                </h2>

                {/* body */}
                <div
                  id="collapseTwo"
                  className="!visible hidden"
                  data-te-collapse-item
                  aria-labelledby="headingTwo"
                  data-te-parent="#accordionExample">
                  <div className="py-4 px-5">
                    <PowerZones segmentEfforts={activityDetails.segment_efforts} />
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>

      {/* <div
        data-te-modal-init
        className="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
        id={"examplemodalcenter" + activitydetails.id}
        tabIndex={-1}
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog">
        <div
          data-te-modal-dialog-ref
          className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]">
          <div
            className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
            <div
              className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
              <h5
                className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                id="exampleModalScrollableLabel">
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
            <div className="relative p-4">
              <p>This is a vertically centered modal.</p>
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
    </div >
  )
}

// <div>
//   <div className="
//         modal
//         fade
//         fixed
//         top-0
//         left-0
//         hidden
//         w-full
//         h-full
//         overflow-x-hidden
//         overflow-y-auto
//         backdrop-blur-sm
//         bg-black/30
//         "
//     id={"exampleModalCenter" + activityDetails.id}
//     tab-index="-1"
//     aria-labelledby="exampleModalCenterTitle"
//     aria-modal="true"
//     role="dialog"
//     data-te-modal-init
//   >
//     <div className="
//           modal-dialog
//           modal-xl
//           modal-dialog-centered
//           relative
//           w-auto
//           pointer-events-none
//           "
//       data-te-modal-dialog-ref
//     >
//       <div className="
//             modal-content
//             border-none
//             shadow-lg
//             relative
//             flex
//             flex-col
//             w-full pointer-events-auto
//             bg-white
//             bg-clip-padding
//             rounded-md
//             outline-none
//             text-current
//             "
//       >
//         <div className="
//               modal-header
//               flex
//               flex-shrink-0
//               items-center
//               justify-between
//               p-4
//               rounded-t-md
//               "
//         >
//           <h5 className="text-xl font-bold leading-normal text-gray-800" id="exampleModalScrollableLabel">
//             {activityDetails.name}
//           </h5>
//           <button type="button"
//             className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
//             data-bs-dismiss="modal" aria-label="Close" data-te-modal-dismiss>
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div >

      // <div data-te-modal-init className="modal fade fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto backdrop-blur-sm bg-black/30"
      //   id={"exampleModalCenter" + activityDetails.id}
      //   tab-index="-1"
      //   aria-labelledby="exampleModalCenterTitle"
      //   aria-modal="true"
      //   role="dialog"
      // >
      //   <div data-te-modal-dialog-ref className="modal-dialog modal-xl modal-dialog-centered relative w-auto pointer-events-none"
      //   >
      //     <div className="modal-content border-non shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">

      //       {/* header */}
      //       <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
      //         <h5 className="text-xl font-bold leading-normal text-gray-800" id="exampleModalScrollableLabel">
      //           {activityDetails.name}
      //         </h5>
      //         <button type="button"
      //           className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
      //           data-bs-dismiss="modal" aria-label="Close">
      //         </button>
      //       </div>

      //       {/* body */}
      //       <div className="modal-body relative p-4">

      //         {/* description */}
      //         {
      //           (activityDetails.description || "").length !== 0 ?
      //             <div className="font-bold text-black-800 text-sm mb-2">
      //               {activityDetails.description}
      //             </div>
      //             :
      //             <></>
      //         }

      //         {/* date/weather/device */}
      //         <div className="font-bold text-gray-500 text-xs mb-2">
      //           {new Date(activityDetails.start_date).toLocaleString()} - {activityDetails.average_temp}&deg;C / {(activityDetails.average_temp * 9 / 5) + 32}&deg;F - {activityDetails.device_name}
      //         </div>

      //         {/* map */}
      //         {
      //           activityDetails.start_latlng.length !== 0 && renderMap === true ?
      //             <div className="mb-6 w-full h-96">
      //               <Map
      //                 mapboxAccessToken={mapboxgl.accessToken}
      //                 initialViewState={{
      //                   longitude: activityDetails.start_latlng[1],
      //                   latitude: activityDetails.start_latlng[0],
      //                   zoom: 11
      //                 }}
      //                 style={{
      //                   width: "100%",
      //                   height: "100%",
      //                 }}
      //                 mapStyle="mapbox://styles/mapbox/streets-v12"
      //                 onRender={(event) => event.target.resize()}
      //               >
      //                 <NavigationControl />
      //                 <Source id="polylineLayer" type="geojson" data={activityRoute}>
      //                   <Layer
      //                     id="lineLayer"
      //                     type="line"
      //                     source="my-data"
      //                     layout={{
      //                       "line-join": "round",
      //                       "line-cap": "round"
      //                     }}
      //                     paint={{
      //                       "line-color": "rgba(255, 0, 0, 0.8)",
      //                       "line-width": 3
      //                     }}
      //                   />
      //                 </Source>
      //                 {
      //                   segmentRoute.length !== 0 ?
      //                     <Source id="polylineLayer2" type="geojson" data={segmentRoute}>
      //                       <Layer
      //                         id="lineLayer2"
      //                         type="line"
      //                         source="my-data"
      //                         layout={{
      //                           "line-join": "round",
      //                           "line-cap": "round"
      //                         }}
      //                         paint={{
      //                           "line-color": "rgba(15, 10, 222, 1)",
      //                           "line-width": 3
      //                         }}
      //                       />
      //                     </Source>
      //                     :
      //                     <></>
      //                 }
      //               </Map>
      //             </div>
      //             :
      //             <></>
      //         }

      //         {/* list activity statistics */}
      //         <div className="grid grid-cols-3 gap-4 content-start">
      //           <div>
      //             <p className="text-gray-700 text-base">distance</p>
      //             <p className="font-bold">{((activityDetails.distance || 0) / 1609.344).toFixed(2)} mi</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">time</p>
      //             <p className="font-bold">{((activityDetails.moving_time || 0) / 60).toFixed(0)} mins</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">avg mph</p>
      //             <p className="font-bold">{((activityDetails.average_speed || 0) * 2.23694).toFixed(2)} mph</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">max mph</p>
      //             <p className="font-bold">{((activityDetails.max_speed || 0) * 2.23694).toFixed(2)} mph</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">avg watts</p>
      //             <p className="font-bold">{(activityDetails.average_watts || 0).toFixed(2)} w</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">max watts</p>
      //             <p className="font-bold">{(activityDetails.max_watts || 0)} mph</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">elevation gain</p>
      //             <p className="font-bold">{((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(0)} feet</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">calories</p>
      //             <p className="font-bold">{((activityDetails.calories || 0)).toFixed(0)} cals</p>
      //           </div>
      //         </div>

      //       </div>

      //       {/* below body */}
      //       <div>

      //         {/* accordions */}
      //         <div className="accordion m-1" id="accordionExample5">

      //           {/* segments */}
      //           <div className="accordion-item bg-white border border-gray-200">

      //             {/* title */}
      //             <h2 className="accordion-header mb-0" id="headingOne5">
      //               <button className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
      //                 type="button"
      //                 data-bs-toggle="collapse"
      //                 data-bs-target="#collapseOne5"
      //                 aria-expanded="false"
      //                 aria-controls="collapseOne5"
      //               >
      //                 Segments
      //               </button>
      //             </h2>

      //             {/* body */}
      //             <div id="collapseOne5" className="accordion-collapse collapse" aria-labelledby="headingOne5">
      //               <div className="accordion-body py-2">
      //                 <Segments activityDetails={activityDetails} setSegmentRoute={setSegmentRoute} />
      //               </div>
      //             </div>

      //           </div>

      //           {/* power zones */}
      //           <div className="accordion-item bg-white border border-gray-200">

      //             {/* title */}
      //             <h2 className="accordion-header mb-0" id="headingOne6">
      //               <button className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
      //                 type="button"
      //                 data-bs-toggle="collapse"
      //                 data-bs-target="#collapseOne6"
      //                 aria-expanded="false"
      //                 aria-controls="collapseOne6"
      //               >
      //                 Power Zones
      //               </button>
      //             </h2>

      //             {/* body */}
      //             <div id="collapseOne6" className="accordion-collapse collapse" aria-labelledby="headingOne6">
      //               <div className="accordion-body py-2">

      //                 {/* bar graph */}
      //                 <div className="flex flex-col">
      //                   <div className="overflow-hidden rounded-lg shadow-lg">
      //                     <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-neutral-200">
      //                       Time in Power Zone
      //                     </div>
      //                     <PowerZones segmentEfforts={activityDetails.segment_efforts} />
      //                   </div>
      //                 </div>

      //               </div>
      //             </div>

      //           </div>

      //         </div>

      //       </div>

      //     </div>
      //   </div>
      // </div>


      // <div data-te-modal-init className="modal fade fixed top-0 left-0 hidden w-full h-full overflow-x-hidden overflow-y-auto backdrop-blur-sm bg-black/30"
      //   id={"exampleModalCenter" + activityDetails.id}
      //   tabIndex={-1}
      //   aria-labelledby="exampleModalCenterTitle"
      //   aria-modal="true"
      //   role="dialog"
      // >
      //   <div data-te-modal-dialog-ref className="modal-dialog modal-xl modal-dialog-centered relative w-auto pointer-events-none"
      //   >
      //     <div className="modal-content border-non shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">

      //       {/* header */}
      //       <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
      //         <h5 className="text-xl font-bold leading-normal text-gray-800" id="exampleModalScrollableLabel">
      //           {activityDetails.name}
      //         </h5>
      //         <button type="button"
      //           className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
      //           data-bs-dismiss="modal" aria-label="Close">
      //         </button>
      //       </div>

      //       {/* body */}
      //       <div className="modal-body relative p-4">

      //         {/* description */}
      //         {
      //           (activityDetails.description || "").length !== 0 ?
      //             <div className="font-bold text-black-800 text-sm mb-2">
      //               {activityDetails.description}
      //             </div>
      //             :
      //             <></>
      //         }

      //         {/* date/weather/device */}
      //         <div className="font-bold text-gray-500 text-xs mb-2">
      //           {new Date(activityDetails.start_date).toLocaleString()} - {activityDetails.average_temp}&deg;C / {(activityDetails.average_temp * 9 / 5) + 32}&deg;F - {activityDetails.device_name}
      //         </div>

      //         {/* map */}
      //         {
      //           activityDetails.start_latlng.length !== 0 && renderMap === true ?
      //             <div className="mb-6 w-full h-96">
      //               <Map
      //                 mapboxAccessToken={mapboxgl.accessToken}
      //                 initialViewState={{
      //                   longitude: activityDetails.start_latlng[1],
      //                   latitude: activityDetails.start_latlng[0],
      //                   zoom: 11
      //                 }}
      //                 style={{
      //                   width: "100%",
      //                   height: "100%",
      //                 }}
      //                 mapStyle="mapbox://styles/mapbox/streets-v12"
      //                 onRender={(event) => event.target.resize()}
      //               >
      //                 <NavigationControl />
      //                 <Source id="polylineLayer" type="geojson" data={activityRoute}>
      //                   <Layer
      //                     id="lineLayer"
      //                     type="line"
      //                     source="my-data"
      //                     layout={{
      //                       "line-join": "round",
      //                       "line-cap": "round"
      //                     }}
      //                     paint={{
      //                       "line-color": "rgba(255, 0, 0, 0.8)",
      //                       "line-width": 3
      //                     }}
      //                   />
      //                 </Source>
      //                 {
      //                   segmentRoute.length !== 0 ?
      //                     <Source id="polylineLayer2" type="geojson" data={segmentRoute}>
      //                       <Layer
      //                         id="lineLayer2"
      //                         type="line"
      //                         source="my-data"
      //                         layout={{
      //                           "line-join": "round",
      //                           "line-cap": "round"
      //                         }}
      //                         paint={{
      //                           "line-color": "rgba(15, 10, 222, 1)",
      //                           "line-width": 3
      //                         }}
      //                       />
      //                     </Source>
      //                     :
      //                     <></>
      //                 }
      //               </Map>
      //             </div>
      //             :
      //             <></>
      //         }

      //         {/* list activity statistics */}
      //         <div className="grid grid-cols-3 gap-4 content-start">
      //           <div>
      //             <p className="text-gray-700 text-base">distance</p>
      //             <p className="font-bold">{((activityDetails.distance || 0) / 1609.344).toFixed(2)} mi</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">time</p>
      //             <p className="font-bold">{((activityDetails.moving_time || 0) / 60).toFixed(0)} mins</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">avg mph</p>
      //             <p className="font-bold">{((activityDetails.average_speed || 0) * 2.23694).toFixed(2)} mph</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">max mph</p>
      //             <p className="font-bold">{((activityDetails.max_speed || 0) * 2.23694).toFixed(2)} mph</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">avg watts</p>
      //             <p className="font-bold">{(activityDetails.average_watts || 0).toFixed(2)} w</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">max watts</p>
      //             <p className="font-bold">{(activityDetails.max_watts || 0)} mph</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">elevation gain</p>
      //             <p className="font-bold">{((activityDetails.total_elevation_gain || 0) * 3.2808).toFixed(0)} feet</p>
      //           </div>
      //           <div>
      //             <p className="text-gray-700 text-base">calories</p>
      //             <p className="font-bold">{((activityDetails.calories || 0)).toFixed(0)} cals</p>
      //           </div>
      //         </div>

      //       </div>

      //       {/* below body */}
      //       <div>

      //         {/* accordions */}
      //         <div className="accordion m-1" id="accordionExample5">

      //           {/* segments */}
      //           <div className="accordion-item bg-white border border-gray-200">

      //             {/* title */}
      //             <h2 className="accordion-header mb-0" id="headingOne5">
      //               <button className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
      //                 type="button"
      //                 data-bs-toggle="collapse"
      //                 data-bs-target="#collapseOne5"
      //                 aria-expanded="false"
      //                 aria-controls="collapseOne5"
      //               >
      //                 Segments
      //               </button>
      //             </h2>

      //             {/* body */}
      //             <div id="collapseOne5" className="accordion-collapse collapse" aria-labelledby="headingOne5">
      //               <div className="accordion-body py-2">
      //                 <Segments activityDetails={activityDetails} setSegmentRoute={setSegmentRoute} />
      //               </div>
      //             </div>

      //           </div>

      //           {/* power zones */}
      //           <div className="accordion-item bg-white border border-gray-200">

      //             {/* title */}
      //             <h2 className="accordion-header mb-0" id="headingOne6">
      //               <button className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
      //                 type="button"
      //                 data-bs-toggle="collapse"
      //                 data-bs-target="#collapseOne6"
      //                 aria-expanded="false"
      //                 aria-controls="collapseOne6"
      //               >
      //                 Power Zones
      //               </button>
      //             </h2>

      //             {/* body */}
      //             <div id="collapseOne6" className="accordion-collapse collapse" aria-labelledby="headingOne6">
      //               <div className="accordion-body py-2">

      //                 {/* bar graph */}
      //                 <div className="flex flex-col">
      //                   <div className="overflow-hidden rounded-lg shadow-lg">
      //                     <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-neutral-200">
      //                       Time in Power Zone
      //                     </div>
      //                     <PowerZones segmentEfforts={activityDetails.segment_efforts} />
      //                   </div>
      //                 </div>

      //               </div>
      //             </div>

      //           </div>

      //         </div>

      //       </div>

      //     </div>
      //   </div>
      // </div>