import Link from "next/link"
import { useRouter } from "next/router"

function NavBar() {
  const router = useRouter()

  function goToPage(url: string) {
    router.push(url)
  }

  return (
    <>
      <div className="my-40 mx-1">
        <ul
          className="
            flex 
            list-none 
            flex-col 
            flex-wrap 
          "
          role="tablist"
          data-te-nav-ref>
          <li role="presentation" className="flex-grow text-center">
            <a
              className="
                cursor-pointer
                shadow-md
                my-2 
                block 
                rounded 
                px-7 
                pt-4 
                pb-3.5 
                text-xs 
                font-bold 
                uppercase 
                leading-tight 
                text-neutral-500 
                data-[te-nav-active]:!bg-blue-300 
                dark:bg-neutral-400 
                dark:text-white 
                dark:data-[te-nav-active]:text-white-700
              "
              id="pills-home-tab03"
              data-te-toggle="pill"
              data-te-target="#pills-home03"
              data-te-nav-active
              role="tab"
              aria-controls="pills-home03"
              aria-selected="true"
              onClick={() => goToPage("/")}
            >Home</a
            >
          </li>
          <li role="profile" className="flex-grow text-center">
            <a
              className="
                cursor-pointer
                shadow-md
                my-2 
                block 
                rounded 
                px-7 
                pt-4 
                pb-3.5 
                text-xs 
                font-bold 
                uppercase 
                leading-tight 
                text-neutral-500 
                data-[te-nav-active]:!bg-blue-300 
                dark:bg-neutral-400 
                dark:text-white 
                dark:data-[te-nav-active]:text-white-700
              "
              id="pills-profile-tab03"
              data-te-toggle="pill"
              data-te-target="#pills-profile03"
              role="tab"
              aria-controls="pills-profile03"
              aria-selected="false"
              onClick={() => goToPage("/login")}
            > Login</a
            >
          </li>
          <li role="contact" className="flex-grow text-center">
            <a
              className="
                cursor-pointer
                shadow-md
                my-2 
                block 
                rounded 
                px-7 
                pt-4 
                pb-3.5 
                text-xs 
                font-bold
                uppercase 
                nav-link
                leading-tight 
                text-neutral-500 
                data-[te-nav-active]:!bg-blue-300 
                dark:bg-neutral-400 
                dark:text-white 
                dark:data-[te-nav-active]:text-white-700
              "
              id="pills-contact-tab03"
              data-te-toggle="pill"
              data-te-target="#pills-contact03"
              role="tab"
              aria-controls="pills-contact03"
              aria-selected="false"
              onClick={() => goToPage("/activities")}
            >Activities</a
            >
          </li>
          <li role="profile" className="flex-grow text-center">
            <a
              className="
                cursor-pointer
                shadow-md
                my-2 
                block 
                rounded 
                px-7 
                pt-4 
                pb-3.5 
                text-xs 
                font-bold 
                uppercase 
                leading-tight 
                text-neutral-500 
                data-[te-nav-active]:!bg-blue-300 
                dark:bg-neutral-400 
                dark:text-white 
                dark:data-[te-nav-active]:text-white-700
              "
              id="pills-profile-tab03"
              data-te-toggle="pill"
              data-te-target="#pills-profile03"
              role="tab"
              aria-controls="pills-profile03"
              aria-selected="false"
              onClick={() => goToPage("/kom")}
            > KOM Hunt</a>
          </li>
          <li role="profile" className="flex-grow text-center">
            <a
              className="
                cursor-pointer
                shadow-md
                my-2 
                block 
                rounded 
                px-7 
                pt-4 
                pb-3.5 
                text-xs 
                font-bold 
                uppercase 
                leading-tight 
                text-neutral-500 
                data-[te-nav-active]:!bg-blue-300 
                dark:bg-neutral-400 
                dark:text-white 
                dark:data-[te-nav-active]:text-white-700
              "
              id="pills-profile-tab03"
              data-te-toggle="pill"
              data-te-target="#pills-profile03"
              role="tab"
              aria-controls="pills-profile03"
              aria-selected="false"
              onClick={() => goToPage("/stats")}
            > Stats</a>
          </li>
        </ul>
        <div className="my-2">
          <div
            className="hidden opacity-0 opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="pills-home03"
            role="tabpanel"
            aria-labelledby="pills-home-tab03"
            data-te-tab-active>
          </div>
          <div
            className="hidden opacity-0 opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="pills-profile03"
            role="tabpanel"
            aria-labelledby="pills-profile-tab03">
          </div>
          <div
            className="hidden opacity-0 opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="pills-contact03"
            role="tabpanel"
            aria-labelledby="pills-contact-tab03">
          </div>
        </div>
      </div>
    </>
  )
}

export default function Layout({ children }: any) {
  return (
    <>
      <div className="flex">

        <div className="flex items-baseline justify-center w-1/5">
          <NavBar />
        </div>

        {/* main content */}
        <div className="flex">
          <main>
            {children}
          </main>
        </div>

      </div>
    </>
  )
}
