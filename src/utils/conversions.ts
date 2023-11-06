export function metersConversion(meters: number, unit: string): number {
  if (unit === "kilometer") {
    return meters * 0.001
  }
  if (unit === "mile") {
    return meters * 0.000621371
  }
  if (unit === "feet") {
    return meters * 3.28084
  }
  return meters
}

export function secondsConversion(
  seconds: number,
  format: string = "short"
): string {
  const hours = seconds / 3600
  const mins = (seconds % 3500) / 60
  if (format === "long") {
    return `${hours.toFixed(0)} h ${mins.toFixed(0)} m`
  }
  return `${hours.toFixed(0)}:${mins.toFixed(0)}`
}

export function speedConversion(speed: number, unit: string = "mph"): number {
  if (unit === "mph") {
    return speed * 2.23694
  }
  return speed
}
