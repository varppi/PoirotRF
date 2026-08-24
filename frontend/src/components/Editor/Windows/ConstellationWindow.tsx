import { useEffect, useRef, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta } from "../../../Global";
import ReactECharts from 'echarts-for-react';
import type { Meta } from "../../../Actions/Meta";
import type { SignalData } from "../../../Actions/SignalData";

export default function ConstellationWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [scatterData, setScatterData] = useState<number[][]>([]);
    const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 500, height: 250 });
    const [update, setUpdate] = useState<boolean>(false);

    const ref = useRef<any>(null);

    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        if (!data) return;
        let scatterDataTmp = [];
        for (let i=0; i < data.Real.length; i+=meta?.Accuracy??1)
            scatterDataTmp.push([data.Real[i],data.Imaginary[i]])
        setScatterData(scatterDataTmp)
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

    const scale = Math.ceil(scatterData.map(pair=>Math.abs(pair[0])).sort()[0]+1)
    const chartOptions = {
        animation: false,

        grid: {
            top: 8,
            right: 8,
            bottom: 24,
            left: 36
        },

        xAxis: {
            min: -scale,
            max: scale,
        },

        yAxis: {
            min: -scale,
            max: scale,
        },

        dataZoom: [
            { type: 'inside', realtime: false },
            { type: 'slider', realtime: false }
        ],

        series: [
            {
                type: 'scatter',
                data: scatterData,
                symbolSize: 15,
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
            <footer className="font-light uppercase opacity-[.25]">I/Q Constellation</footer>
            <Message text={message.text} color={message.color}/>
        </div>
    )
}