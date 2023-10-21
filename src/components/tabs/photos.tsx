import React from "react"
// next
import Image from "next/image"

export default function Photos({ photos }: { photos: any[] }) {
  return (
    <div>
      {photos && photos[0] !== undefined && (
        <>
          <div className="grid grid-cols-4 gap-4">
            {photos.map((photo: any, idx) => (
              <section
                key={idx}
                className="bg-white shadow-md rounded-sm h-fit"
              >
                <div className="p-2">
                  <div className="mx-auto max-w-screen-sm text-center">
                    <Image
                      key={idx}
                      src={photo}
                      alt="activityPhoto"
                      width={600}
                      height={600}
                    />
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
