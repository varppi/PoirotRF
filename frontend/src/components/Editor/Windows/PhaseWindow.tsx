import { useEffect, useRef, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta } from "../../../Global";
import ReactECharts from 'echarts-for-react';
import type { Meta } from "../../../Actions/Meta";
import type { SignalData } from "../../../Actions/SignalData";

export default function PhaseWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [yAxis, setYAxis] = useState<number[]>([])
    const [xAxis, setXAxis] = useState<number[]>([])
    const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 500, height: 250 });
    const [update, setUpdate] = useState<boolean>(false);

    const ref = useRef<any>(null);

    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        if (!data) return;

        let xAxisTmp = []
        let yAxisTmp = []

        for (let i=0; i < data.Real.length; i+=meta?.Accuracy??1)
            xAxisTmp.push(data.Imaginary[i])
        for (let i=0; i < data.Real.length; i+=meta?.Accuracy??1)
            yAxisTmp.push(data.Real[i])

        setXAxis(xAxisTmp);
        setYAxis(yAxisTmp);
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

        (async()=>{
            AddListener(handleNewData);
            handleNewData(GetGlobalSignalData(), GetMeta());
        })()
    }, [])


    const chartOptions = {
        animation: false,

        grid: {
            top: 8,
            right: 8,
            bottom: 24,
            left: 36
        },

        xAxis: {
            type: 'category',
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
                type: 'scatter',
                data: yAxis,
                symbolSize: 4,
                large: true,
                largeThreshold: 1000,
            }
        ]
    };

    return (
        <div className="m-2 flex flex-col gap-2" ref={ref} 
            style={{width: `${windowSize.width}px`, height: `${windowSize.height}px`}}>
            <ReactECharts
                style={{height:  `${windowSize.height}px`, width:  `${windowSize.width}px`}}
                option={chartOptions}
            />
            <footer className="font-light uppercase opacity-[.25]">Phase Over Time</footer>
            <Message text={message.text} color={message.color}/>
        </div>
    )
}