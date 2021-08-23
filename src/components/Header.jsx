import React from "react"
import { useState } from "react"

const Header = ({setCount, setChartsType, chartsType}) => {
    const [value, setValue] = useState(2)
    

    const chartLine = () => {
        if (chartsType === 'CANDLE') {
            setChartsType('LINE')
        }
    }

    const chartCandles = () => {
        if (chartsType === 'LINE') {
            setChartsType('CANDLE')
        }
    }

    return (
        <div className="header">
            <div className="header__toggle_charts">
                <button onClick={chartLine} className={`header__toggle_btn ${chartsType==='LINE'?'active':''}`}>line</button>
                <button onClick={chartCandles} className={`header__toggle_btn ${chartsType==='CANDLE'?'active':''}`}>candles</button>
            </div>
            <p className="header__label">count of chart:</p>
            <select value={value} onChange={(e) => {
                setValue(e.target.value)
                setCount(e.target.value)
            }}>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
            </select>
        </div>
    ) 
}

export default Header