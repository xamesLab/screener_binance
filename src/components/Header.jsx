import React from "react"
import { useState } from "react"

const Header = ({setCount, setChartsType, chartsType}) => {
    const [value, setValue] = useState(2)
    

    const chartLine = () => {
        if (chartsType === 'BARS') {
            setChartsType('LINE')
        }
    }

    const chartBars = () => {
        if (chartsType === 'LINE') {
            setChartsType('BARS')
        }
    }

    return (
        <div className="header">
            <div className="header__toggle_charts">
                <button onClick={chartLine} className={`header__toggle_btn ${chartsType==='LINE'?'active':''}`}>line</button>
                <button onClick={chartBars} className={`header__toggle_btn ${chartsType==='BARS'?'active':''}`}>bars</button>
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