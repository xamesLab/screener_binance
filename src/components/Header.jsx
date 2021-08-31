import React from "react"

const Header = ({setCount, countChart, setChartsType, chartsType}) => {
    // переключение типа графика
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
            <select value={countChart} onChange={(e) => {
                setCount(e.target.value)
            }}>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
            </select>
        </div>
    ) 
}

export default Header