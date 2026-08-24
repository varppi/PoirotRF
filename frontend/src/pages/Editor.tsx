import { useState, type ReactElement } from "react"
import Window from "../components/Editor/Window";
import InputWindow from "../components/Editor/Windows/InputWindow";
import WaveformWindow from "../components/Editor/Windows/WaveformWindow";
import FFTWindow from "../components/Editor/Windows/FFTWindow";
import ConstellationWindow from "../components/Editor/Windows/ConstellationWindow";
import PhaseWindow from "../components/Editor/Windows/PhaseWindow";
import AudioWindow from "../components/Editor/Windows/AudioWindow";
import WaterfallWindow from "../components/Editor/Windows/WaterfallWindow";
import Background2 from "../components/Background2";

export default function Editor() {
    document.getElementsByTagName("html")[0].style.overflowY="hidden";
    const [spawnedWindows, setSpawnedWindows] = useState<{[key: string]: string}>({});
    const [isFocused, setIsFocused] = useState<{[key: string]: boolean}>({});
    const [update, setUpdate] = useState<boolean>(false);
    const windows: {[key: string]: ReactElement} = {
        "input": <InputWindow/>,
        "waveform": <WaveformWindow/>,
        "fft": <FFTWindow/>,
        "constellation": <ConstellationWindow/>,
        "phase": <PhaseWindow/>,
        "audio": <AudioWindow/>,
        "waterfall": <WaterfallWindow/>
    }

    /// Adds the window along with a unique ID tied to the window to spawnedWindows
    function addWindow(windowName: string) {
        let spawnedWindowsCopy = spawnedWindows;
        // let dragMapCopy = dragMap;
        const id = crypto.randomUUID().toString();
        spawnedWindowsCopy[id] = windowName
        setSpawnedWindows(spawnedWindowsCopy);
        setUpdate(!update);
    }

    /// Removes windowID from spawned windows
    function closeWindow(windowID: string) {
        let spawnedWindowsCopy = spawnedWindows;
        delete spawnedWindowsCopy[windowID];
        setSpawnedWindows(spawnedWindowsCopy);
        setUpdate(!update);
    }

    /// Focuses on the window so it shows on top of everything else
    function focusWindow(windowID: string) {
        let focusedWindowCopy = isFocused;
        Object.keys(focusedWindowCopy).map(key => focusedWindowCopy[key] = false);
        focusedWindowCopy[windowID] = true;
        setIsFocused(focusedWindowCopy);
        setUpdate(!update);
    }

    return (
        <main>
            <Background2/>
            <nav className="bg-[var(--primary)] p-2 flex gap-2">
                {
                    Object.keys(windows).map((windowName) => 
                        <button className="text-[var(--bg)] uppercase font-bold bg-[var(--bg)]/20 p-2 hover:bg-[var(--bg)]/50 hover:cursor-pointer" onClick={()=>addWindow(windowName)}>{windowName}</button>)
                }
            </nav>
            {Object.keys(spawnedWindows).map(windowID =>  
                <Window 
                    key={windowID}
                    windowID={windowID}
                    isFocused={isFocused[windowID]}
                    closeWindow={closeWindow}
                    window={windows[spawnedWindows[windowID]]}
                    onMouseDown={focusWindow}
                />
            )}
        </main>
    )
}