import React, { ReactNode } from "react"

export default function PageContent({ children }: { children: ReactNode }) {
  return <div className="px-6 xl:mx-40">{children}</div>
}
