import { useEffect, useRef } from "react"
import { conf } from "./conf"
import { getData } from "./getData"
import { drawChart} from "./utils"

const Chart = () => {
    const ref = useRef()

    useEffect(() => {
        (async function drawChartOfData() {
        const data = await getData()
        drawChart(ref.current, data)
        })()
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