from scipy.io import wavfile
import wave 
import io
import numpy as np
from dsp.clean import CLEANUP

def PARSE_WAV(bytes: bytes):
    (sampleRate, signal) = wavfile.read(io.BytesIO(bytes))
    complexed = np.array(signal, dtype=np.complex64)
    return (sampleRate, complexed)

def PARSE_NUMPYI64(bytes: bytes):
    return (48_000, np.frombuffer(bytes, dtype=np.complex64))
           #^ have to replace with actual sample rate someday

def AUTO_PARSER(bytes: bytes):
    sample_rate = 0
    signal = np.array([])
    parsers = [PARSE_NUMPYI64, PARSE_WAV]
    for parser in parsers:
        try:
            (sample_rate, signal) = parser(bytes)
            if len(signal) > 0:
                break
        except:
            pass
    signal = CLEANUP(signal)
    return (sample_rate, signal)