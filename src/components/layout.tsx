import React from "react"
import { useState, useEffect } from "react"
// next
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
// utils
import { cn } from "@/utils/tailwind"

function NavBar() {
  const [stravaAccessToken, setStravaAccessToken] = useState<any>("")

  useEffect(() => {
    const token = window.sessionStorage.getItem("accessToken")
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || "")
  }, [])

  const fullPathname = usePathname()
  const pathname = "/" + fullPathname?.split("/")?.[1]

  return (
    <>
      {/* Side Navbar */}
      <aside
        id="logo-sidebar"
        className="fixed min-h-screen top-0 left-0 z-40 w-52 xl:w-64 border-r bg-black border-black"
        aria-label="Sidebar"
      >
        <div className="overflow-y-auto bg-black px-4 pt-7 pb-6">
          <Link
            href="/"
            className="flex items-center w-fit"
          >
            <Image
              src="/strava-icon.svg"
              className="h-8 mr-2 rounded"
              alt="Strava Logo"
              height={32}
              width={32}
            />
            <span className="self-center text-2xl font-semibold text-white">
              Strava Pro
            </span>
          </Link>
        </div>
        <div className="px-3 py-2">
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className={cn(
                  "flex items-center p-2 rounded text-slate-300 font-semibold text-lg tracking-wide hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                  pathname === "/"
                    ? "text-white bg-slate-500 bg-opacity-30"
                    : "text-slate-300"
                )}
              >
                <svg
                  className={cn(
                    "w-5 h-5 text-slate-300 group-hover:text-white",
                    pathname === "/" ? "text-white" : "text-slate-300"
                  )}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1v14h16m0-9-3-2-3 5-3-2-3 4"
                  />
                </svg>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={cn(
                  "flex items-center p-2 rounded text-slate-300 font-bold text-lg tracking-wide hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                  pathname === "/profile"
                    ? "text-white bg-slate-500 bg-opacity-30"
                    : "text-slate-300"
                )}
              >
                <svg
                  className={cn(
                    "w-5 h-5 text-slate-300 group-hover:text-white",
                    pathname === "/profile" ? "text-white" : "text-slate-300"
                  )}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
                  />
                </svg>
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/activities"
                className={cn(
                  "flex items-center p-2 rounded text-slate-300 font-bold tracking-wide text-lg hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                  pathname === "/activities"
                    ? "text-white bg-slate-500 bg-opacity-30"
                    : "text-slate-300"
                )}
              >
                <svg
                  className={cn(
                    "w-5 h-5  text-slate-300 group-hover:text-white",
                    pathname === "/activities" ? "text-white" : "text-slate-300"
                  )}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6.143 1H1.857A.857.857 0 0 0 1 1.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 6.143V1.857A.857.857 0 0 0 6.143 1Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 17 6.143V1.857A.857.857 0 0 0 16.143 1Zm-10 10H1.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 16.143v-4.286A.857.857 0 0 0 6.143 11Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
                  />
                </svg>
                <span className="ml-3">Activities</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chat"
                className={cn(
                  "flex items-center p-2 rounded text-slate-300 font-bold tracking-wide text-lg hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                  pathname === "/chat"
                    ? "text-white bg-slate-500 bg-opacity-30"
                    : "text-slate-300"
                )}
              >
                <svg
                  className={cn(
                    "w-5 h-5  text-slate-300 group-hover:text-white",
                    pathname === "/chat" ? "text-white" : "text-slate-300"
                  )}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                  />
                </svg>
                <span className="ml-3">Chat</span>
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className={cn(
                  "flex items-center p-2 rounded text-slate-300 font-bold tracking-wide text-lg hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                  pathname === "/search"
                    ? "text-white bg-slate-500 bg-opacity-30"
                    : "text-slate-300"
                )}
              >
                <svg
                  className={cn(
                    "w-5 h-5  text-slate-300 group-hover:text-white",
                    pathname === "/search" ? "text-white" : "text-slate-300"
                  )}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="ml-3">Search</span>
              </Link>
            </li>
            <li>
              <Link
                href="/kom"
                className={cn(
                  "flex items-center p-2 rounded text-slate-300 font-bold tracking-wide text-lg hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                  pathname === "/kom"
                    ? "text-white bg-slate-500 bg-opacity-30"
                    : "text-slate-300"
                )}
              >
                <svg
                  className={cn(
                    "w-5 h-5  text-slate-300 group-hover:text-white",
                    pathname === "/kom" ? "text-white" : "text-slate-300"
                  )}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 21 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"
                  />
                </svg>
                <span className="ml-3">KOM</span>
              </Link>
            </li>
            <ul className="py-3 mx-3 absolute inset-x-0 bottom-0 space-y-2 border-t-2 border-slate-400">
              <li>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center p-2 rounded text-slate-300 font-bold tracking-wide text-lg hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                    pathname === "/settings"
                      ? "text-white bg-slate-500 bg-opacity-30"
                      : "text-slate-300"
                  )}
                >
                  <svg
                    className={cn(
                      "w-5 h-5  text-slate-300 group-hover:text-white",
                      pathname === "/settings" ? "text-white" : "text-slate-300"
                    )}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <g
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M19 11V9a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L12 2.757V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L2.929 4.343a1 1 0 0 0 0 1.414l.536.536L2.757 8H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535L8 17.243V18a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H18a1 1 0 0 0 1-1Z" />
                      <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </g>
                  </svg>
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className={cn(
                    "flex items-center p-2 rounded text-slate-300 font-bold tracking-wide text-lg hover:bg-slate-500 hover:text-white hover:bg-opacity-30 group",
                    pathname === "/login"
                      ? "text-white bg-slate-500 bg-opacity-30"
                      : "text-slate-300"
                  )}
                >
                  <svg
                    className={cn(
                      "w-5 h-5  text-slate-300 group-hover:text-white",
                      pathname === "/login" ? "text-white" : "text-slate-300"
                    )}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 15"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"
                    />
                  </svg>
                  <span className="ml-3">Log In</span>
                </Link>
              </li>
            </ul>
          </ul>
        </div>
      </aside>
    </>
  )
}

export default function Layout({ children }: any) {
  return (
    <div className="flex">
      <NavBar />
      <main className="flex-1 ml-52">{children}</main>
    </div>
  )
}
