import { useState } from "react"
import Chart from "./Chart"
import Header from "./Header"

const Container = () => {
    const [countChart, setCountChart] = useState(2)
    const currencytList = ['BTC', 'ADA', 'ETH', 'LTC', 'DOT', 'XRP']
    const chartList =[]
    
    for (let i = 0; i < countChart; i++){
        chartList.push(currencytList[i])
    }
    return (
        <div className="container">
            <Header setCount={ setCountChart } />
            <div className="content">{chartList.length===0
                ? <div>none</div>
                : chartList.map((v,i) =>
                    <Chart key={i} list={[v,i]}/>
                )}</div>
            
        </div>
    ) 
}

export default Container