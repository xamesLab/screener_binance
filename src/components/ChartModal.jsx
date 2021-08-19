import React, { useState } from "react"

const ChartModal = ({ active, setActive, setCurrency, setLimit, reqData }) => {
    const [selectValue, setSelectValue] = useState('')
    const [inputValue, setInputValue] = useState('')

    const closeModal = () => {
        setActive(false)
    }

    const changeLimit = (e) => {
        const num = +e.target.value
        if (!isNaN(num)&&num<=200) {
            setInputValue(num)
            setLimit(num)
        }
    }

    const changeCurrency = (e) => {
        setSelectValue(e.target.value)
        setCurrency(e.target.value)
    }

    const requestData = () => {
        reqData()
        closeModal()
    }
    
    return (
        <div onClick={closeModal} className="modal_chart" style={{ display: `${active ? 'flex' : 'none'}` }}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="modal_chart__content">
                <input placeholder={'amount of data (<200)'} className='modal_chart__input' value={inputValue} onChange={changeLimit} />
                <select
                    value={selectValue}
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