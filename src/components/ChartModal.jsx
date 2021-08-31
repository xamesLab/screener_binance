import React, { useState } from "react"

const ChartModal = ({ active, setActive, chartSet, setSettings }) => {
    const TF = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']
    const [selectCurrency, setSelectCurrency] = useState(chartSet.coin)
    const [selectTimeFrame, setSelectTimeFrame] = useState(chartSet.tF)
    const [inputValue, setInputValue] = useState(chartSet.limit)

    // закрытие модалки
    const closeModal = () => setActive(false)

    // установка таймфрейма
    const changeTimeFrame = (e) => setSelectTimeFrame(e.target.value)

    // установка валюты
    const changeCurrency = (e) => setSelectCurrency(e.target.value)

    // установка объема данных
    const changeLimit = (e) => {
        const num = +e.target.value
        if (!isNaN(num)&&num<=200) {
            setInputValue(num)
        }
    }

    // запрос данных по новым настройкам
    const requestData = () => {
        const set = {};
        set.id = chartSet.id
        set.limit = inputValue;
        set.tF = selectTimeFrame
        set.coin = selectCurrency
        setSettings(set)
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
                {/*TODO: рендер опций по массиву актуальных пар*/}
                <select
                    value={selectCurrency}
                    onChange={changeCurrency}>
                    <option disabled value="">coin</option>
                    <option value="ADA">ADA</option>
                    <option value="ETH">ETH</option>
                    <option value="LTC">LTC</option>
                    <option value="BTC">BTC</option>
                    <option value="DOT">DOT</option>
                    <option value="XRP">XRP</option>
                    <option value="YFII">YFII</option>
                    <option value="SRM">SRM</option>
                    <option value="LINK">LINK</option>
                    <option value="EOS">EOS</option>
                    <option value="YFI">YFI</option>
                </select>
                <button className='modal_chart__btn' onClick={requestData}>req</button>
            </div>
        </div>
    )
}

export default ChartModal