import React from "react"

export default function PageHeader({
  title,
  summary
}: {
  title: string
  summary: string
}) {
  return (
    <div>
      <p className="text-4xl font-bold">{title}</p>
      <p className="py-2 text-md xl:text-lg text-gray-700">{summary}</p>
    </div>
  )
}
