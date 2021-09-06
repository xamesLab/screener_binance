import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { conf } from './conf';

export default function CurrentPrice({ chartProps, stream }) {
    const chartColors = useSelector(state=>state.mainColors)
    const [currentPosition, setCurrentPosition] = useState({})
    const [style, setStyle] = useState()
    const [currentColor, setCurrentColor] = useState('#777')

    // конвертация цены в позицию на графике (в пикселях)
    useEffect(() => {
        const { min, ratio } = chartProps;
        const getPosition = (price) => {
            return Math.floor(((price - min) * ratio + conf.PADDING) / 2)
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
        const {bull, bear} = chartColors
        if (currentPosition.c < currentPosition.o) {
            setStyle({
                border: `1px solid ${bear}`,
                height: currentPosition.o-currentPosition.c,
                bottom: currentPosition.c,
            })
            setCurrentColor(`${bear}`)
        } else if(currentPosition.c) {
            setStyle({
                border: `1px solid ${bull}`,
                height: currentPosition.c - currentPosition.o,
                bottom: currentPosition.o,
            })
            setCurrentColor(`${bull}`)
} 
    }, [currentPosition, chartColors])
    
    return (
        <div className='current_price'>
            <div className="current_price__high" style={{
                borderRight: `2px solid ${chartColors.bull}` ,
                height: `${currentPosition.h-currentPosition.o}px`,
                bottom: `${currentPosition.o}px`
            }}></div>
            <div className="current_price__low" style={{
                borderRight: `2px solid ${chartColors.bear}` ,
                height: `${currentPosition.o - currentPosition.l}px`,
                bottom: `${currentPosition.l}px`
            }}></div>
            <div className="current_price__candle" style={style}></div>
            
            <div className='current_price__priceLine' style={{
                borderBottom: `1px solid ${currentColor}`,
                bottom: `${currentPosition.c}px`
            }}></div>

            {stream?<div className='current_price__label' style={{
                borderLeft: `3px solid ${currentColor}`,
                bottom: `${currentPosition.c}px`,
                color:`${currentColor}`,
            }}>{ stream.k.c }</div>:<></>}
           
        </div>
    )
}
