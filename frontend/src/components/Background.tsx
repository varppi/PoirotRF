import { useEffect, useState, type ReactHTMLElement, type ReactElement } from "react"

export default function Background(){
    const [dots, setDots] = useState<ReactElement[]>([]);
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  
    useEffect(()=>{
        const d = 200;
        const l = window.innerWidth;
        const t = window.innerHeight*1;
        const f = d/(Math.PI*2)
        let tmpDots = [];
        let s = 0;
        let c = 0;
        for (let i = 0; i < d; i++) {
            s = Math.sin(i/f)+1;
            c = Math.cos(i/f)+1;
            tmpDots.push(<div 
                className="h-[2px] w-[calc(20vw_+_50px)] absolute " 
                style={{
                    left: `${(s-1)/3.5*l+l*.3}px`, 
                    top: `${i/d*t}px`,
                    backgroundColor: `rgba(255,0,0,${(1-c)+1})`,
                }}></div>)
        }
        setDots(tmpDots);
    }, [width])

    return (
        <div className="absolute top-0 opacity-[0.5]">
            {dots}
        </div>
    )
}