import sys 
sys.path.append("..")

import numpy as np
from dsp.iqheat import GENERATE_IQ_HEATMAP
import matplotlib.pyplot as plt
from dsp.parsers import AUTO_PARSER
from data.signal_data import TEXTIFY, DETEXTIFY
from data.cache import CACHE
from data.signal_data import SIGNAL_DATA
import base64
import sigmf 

# sigmf_file = sigmf.fromfile("../../../../../Downloads/fm.sigmf-meta")
# signal = sigmf_file[0:len(sigmf_file)-1]
signal = np.load("../../../../../Downloads/lte_out.iq.npy")
texts = DETEXTIFY(TEXTIFY(signal))
out = GENERATE_IQ_HEATMAP(texts)
plt.imshow(out)
plt.show()