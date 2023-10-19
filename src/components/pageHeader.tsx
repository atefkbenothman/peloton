import React from "react"

export default function PageHeader({ title }: { title: string }) {
  return (
    <>
      <h3 className="p-6 text-3xl font-bold">{title}</h3>
    </>
  )
}
