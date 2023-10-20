import React from "react"
// next
import Link from "next/link"

export default function LoginFirst() {
  return (
    <div className="font-bold text-red-500 bg-gray-200 w-fit p-2 rounded">
      <Link href="/login">
        <p>
          Please <span className="underline">login</span> first
        </p>
      </Link>
    </div>
  )
}
