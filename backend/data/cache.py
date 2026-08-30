import base64 
import uuid
from data.signal_data import DETEXTIFY, TEXTIFY

class CACHE:
    uploadMap = {}

    def __init__(self):
        return 
    
    def UploadFile(self, encodedData):
        rawData = base64.b64decode(encodedData)
        id = str(uuid.uuid4())
        self.uploadMap[id] = rawData
        return id
    
    def ListFiles(self):
        return list(self.uploadMap.keys())

    def GetData(self, id):
        return self.uploadMap[id]

    def GetDataEncoded(self, id):
        return base64.b64decode(self.uploadMap[id])