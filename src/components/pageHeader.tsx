import React from "react"

export default function PageHeader({
  title,
  summary
}: {
  title: string
  summary: string
}) {
  return (
    <>
      <div className="p-6 xl:mx-40">
        <p className="text-4xl font-bold">{title}</p>
        <p className="pt-3 text-gray-700 text-lg">{summary}</p>
      </div>
    </>
  )
}
