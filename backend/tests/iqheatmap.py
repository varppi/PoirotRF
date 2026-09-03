import sys 
sys.path.append("..")
import numpy as np
from dsp.iqheat import GENERATE_IQ_HEATMAP
import matplotlib.pyplot as plt
from dsp.parsers import AUTO_PARSER
from data.signal_data import TEXTIFY, DETEXTIFY
from data.cache import CACHE
from data.signal_data import SIGNAL_DATA
from dsp.clean import CLEANUP
import base64
import sigmf 
from numpy import ma
import os 

testIQPath = os.path.expanduser("~") + "\\Downloads\\lte_out.iq.npy"
signal = open(testIQPath, "rb").read()
data = base64.b64encode(signal)
cache = CACHE()
id = cache.UploadFile(data)
bytes = cache.GetData(id)
(sr,signal) = AUTO_PARSER(bytes)
out = GENERATE_IQ_HEATMAP(signal)
plt.imshow(out)
plt.show()