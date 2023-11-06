import React from "react"
// next
import Image from "next/image"
// helpers
import { metersConversion } from "@/utils/conversions"

export default function Segments({
  segments,
  getPolyline
}: {
  segments: any
  getPolyline: any
}) {
  return (
    <div className="rounded overflow-y-auto overscroll-none">
      <table className="table-auto w-full border-l-2 border-r-2 border-b-2">
        <thead className="text-xs text-white bg-black text-center">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3">Distance</th>
            <th className="px-4 py-3">Elev Difference</th>
            <th className="px-4 py-3">Climb Category</th>
            <th className="px-4 py-3">Avg Grade</th>
            <th className="px-4 py-3 text-center">Elevation Profile</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {segments.length > 0 &&
            segments.map((seg: any) => (
              <tr
                className="bg-white border-b hover:bg-gray-200 cursor-pointer"
                key={seg.id}
                onClick={() => getPolyline(seg.points)}
              >
                <td className="text-gray-900 font-semibold px-4 py-1 border-r border-l break-normal text-left">
                  {seg.name}
                </td>
                <td className="text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
                  {metersConversion(seg.distance, "mile").toFixed(1)} miles
                </td>
                <td className="text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
                  {metersConversion(seg.elev_difference, "feet").toFixed(0)} ft
                </td>
                <td className="text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
                  {seg.climb_category}
                </td>
                <td className="text-center text-gray-900 font-medium px-4 py-1 border-r break-normal">
                  <p>{seg.avg_grade}%</p>
                </td>
                <td className="relative flex justify-center border-r break-normal">
                  <Image
                    src={seg.elevation_profile}
                    alt="elevation profile"
                    height={200}
                    width={200}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
