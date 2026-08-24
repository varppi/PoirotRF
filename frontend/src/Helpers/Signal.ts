export function ASK(signal: number[], start: number): number[] {
    return signal.map(x => x >= start ? 1 : 0)
}