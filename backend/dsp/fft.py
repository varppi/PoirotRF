from scipy.fft import fft
import numpy as np 
from scipy.fft import rfft, rfftfreq
from dsp.clean import CLEANUP

def FFT(signal):
    signal = CLEANUP(signal)
    fft_signal = np.abs(fft(signal.real).real)/len(signal.real)
    fft_signal = fft_signal[:(len(fft_signal)//2)]
    return CLEANUP(fft_signal)