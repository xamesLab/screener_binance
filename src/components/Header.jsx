import React from "react"
import {useDispatch, useSelector} from 'react-redux'
import { setLine, setCandle, sizeUP, sizeDOWN } from "../redux/actions"

const Header = ({ setCount, countChart }) => {
    // переключение типа графика
    const dispatch = useDispatch()
    const chartsType = useSelector(state=>state.typeChart)
    
    return (
        <div className="header">
            <button onClick={() => { dispatch(sizeUP()) }}> sizing + </button>
            <button onClick={()=>{dispatch(sizeDOWN())}}> sizing - </button>
            <div className="header__toggle_charts">
                <button onClick={()=>{dispatch(setLine())}} className={`header__toggle_btn ${chartsType==='LINE'?'active':''}`}>line</button>
                <button onClick={()=>{dispatch(setCandle())}} className={`header__toggle_btn ${chartsType==='CANDLE'?'active':''}`}>candles</button>
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