import type { Meta } from "./Actions/Meta";
import type { SignalData } from "./Actions/SignalData";
let dataStore: SignalData|null = null;
let meta: Meta|null = null;
let listeners:((data: SignalData|null, meta: Meta|null) => void)[] = []
export function AddListener(callback: (data: SignalData|null, meta: Meta|null)=>void) {
    listeners.push(callback);
}
export function SetData(newData: SignalData) {
    dataStore = newData;
    listeners.forEach(l => l(dataStore, meta))
} 
export function GetGlobalSignalData() {
    return dataStore
} 
export function SetMeta(uMeta: Meta | null) {
    meta = uMeta;
    listeners.forEach(l => l(dataStore, meta))
}
export function GetMeta() {
    return meta;
}

