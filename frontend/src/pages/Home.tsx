import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { useState, useEffect } from "react";
export default function Home() {
    const navigate = useNavigate();
    const [constellationAmount, setConstellationAmount] = useState<number>(0);

    useEffect(()=>{
        setTimeout(()=>{
            setConstellationAmount((constellationAmount+1) % (6*8))
        }, 100)
    }, [constellationAmount])

    return (
        <>
            <Background/>
            <main className="pe-3 min-md:ps-[10%] ps-[2%]">
                <section className="flex p-3 mt-[7vh] items-baseline gap-5">
                    <div className="flex flex-col items-start">
                        <h1 className="text-[var(--primary)] display-10 text-[calc(70px_+3vw)] font-bold tracking-[5px]">Poirot RF</h1>
                    </div>
                </section>

                <section className="flex gap-5">
                    <div className="max-w-[1000px] w-full">
                        <p className="o-big-text">Poirot is a web-based IQ signal capture analyzer. It is fully open source and can be downloaded from <a className="text-[var(--link)]" href="https://github.com/varppi/PoirotRF">Github</a>.</p>
                        <div className="flex max-w-[300px] mt-5">
                            <button className="mt-5 o-button text-2xl w-full p-4" onClick={()=>navigate("/editor")}>OPEN EDITOR</button>
                        </div>
                    </div>
                </section>
{/* 
                <div className="mt-[60vh]"></div>
                <h2 className="text-center min-md:me-[10%] text-[var(--primary)] text-6xl mb-[5vh] font-bold">Features</h2>
                <section className="flex gap-[5%] flex-wrap">
                    <div className="shadow-[5px_5px_var(--trans-primary)] min-w-[300px] my-5 max-sm:w-full animate-pulse">
                        <h3 className="p-2 text-[var(--bg)] bg-[var(--primary))] font-bold text-2xl">I/Q Constellation Viewer</h3>
                        <div className="flex justify-center bg-[var(--bg)]/90 border-5 border-[var(--primary)]">
                            <div className="mt-5 h-[210px]">
                                {[...new Array(constellationAmount)].map((_,i) => <div className="h-[10px] w-[10px] relative bg-[var(--primary)] rounded-full m-[-10px]" style={{left: `calc(${(Math.cos(i)+1)/2 * s}px - 90px)`, top:`${(Math.sin(i)+1)/2 * s}px`}}></div>)}
                            </div>
                        </div>
                    </div>
                    <div className="shadow-[5px_5px_var(--trans-primary)] min-w-[300px] my-5 max-sm:w-full">
                        <h3 className="p-2 text-[var(--bg)] bg-[var(--primary))] font-bold text-2xl">Waveform Analysis</h3>
                        <div className="flex justify-center bg-[var(--bg)]/90 border-5 border-[var(--primary)]">
                            <div className="mt-5 h-[210px]">
                                {[...new Array(6*8)].map((_,i) => <div className="h-[10px] w-[10px] relative bg-[var(--primary)] rounded-full m-[-10px]" style={{left: `calc(${i/45 * s}px - 100px)`, top:`${(Math.sin(i/7.5)+1)/2 * s}px`}}></div>)}
                            </div>
                        </div>
                    </div>
                    <div className="shadow-[5px_5px_var(--trans-primary)] min-w-[300px] my-5 max-sm:w-full">
                        <h3 className="p-2 text-[var(--bg)] bg-[var(--primary))] font-bold text-2xl">FFT Display</h3>
                        <div className="flex justify-center bg-[var(--bg)]/90 border-5 border-[var(--primary)]">
                            <div className="mt-5 h-[210px]">
                                {[...new Array(30)].map((_,i) => <div className="h-[10px] w-[10px] relative bg-[var(--primary)] rounded-full m-[-10px]" style={{left: `calc(${i/21.5 * s}px - 130px)`, top:`${(Math.abs(i-10) < 5 ? ((20)+Math.abs(i-10)*20) : 100)}px`}}></div>)}
                            </div>
                        </div>
                    </div>
                    <div className="shadow-[5px_5px_var(--trans-primary)] min-w-[300px] my-5 max-sm:w-full">
                        <h3 className="p-2 text-[var(--bg)] bg-[var(--primary))] font-bold text-2xl">ASK/FSK/QAM Decoder</h3>
                        <div className="flex justify-center bg-[var(--bg)]/90 border-5 border-[var(--primary)]">
                            <div className="mt-5 h-[210px]">
                                {[...new Array(100)].map((_,i) => <div className="h-[10px] w-[10px] relative bg-[var(--primary)] rounded-full m-[-10px]" style={{left: `calc(${i/100 * s}px - 100px)`, top:`${(Math.sin(i/10+(i > 62 ? Math.PI : 0))+1)/2 * s}px`}}></div>)}
                            </div>
                        </div>
                    </div>
                </section> */}
            </main>
        </>
    )
}