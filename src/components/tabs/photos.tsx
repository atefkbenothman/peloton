import React from "react"
// next
import Image from "next/image"

export default function Photos({ photos }: { photos: any[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {photos.map((photo: any, idx) => (
        <Image
          key={idx}
          src={photo}
          alt="activityPhoto"
          className="m-2 shadow-lg"
          width={600}
          height={600}
        />
      ))}
    </div>
  )
}
