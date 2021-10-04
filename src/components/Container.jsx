import { useEffect } from "react"
import { useState } from "react"
import Chart from "./Chart"
import Header from "./Header"

const Container = () => {
    const [chartSeting, setChartSeting] = useState([])
    const [settings, setSettings] = useState()
    const [countChart, setCountChart] = useState(6)
    const [socketData, setSocketData] = useState()
    const [wsString, setString] = useState()
    const [, setSocket] = useState()

    useEffect(() => {
        if (chartSeting.length !== 0) {
            setString(chartSeting.reduce((str, settingObj) => {
                return str + `${settingObj.coin.toLowerCase()}usdt@kline_${settingObj.tF}/`;
            }, ''));
        }
    }, [chartSeting]);

    useEffect(() => {
        if (wsString) {
            console.log('run socket')
            const socket = new WebSocket(`wss://fstream.binance.com/stream?streams=${wsString.slice(0, wsString.length - 1)}`)

            socket.onopen = function () {
                setSocket((prevS) => {
                    if (prevS) prevS.close()
                    return socket
                })
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

    // зависимость количества графиков на странице от селектора
    useEffect(() => {
        // первичная инициализация (временно)
        const initCurrency = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP', 'YFII','SRM','LINK','EOS','YFI'];
        const initSet = { limit: 70, tF: '5m' };
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
            <Header setCount={setCountChart} countChart={countChart}/>
            <div className="content">
                {chartSeting.map((v) =>
                    <Chart socket={socketData} key={v.id} chartSet={v} setSettings={setSettings} />
                )}
            </div>
        </div>
    )
}

export default Container