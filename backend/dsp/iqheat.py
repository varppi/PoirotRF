import numpy as np
from numpy.typing import NDArray

def GENERATE_IQ_HEATMAP(signal: NDArray[np.complex64], split=50):
    cell_size = 10
    realMax = np.max(signal.real)
    realMin = np.min(signal.real)
    imagMax = np.max(signal.imag)
    imagMin = np.min(signal.imag)
    realJump = (realMax-realMin)/cell_size
    imagJump = (imagMax-realMin)/cell_size
    chunks = int(np.floor(len(signal.real)/split))

    maps = []

    for ci in range(chunks):
        cmap = np.zeros((cell_size, cell_size))
        chunk = signal[(ci*split):((ci+1)*split)]
        for val in chunk:
            rval = int(np.floor((val.real-realMin)/realJump))-1
            ival = int(np.floor((val.imag-imagMin)/imagJump))-1
            cmap[rval][ival] += 1
        maps.append(cmap)
    
    averaged = np.mean(maps, axis=0)

    return averaged