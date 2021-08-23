import { useEffect, useRef } from "react"
import { canvasInit, drawChart, drawOverlay } from "./utils"
import SettingsIcon from '@material-ui/icons/Settings';
import { useState } from "react";
import ChartModal from "./ChartModal";
import { getData } from "./getData";

const Chart = ({ chartSet, chartsType, setSettings }) => {
    const [activeChartModal, setactiveChartModal] = useState(false)
    const [ctxArr, setCtxArr] = useState([])
    const [data, setData] = useState()
    const [currentSettings, setCurrentSettings] = useState()
    const ref = useRef()
    const refY = useRef()
    const refX = useRef()
    const refOver = useRef()

    // инициализация канваса
    useEffect(() => {
        setCtxArr(canvasInit(ref.current, refY.current, refX.current))
        drawOverlay(refOver.current)
    }, [])

    //получение данных
    useEffect(() => {
        if (!data || currentSettings.coin !== chartSet.coin || currentSettings.tF !== chartSet.tF || currentSettings.limit !== chartSet.limit) {
            console.log('req', chartSet.id)
            getData(chartSet.coin, chartSet.tF, chartSet.limit).then((d) => {
                setData([chartSet.id, d]);
                setCurrentSettings(chartSet);
            });
        };
    },[chartSet])

    // отрисовка графика

    useEffect(() => {
        if (data) {
            drawChart(ctxArr, data[1], chartsType)
        }
    },[data, ctxArr, chartsType])

    return (
        <div className="chart">
            <div className="chart__label">{chartSet.coin}/USDT {chartSet.tF} {chartSet.id}</div>
            <ChartModal
                setActive={setactiveChartModal}
                active={activeChartModal}
                chartSet={chartSet}
                setSettings={setSettings}/>
            <canvas className='chart__field' ref={ref} />
            <canvas className='chart__field_overlay' ref={refOver}/>
            <canvas className='chart__axis_y' ref={refY}/>
            <canvas className='chart__axis_x' ref={refX}/>
            <div className="chart__set" onClick={setactiveChartModal}>
                <SettingsIcon style={{ fontSize: '20px' }} />
            </div>
        </div>
    )
}

export default Chart