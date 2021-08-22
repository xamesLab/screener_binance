import { useEffect, useRef } from "react"
import { drawChart, drawOverlay } from "./utils"
import SettingsIcon from '@material-ui/icons/Settings';
import { conf } from "./conf";
import { useState } from "react";
import ChartModal from "./ChartModal";

const Chart = ({chart, settings, chartsType}) => {
    const [activeChartModal, setactiveChartModal] = useState(false)
    const ref = useRef()
    const refY = useRef()
    const refX = useRef()
    const refOver = useRef()

    // отрисовка графика
    useEffect(() => {
        drawChart(ref.current, refY.current, refX.current, chart.data, chartsType);
        drawOverlay(refOver.current);
    }, [chart]);

    return (
        <div className="chart">
            <ChartModal
                setActive={setactiveChartModal}
                active={activeChartModal}
                setSettings={settings}
                chart={chart}/>
            <div className="chart__label">{chart.sbl}/USDT {chart.timeFrame} {chart.id}</div>
            <div style={{position:'relative',width:`${conf.WIDTH}`,height:`${conf.HEIGHT}`}}>
                {chart.data.columns?.low
                    ? <canvas className='chart__field' ref={ref} />
                    : ''}
                <canvas className='chart__field_overlay' ref={refOver}/>
            </div>
            
            <canvas className='chart__axis_y' ref={refY}/>
            <canvas className='chart__axis_x' ref={refX}/>
            <div className="chart__set" onClick={setactiveChartModal}>
                <SettingsIcon style={{ fontSize: '20px' }} />
            </div>
        </div>
    )
}

export default Chart