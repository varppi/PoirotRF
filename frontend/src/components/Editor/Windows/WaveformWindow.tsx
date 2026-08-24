import { useEffect, useRef, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta } from "../../../Global";
import ReactECharts from 'echarts-for-react';
import type { Meta } from "../../../Actions/Meta";
import type { SignalData } from "../../../Actions/SignalData";
import { ASK } from "../../../Helpers/Signal";

export default function WaveformWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [yAxis, setYAxis] = useState<number[]>([])
    const [xAxis, setXAxis] = useState<number[]>([])
    const [ASKStart, setASKStart] = useState<number>(0)
    const [ASKDemod, setASKDemod] = useState<boolean>(false);
    const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 500, height: 400 });
    const [update, setUpdate] = useState<boolean>(false);

    const ASKStartRef = useRef<any>(ASKStart);
    const ASKDemodRef = useRef<any>(ASKDemod);


    const ref = useRef<any>(null);

    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        if (!data) return;

        let graphData = data.Real;
        if (ASKDemodRef.current)
            graphData = ASK(graphData, ASKStartRef.current)

        let xAxisTmp = []
        let yAxisTmp = []

        for (let i=0; i < graphData.length; i+=meta?.Accuracy??1)
            xAxisTmp.push(i)
        for (let i=0; i < graphData.length; i+=meta?.Accuracy??1)
            yAxisTmp.push(graphData[i])

        setXAxis(xAxisTmp);
        setYAxis(yAxisTmp);
    }

    useEffect(()=>{
        ASKDemodRef.current = ASKDemod;
        ASKStartRef.current = ASKStart;

        handleNewData(GetGlobalSignalData(), GetMeta());
    }, [ASKStart, ASKDemod])


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
                smooth: false,
                symbol: 'none',
                connectNulls: false,
                lineStyle: {
                    width: 1
                }
            },
        ],
    };

    return (
        <div className="m-2 flex flex-col gap-2" ref={ref} 
            style={{width: `${windowSize.width}px`, height: `${windowSize.height}px`}}>
            <ReactECharts
                style={{height:  `${windowSize.height}px`, width:  `${windowSize.width}px`}}
                option={chartOptions}
            />
            <div className="flex gap-1 items-center w-fit p-1">
                <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50" type="number" value={ASKStart} onChange={(e)=>setASKStart(parseFloat(e.target.value))} step="0.01"></input>
                <button className="p-1 text-[var(--bg)] font-semibold h-full" type="button" style={{backgroundColor: `var(--${ASKDemod ? "success" : "primary"})`, animation: `${ASKDemod ? "pulse 3s ease-in-out infinite" : ""}`}} onClick={()=>setASKDemod(!ASKDemod)}>ASK DEMODULATOR</button>
            </div>
            <footer className="font-light uppercase opacity-[.25]">Waveform</footer>
            <Message text={message.text} color={message.color}/>
        </div>
    )
}