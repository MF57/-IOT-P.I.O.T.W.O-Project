#!/usr/bin/env python

# ----- BEGIN INITIALIZATION -----
import os
import socket
import thread
from serial import Serial

from vcopernicus_light_show import mosquitto

ALLOW_IP_AUTO_CONFIG = False
ENABLE_KNOB_COLOR_CHANGE = False
ALLOW_MULTIPLE_COLOR_CHANGES = False

NODE_IP = "enter_node_ip" if not ALLOW_IP_AUTO_CONFIG else socket.gethostbyname(socket.gethostname())
current_color = 0
BASE_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SERIAL_PATH = os.path.join(BASE_DIR, 'dev', 'ttyS0')

serial = Serial(SERIAL_PATH, 38400, rtscts=True, dsrdtr=True)
# ----- END INITIALIZATION -----

# ----- BEGIN MQTT LOGIC -----


def map_diode_color(color):
    if color == "off":
        return 0
    elif color[:3] == "rgb":
        color = color[4:-1]
        rgb = color.split(',')
        for i in range(3):
            rgb[i] = int(rgb[i])/64
        col = rgb[0] * 16 + rgb[1] * 4 + rgb[2]
        return col % 64
    else:
        return int(color) % 64


def handle_button_and_knob():
    serial.write(chr(128 + 32 + 16 + 8 + 4 + 1))
    global mqtt_client
    global current_color
    global ENABLE_KNOB_COLOR_CHANGE
    global ALLOW_MULTIPLE_COLOR_CHANGES
    used_knob = False
    while True:
        cc = serial.read(1)
        if len(cc) > 0:
            ch = ord(cc)
            if 64 <= ch < 128:  # KNOB
                if not used_knob:
                    print "Changed curtains " + str(ch)
                    if ENABLE_KNOB_COLOR_CHANGE:
                        mqtt_client.publish("color/"+str(current_color), str(current_color-1), 0, False)
                    else:
                        mqtt_client.publish("all", str(current_color - 1), 0, False)
                    if not ALLOW_MULTIPLE_COLOR_CHANGES:
                        used_knob = True
            elif ch == 195 or ch == 197:  # BUTTONS
                if not ALLOW_MULTIPLE_COLOR_CHANGES:
                    used_knob = False
                print "Changed light " + str(ch)
                if ENABLE_KNOB_COLOR_CHANGE:
                    mqtt_client.publish("color/"+str(current_color), "off", 0, False)
                else:
                    mqtt_client.publish("all", "off", 0, False)


def on_connect(mqtt_client, obj, rc):
    print("rc: " + str(rc))


def on_message(mqtt_client, obj, msg):
    global current_color
    mqtt_client.unsubscribe("color/"+str(current_color))
    current_color = map_diode_color(msg.payload)
    print "color " + str(current_color) + " " + chr(current_color)
    mqtt_client.subscribe("color/" + str(current_color), 0)
    serial.write(chr(current_color % 64 + 64))
    print("Setting diode's color to " + str(current_color) + " (" + msg.topic + ")")


def on_publish(mqtt_client, obj, mid):
    # print("mid: " + str(mid))
    pass


def on_subscribe(mqtt_client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))


def on_log(mqtt_client, obj, level, string):
    print(string)

print "Starting a node with " + NODE_IP + " ip."

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

# start thread handling button and knob
try:
    thread.start_new_thread(handle_button_and_knob, ())
except:
    print "Error: unable to start thread"

mqtt_client.subscribe(NODE_IP, 0)
mqtt_client.subscribe("all", 0)

mqtt_client.loop_forever()

# ----- END MQTT LOGIC -----


