import type React from "react";
import { GetData, UploadFile } from "../../../Actions/Input";
import { useEffect, useState } from "react";
import Message from "../../Message";
import { GetGlobalSignalData, GetMeta, SetData, SetMeta } from "../../../Global";
import { SignalData } from "../../../Actions/SignalData";

export default function InputWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [start, setStart] = useState<number>(0);
    const [size, setSize] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(1);
    const [maxStop, setMaxStop] = useState<number>(0);
    const [autoplay, setAutoplay] = useState<boolean>(false);
    const [autoplayTap, setAutoplayTap] = useState<boolean>(false);
    const [expression, setExpression] = useState<string>("x");

    async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
        setMessage({text: "Uploading...", color: "warning"})
        const file = event.target.files?.[0];
        if (!file) return;

        const data = await file.bytes();
        const resp = await UploadFile(data);
        if (resp instanceof Error)  {
            setMessage({text: resp.message, color: "error"})
            return;
        }
        else
            setMessage({text: "Successfully uploaded!", color: "success"})
        const id = resp as string|null ?? "";
        setStart(0);
        setSize(1000);
        const signalData = await GetData(id, start, 1000, expression)
        if (signalData != null && signalData instanceof SignalData) {
            SetMeta({
                ID: id,
                Accuracy: accuracy,
                Size: signalData.FullSize,
            });
            
            setMaxStop(signalData.FullSize);
            SetData(signalData)
        }
        setTimeout(()=>setMessage({text: null, color: ""}), 5000);
    }

    useEffect(()=>{
        (async ()=>{
            const id = GetMeta()?.ID as string ?? "";
            const signalData = await GetData(id, start, start+size, expression)
            if (signalData != null && signalData instanceof SignalData) {
                SetData(signalData)
                SetMeta({
                    ID: id,
                    Accuracy: accuracy*32 == 0 ? 1 : accuracy*32,
                    Size: signalData.FullSize
                })
            }
        })()
    }, [start,size,accuracy,expression])

    useEffect(()=>{
        if (!autoplay) return;
        let at = start;
        setTimeout(()=>{
            at+=10;
            at%=GetGlobalSignalData()?.FullSize??0
            setStart(at);
            setAutoplayTap(!autoplayTap);
        }, 250)
    }, [autoplayTap])

    useEffect(()=>{
        setAutoplayTap(!autoplayTap)
    }, [autoplay])

    return (
        <form className="m-2 flex flex-col gap-2">
            <input className="o-button p-3" type="file" onChange={handleFile}/>
            <div className="flex flex-col mt-5 w-[50%] min-w-fit">
                <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50" type="number" min={0} max={maxStop} value={start} onChange={(e)=>setStart(parseInt(e.target.value))}></input>
                <label className="font-semibold uppercase mb-5">Start: {start}/{maxStop}</label>

                <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50" type="number" min={0} step={50} max={maxStop-start} value={size} onChange={(e)=>setSize(parseInt(e.target.value))}></input>
                <label className="font-semibold uppercase mb-5">Size: {size}/{maxStop-start}</label>

                <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50"  type="number" min={0} max={100} value={accuracy} onChange={(e)=>setAccuracy(parseInt(e.target.value))}></input>
                <label className="font-semibold uppercase mb-5">Compression: {accuracy*32}</label>

                <input className="border p-1 border-[var(--primary)] shadow-[2px_2px_var(--trans-primary)] bg-[var(--bg)]/50"  type="text" value={expression} onChange={(e)=>setExpression(e.target.value)}></input>
                <label className="font-semibold uppercase mb-5">Expression: {expression}</label>

                <button className="p-1 text-[var(--bg)] font-semibold" type="button" style={{backgroundColor: `var(--${autoplay ? "success" : "primary"})`, animation: `${autoplay ? "pulse 3s ease-in-out infinite" : ""}`}} onClick={()=>setAutoplay(!autoplay)}>Toggle Autoplay</button>
            </div>

            <Message text={message.text} color={message.color}/>
        </form>
    )
}