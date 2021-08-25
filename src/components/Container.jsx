import { useEffect } from "react"
import { useState } from "react"
import Chart from "./Chart"
import Header from "./Header"

//'wss://fstream.binance.com/stream?streams=adausdt@kline_30m/btcusdt@kline_30m'
//const socket = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_30m')

const Container = () => {
    const [chartSeting, setChartSeting] = useState([])
    const [settings, setSettings] = useState()
    const [countChart, setCountChart] = useState(2)
    const [chartsType, setChartsType] = useState('LINE')
    const [socketData, setSocketData] = useState()
    const [wsString, setString] = useState()
    const [ws, setSocket] = useState()

    useEffect(() => {
        if (chartSeting.length !== 0) {
            console.log('setStr');
            setString(chartSeting.reduce((str, settingObj) => {
                return str + `${settingObj.coin.toLowerCase()}usdt@kline_${settingObj.tF}/`;
            }, ''));
        }
    }, [chartSeting]);

    useEffect(() => {
        if (wsString) {
            console.log('socket')
            const socket = new WebSocket(`wss://fstream.binance.com/stream?streams=${wsString.slice(0, wsString.length - 1)}`)
            
            socket.onopen = function () {
                if (ws) ws.close()
                setSocket(socket)
            }
            socket.onmessage = async function (event) {
                let d = await JSON.parse(event.data)
                //console.log(d)
                setSocketData(d)
            }
            socket.onclose = function () {
                console.log('close')
            }
        }
    }, [wsString])

    // первичная инициализация (временно)
    // зависимость количества графиков на странице от селектора
    useEffect(() => {
        const initCurrency = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP'];
        const initSet = { limit: 60, tF: '5m' };
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