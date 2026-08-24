export class SignalData {
    FFT: number[];
    Real: number[];
    Imaginary: number[];
    Start: number;
    Stop: number;
    FullSize: number;

    constructor(
        fft: number[], 
        real: number[], 
        imaginary: number[],
        start: number,
        stop: number,
        fullSize: number,
    ) {
        this.FFT = fft;
        this.Real = real;
        this.Imaginary = imaginary;
        this.Start = start;
        this.Stop = stop;
        this.FullSize = fullSize;
    }
}