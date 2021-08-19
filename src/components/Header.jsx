import React from "react"
import { useState } from "react"

const Header = ({setCount}) => {
    const [value, setValue] = useState(2)
    return (
        <div className="header">
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