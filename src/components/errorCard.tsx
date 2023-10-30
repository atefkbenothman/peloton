import React from "react"
// next
import Link from "next/link"

export default function ErrorCard({ error }: { error: any }) {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-md text-center bg-white rounded shadow p-12">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-primary-500">
          {error.status}
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          {error.info || "something's missing."}
        </p>
        <p className="text-lg font-light text-gray-600 mb-2">{error.message}</p>
        <Link
          href="/"
          className="inline-flex text-white bg-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
        >
          <p>back to home</p>
        </Link>
      </div>
    </div>
  )
}
