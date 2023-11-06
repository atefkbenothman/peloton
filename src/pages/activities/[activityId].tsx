import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// next
import { useRouter } from "next/router"
import Link from "next/link"
// components
import ActivityMap from "@/components/activity/activityMap"
import ActivityStats from "@/components/activity/activityStats"
import ActivityTabs from "@/components/activity/activityTabs"
import ErrorCard from "@/components/errorCard"
import PageContent from "@/components/pageContent"
import Photos from "@/components/tabs/photos"
import Segments from "@/components/tabs/segments"
// api
import { getActivity, getActivityPhotos, getSegment } from "@/utils/api"
// mapbox
import polyline from "@mapbox/polyline"
// flowbite
import { Tabs, CustomFlowbiteTheme } from "flowbite-react"
// json viewer
import dynamic from "next/dynamic"
const DynamicReactJson = dynamic(import("@microlink/react-json-view"), {
  ssr: false
})

const customTheme: CustomFlowbiteTheme["tab"] = {
  tablist: {
    styles: {
      underline: "gap-x-10 font-semibold text-lg"
    },
    tabitem: {
      base: "focus:outline-none pb-0.5",
      styles: {
        underline: {
          active: {
            on: "border-b-2 border-blue-700 active text-blue-600",
            off: "text-gray-600 border-b-2 hover:border-blue-700"
          }
        }
      }
    }
  }
}

export default function ActivityDetails() {
  const router = useRouter()
  // get activityId from url
  const activityId: string = Array.isArray(router.query.activityId)
    ? router.query.activityId[0]
    : router.query.activityId ?? ""

  const [stravaAccessToken, setStravaAccessToken] = useState<string>("")
  const [segmentRoute, setSegmentRoute] = useState<any[]>([])
  const [route, setRoute] = useState<any | null>(null)

  // retrive strava accessToken from sessionStorage
  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const {
    data: activity,
    error,
    isLoading
  } = useSWR(
    activityId && stravaAccessToken
      ? ["activity", activityId, stravaAccessToken]
      : null,
    ([key, activityId, token]) => getActivity(activityId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const { data: photos } = useSWR(
    activityId && stravaAccessToken
      ? ["activityPhotos", activityId, stravaAccessToken]
      : null,
    ([key, activityId, token]) => getActivityPhotos(activityId, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  useEffect(() => {
    if (activity && activity.map) {
      setRoute(polyline.toGeoJSON(activity.map.summary_polyline))
    }
  }, [activity])

  const BackButton = () => {
    return (
      <div className="mb-6">
        <Link href="/activities">
          <button
            type="button"
            className="text-black rounded-md inline-flex items-center mr-2"
          >
            <svg
              className="w-3 h-3 text-black mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            <span className="sr-only">Back</span>
            all activities
          </button>
        </Link>
      </div>
    )
  }

  const ActivityHeader = () => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h5 className="text-3xl font-bold">{activity.name}</h5>
          <div className="flex gap-2">
            {activity.athlete_count > 1 && (
              <div className="inline-block bg-blue-200 rounded px-3 py-1 text-xl font-bold text-blue-700">
                {activity.athlete_count}
              </div>
            )}
            {activity.suffer_score && (
              <div className="inline-block bg-red-200 rounded px-3 py-1 text-xl font-bold text-red-700">
                {activity.suffer_score}
              </div>
            )}
            {activity.type && (
              <div className="bg-gray-300 rounded px-3 py-1 text-xl font-bold text-gray-700">
                {activity.type}
              </div>
            )}
          </div>
        </div>
        {activity.description && (
          <h5 className="mt-2 text-xl font-medium">{activity.description}</h5>
        )}
        <div className="font-semibold text-slate-500 text-sm py-2">
          {new Date(activity.start_date).toLocaleString()} -{" "}
          {activity.average_temp}&deg;C / {(activity.average_temp * 9) / 5 + 32}
          &deg;F - {activity.device_name}
        </div>
      </div>
    )
  }

  const ActTabs = () => {
    const [activeTab, setActiveTab] = useState<number>(0)

    return (
      <div>
        <Tabs.Group
          aria-label="Tabs with underline"
          style="underline"
          onActiveTabChange={(tab) => setActiveTab(tab)}
          theme={customTheme}
        >
          <Tabs.Item
            active
            title="Segments"
          >
            <div className="mb-6">
              {activity && <ActivityStats activityDetails={activity} />}
            </div>
            {(activity.start_latlng || []).length !== 0 && (
              <div className="mb-6 h-96 border-2 border-black">
                <ActivityMap
                  key={activeTab}
                  activityId={activity.id}
                  activityDetails={activity}
                  activityRoute={route}
                  segmentRoute={segmentRoute}
                />
              </div>
            )}
            <div>
              {activity && (
                <Segments
                  segments={activity.segment_efforts}
                  setSegmentRoute={setSegmentRoute}
                />
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Analysis">
            <p>analysis</p>
          </Tabs.Item>
          <Tabs.Item title="Photos">
            <Photos photos={photos} />
          </Tabs.Item>
          <Tabs.Item title="Raw Data">
            <div className="w-full whitespace-normal break-all">
              <DynamicReactJson
                src={activity}
                indentWidth={2}
                collapsed={1}
                collapseStringsAfterLength={100}
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
              />
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    )
  }

  return (
    <div>
      <PageContent>
        {activity && (
          <div className="-mt-12 xl:-mt-10">
            <div className="mb-4">
              <BackButton />
              <ActivityHeader />
            </div>
            <ActTabs />
          </div>
        )}
      </PageContent>
    </div>
  )
}
