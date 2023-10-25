import React from "react"
import ReactPlayer from "react-player"
// next
import Image from "next/image"

export default function Photos({ photos }: { photos: any[] }) {
  return (
    <div>
      {photos && (
        <>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {photos.map((photo: any, idx) => (
              <section
                key={idx}
                className="bg-white overflow-hidden shadow-md rounded-md h-fit w-fit"
              >
                <div className="p-2">
                  <div className="">
                    {photo.hasOwnProperty("video_url") ? (
                      <div
                        key={idx}
                        className=""
                      >
                        <ReactPlayer
                          muted
                          loop
                          controls
                          height="100%"
                          width="100%"
                          url={photo.video_url}
                        />
                      </div>
                    ) : (
                      <Image
                        key={idx}
                        src={photo.urls["2000"]}
                        alt="activityPhoto"
                        width={600}
                        height={600}
                      />
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
