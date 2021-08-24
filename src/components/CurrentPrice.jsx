import React, { useEffect, useState } from 'react'



export default function CurrentPrice({socket}) {
    const [data, setData] = useState()
    let [test, setTest] = useState(1)

    useEffect(() => {
        console.log(socket, 'data', test)
    }, [socket])

    
    return (
        <div className='current_price'>
            {socket} {test}
            <button onClick={()=>{}}>test</button>
            <div className='priceLine' style={{
                    position: 'absolute',
                    width:'100%',
                    borderBottom: "1px dashed green",
                    left: '0',
                    bottom:`50px`
                }}></div>
            
        </div>
    )
}
