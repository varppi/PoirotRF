import numpy as np
import base64
import os
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

from flask_init import APP
from flask import request, jsonify, send_file, send_from_directory
from data.cache import CACHE
from data.signal_data import SIGNAL_DATA
from dsp.waterfall import GENERATE_WATERFALL
from dsp.parsers import AUTO_PARSER
from dsp.expressions import RUN_EXPRESSION
from dsp.iqheat import GENERATE_IQ_HEATMAP
from io import BytesIO
from scipy.io.wavfile import write

class Handlers:
    dataCache = None 

    def __init__(self):
        self.dataCache = CACHE()

    def HANDLERS_INIT(self):
        @APP.route("/api/ping", methods=["GET"])
        def ping():
            return "pong"
        
        @APP.route("/api/files", methods=["GET"])
        def get_files():
            ids = self.dataCache.ListFiles()
            return jsonify({"ids": ids})

        @APP.route("/api/upload", methods=["POST"])
        def upload():
            data = request.get_json()["data"]
            id = self.dataCache.UploadFile(data)
            return jsonify({"id": id})
        
        @APP.route("/api/upload/<id>/<start>/<end>", methods=["GET"])
        def get_signal(id, start, end):
            start,end = int(start), int(end)
            data = self.dataCache.GetData(id)
            (sample_rate, signal) = AUTO_PARSER(data)
            cropped_signal = signal[start:end]
            sd = SIGNAL_DATA(cropped_signal, len(signal.real), sample_rate, start, end)
            return jsonify({
                "fft":  sd.Fft,
                "real":  sd.Real,
                "imaginary": sd.Imaginary,
                "start": sd.Start,
                "stop": sd.Stop,
                "fullSize": sd.FullSize
            })
        
        @APP.route("/api/upload/<id>/<start>/<end>", methods=["POST"])
        def get_sympify_signal(id, start, end):
            postdata = request.get_json()
            if "expression" not in postdata:
                return jsonify({}), 400
            start,end = int(start), int(end)
            data = self.dataCache.GetData(id)
            (sample_rate, signal) = AUTO_PARSER(data)
            cropped_signal = np.array([])

            expr = postdata["expression"]
            try:
                cropped_signal = RUN_EXPRESSION(expr, signal[start:end])
            except Exception as e:
                print(e)
            sd = SIGNAL_DATA(cropped_signal, len(signal.real), sample_rate, start, end)
            return jsonify({
                "fft":  sd.Fft,
                "real":  sd.Real,
                "imaginary": sd.Imaginary,
                "start": sd.Start,
                "stop": sd.Stop,
                "fullSize": sd.FullSize
            })


        @APP.route("/api/upload/<id>/<start>/<end>/<sr>/listen", methods=["GET"])
        def get_signal_audio(id, start, end, sr):
            start,end = int(start), int(end)
            data = self.dataCache.GetData(id)
            (sample_rate, signal) = AUTO_PARSER(data)
            cropped_signal = signal[start:end]
            cropped_signal = cropped_signal.real

            buffer = BytesIO()
            normalized = cropped_signal / np.max(np.abs(cropped_signal))
            scaled = normalized * 32767
            int16Version = scaled.astype(np.int16)
            write(buffer, int(sr), int16Version)
            buffer.seek(0)
            return send_file(buffer, mimetype="audio/wav", as_attachment=False)
    
        @APP.route("/api/upload/<id>/<start>/<end>/waterfall/<sr>/<contrast>", methods=["GET"])
        def get_signal_waterfall(id, start, end, sr, contrast):
            start,end,sr,contrast = int(start), int(end), int(sr), float(contrast)
            data = self.dataCache.GetData(id)
            (sample_rate, signal) = AUTO_PARSER(data)
            cropped_signal = signal[start:end]

            image = GENERATE_WATERFALL(cropped_signal, sr, contrast)
            return send_file(image, mimetype="image/png", as_attachment=False)
        
        
        @APP.route("/api/upload/<id>/<start>/<end>/iqheat", methods=["GET"])
        def get_signal_heatmap(id, start, end):
            start,end = int(start), int(end)
            data = self.dataCache.GetData(id)
            (sample_rate, signal) = AUTO_PARSER(data)
            cropped_signal = signal[start:end]

            fig = Figure()
            ax = fig.add_subplot(111)
            ax.set_xticks([])
            ax.set_yticks([])
            ax.set_position([0, 0, 1, 1])
            data = GENERATE_IQ_HEATMAP(cropped_signal)
            ax.imshow(data, cmap='viridis')

            buffer = BytesIO()
            fig.savefig(buffer, format="png", bbox_inches='tight')
            buffer.seek(0)
            return send_file(buffer, mimetype="image/png", as_attachment=False)
        
        @APP.route("/api/upload/<id>/iqheat", methods=["GET"])
        def get_full_signal_heatmap(id):
            data = self.dataCache.GetData(id)
            (sample_rate, signal) = AUTO_PARSER(data)

            fig = Figure()
            ax = fig.add_subplot(111)
            ax.set_xticks([])
            ax.set_yticks([])
            ax.set_position([0, 0, 1, 1])
            data = GENERATE_IQ_HEATMAP(signal)
            ax.imshow(data, cmap='viridis')

            buffer = BytesIO()
            fig.savefig(buffer, format="png", bbox_inches='tight')
            buffer.seek(0)
            return send_file(buffer, mimetype="image/png", as_attachment=False)

        @APP.route('/', defaults={'path': ''})
        @APP.route('/<path:path>')
        def serve_frontend(path):
            if path != "" and APP.static_folder and os.path.exists(os.path.join(APP.static_folder, path)):
                return send_from_directory(APP.static_folder, path)
            else:
                return send_from_directory(APP.static_folder, 'index.html')