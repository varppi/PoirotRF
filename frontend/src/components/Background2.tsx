import { useEffect, useState, type ReactHTMLElement, type ReactElement } from "react"

export default function Background2(){
    const [dots, setDots] = useState<ReactElement[]>([]);
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  
    useEffect(()=>{
        const t = window.innerWidth-40;
        const l = window.innerHeight*1.1;
        const d = Math.log10(t)*40;
        const f = d/(Math.PI*2)/5
        let tmpDots = [];
        let s = 0;
        let c = 0;
        for (let i = 0; i < d; i++) {
            s = Math.sin(i/f)+1;
            c = Math.cos(i/f)+1;
            tmpDots.push(<div 
                className="w-[15px] h-[15px] absolute rounded-full" 
                style={{
                    top: `${(s-1)/8*l+l*.45}px`, 
                    left: `${i/d*t}px`,
                    backgroundColor: `rgba(0, 0, 0, 0.5)`,
                }}></div>)
        }
        setDots(tmpDots);
    }, [width])

    return (
        <div className="absolute top-0 opacity-[.2]">
            {dots}
            <div className="absolute w-[100vw] h-[100vh] items-center justify-center flex">
                <b className="text-[calc(50px_+_5vw)] text-[var(--primary)]">Poirot RF</b>
            </div>
        </div>
    )
}