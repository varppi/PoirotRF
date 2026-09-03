<img width="1308" height="528" src="https://github.com/user-attachments/assets/f3803a1d-9491-472f-87a9-f818ffb74f3a" />
<p align="center">
<img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54">
<img src="https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white">
<img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white">
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
</p>

# Description
**PoirotRF is a web based signal analyzer made with the goal of making signal identification easier and quicker.**
## Features
- WAV and raw IQ data (.npy) parser 
- I/Q constellation view
- Waterfall view
- FFT view
- Waveform view
- Relative phase view
- Audio playback

<img width="640" height="360" src="https://github.com/user-attachments/assets/75e723e4-d95d-4002-84c7-fe4785ce04fa" />

# Installation and **LOCAL** deployment
### Linux
```
git clone https://github.com/varppi/PoirotRF
cd PoirotRF/backend
python -m venv .poirot_venv
source .poirot_venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

### Windows
```
git clone https://github.com/varppi/PoirotRF
cd PoirotRF/backend
python -m venv .poirot_venv
.\.poirot_venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python app.py
```

