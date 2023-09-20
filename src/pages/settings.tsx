import React from "react"

export default function Settings() {
  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold mb-4">Settings</h3>
          </div>
          {/* Info */}
          <div className="flex">
            <p className="font-bold">env: </p>
            <p className="ml-2">{process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
