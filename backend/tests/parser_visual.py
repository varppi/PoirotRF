import sys 
sys.path.append("..")

import numpy as np
from dsp.parsers import AUTO_PARSER
from data.cache import CACHE
from data.signal_data import SIGNAL_DATA
import base64

data = base64.b64encode(open("../../../../../Downloads/bpsk.wav", "rb").read())
cache = CACHE()
id = cache.UploadFile(data)
bytes = cache.GetData(id)
(sr,signal) = AUTO_PARSER(bytes)
signaldata = SIGNAL_DATA(signal,len(signal.real),sr)
print(signaldata.Real[:100])
print(signaldata.Imaginary[:100])
