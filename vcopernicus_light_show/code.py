#!/usr/bin/env python

# ----- BEGIN INITIALIZATION -----
import os
from serial import Serial

from vcopernicus_light_show import mosquitto

NODE_IP = "node_ip"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SERIAL_PATH = os.path.join(BASE_DIR, 'dev', 'ttyS0')

serial = Serial(SERIAL_PATH, 38400, rtscts=True, dsrdtr=True)
# ----- END INITIALIZATION -----

# ----- BEGIN MQTT LOGIC -----


def on_connect(mqtt_client, obj, rc):
    print("rc: " + str(rc))


def on_message(mqtt_client, obj, msg):
    serial.write(chr(int(msg.payload) % 32 + 66))
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))


def on_publish(mqtt_client, obj, mid):
    print("mid: " + str(mid))


def on_subscribe(mqtt_client, obj, mid, granted_qos):
    print("Subscribed: " + str(obj) + str(mid) + " " + str(granted_qos))


def on_log(mqtt_client, obj, level, string):
    print(string)

serial.write(chr(128 + 32 + 16 + 8 + 4 + 1))

# If you want to use a specific client id, use
# mqtt_client = mqtt.Client("client-id")
# but note that the client id must be unique on the broker. Leaving the client
# id parameter empty will generate a random id for you.
mqtt_client = mosquitto.Mosquitto()
mqtt_client.on_message = on_message
mqtt_client.on_connect = on_connect
mqtt_client.on_publish = on_publish
mqtt_client.on_subscribe = on_subscribe
# Uncomment to enable debug messages
# mqtt_client.on_log = on_log
# mqtt_client.connect("127.0.0.1", 1883, 60)

# setting testament for that client
# mqtt_client.will_set("temp/floor1/room1/pref1", "broken", 0, True)

mqtt_client.connect("127.0.0.1", 1883, 60)

mqtt_client.subscribe(NODE_IP, 0)

# publishing message on topic with QoS 0 and the message is not Retained
# mqtt_client.publish("temp/floor1/room1/pref1", "20", 0, False)

mqtt_client.loop_forever()

# ----- END MQTT_LOGIC -----

# TODO start second thread handling serial

# ----- BEGIN BUSINESS LOGIC -----

serial.write(chr(128 + 32 + 16 + 8 + 4 + 1))

while True:
    cc = serial.read(1)
    if len(cc) > 0:
        ch = ord(cc)
        serial.write(chr(ch % 32 + 64))
        # print ch

# ----- BEGIN BUSINESS LOGIC -----
