import { motion, useDragControls } from "motion/react"
import { useState, type ReactElement, type ReactHTMLElement } from "react";
export default function Window({
        windowID, 
        isFocused, 
        closeWindow, 
        window,
        onMouseDown}:{
            windowID: string,
            isFocused: boolean,
            closeWindow: (windowID: string) => void,
            window: ReactElement,
            onMouseDown: (windowID: string)=>void,
        }) {
    const dragControls = useDragControls();

    return <motion.div 
        key={windowID} 
        id={windowID} 
        drag 
        dragControls={dragControls} 
        dragMomentum={false} 
        dragListener={false} 
        dragConstraints={{top: 0}}
        className="window-box border-b-2 border-r-2 backdrop-blur bg-[var(--bg)]/75 border-l-2
        border-[var(--primary)] m-2 w-fit h-fit  absolute shadow-[2px_2px_5px_rgba(0,0,0,.3)] resize overflow-auto
        min-w-[450px] min-h-[300px] select-none"
        style={{left: `50px`, zIndex: (isFocused ? 200 : 100)}}
        onMouseDown={()=>onMouseDown(windowID)}>
        
        <motion.div className="o-window justify-end flex bg-[var(--primary)]" onPointerDown={(e)=>dragControls.start(e)}>
            <button className="text-[var(--bg)] font-semibold border-l border-[var(--bg)] hover:bg-[var(--bg)]/25" onClick={()=>closeWindow(windowID)}>
                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </motion.div>
        {window}
    </motion.div>
}