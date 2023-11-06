// authorize with strava
export function generateStravaAuthURL() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID?.toString() || ""
  // set the redirect uri based on dev/prod
  let redirect_uri = "http://localhost:3000/login"
  if (process.env.NODE_ENV === "production") {
    redirect_uri = "https://master.d18mtk2j3wua4u.amplifyapp.com/login"
  }
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirect_uri,
    approval_prompt: "force",
    scope: "read_all,activity:read_all,profile:read_all"
  }).toString()
  const authorizeBaseURL = "https://strava.com/oauth/authorize"
  const authorizeURL = `${authorizeBaseURL}?${params}`
  return authorizeURL
}

// exhchange code for access token
export async function getAccessToken(code: string) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID?.toString() || ""
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET?.toString() || ""
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code"
  }).toString()
  const exchangeBaseURL = "https://www.strava.com/oauth/token"
  const exchangeURL = `${exchangeBaseURL}?${params}`
  const res = await fetch(exchangeURL, {
    method: "POST"
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while exchanging token ${exchangeURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  const access_token = data.access_token
  return access_token
}

// return the currently authenticated athlete
export async function getAthlete(stravaAccessToken: string | null) {
  const athleteDataURL = "https://www.strava.com/api/v3/athlete"
  const res = await fetch(athleteDataURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${athleteDataURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return the activity stats of an athlete
export async function getAthleteStats(
  athleteId: number,
  stravaAccessToken: string | null
) {
  const athleteStatsURL = `https://www.strava.com/api/v3/athletes/${athleteId}/stats`
  const res = await fetch(athleteStatsURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${athleteStatsURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return the the authenticated athlete's heart rate and power zones
export async function getAthleteZones(stravaAccessToken: string | null) {
  try {
    const athleteZonesURL = "https://www.strava.com/api/v3/athlete/zones"
    const res = await fetch(athleteZonesURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    if (!res.ok) {
      const error: any = new Error(
        `an error occurred while fetching the api "${athleteZonesURL}".`
      )
      const e = await res.json()
      error.info = e.message
      error.status = res.status
      throw error
    }
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return the activities of an athlete for a specific identifier
export async function getAthleteActivities(stravaAccessToken: string | null) {
  const numActivities = 15
  const activitiesURL = `https://www.strava.com/api/v3/athlete/activities?per_page=${numActivities}`
  const res = await fetch(activitiesURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${activitiesURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return the given activity that is owned by the authenticated athlete
export async function getActivity(
  activityId: string,
  stravaAccessToken: string
) {
  const activityURL = `https://www.strava.com/api/v3/activities/${activityId}`
  const res = await fetch(activityURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${activityURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return all photos from a given activity
export async function getActivityPhotos(
  activityId: string,
  stravaAccessToken: string
) {
  const activityPhotosURL = `https://www.strava.com/api/v3/activities/${activityId}/photos?size=2000&photo_sources=true`
  const res = await fetch(activityPhotosURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${activityPhotosURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return the given activity's streams
export async function getActivityStream(
  activityId: string,
  stravaAccessToken: string
) {
  const activityStreamURL = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance,velocity_smooth,watts,grade_smooth,moving,altitude&key_by_type=true`
  const res = await fetch(activityStreamURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${activityStreamURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return a segment effort from an activity that is owned by the authenticated athlete
export async function getSegment(
  segmentId: number | null,
  stravaAccessToken: string | null
) {
  const segmentURL = `https://www.strava.com/api/v3/segments/${segmentId}`
  const res = await fetch(segmentURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${segmentURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// return all activities after a given date
export async function getAllAthleteActivities(
  date: Date | null,
  stravaAccessToken: string | null
) {
  // if no date was specified, set the date to some time in the past so we can
  // get all activities
  if (!date) {
    date = new Date("2000-01-01")
  }
  const baseURL = "https://www.strava.com/api/v3/athlete/activities"
  const dateToEpoch = (Date.parse(date.toISOString()) / 1000).toString()
  let allActivities: any = []
  let page = 1
  while (true) {
    const params = new URLSearchParams({
      after: dateToEpoch,
      page: page.toString(),
      per_page: "200"
    }).toString()

    const activitiesURL = baseURL + "?" + params

    const res = await fetch(activitiesURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    if (!res.ok) {
      const error: any = new Error(
        `an error occurred while fetching the api "${baseURL}".`
      )
      const e = await res.json()
      error.info = e.message
      error.status = res.status
      throw error
    }
    const data = await res.json()
    // check if there are still activities on this page
    if (data.length === 0) {
      // no more
      break
    }
    for (let i = 0; i < data.length; i++) {
      allActivities.push(data[i])
    }
    // check next page
    page++
  }
  return allActivities
}

// return the top 10 segments matching a specified query
export async function getNearbySegments(
  coords: string,
  minCat: number,
  maxCat: number,
  stravaAccessToken: string
) {
  const params = new URLSearchParams({
    bounds: coords,
    activity_type: "riding"
  }).toString()
  const segmentExploreURL = `https://www.strava.com/api/v3/segments/explore?${params}&min_cat=${minCat}&max_cat=${maxCat}`
  const res = await fetch(segmentExploreURL, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + stravaAccessToken
    }
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while fetching the api "${segmentExploreURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// test chat server connection
export async function testChatServerConnection() {
  const chatServerURL = "http://localhost:8000/"
  const res = await fetch(chatServerURL, {
    method: "GET"
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while connecting to chat server @ "${chatServerURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// upload activity data to chat server
export async function uploadActivityData(activities: any) {
  const chatServerUploadURL = "http://localhost:8000/upload"
  const body = {
    data: activities
  }
  const res = await fetch(chatServerUploadURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while uploading activities to chat server @ "${chatServerUploadURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// upload a file object to chat server
export async function uploadFileToServer(file: any) {
  const uploadURL = "http://localhost:8000/uploadfile/"
  const res = await fetch(uploadURL, {
    method: "POST",
    body: file
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while uploading file to chat server @ "${uploadURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const data = await res.json()
  return data
}

// send question to chat server
export async function sendQuestion(question: string) {
  const chatServerChatURL = "http://localhost:8000/ask"
  const body = {
    question: question
  }
  const res = await fetch(chatServerChatURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const error: any = new Error(
      `an error occurred while uploading activities to chat server @ "${chatServerChatURL}".`
    )
    const e = await res.json()
    error.info = e.message
    error.status = res.status
    throw error
  }
  const contentType = res.headers.get("content-type")
  if (contentType && contentType.includes("image/png")) {
    const blob = await res.blob()
    const imageURL = URL.createObjectURL(blob)
    return imageURL
  } else {
    const data = await res.json()
    return data
  }
}
