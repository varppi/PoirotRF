import type React from "react";
import { GetData, UploadFile } from "../../../Actions/Input";
import { useEffect, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta, SetData, SetMeta } from "../../../Global";
import { SignalData } from "../../../Actions/SignalData";
import { useRef } from "react";
import type { Meta } from "../../../Actions/Meta";

export default function AudioWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 500, height: 250 });
    const [update, setUpdate] = useState<boolean>(false);
    const [wavUrl, setWavUrl] = useState<string>("");
    const [sampleRate, setSampleRate] = useState<number>(48000);

    const ref = useRef<any>(null);
    const sampleRateRef = useRef<any>(sampleRate);

    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        setWavUrl(`/api/upload/${meta.ID}/${data.Start}/${data.Stop}/${sampleRateRef.current}/listen`)
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

    useEffect(()=>{
        sampleRateRef.current = sampleRate;
        handleNewData(GetGlobalSignalData(), GetMeta());
    }, [sampleRate])

    return (
        <div className="m-2 flex flex-col gap-2" ref={ref}>
            <audio src={wavUrl} controls/>

            <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50"  type="number" min={0} max={100} value={sampleRate} onChange={(e)=>setSampleRate(parseInt(e.target.value))}></input>
            <label className="font-semibold uppercase mb-5">Sample rate: {sampleRate}</label>

            <Message text={message.text} color={message.color}/>
        </div>
    )
}