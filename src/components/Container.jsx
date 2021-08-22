import { useEffect } from "react"
import { useState } from "react"
import Loading from "../UI/Loading"
import Chart from "./Chart"
import { getData } from "./getData"
import Header from "./Header"

const Container = () => {
    const initSet = [
        { id: 1, coin: 'BTC', limit: 100, tF: '15m' },
        { id: 2, coin: 'ADA', limit: 100, tF: '15m' }]
    const [settings, setSettings] = useState({})
    const [chartSeting, setChartSeting] = useState([])
    const [countChart, setCountChart] = useState(2)
    const [chartsType, setChartsType] = useState('LINE')
    const [data, setData] = useState([])

    useEffect(() => {
        // const currencyList = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP']
        // const list = []
        // for (let i = 0; i < countChart; i++){
        //     list.push({id:i+1, coin:currencyList[i], limit:100, tF:'15m'})
        // }
        setChartSeting(initSet)
    },[])

    // запрос к серверу и формирование списка данных (графиков)
    async function getNewData() {
        const list = []
        for(let i of chartSeting){
            const obj = await getData(i.coin, i.tF, i.limit)
            list.push({id:i.id, sbl:i.coin, timeFrame:i.tF, limit:i.limit, data:obj})
        }
        return list
    }

    // запрос новых данных при изменении настроек графика
    useEffect(() => {
        getNewData().then((l) => setData(l))
        console.log('req', data)
    }, [chartSeting])

    return (
        <div className="container">
            <Header setCount={setCountChart} setChartsType={setChartsType} chartsType={chartsType} />
            <div className="content">{data.length===0
                ? <Loading/>
                : data.map((v) =>
                    <Chart key={v.sbl} chart={v} settings={setSettings} chartsType={chartsType}/>
                )}
            </div>
        </div>
    ) 
}

export default Container