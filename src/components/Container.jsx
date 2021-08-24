import { useEffect } from "react"
import { useState } from "react"
import Chart from "./Chart"
import Header from "./Header"

const Container = () => {
    const [chartSeting, setChartSeting] = useState([])
    const [settings, setSettings] = useState()
    const [countChart, setCountChart] = useState(2)
    const [chartsType, setChartsType] = useState('LINE')
    const [socketData, setSocketData] = useState()

    useEffect(() => {
        const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_30m')
    socket.onopen = function (){
        console.log('connect')
    }
    socket.onmessage = async function (event) {
        let d = await JSON.parse(event.data)
        let preData = d.k.c
        setSocketData(preData)
    }
    socket.onclose = function (){
        console.log('close')
    }
    function closeWs (){
        socket.close()
    }
    },[])

    // первичная инициализация (временно)
    // зависимость количества графиков на странице от селектора
    useEffect(() => {
        const initCurrency = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP'];
        const initSet = { limit: 10, tF: '15m' };
        const set = [];
        
        for (let i = 1; i <= countChart; i++) {
            set.push({ id: i, coin: initCurrency[i - 1], limit: initSet.limit, tF: initSet.tF })
        };
        setChartSeting(set);
    }, [countChart]);
    
    // синхронизация с новыми настройками графика
    useEffect(() => {
        if (settings) {
            setChartSeting((prev) => {
                return prev.map((i) => settings.id === i.id ? settings : i);
            });
        };
    }, [settings])

    return (
        <div className="container">
            <Header setCount={setCountChart} setChartsType={setChartsType} chartsType={chartsType} />
            <div className="content">
                {chartSeting.map((v) =>
                    <Chart socket={socketData} key={v.id} chartSet={v} chartsType={chartsType} setSettings={setSettings}/>
                )}
            </div>
        </div>
    ) 
}

export default Container