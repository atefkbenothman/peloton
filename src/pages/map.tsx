import { useRouter } from "next/router"

export default function Map() {
  const router = useRouter()

  function toLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    router.push("/login")
  }

  return (
    <>
      <div className="h-screen mx-6 my-6">
        <div className="">
          <div>
            <h1 className="text-3xl font-bold">
              Map
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}
