import Link from "next/link"
import { useRouter } from "next/router"

function NavBar() {
  const router = useRouter()

  function goToPage(url: string) {
    router.push(url)
  }

  return (
    <>
      <div className="w-1/5 ml-1 mx-1 my-36">
        <div className="flex justify-center">
          <ul className="nav nav-pills flex flex-col flex-wrap list-none pl-0" id="pills-tabVertical" role="tablist">
            <li className="nav-item flex-grow text-center mb-2 shadow" role="presentation">
              <a href="/"
                className="
                  nav-link
                  block
                  font-bold
                  text-xs
                  leading-tight
                  uppercase
                  rounded
                  px-6
                  py-3
                  focus:outline-none focus:ring-0
                  active
                "
                id="pills-home-tabVertical" data-bs-toggle="pill" data-bs-target="#pills-homeVertical" role="tab"
                aria-controls="pills-homeVertical" aria-selected="true" onClick={() => goToPage("/")}>Home</a>
            </li>
            <li className="nav-item flex-grow text-center my-2 shadow" role="presentation">
              <a href="/login" className="
                  nav-link
                  block
                  font-bold
                  text-xs
                  leading-tight
                  uppercase
                  rounded
                  px-6
                  py-3
                  focus:outline-none focus:ring-0
                " id="pills-profile-tabVertical" data-bs-toggle="pill" data-bs-target="#pills-profileVertical" role="tab"
                aria-controls="pills-profileVertical" aria-selected="false" onClick={() => goToPage("/login")}>Login</a>
            </li>
            <li className="nav-item flex-grow text-center my-2 shadow" role="presentation">
              <a href="/profile" className="
                  nav-link
                  block
                  font-bold
                  text-xs
                  leading-tight
                  uppercase
                  rounded
                  px-6
                  py-3
                  focus:outline-none focus:ring-0
                " id="pills-profile-tabVertical" data-bs-toggle="pill" data-bs-target="#pills-profileVertical" role="tab"
                aria-controls="pills-profileVertical" aria-selected="false" onClick={() => goToPage("/profile")}>Profile</a>
            </li>
            <li className="nav-item flex-grow text-center my-2 shadow" role="presentation">
              <a href="/activities" className="
                  nav-link
                  block
                  font-bold
                  text-xs
                  leading-tight
                  uppercase
                  rounded
                  px-6
                  py-3
                  focus:outline-none focus:ring-0
                " id="pills-contact-tabVertical" data-bs-toggle="pill" data-bs-target="#pills-contactVertical" role="tab"
                aria-controls="pills-contactVertical" aria-selected="false" onClick={() => goToPage("/activities")}>Activities</a>
            </li>
            <li className="nav-item flex-grow text-center my-2 shadow" role="presentation">
              <a href="/map" className="
                  nav-link
                  block
                  font-bold
                  text-xs
                  leading-tight
                  uppercase
                  rounded
                  px-6
                  py-3
                  focus:outline-none focus:ring-0
                " id="pills-contact-tabVertical" data-bs-toggle="pill" data-bs-target="#pills-contactVertical" role="tab"
                aria-controls="pills-contactVertical" aria-selected="false" onClick={() => goToPage("/map")}>Map</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default function Layout({ children }: any) {
  return (
    <>
      <div className="flex w-full">
        <div className="w-1/5 flex justify-center p-1">
          <NavBar />
        </div>
        <div className="justify-center">
          <div>
            <main>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}