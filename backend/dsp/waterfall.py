from dsp.fft import FFT
from numpy.typing import NDArray
import numpy as np
from PIL import Image
from io import BytesIO

def GENERATE_WATERFALL(signal: NDArray[np.complex64], sample_rate, contrast):
    signal= np.pad(signal.real, (0, ((-len(signal.real))%sample_rate)), constant_values=0)
    sections = signal.reshape(-1, sample_rate)
    img = None
    for i, section in enumerate(sections):
        fftbin = FFT(section)
        if img is None:
            img = Image.new("RGBA", (len(fftbin), len(sections)))
        pixels = img.load()
        for x in range(len(fftbin)):
            val = int(fftbin[x]%255*contrast)
            pixels[x,i] = (0,0,0,val)
    if img is None:
        img = Image.new("RGB", (1,1))
    buffer = BytesIO()    
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer