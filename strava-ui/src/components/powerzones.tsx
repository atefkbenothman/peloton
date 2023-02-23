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
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const zoneRanges = [
  {
    zone: "one",
    lower: 95,
    upper: 142
  },
  {
    zone: "two",
    lower: 143,
    upper: 194
  },
  {
    zone: "three",
    lower: 195,
    upper: 225
  },
  {
    zone: "four",
    lower: 226,
    upper: 260
  },
  {
    zone: "five",
    lower: 270,
    upper: 355
  },
  {
    zone: "six",
    lower: 356,
    upper: 999
  },
]

export default function PowerZones({ segmentEfforts }) {
  const [powerZonesTotal, setPowerZonesTotal] = React.useState({
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

  function calculatePowerZonesTotal() {
    let zones = {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      six: 0
    }
    for (let i = 0; i < (segmentEfforts || []).length; i++) {
      let avgWatts = segmentEfforts[i].average_watts
      let time = segmentEfforts[i].moving_time
      for (let j = 0; j < zoneRanges.length; j++) {
        let zone = zoneRanges[j].zone
        let lowerLimit = zoneRanges[j].lower
        let upperLimit = zoneRanges[j].upper
        if (avgWatts >= lowerLimit && avgWatts <= upperLimit) {
          zones[zone] += time / 60
        }
      }
    }
    setPowerZonesTotal(zones)
  }

  const labels = ["1: Recovery (95 - 142)", "2: Endurance (143 - 194)", "3: Sweet Spot (195 - 225)", "4: Lactate (226 - 260)", "5: VO2 (270 - 355)", "6: Neuromuscular (356+)"];
  const barData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: Object.values(powerZonesTotal),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  return (
    <div>
      <Bar data={barData} />
    </div>
  )
}