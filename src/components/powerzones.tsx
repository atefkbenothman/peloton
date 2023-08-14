import React from "react"
import { useEffect } from "react"
// chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface SegmentEffort {
  name: string
  average_watts: number
  distance: number
  elapsed_time: number
  moving_time: number
  pr_rank: number
}

interface PowerZoneTotal {
  [key: string]: number
}

interface ZoneRange {
  zone: string
  name: string
  lower: number
  upper: number
}

const zoneRanges: ZoneRange[] = [
  {
    zone: "one",
    name: "Recovery",
    lower: 95,
    upper: 142
  },
  {
    zone: "two",
    name: "Endurance",
    lower: 143,
    upper: 194
  },
  {
    zone: "three",
    name: "Sweet Spot",
    lower: 195,
    upper: 225
  },
  {
    zone: "four",
    name: "Lactate",
    lower: 226,
    upper: 260
  },
  {
    zone: "five",
    name: "Vo2",
    lower: 270,
    upper: 355
  },
  {
    zone: "six",
    name: "Neuromuscular",
    lower: 356,
    upper: 999
  }
]

export default function PowerZones({
  segmentEfforts
}: {
  segmentEfforts: SegmentEffort[]
}) {
  const [powerZonesTotal, setPowerZonesTotal] = React.useState<PowerZoneTotal>({
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0
  })

  useEffect(() => {
    calculatePowerZonesTotal()
  }, [segmentEfforts])

  // calculate time spent in each power zone
  function calculatePowerZonesTotal() {
    let zones: PowerZoneTotal = {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      six: 0
    }
    for (const effort of segmentEfforts) {
      const avgWatts = effort.average_watts
      for (const zoneRange of zoneRanges) {
        if (avgWatts >= zoneRange.lower && avgWatts <= zoneRange.upper) {
          zones[zoneRange.zone] += Math.floor(effort.moving_time / 60)
        }
      }
    }
    setPowerZonesTotal(zones)
  }

  const barData = {
    labels: zoneRanges.map((zone) => zone.name),
    datasets: [
      {
        label: "Time Spent in Zone",
        data: Object.values(powerZonesTotal),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: "minutes"
        }
      }
    }
  }

  return (
    <div
      style={{ width: "99%" }}
      className="flex justify-center items-center"
    >
      <Bar
        data={barData}
        options={barOptions}
      />
    </div>
  )
}
