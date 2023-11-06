import React, { useEffect, useState } from "react"

export default function RawData({ activityDetails }: { activityDetails: any }) {
  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  return (
    <div className="max-w-full">
      <div className="bg-white p-2 rounded shadow">
        <pre></pre>
      </div>
    </div>
  )
}
