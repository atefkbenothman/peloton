// return the currently authenticated athlete
export async function fetchAthleteData(stravaAccessToken: string) {
  const athleteDataURL = "https://www.strava.com/api/v3/athlete"
  try {
    const res = await fetch(athleteDataURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return the activity stats of an athlete
export async function fetchAthleteStats(
  stravaAccessToken: string,
  athleteId: number
) {
  const athleteStatsURL = `https://www.strava.com/api/v3/athletes/${athleteId}/stats`
  try {
    const res = await fetch(athleteStatsURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return the activities of an athlete for a specific identifier
export async function fetchAthleteActivities(stravaAccessToken: string) {
  const numActivities = 15
  const activitiesURL = `https://www.strava.com/api/v3/athlete/activities?per_page=${numActivities}`
  try {
    const res = await fetch(activitiesURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return the given activity that is owned by the authenticated athlete
export async function fetchActivityDetails(
  stravaAccessToken: string,
  activityId: string
) {
  const activityDetailURL = `https://www.strava.com/api/v3/activities/${activityId}`
  try {
    const res = await fetch(activityDetailURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return all photos from a given activity
export async function fetchActivityPhotos(
  stravaAccessToken: string,
  activityId: string
) {
  const activityPhotosURL = `https://www.strava.com/api/v3/activities/${activityId}/photos?size=2000&photo_sources=true`
  try {
    const res = await fetch(activityPhotosURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return the given activity's streams
export async function fetchActivityStream(
  stravaAccessToken: string,
  activityId: string
) {
  const activityStreamURL = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance,velocity_smooth,watts,grade_smooth,moving,altitude&key_by_type=true`
  try {
    const res = await fetch(activityStreamURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return a segment effort from an activity that is owned by the authenticated athlete
export async function fetchSegmentDetail(
  stravaAccessToken: string,
  segmentId: number
) {
  const segmentDetailURL = `https://www.strava.com/api/v3/segments/${segmentId}`
  try {
    const res = await fetch(segmentDetailURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

// return the top 10 segments matching a specified query
export async function fetchSegments(stravaAccessToken: string, coords: string) {
  const params = new URLSearchParams({
    bounds: coords,
    activity_type: "riding"
  }).toString()
  const segmentExploreURL = `https://www.strava.com/api/v3/segments/explore?${params}`
  try {
    const res = await fetch(segmentExploreURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}
