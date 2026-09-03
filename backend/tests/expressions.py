import sys 
sys.path.append("..")
import numpy as np
import matplotlib.pyplot as plt
from dsp.expressions import RUN_EXPRESSION

f = 100
n = 1000
sr = 5000
t = np.linspace(0,n,sr)
signal = np.exp(2j * np.pi * t * f)
data = np.array(signal, dtype=np.complex64)

assert(np.sum(RUN_EXPRESSION("sin(x/(pi*2))", data).real) < 0.2)
print("> EXPRESSIONS WORK")