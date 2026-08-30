import axios, { type AxiosResponse } from "axios";
import { Error } from "./Errors";

/// Lists all uploaded files on the server
export async function GetFiles(): Promise<Error | string[]> {
    let response: AxiosResponse
    try {
        response = await axios.get("/api/files");
    }catch(error) {
        return new Error(`from axios: ${error == null ? "" : error.toString()}`, "retrieve file list", Date.now())
    }
    if (response.status != 200)
        return new Error("API did not return status 200", "retrieve file list", Date.now())

    return response.data["ids"] ?? new Error("API response did not contain file IDs", "retrieve file list", Date.now());
} 