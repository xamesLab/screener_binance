import { useEffect, useRef } from "react"
import { canvasInit, drawChart, drawOverlay, updateData } from "./utils"
import SettingsIcon from '@material-ui/icons/Settings';
import { useState } from "react";
import ChartModal from "./ChartModal";
import { getData } from "./getData";
import Loading from '../UI/Loading'
import CurrentPrice from "./CurrentPrice";

const Chart = ({ socket, chartSet, chartsType, setSettings }) => {
    const [activeChartModal, setactiveChartModal] = useState(false)
    const [ctxArr, setCtxArr] = useState([])
    const [data, setData] = useState()
    const [stream, setStream] = useState()
    const [chartProps, setChartProps] = useState({})
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
        const { id, coin, tF, limit } = chartSet;
        if (!data || data.settings.coin !== coin || data.settings.tF !== tF || data.settings.limit !== limit) {
            console.log('req', id);
            getData(coin, tF, limit).then((d) => { setData(d) });
        };
    }, [chartSet, data]);
    
    // прием данных из стрима для текущей валюты
    useEffect(() => {
        const { coin, tF } = chartSet;
        if (socket && socket.stream === `${coin.toLowerCase()}usdt@kline_${tF}`) {
            setStream(socket.data);
            if (socket.data.k.x) {
                const newData = {
                    times: socket.data.E,
                    low: +socket.data.k.l,
                    high: +socket.data.k.h,
                    open: +socket.data.k.o,
                    close: +socket.data.k.c
                };
                setData((prev) => {
                    let temp = updateData(prev, newData)
                    console.log('update')
                    return temp
                })
            };
        }
    }, [socket, chartSet]);

    // отрисовка графика и получение его параметров
    useEffect(() => {
        if (data) {
            console.log('draw')
            setChartProps(drawChart(ctxArr, data, chartsType))
        }
    },[data, ctxArr, chartsType])

    return (
        <div className="chart">
            {!data?<div className="chart__load"><Loading/></div>:''}
            <div className="chart__label">{chartSet.coin}/USDT {chartSet.tF}</div>
            <CurrentPrice chartProps={chartProps} stream={stream}/>
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