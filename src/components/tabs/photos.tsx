import React from "react"
import ReactPlayer from "react-player"
// next
import Image from "next/image"

export default function Photos({ photos }: { photos: any[] }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {photos &&
          photos.map((photo: any, idx) => (
            <div
              key={idx}
              className="flex justify-center w-fit h-fit shadow"
            >
              {photo.hasOwnProperty("video_url") ? (
                <div key={idx}>
                  <ReactPlayer
                    key={idx}
                    muted
                    loop
                    controls
                    height="100%"
                    width="100%"
                    url={photo.video_url}
                  />
                </div>
              ) : (
                <div key={idx}>
                  <Image
                    key={idx}
                    src={photo.urls["2000"]}
                    alt="activityPhoto"
                    width={600}
                    height={600}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
