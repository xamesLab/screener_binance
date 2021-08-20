import { useEffect } from "react"
import { useState } from "react"
import Chart from "./Chart"
import { getData } from "./getData"
import Header from "./Header"

const Container = () => {
    let [currency, setCurrency] = useState('BTC')
    const [limit, setLimit] = useState(3)
    const [timeFrame, setTimeFrame] = useState('5m')
    const [countChart, setCountChart] = useState(5)
    const [chartsType, setChartsType] = useState('LINE')
    const [data, setData] = useState([])
    const currencytList = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP']
    const chartList = []

    async function getNewData() {
        let list = []
        for (let i = 0; i < countChart; i++){
            const obj = (await getData(currency, timeFrame, limit));
            list.push(obj)
        }
        return list
    }

    useEffect(() => {
        getNewData().then((l) => setData(l))
    }, [])

    return (
        <div className="container">
            <Header setCount={setCountChart} setChartsType={setChartsType} chartsType={chartsType} />
            <div className="content">
                {data.map((v,i) =>
                    <div key={i}>test</div>)}
            </div>
            {/* <div className="content">{chartList.length===0
                ? <div>none</div>
                : chartList.map((v,i) =>
                    <Chart key={i} list={[v, i]}/>
                )}</div> */}
            
        </div>
    ) 
}

export default Container