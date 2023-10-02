import React from "react"
// components
import Segments from "@/components/tabs/segments"
import PowerZones from "@/components/tabs/powerzones"
import Analysis from "@/components/tabs/analysis"
import Photos from "@/components/tabs/photos"
// flowbite
import { Tabs, CustomFlowbiteTheme } from "flowbite-react"

const customTheme: CustomFlowbiteTheme["tab"] = {
  tablist: {
    styles: {
      default: ""
    },
    tabitem: {
      base: "flex items-center justify-center p-4 px-10 rounded-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:outline-none",
      styles: {
        default: {
          active: {
            on: "bg-gray-300"
          },
          base: "font-bold text-xl"
        }
      }
    }
  }
}

interface ActivityDetail {
  name: string
  description: string
  distance: number
  moving_time: number
  average_speed: number
  max_speed: number
  average_watts: number
  max_watts: number
  total_elevation_gain: number
  calories: number
  start_date: number
  average_temp: number
  device_name: string
  segment_efforts: any[]
  start_latlng: any[]
}

export default function ActivityTabs({
  activityId,
  activityDetails,
  activityPhotos,
  setSegmentRoute
}: {
  activityId: string
  activityDetails: ActivityDetail
  activityPhotos: any
  setSegmentRoute: any
}) {
  return (
    <>
      <Tabs.Group
        style="default"
        theme={customTheme}
      >
        {/* segments */}
        <Tabs.Item
          active
          title={`Segments (${activityDetails.segment_efforts.length})`}
        >
          <Segments
            segments={activityDetails.segment_efforts}
            setSegmentRoute={setSegmentRoute}
          />
        </Tabs.Item>
        {/* power zones */}
        <Tabs.Item title="Power Zones">
          <PowerZones segmentEfforts={activityDetails.segment_efforts} />
        </Tabs.Item>
        {/* analytics */}
        <Tabs.Item title="Analysis">
          {activityId && <Analysis activityId={activityId} />}
        </Tabs.Item>
        {/* photos */}
        <Tabs.Item title={`Photos (${activityPhotos.length})`}>
          {activityPhotos && <Photos photos={activityPhotos} />}
        </Tabs.Item>
      </Tabs.Group>
    </>
  )
}
