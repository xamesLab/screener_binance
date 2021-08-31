import React, { useEffect } from 'react'
import { useState } from 'react'
import { conf } from './conf';

export default function CurrentPrice({chartProps, stream }) {
    const [currentPosition, setCurrentPosition] = useState({})
    const [style, setStyle] = useState()
    const [stylePL, setStylePL] = useState()

    // конвертация цены в позицию на графике (в пикселях)
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

    // определение стиля падающей и растущей цены
    useEffect(() => {
        if (currentPosition.c < currentPosition.o) {
            setStyle({
                border: `1px solid ${conf.colors.low}`,
                height: currentPosition.o-currentPosition.c,
                bottom: currentPosition.c,
            })
            setStylePL({backgroundColor:`${conf.colors.low}`})
        } else if(currentPosition.c) {
            setStyle({
                border: `1px solid ${conf.colors.high}`,
                height: currentPosition.c - currentPosition.o,
                bottom: currentPosition.o,
            })
            setStylePL({backgroundColor:`${conf.colors.high}`})
} 
    }, [currentPosition])
    
    return (
        <div className='current_price'>
            <div className="current_price__high" style={{
                borderRight: `2px solid ${conf.colors.high}` ,
                height: `${currentPosition.h-currentPosition.o}px`,
                bottom: `${currentPosition.o}px`
            }}></div>
            <div className="current_price__low" style={{
                borderRight: `2px solid ${conf.colors.low}` ,
                height: `${currentPosition.o - currentPosition.l}px`,
                bottom: `${currentPosition.l}px`
            }}></div>
            <div className="current_price__candle" style={style}></div>
            <div className='current_price__priceLine' style={{
                borderBottom: `1px solid ${stylePL?stylePL.backgroundColor:'#777'}`,
                bottom: `${currentPosition.c}px`
            }}></div>
            
        </div>
    )
}
