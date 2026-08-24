import numpy as np
from dsp.fft import FFT
from numpy.typing import NDArray

def TEXTIFY(array):
    final = ""
    for element in array:
        el = f"{element},".replace("nan", "0")
        final += el
    final = final[:-1]
    return final 


def DETEXTIFY(data):
    final = []
    for element in data.split(","):
        final.append(float(element))
    return np.array(final)

class SIGNAL_DATA:
    Fft = "" 
    Real = ""
    Imaginary = ""
    SampleRate = 0
    Start = 0 
    Stop = 0 
    FullSize = 0

    def __init__(self, signal: NDArray[np.complex64], fullSize, sampleRate,  start, stop):
        self.SampleRate = sampleRate
        self.Fft =  TEXTIFY(FFT(signal).real)
        self.Real = TEXTIFY(signal.real)
        self.Imaginary = TEXTIFY(signal.imag)
        self.Start = start
        self.Stop = stop
        self.FullSize = fullSize
