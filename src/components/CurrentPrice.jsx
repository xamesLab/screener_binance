import React, { useEffect } from 'react'
import { useState } from 'react'
import { conf } from './conf';

export default function CurrentPrice({chartProps, stream }) {
    const [currentPosition, setCurrentPosition] = useState({})
    const [style, setStyle] = useState()

    useEffect(() => {
        const { min, ratio } = chartProps;
        const getPosition = (price) => {
            return ((price - min) * ratio + conf.PADDING) / 2
        };

        if (stream) {
            setCurrentPosition({
                c: getPosition(stream.k.c),
                o: getPosition(stream.k.o),
                h: getPosition(stream.k.h),
                l: getPosition(stream.k.l)
            })
        };
    }, [stream, chartProps]);

    useEffect(() => {
        if (currentPosition.c < currentPosition.o) {
            setStyle({
                backgroundColor: conf.colors.low,
                height: currentPosition.o-currentPosition.c,
                bottom: currentPosition.c,
            })
        } else if(currentPosition.c) {
            setStyle({
                backgroundColor: conf.colors.high,
                height: currentPosition.c - currentPosition.o,
                bottom: currentPosition.o,
            })
} 
    }, [currentPosition])
    
    return (
        <div className='current_price'>

            <div className="current_price__high" style={{
                position: 'absolute',
                right: '10px',
                borderRight: `2px solid ${conf.colors.high}` ,
                height: `${currentPosition.h-currentPosition.o}px`,
                bottom: `${currentPosition.o}px`
            }}></div>
            <div className="current_price__low" style={{
                position: 'absolute',
                right: '10px',
                borderRight: `2px solid ${conf.colors.low}` ,
                height: `${currentPosition.o - currentPosition.l}px`,
                bottom: `${currentPosition.l}px`
            }}></div>
            <div className="current_price__candle" style={style}></div>
            <div className='current_price__priceLine' style={{
                position: 'absolute',
                borderBottom: `1px solid ${style?style.backgroundColor:'#777'}`,
                width:'100%',
                left: '0',
                bottom: `${currentPosition.c}px`
            }}></div>
            
        </div>
    )
}
