import React from "react"
import {useDispatch, useSelector} from 'react-redux'
import { setLine, setCandle, widthMore, widthLess, heightMore, heightLess, colorsInv } from "../redux/actions"

const Header = ({ setCount, countChart }) => {
    // переключение типа графика
    const dispatch = useDispatch()
    const chartsType = useSelector(state=>state.typeChart)
    
    // TODO: вынести кнопки в отдельные компоненты, скрывать header, адаптивность
    return (
        <div className="header">
            <div className="header__logo">
                <p className="logo">ScreenLine</p>
                <p className="logo__label">beta</p>
            </div>
            <div className="pass" style={{width:'10rem'}}><button onClick={()=>{dispatch(colorsInv())}}> invert </button></div>
            <div className="header__resize">
            <p className="header__label">sizing:</p>
                <button className='header__resize_btn' onClick={() => { dispatch(widthMore()) }}> W + </button>
                <button className='header__resize_btn' onClick={()=>{dispatch(widthLess())}}> W - </button>
                <button className='header__resize_btn' onClick={() => { dispatch(heightMore()) }}> H + </button>
                <button className='header__resize_btn' onClick={()=>{dispatch(heightLess())}}> H - </button>
            </div>
            <div className="header__toggle_charts">
            <p className="header__label">charts type:</p>
                <button onClick={()=>{dispatch(setLine())}} className={`header__toggle_btn ${chartsType==='LINE'?'active':''}`}>line</button>
                <button onClick={()=>{dispatch(setCandle())}} className={`header__toggle_btn ${chartsType==='CANDLE'?'active':''}`}>candles</button>
            </div>
            <div className="header__count">
            <p className="header__label">count of chart:</p>
            <select value={countChart} onChange={(e) => {
                setCount(e.target.value)
            }}>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
            </select></div>
        </div>
    ) 
}

export default Header