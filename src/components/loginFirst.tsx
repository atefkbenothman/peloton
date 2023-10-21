import React from "react"
// next
import Link from "next/link"

export default function LoginFirst() {
  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <p className="mb-4 text-xl tracking-tight font-bold text-gray-900">
            Please connect your Strava account first
          </p>
          <Link
            href="/login"
            className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            <p>Sign In</p>
          </Link>
        </div>
      </div>
    </section>
  )
}
