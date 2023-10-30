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
      underline: ""
    },
    tabitem: {
      base: "p-4 px-10 mx-1 xl:mx-10 text-xl font-semibold focus:outline-none hover:bg-gray-200",
      styles: {
        underline: {
          active: {
            on: "rounded-t-lg border-b-4 border-blue-700 active text-blue-600",
            off: "rounded-lg text-gray-500 hover:text-black"
          }
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
    <div>
      {activityId && activityDetails && activityPhotos ? (
        <>
          <Tabs.Group
            style="underline"
            theme={customTheme}
            className="flex w-full justify-center"
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
            <Tabs.Item title="Zones">
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
      ) : (
        <></>
      )}
    </div>
  )
}
