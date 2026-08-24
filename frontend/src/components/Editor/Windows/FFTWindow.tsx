import { useEffect, useRef, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta } from "../../../Global";
import ReactECharts from 'echarts-for-react';
import type { Meta } from "../../../Actions/Meta";
import type { SignalData } from "../../../Actions/SignalData";

export default function FFTWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [yAxis, setYAxis] = useState<number[]>([])
    const [xAxis, setXAxis] = useState<number[]>([])
    const [fftSize, setFftSize] = useState<number>(0);    
    const [update, setUpdate] = useState<boolean>(false);
    const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 500, height: 500 });
    const fftSizeRef = useRef<any>(fftSize);
    const ref = useRef<any>(null);

    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        if (!data) return;
        let xAxisTmp = []
        for (let i=0; i < fftSizeRef.current; i++)
            xAxisTmp.push(i)
        setXAxis(xAxisTmp);
        setYAxis(data.FFT);
    }

    useEffect(()=>{
        const parent = ref.current?.parentElement;
        function updateSize() {
            const dims = parent.getBoundingClientRect();
            setWindowSize({
                width: dims.width-40,
                height: dims.height-60,
            });
            setUpdate(!update);
        }
        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(parent);

        AddListener(handleNewData);
        handleNewData(GetGlobalSignalData(), GetMeta());
    }, [])

    const chartOptions = {
        progressive: 1000,           
        progressiveThreshold: 5000, 
        large: true,              
          
        largeThreshold: 1000,     
        animation: false,          
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: { 
            type: 'category',
            data: xAxis,
        },
        yAxis: { 
            type: 'value',
        },
        dataZoom: [  
            { type: 'inside', realtime: false },
            { type: 'slider', realtime: false }
        ],
        series: [
            {
                type: 'line',
                data: yAxis,
                smooth: true,
                symbol: 'none',
                connectNulls: false,
                lineStyle: {
                    width: 1
                }
            },
        ],
    };

    useEffect(()=>{
        fftSizeRef.current = fftSize;
        handleNewData(GetGlobalSignalData(), GetMeta());
    }, [fftSize])

    return (
        <div className="m-2 flex flex-col gap-2" ref={ref}
            style={{width: `${windowSize.width}px`, height: `${windowSize.height}px`}}>
            <ReactECharts
                style={{height:  `${windowSize.height}px`, width:  `${windowSize.width}px`}}
                option={chartOptions}
            />
            <footer className="font-light uppercase opacity-[.25]">FFT</footer>

            <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50" type="number" min={0} max={5000000} value={fftSize} onChange={(e)=>setFftSize(parseInt(e.target.value))}></input>
            <label className="font-semibold uppercase mb-5">FFT SIZE: (UP TO {fftSize} HZ)</label>

            <Message text={message.text} color={message.color}/>
        </div>
    )
}