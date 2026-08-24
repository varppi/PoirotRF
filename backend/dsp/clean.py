import numpy as np

def CLEANUP(signal):
    signal = signal[np.isfinite(signal)]
    return signal