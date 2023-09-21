import React from "react"
import { useEffect, useState } from "react"

export default function Chat() {
  const [stravaAccessToken, setStravaAccessToken] = useState("")
  const [question, setQuestion] = useState<string>("")
  const [response, setResponse] = useState<string>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  function handleInputChange(e: any) {
    setQuestion(e.target.value)
  }

  function getAnswer(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    askQuestion(question)
  }

  const askQuestion = async (question: string) => {
    const athleteStatsURL = "http://localhost:8000/chat"
    const body = {
      question: question
    }
    try {
      const res = await fetch(athleteStatsURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      setResponse(data["data"])
    } catch (err) {
      console.error(err)
    }
  }

  const HTMLRenderer = ({ response }) => {
    return <div dangerouslySetInnerHTML={{ __html: response }}></div>
  }

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold mb-2">Chat</h3>

            {stravaAccessToken ? (
              <>
                <div className="my-4">
                  <input
                    type="text"
                    value={question}
                    onChange={handleInputChange}
                    className="mr-4 shadow border rounded h-10 w-1/2 p-2"
                  ></input>
                  <button
                    className="btn bg-blue-300 rounded p-2 shadow font-bold text-white"
                    onClick={getAnswer}
                  >
                    Ask
                  </button>
                  <div className="my-6">
                    <HTMLRenderer response={response} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="font-bold text-red-500">Please login first</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
