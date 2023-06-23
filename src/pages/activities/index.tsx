import React from "react";
import { useEffect, useRef } from "react";
// next
// mapbox
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// components
import Activity from "../../components/activity";

export default function Activities() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYXRlZmthaWJlbm90aG1hbiIsImEiOiJjbGU1Mms1aGQwMzk2M3BwMzhyOWx2dDV2In0.Iqr4f_ZJMostXFJ3NJB1RA";

  const [stravaAccessToken, setStravaAccessToken] = React.useState("");
  const [activities, setActivities] = React.useState<any[]>([]);
  const [errorMessage, setErrorMessage] = React.useState("");

  // retrive strava accessToken from localstorage
  useEffect(() => {
    setStravaAccessToken(window.localStorage.getItem("accessToken") || "");
  }, []);

  // once the access token has been retrieved, get all activities
  useEffect(() => {
    if (stravaAccessToken) {
      getAllActivities();
    }
  }, [stravaAccessToken]);

  // retrive last 30 activities from strava api
  const getAllActivities = async () => {
    const activitiesURL =
      "https://www.strava.com/api/v3/athlete/activities?per_page=9";
    try {
      const res = await fetch(activitiesURL, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + stravaAccessToken,
        },
      });
      const data = await res.json();

      // check if the data we received back is a list
      if (!Array.isArray(data)) {
        setErrorMessage(data.message);
        return;
      }

      setActivities(data);
    } catch (err) {
      console.error(err);
      setErrorMessage("error retrieving all activities from strava api");
    }
  };

  return (
    <>
      <div className="min-h-screen mx-6 py-6">
        <div className="m-auto">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Activities</h1>
          </div>

          {/* Error Msg */}
          {errorMessage.length !== 0 && (
            <div>
              <p className="font-bold text-red-500 pl-2">{errorMessage}</p>
            </div>
          )}

          {/* Activity List */}
          <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {stravaAccessToken ? (
              Array.isArray(activities) &&
              activities.map((activity) => (
                <Activity key={activity.id} activity={activity} />
              ))
            ) : (
              <>
                <p className="font-bold pl-2">Please login first</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
