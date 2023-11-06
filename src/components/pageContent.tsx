import React, { ReactNode } from "react"
// components
import PageHeader from "./pageHeader"

export default function PageContent({
  children,
  title,
  summary
}: {
  children: ReactNode
  title?: string
  summary?: string
}) {
  return (
    <div className="px-4 pt-[23px] xl:px-52">
      <div>
        <PageHeader
          title={title || ""}
          summary={summary || ""}
        />
      </div>
      <div className="py-6">{children}</div>
    </div>
  )
}
