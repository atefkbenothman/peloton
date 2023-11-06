import React from "react"
import { useState, useEffect } from "react"
// components
import LoadingIndicator from "../loadingIndicator"
// calendar
import ActivityCalendar from "react-activity-calendar"

export default function YearlyCalendar({
  data,
  loading
}: {
  data: any
  loading: boolean
}) {
  const [calendarData, setCalendarData] = useState<any>(null)

  const explicitTheme: any = {
    dark: ["#cbd5e1", "#0e4429", "#006d32", "#26a641", "#39d353"]
  }

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (data) {
      const activityData: any = []
      data.map((act: any) => {
        const startDate = new Date(act.start_date)
        const year = startDate.getFullYear()
        if (year === currentYear) {
          const calendarObj: any = {}
          calendarObj["date"] = new Date(act.start_date_local)
            .toISOString()
            .split("T")[0]
          calendarObj["count"] = 1
          const distance = act.distance / 1609.344
          calendarObj["level"] = 0
          if (distance < 20) {
            calendarObj["level"] = 1
          } else if (distance < 40) {
            calendarObj["level"] = 2
          } else if (distance < 60) {
            calendarObj["level"] = 3
          } else if (distance < 100) {
            calendarObj["level"] = 4
          }
          activityData.push(calendarObj)
        }
      })
      setCalendarData(activityData)
    }
  }, [data])

  return (
    <div className="w-fit bg-white rounded border-2">
      <div className="px-4 py-4">
        <ActivityCalendar
          data={calendarData || []}
          theme={explicitTheme}
          weekStart={1}
        />
      </div>
    </div>
  )
}
