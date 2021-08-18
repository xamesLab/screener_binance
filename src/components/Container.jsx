import { useState } from "react"
import Chart from "./Chart"
import Header from "./Header"

const Container = () => {
    const chartList = ['BTC','ADA', 'ETH', 'LTC']
    return (
        <div className="container">
            <Header />
            <div className="content">{chartList.length===0
                ? <div>none</div>
                : chartList.map((v,i) =>
                    <Chart key={i} list={[v,i]}/>
                )}</div>
            
        </div>
    ) 
}

export default Container