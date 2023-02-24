import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL || "")

const fetch = async (key: string, fetcher: any, expires: number) => {
  const existing = await get(key)
  if (existing !== null) {
    console.log("retrieving activities data from upstash/redis")
    return existing
  }
  console.log("calling strava api")
  return set(key, fetcher, expires)
}

const get = async (key: string) => {
  const value = await redis.get(key)
  if (value === null) {
    return null
  }
  return JSON.parse(value)
}

const set = async (key: string, fetcher: any, expires: number) => {
  const value = await fetcher()
  await redis.set(key, JSON.stringify(value), "EX", expires)
  return value
}

export default { fetch, set }
