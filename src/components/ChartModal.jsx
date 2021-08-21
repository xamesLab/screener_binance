import React, { useState } from "react"

const ChartModal = ({ active, setActive, setCurrency, setSettings, setTimeFrame }) => {
    const TF = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']
    const [selectCurrency, setSelectCurrency] = useState('')
    const [selectTimeFrame, setSelectTimeFrame] = useState('')
    const [inputValue, setInputValue] = useState('')

    // закрытие модалки
    const closeModal = () => {
        setActive(false)
    }

    // установка объема данных
    const changeLimit = (e) => {
        const num = +e.target.value
        if (!isNaN(num)&&num<=200) {
            setInputValue(num)
        }
    }

    // установка таймфрейма
    const changeTimeFrame = (e) => {
        setSelectTimeFrame(e.target.value)
        setTimeFrame(e.target.value)
    }

    // установка валюты
    const changeCurrency = (e) => {
        setSelectCurrency(e.target.value)
        setCurrency(e.target.value)
    }

    // запрос данных по новым настройкам
    const requestData = () => {
        const set = {};
        if (inputValue !== '') {
            set.limit = inputValue;
            setSettings(set)
        };
        closeModal();
    }
    
    return (
        <div onClick={closeModal} className="modal_chart" style={{ display: `${active ? 'flex' : 'none'}` }}>
            <div onClick={(e) => e.stopPropagation()} className="modal_chart__content">
                <input placeholder={'amount of data (<200)'} className='modal_chart__input' value={inputValue} onChange={changeLimit} />
                <select
                    value={selectTimeFrame}
                    onChange={changeTimeFrame}>
                    <option disabled value="">TF</option>
                    {TF.map(i => <option key={i} value={`${i}`}>{ i }</option>)}
                </select>
                <select
                    value={selectCurrency}
                    onChange={changeCurrency}>
                    <option disabled value="">coin</option>
                    <option value="ADA">ADA</option>
                    <option value="ETH">ETH</option>
                    <option value="LTC">LTC</option>
                    <option value="BTC">BTC</option>
                </select>
                <button className='modal_chart__btn' onClick={requestData}>req</button>
            </div>
        </div>
    )
}

export default ChartModal