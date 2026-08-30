import type React from "react";
import { GetData, UploadFile } from "../../../Actions/Input";
import { useEffect, useState } from "react";
import Message from "../../Message";
import { AddListener, GetGlobalSignalData, GetMeta, SetData, SetMeta } from "../../../Global";
import { SignalData } from "../../../Actions/SignalData";
import { GetFiles } from "../../../Actions/Retrieve";
import { Error } from "../../../Actions/Errors";
import { type Meta } from "../../../Actions/Meta";

export default function FilesWindow() {
    const [message, setMessage] = useState<{text: string|null, color: string}>({text:null, color:""});
    const [files, setFiles] = useState<string[]>([]);

    async function loadFile(id: string) {
        const meta = GetMeta()??{"Accuracy": 1, "ID": id, "Size": 1000};
        const curData = GetGlobalSignalData()??new SignalData([], [], [], 0, 1000, 1000, "x");
        const signalData = await GetData(id, curData.Start, curData.Stop, curData.Expression)
        if (signalData != null && signalData instanceof SignalData) {
            SetMeta({
                ID: id,
                Accuracy: meta.Accuracy,
                Size: signalData.FullSize,
            });
            
            SetData(signalData)
        }
    }


    async function handleNewData (data: SignalData|null, meta: Meta|null) {
        const resp = await GetFiles();
        if (resp instanceof Error) {
            setMessage({text: "could not list files", color: "danger"});
            return;
        }
        setFiles(resp);
    }

    useEffect(()=>{
        (async () => {
            AddListener(handleNewData);
            handleNewData(GetGlobalSignalData(), GetMeta());
        })()
    }, [])
    

    return (
        <div className="p-2 text-nowrap max-h-[500px]">
            <div className="flex flex-col w-full gap-2 overflow-y-scroll">
                {files.reverse().map(fileID => <div className="border-b py-2 border-[var(--primary)]">
                    <div className="flex items-center gap-3 justify-between">
                        <p className="font-mono text-xl">{fileID}</p>
                        <button className="o-button p-1 px-3" onClick={()=>loadFile(fileID)}>Load File</button>
                    </div>
                    <div className="flex py-1">
                        <img src={`/api/upload/${fileID}/iqheat`} className="max-h-[100px] max-w-[19.99%]"></img>
                        {/* {[...new Array(5)].map((_,i) => 
                            <img src={`/api/upload/${fileID}/iqheat`} className="max-h-[100px] max-w-[19.99%]"></img>
                        )} */}
                    </div>
                </div>)}
            </div>
            <Message text={message.text} color={message.color}/>
        </div>
    )
}