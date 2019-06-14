#coding=utf-8

import pyaudio
import wave
import os
import sys


script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "../sounds/" + sys.argv[1])

#define stream chunk
chunk = 1024

#open a wav format music
f = wave.open(file_path,"rb")
#instantiate PyAudio
p = pyaudio.PyAudio()
#open stream
stream = p.open(format = p.get_format_from_width(f.getsampwidth()),
                channels = f.getnchannels(),
                rate = f.getframerate(),
                output = True)
#read data
data = f.readframes(chunk)

#play stream
while data:
    stream.write(data)
    data = f.readframes(chunk)

#stop stream
stream.stop_stream()
stream.close()

#close PyAudio
p.terminate()