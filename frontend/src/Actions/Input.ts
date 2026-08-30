import axios, { type AxiosResponse } from "axios";
import { Error } from "./Errors";
import { SignalData } from "./SignalData";
import { ServerEncodingToNumbers, Uint8ArrayToBase64 } from "../Helpers/Parsers";


/// Uploads a waveform file to the server and responds with the upload ID.
export async function UploadFile(data: Uint8Array<ArrayBuffer>): Promise<Error | string> {
    const encodedData = Uint8ArrayToBase64(data);

    let response: AxiosResponse
    try {
        response = await axios.post("/api/upload", {
            "data": encodedData,
        });
    }catch(error) {
        return new Error(`from axios: ${error == null ? "" : error.toString()}`, "file upload", Date.now())
    }
    if (response.status != 200)
        return new Error("API did not return status 200", "file upload", Date.now())

    return response.data["id"] ?? new Error("API response did not contain upload ID", "file upload", Date.now());
} 

/// Downloads the processed version of the uploaded file 
export async function GetData(
    id: string, 
    wantStart: number, 
    wantStop: number,
    expression: string
    ): Promise<Error | SignalData | null> {
    let response: AxiosResponse
    try {
        response = await axios.post(`/api/upload/${id}/${wantStart}/${wantStop}`, {expression});
    }catch(error) {
        return new Error(`from axios: ${error == null ? "" : error.toString()}`, "file upload", Date.now())
    }

    if (response.status != 200)
        return new Error("API did not return status 200", "file upload", Date.now())
    
    const fft = ServerEncodingToNumbers(response.data["fft"]);
    const real = ServerEncodingToNumbers(response.data["real"]);
    const imaginary = ServerEncodingToNumbers(response.data["imaginary"]);
    const start = parseInt(response.data["start"]);
    const stop = parseInt(response.data["stop"]);
    const fullSize = parseInt(response.data["fullSize"])
    return new SignalData(fft, real, imaginary, start, stop, fullSize, expression);
}