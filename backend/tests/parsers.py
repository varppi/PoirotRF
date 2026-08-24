import sys 
sys.path.append("..")

import numpy as np
from dsp.parsers import PARSE_WAV, PARSE_NUMPYI64, AUTO_PARSER
from dsp.fft import FFT
from data.signal_data import TEXTIFY, DETEXTIFY
from data.signal_data import SIGNAL_DATA
from scipy.fft import fft 
import os

print("\n")
print("-------------------------------------------")
print("---  AUTOMATED INTERNAL PARSER TESTER   ---")
print("-------------------------------------------\n")

testWavPath = os.path.expanduser("~") + "\\Downloads\\test.wav"
testWavPath = testWavPath.replace("\\", "/")

assert(len(PARSE_WAV(open(testWavPath, "rb").read())) > 0)
print("> WAV PARSER WORKS")

f = 100
n = 1000
sr = 5000
t = np.linspace(0,n,sr)
signal = np.exp(2j * np.pi * t * f)
data = np.array(signal, dtype=np.complex64)
assert(np.abs(np.sum(PARSE_NUMPYI64(data.tobytes()).real) - 1) < 0.001)
print("> NUMPY COMPLEX64 PARSER WORK")

assert(np.abs(np.sum(AUTO_PARSER(data.tobytes()).real) - 1) < 0.001)
print("> AUTOMATIC PARSER WORK")

parsedWav = AUTO_PARSER(PARSE_WAV(open(testWavPath, "rb").read())[:10000])
assert(np.sum(FFT(parsedWav).real) > 1.023e+37)
print("> FFT CLEANUP WORKS")

signalData = SIGNAL_DATA(FFT(parsedWav), len(parsedWav.real))
print("> SIGNAL DATA PARSER WORKS")

assert(TEXTIFY(DETEXTIFY(TEXTIFY(parsedWav))) == TEXTIFY(parsedWav))
print("> CUSTOM ENCODING WORKS")

print("\n::::::::::EVERYTHING SEEMS TO BE IN ORDER!::::::::::\n")