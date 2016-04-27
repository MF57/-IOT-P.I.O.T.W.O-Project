#!/usr/bin/env python

# ----- BEGIN INITIALIZATION -----
import os
from serial import Serial

BASE_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SERIAL_PATH = os.path.join(BASE_DIR, 'dev', 'ttyS0')

serial = Serial(SERIAL_PATH, 38400)
# ----- END INITIALIZATION -----

# ----- BEGIN BUSINESS LOGIC -----

serial.write(chr(128+32+16+8+4+1))

while True:
        cc = serial.read(1)
        if len(cc) > 0:
                ch = ord(cc)
                print ch

# ----- BEGIN BUSINESS LOGIC -----
