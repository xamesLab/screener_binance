import React, { useEffect } from 'react'
import { useState } from 'react'
import { conf } from './conf';

export default function CurrentPrice({chartProps, stream }) {
    const [currentPrice, setCurrentPrice] = useState(0)
    const [currentPosition, setCurrentPosition] = useState(0)

    useEffect(() => {
        if (stream) {
            let last = stream.k.c;
            setCurrentPrice(last);
            setCurrentPosition(() => {
                return ((last - chartProps.min) * chartProps.ratio + conf.PADDING)/2;
            })
        };
    }, [stream]);

    useEffect(() => {
        console.log(chartProps)
    }, [chartProps])
    
    return (
        <div className='current_price'>
            {currentPrice}
            <div className='current_price__priceLine' style={{
                    position: 'absolute',
                    width:'100%',
                    left: '0',
                    bottom: `${currentPosition}px`
                }}></div>
            
        </div>
    )
}
