import React from "react"
import { useState } from "react"
// datepicker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function Stats() {
  const [date, setDate] = useState(new Date())

  function handleSearch(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    console.log(date)
  }

  return (
    <>
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          <div>
            <h1 className="text-3xl font-bold mb-6">Stats</h1>
            <h1 className="text-lg mb-2">
              how many miles since{" "}
              {date.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric"
              })}{" "}
              ?
            </h1>
            <div className="mb-4 m-2">
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
              />
            </div>
            <button
              className="btn bg-green-500 text-white rounded p-2 shadow font-bold"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
