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

// return the leaderboard for a given segment
export async function fetchLeaderboard(
  stravaAccessToken: string,
  segmentId: string
) {
  const segmentLeaderboardURL = `https://www.strava.com/segments/20465905/leaderboard?raw=true&page=1&per_page=10&viewer_context=true&activity_athlete_id=94900785`
  try {
    const res = await fetch(segmentLeaderboardURL, {
      method: "GET",
      headers: {
        authority: "www.strava.com",
        origin: "https://www.strava.com",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        cookie:
          "xp_session_identifier=916b496e3d2dcad5ca0e29c8701a2fa2; iterableEndUserId=atefkbenothman%40gmail.com; _strava_cbv3=true; _sp_id.f55d=1015f4f9-a186-47ab-966f-fe7f3cebb7b8.1663045194.2.1676598912.1663045194.7ab12c6a-3fb5-4fe7-826c-e4e66c765778; strava_remember_id=94900785; strava_remember_token=eyJzaWduaW5nX2tleSI6InYxIiwiZW5jcnlwdGlvbl9rZXkiOiJ2MSIsIml2IjoieU5nektubWowNDdhS3lrNXdtOFJDdz09XG4iLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb20uc3RyYXZhLmF0aGxldGVzIiwic3ViIjo5NDkwMDc4NSwiaWF0IjoxNjk1ODY2Mzc4LCJleHAiOjE2OTg0NTgzNzgsImVtYWlsIjoibzVWUVhJVjFZaXhUYW9ibnBibUtnM0VzVFR2VlVYK1U2cnBKV0xMNU83bCtvbUF4eVRWMU92bkpMZVVqXG5XaFVzT1Y4Sit0bVRUbWk4K0duTjZhSXdkS1gwOXhEeThidW8zdysxY0Z5UENIYz1cbiJ9.S8hvMNx3_KKKl0REXGlg59Ey7Jb0zHpNQ8c-5VRk42I; _strava4_session=kr6nthlvhiq4i49kp76am7ti3rb1ei2j; _sp_ses.047d=*; _sp_id.047d=462ae52c-9f2a-48eb-b58c-6280b4bcb85f.1661277762.284.1695956132.1695866532.a63105ab-ce8f-4e09-97e3-773fa9456d47; _strava4_session=j00jpgbcprfg05d63s37v4g2kbj61m0c",
        pragma: "no-cache",
        referer:
          "https://www.strava.com/activities/9940292694/segments/3142629631122313602",
        "sec-ch-ua":
          '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest"
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}
