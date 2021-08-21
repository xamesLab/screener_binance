import { useEffect } from "react"
import { useState } from "react"
import Chart from "./Chart"
import { getData } from "./getData"
import Header from "./Header"

const Container = () => {
    let [currency, setCurrency] = useState('BTC')
    const [settings, setSettings] = useState({limit:3})
    const [timeFrame, setTimeFrame] = useState('5m')
    const [countChart, setCountChart] = useState(2)
    const [chartsType, setChartsType] = useState('LINE')
    const [data, setData] = useState([])
    const currencyList = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP']
    const chartList = []

    // запрос к серверу и формирование списка данных (графиков)
    async function getNewData() {
        const list = []
        for (let i = 0; i < countChart; i++){
            const obj = (await getData(currencyList[i], timeFrame, settings.limit));
            list.push({sbl:currencyList[i], data:obj})
        }
        return list
    }

    // запрос новых данных при изменении настроек графика
    useEffect(() => {
        getNewData().then((l) => setData(l))
    }, [settings])
    
    // useEffect(() => {
    //     console.log(data, 'data')
    // },[data])

    return (
        <div className="container">
            <Header setCount={setCountChart} setChartsType={setChartsType} chartsType={chartsType} />
            <div className="content">{data.length===0
                ? <div>none</div>
                : data.map((v,i) =>
                    <Chart key={i} chart={v} settings={setSettings}/>
                )}
            </div>
        </div>
    ) 
}

export default Container