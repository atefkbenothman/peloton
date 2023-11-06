import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import {
  getAllAthleteActivities,
  testChatServerConnection,
  uploadActivityData,
  sendQuestion,
  uploadFileToServer
} from "@/utils/api"
// components
import PageHeader from "@/components/pageHeader"
import PageContent from "@/components/pageContent"
import LoginFirst from "@/components/loginFirst"
import LoadingIndicator from "@/components/loadingIndicator"
import ErrorCard from "@/components/errorCard"
import Diagrams from "@/components/chat/diagrams"
// csv
import { CSVLink } from "react-csv"

export default function Chat() {
  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>("")
  const [download, setDownload] = useState<boolean>(false)
  const [uploaded, setUploaded] = useState<boolean>(false)
  const [question, setQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<any>(null)
  const [imageSrc, setImageSrc] = useState<any>(null)

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || null)
  }, [])

  const { data: connection, error: testChatServerError } = useSWR(
    stravaAccessToken ? ["testChatServerConnection"] : null,
    ([key]) => testChatServerConnection(),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0
    }
  )

  const {
    data: activities,
    error,
    isLoading
  } = useSWR(
    stravaAccessToken ? ["allActivities", null, stravaAccessToken] : null,
    ([key, fromDate, token]) => getAllAthleteActivities(fromDate, token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  function downloadActivities(e: any) {
    e.preventDefault()
    setDownload(true)
  }

  function updateQuestionText(e: any) {
    e.preventDefault()
    setQuestion(e.target.value)
  }

  async function askQuestion(e: any) {
    e.preventDefault()
    if (question) {
      setLoading(true)
      const res = await sendQuestion(question)
      if (res && res.startsWith("blob:http")) {
        setImageSrc(res)
      } else {
        if (res.status === "success") {
          setAnswer(res.answer)
        }
      }
      setLoading(false)
    }
  }

  function updateFile(e: any) {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)
    setFile(formData)
  }

  async function uploadFile() {
    const res = await uploadFileToServer(file)
    if (res.status === "success") {
      setUploaded(true)
    }
  }

  // if (!stravaAccessToken) {
  //   return (
  //     <div>
  //       <PageHeader
  //         title="Chat"
  //         summary="Ask questions about your cycling metrics"
  //       />
  //       <PageContent>
  //         <LoginFirst />
  //       </PageContent>
  //     </div>
  //   )
  // }

  // if (testChatServerError) {
  //   return (
  //     <div>
  //       <PageHeader
  //         title="Chat"
  //         summary="Ask questions about your cycling metrics"
  //       />
  //       <PageContent>
  //         <p className="text-red-500 font-semibold">
  //           Could not connect to Chat Server
  //         </p>
  //       </PageContent>
  //     </div>
  //   )
  // }

  if (!stravaAccessToken) {
    return (
      <div>
        <PageContent
          title="Chat"
          summary="Ask questions about your strava activities."
        >
          <div>
            <LoginFirst />
          </div>
        </PageContent>
      </div>
    )
  }

  return (
    <div>
      <PageContent
        title="Chat"
        summary="Ask questions about your strava activities."
      >
        <div>hello</div>
      </PageContent>
    </div>
  )
}
{
  /* <PageHeader
        title="Chat"
        summary="Ask questions about your strava activities"
      />
      <PageContent>
        <div>
          {connection && (
            <div>
              <p className="text-green-500 font-semibold pb-8">
                Connected to Chat Server
              </p>
            </div>
          )}
          <div className="pb-6">
            <div className="flex gap-4">
              <button className="btn bg-orange-500 text-white rounded p-2 shadow font-bold">
                {activities ? (
                  <CSVLink
                    data={activities}
                    filename={"activities"}
                    separator=";"
                  >
                    Download All
                  </CSVLink>
                ) : (
                  "Loading..."
                )}
              </button>
              <div className="flex gap-4">
                <input
                  type="file"
                  onChange={updateFile}
                  className="rounded shadow font-medium"
                ></input>
                <button
                  onClick={uploadFile}
                  className="btn bg-blue-500 text-white rounded p-2 shadow font-bold"
                >
                  Upload
                </button>
              </div>
            </div>
            <div className="pt-8">
              {uploaded && <p>successfully uploaded file!</p>}
            </div>
          </div>
          {true && (
            <div>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="PNG Image"
                />
              )}
              {answer && (
                <div className="bg-white rounded flex h-full p-2 font-medium">
                  {"<AI>"}: {answer}
                </div>
              )}
              <form
                className="flex items-center absolute bottom-0 mb-14 w-full"
                onSubmit={askQuestion}
              >
                <div className="w-1/2">
                  <input
                    type="text"
                    className="w-full shadow p-2 text-lg text-gray-900 rounded bg-gray-50 h-full"
                    placeholder="Chat"
                    onChange={updateQuestionText}
                  />
                </div>
                <button
                  onClick={askQuestion}
                  className="mx-2 px-4 btn bg-blue-500 text-white rounded py-2 shadow font-bold"
                >
                  Ask
                </button>
              </form>
              <div></div>
            </div>
          )}
        </div>
      </PageContent>
    </div> */
}

// {answer &&
//   (loading ? (
//     <div className="my-4 p-2 bg-white rounded shadow">
//       <LoadingIndicator />
//     </div>
//   ) : (
//     <div className="my-4 p-2 bg-white rounded shadow">
//       <p>Reponse: {answer}</p>
//       <Diagrams data={answer} />
//     </div>
//   ))}
