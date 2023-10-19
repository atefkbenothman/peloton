import React from "react"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"

export default function Settings() {
  return (
    <div className="bg-gray-100">
      <div className="min-h-screen">
        <div className="m-auto">
          <PageHeader title="Settings" />
          <PageContent>
            <div className="flex">
              <p className="font-bold">env: </p>
              <p className="ml-2">{process.env.NODE_ENV}</p>
            </div>
          </PageContent>
        </div>
      </div>
    </div>
  )
}
