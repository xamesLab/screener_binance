import { useEffect, useRef } from "react"
import { getData } from "./getData"
import { drawChart, drawOverlay } from "./utils"
import SettingsIcon from '@material-ui/icons/Settings';

const Chart = () => {
    const ref = useRef()
    const refY = useRef()
    const refX = useRef()
    const refOver = useRef()

    useEffect(() => {
        (async function drawChartOfData() {
            const data = await getData();
            drawChart(ref.current, refY.current, refX.current, data);
            drawOverlay(refOver.current)
        
        })()
    }, [])
    
    return (
        <div className="chart">
            <div style={{position:'relative'}}>
                <canvas
                className='chart__field'
                ref={ref}>
                    </canvas>
                <canvas
                    className='chart__field_overlay'
                    ref={refOver}>
                    </canvas>
            </div>
            
            <canvas
                className='chart__axis_y'
                ref={refY}></canvas>
            <canvas
                className='chart__axis_x'
                ref={refX}></canvas>
            <div className="chart__set">
                <SettingsIcon style={{fontSize:'20px'}}/>
            </div>
        </div>
    )
}

export default Chart