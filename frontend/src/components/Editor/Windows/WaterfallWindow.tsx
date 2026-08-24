import { useEffect, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta } from "../../../Global";
import { SignalData } from "../../../Actions/SignalData";
import { useRef } from "react";
import type { Meta } from "../../../Actions/Meta";

export default function WaterfallWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 500, height: 250 });
    const [FFTSize, setFFTSize] = useState<number>(500);
    const [contrast, setContrast] = useState<number>(500);

    // const [FFTShift, setFFTShift] = useState<number>(0);

    const [update, setUpdate] = useState<boolean>(false);
    const [waterfallUrl, setWaterfallUrl] = useState<string>("");

    const FFTSizeRef = useRef<any>(FFTSize);
    const contrastRef = useRef<any>(contrast);
    const ref = useRef<any>(null);

    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        if (data == null || meta == null) return;
        setWaterfallUrl(`/api/upload/${meta.ID}/${data.Start}/${data.Stop}/waterfall/${FFTSizeRef.current}/${contrastRef.current}`)
    }

    useEffect(()=>{
        FFTSizeRef.current = FFTSize;
        contrastRef.current = contrast;
        handleNewData(GetGlobalSignalData(), GetMeta());
    }, [FFTSize,contrast])

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

    return (
        <div className="m-2 flex flex-col gap-2" ref={ref}>
            <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50" type="number" min={0} value={FFTSize} onChange={(e)=>setFFTSize(parseInt(e.target.value))}></input>
            <label className="font-semibold uppercase mb-5">FFT size: {FFTSize}</label>
            <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50" type="number" min={0} value={contrast} onChange={(e)=>setContrast(parseFloat(e.target.value))} step="0.01"></input>
            <label className="font-semibold uppercase mb-5">Contrast: {contrast}</label>
            <img src={waterfallUrl}/>
            <Message text={message.text} color={message.color}/>
        </div>
    )
}