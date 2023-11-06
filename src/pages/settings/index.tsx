import React from "react"
// components
import PageContent from "@/components/pageContent"

export default function Settings() {
  return (
    <div>
      <PageContent
        title="Settings"
        summary="Manage your preferences here."
      >
        <div className="flex">
          <p className="font-semibold">env: </p>
          <p className="ml-2">{process.env.NODE_ENV}</p>
        </div>
      </PageContent>
    </div>
  )
}
