export default function Message({text, color}:{text: string|null, color: string}) {
    if (text == null) return <></>

    return <div className="py-1 w-fit border-b-1" style={{borderColor: `var(--${color})`}}>
        <p className="font-semibold" style={{color:  `var(--${color})`}}>{text}</p>
    </div>
}