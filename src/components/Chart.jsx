import { useEffect, useRef } from "react"
import { getData } from "./getData"
import { drawChart, drawOverlay } from "./utils"
import SettingsIcon from '@material-ui/icons/Settings';
import { conf } from "./conf";
import { useState } from "react";
import ChartModal from "./ChartModal";

const Chart = ({ list }) => {
    let [currency, setCurrency] = useState(list[0])
    const [limit, setLimit] = useState(100)
    const [activeChartModal, setactiveChartModal] = useState(false)
    const [data, setData] = useState({})
    const ref = useRef()
    const refY = useRef()
    const refX = useRef()
    const refOver = useRef()

    async function drawChartOfData() {
        const obj =(await getData(currency, limit));
        setData(obj)
        console.log(obj.columns.low[0], currency)
    }

    useEffect(() => {
        drawChartOfData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        if (data.columns?.low) {
            drawChart(ref.current, refY.current, refX.current, data);
            drawOverlay(refOver.current)
        }
    },[data])

    return (
        <div className="chart">
            <ChartModal
                setActive={setactiveChartModal}
                active={activeChartModal}
                setCurrency={setCurrency}
                setLimit={setLimit}
                reqData={ drawChartOfData }/>
            <div className="chart__label">{ currency }</div>
            <div style={{position:'relative',width:`${conf.WIDTH}`,height:`${conf.HEIGHT}`}}>
                {data.columns?.low
                    ?< canvas
                    className='chart__field'
                        ref={ref} />
                    :''}
                <canvas
                    className='chart__field_overlay'
                    ref={refOver}/>
            </div>
            
            <canvas
                className='chart__axis_y'
                ref={refY}></canvas>
            <canvas
                className='chart__axis_x'
                ref={refX}></canvas>
            <div className="chart__set" onClick={setactiveChartModal}>
                <SettingsIcon style={{ fontSize: '20px' }} />
            </div>
        </div>
    )
}

export default Chart