import { useEffect } from "react"
import { useState } from "react"
import Chart from "./Chart"
import Header from "./Header"

const Container = () => {
    const [chartSeting, setChartSeting] = useState([])
    const [settings, setSettings] = useState()
    const [countChart, setCountChart] = useState(2)
    const [chartsType, setChartsType] = useState('LINE')

    useEffect(() => {
        const initCurrency = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP'];
        const initSet = { limit: 50, tF: '15m' };
        const set = [];
        
        for (let i = 1; i <= countChart; i++) {
            set.push({ id: i, coin: initCurrency[i - 1], limit: initSet.limit, tF: initSet.tF })
        };
        setChartSeting(set);
    }, [countChart]);
    
    useEffect(() => {
        if (settings) {
            setChartSeting((prev) => {
                return prev.map((i) => {
                    if (settings.id === i.id) {
                        return settings
                    } else {
                        return i
                    };
                });
            });
            console.log(settings)
        };
    }, [settings])

    return (
        <div className="container">
            <Header setCount={setCountChart} setChartsType={setChartsType} chartsType={chartsType} />
            <div className="content">
                {chartSeting.map((v) =>
                    <Chart key={v.id} chartSet={v} chartsType={chartsType} setSettings={setSettings}/>
                )}
            </div>
        </div>
    ) 
}

export default Container