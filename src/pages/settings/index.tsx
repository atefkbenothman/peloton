import React from "react"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        summary="Manage your preferences here"
      />
      <PageContent>
        <div className="flex">
          <p className="font-bold">env: </p>
          <p className="ml-2">{process.env.NODE_ENV}</p>
        </div>
      </PageContent>
    </div>
  )
}
