import { useEffect, useRef } from "react"
import { conf } from "./conf"
import { drawChart } from "./utils"

const Chart = () => {
    const ref = useRef()

    useEffect(() => {
        drawChart(ref.current, [
            [0,0],
            [200,630],
            [400, 60],
            [600, 300],
            [800, 200],
            [1000,240]
        ])
    }, [])
    
    return (
        <div className="chart">
            <canvas
                style={{width: `${conf.DPI_WIDTH}px`, height: `${conf.DPI_HEIGHT}px`}}
                ref={ref} id="field"></canvas>
        </div>
    )
}

export default Chart