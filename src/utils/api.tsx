// return the currently authenticated athlete
export async function getAthlete(stravaAccessToken: string | null) {
  try {
    const athleteDataURL = "https://www.strava.com/api/v3/athlete"
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
export async function getAthleteStats(
  athleteId: number,
  stravaAccessToken: string | null
) {
  try {
    const athleteStatsURL = `https://www.strava.com/api/v3/athletes/${athleteId}/stats`
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
export async function getAthleteActivities(stravaAccessToken: string | null) {
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
export async function getActivity(
  activityId: string,
  stravaAccessToken: string
) {
  const activityURL = `https://www.strava.com/api/v3/activities/${activityId}`
  try {
    const res = await fetch(activityURL, {
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
export async function getActivityPhotos(
  activityId: string,
  stravaAccessToken: string
) {
  try {
    const activityPhotosURL = `https://www.strava.com/api/v3/activities/${activityId}/photos?size=2000&photo_sources=true`
    const res = await fetch(activityPhotosURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + stravaAccessToken
      }
    })
    const data = await res.json()
    let photos = []
    for (const photo of data) {
      photos.push(photo.urls["2000"])
    }
    return photos
  } catch (err) {
    console.error(err)
  }
}

// return the given activity's streams
export async function getActivityStream(
  activityId: string,
  stravaAccessToken: string
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
export async function getSegment(
  segmentId: number | null,
  stravaAccessToken: string | null
) {
  const segmentURL = `https://www.strava.com/api/v3/segments/${segmentId}`
  try {
    const res = await fetch(segmentURL, {
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
  try {
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
