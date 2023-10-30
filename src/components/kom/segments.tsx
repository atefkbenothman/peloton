import React, { useEffect, useState } from "react"
// next
import Image from "next/image"

export default function Segments({
  segments,
  getPolyline
}: {
  segments: any
  getPolyline: any
}) {
  return (
    <div>
      <div className="w-full">
        <div className="overflow-y-auto rounded max-h-[750px] shadow">
          <table className="w-full table text-sm text-left text-gray-400 rounded">
            <thead className="text-xs sticky top-0 uppercase bg-gray-700 text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  distance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  elev difference
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  climb category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  avg grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center"
                >
                  elevation profile
                </th>
              </tr>
            </thead>
            <tbody>
              {segments &&
                segments.map((s: any, idx: number) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 border-gray-300 cursor-pointer hover:bg-gray-200"
                    key={idx}
                    onClick={() => getPolyline(s.points)}
                  >
                    <td className="text-sm text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left">
                      {s.name}
                    </td>
                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                      {(s.distance / 1609.344).toFixed(1)} miles
                    </td>
                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                      {s.elev_difference}
                    </td>
                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                      {s.climb_category}
                    </td>
                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-left">
                      <p>{s.avg_grade}%</p>
                    </td>
                    <td className="text-sm text-gray-900 font-medium px-4 py-1 border-r break-normal text-center flex items-center justify-center">
                      <Image
                        src={s.elevation_profile}
                        alt="elevation profile"
                        height={100}
                        width={100}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// <div className="max-h-[400px] overflow-y-auto rounded-lg bg-gray-200 border-4 border">
//   <table className="w-full table-fixed bg-gray-200">
//     <thead className="sticky top-0 text-xs bg-gray-200">
//       <tr>
//         <th
//           scope="col"
//           className="text-sm text-gray-900 px-6 py-2"
//         >
//           name
//         </th>
//         <th
//           scope="col"
//           className="text-sm text-gray-900 px-6 py-2"
//         >
//           distance
//         </th>
//         <th
//           scope="col"
//           className="text-sm text-gray-900 px-6 py-2"
//         >
//           elev difference
//         </th>
//         <th
//           scope="col"
//           className="text-sm text-gray-900 px-6 py-2"
//         >
//           climb category
//         </th>
//         <th
//           scope="col"
//           className="text-sm text-gray-900 px-6 py-2"
//         >
//           avg grade
//         </th>
//         <th
//           scope="col"
//           className="text-sm text-gray-900 px-6 py-2"
//         >
//           elevation profile
//         </th>
//       </tr>
//     </thead>
//     <tbody className="border-b">
//       {segments.length > 0 &&
//         segments.map((seg: any) => (
//           <tr
//             className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
//             key={seg.id}
//             onClick={() => getPolyline(seg.points)}
//           >
//             <td className="text-sm text-gray-900 font-semibold px-4 py-1 border-r break-normal text-left">
//               {seg.name}
//             </td>
//             <td className="text-sm text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
//               {(seg.distance / 1609.344).toFixed(1)} miles
//             </td>
//             <td className="text-sm text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
//               {seg.elev_difference}
//             </td>
//             <td className="text-sm text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
//               {seg.climb_category}
//             </td>
//             <td className="text-sm text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
//               <p>{seg.avg_grade}%</p>
//             </td>
//             <td className="text-sm text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
//               <Image
//                 src={seg.elevation_profile}
//                 alt="elevation profile"
//                 height={200}
//                 width={200}
//               />
//             </td>
//           </tr>
//         ))}
//     </tbody>
//   </table>
// </div>
