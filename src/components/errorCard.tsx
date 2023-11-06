import React from "react"
// next
import Link from "next/link"

export default function ErrorCard({ error }: { error: any }) {
  return (
    <div className="w-fit mx-auto flex flex-col items-center gap-2">
      <h1 className="text-7xl font-extrabold text-red-600">{error.status}</h1>
      <p className="text-3xl font-bold text-gray-900">
        {error.info || "something's missing."}
      </p>
      <p className="text-lg font-medium text-gray-600 text-center w-fit">
        {error.message}
      </p>
    </div>
  )
}
