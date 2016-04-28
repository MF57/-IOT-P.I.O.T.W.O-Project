#Project P.I.O.T.W.O

###(v)Copernicus
To work with vCopernicus, first visit [this vCopernicus repository](https://github.com/mkwm/vcopernicus).

1. Customize settings (can be set differently for each device):
 - ALLOW_IP_AUTO_CONFIG - if set to True, NODE_IP (node identifier) is set by itself,
 if set to False, you need to set it by yourself (by changing "enter_node_ip"). It has
 be set to False when working with vCopernicuses.
 - ENABLE_KNOB_COLOR_CHANGE - if set to False, device input will change colors on every other devices,
 if set to True, device input  will change colors only of devices having it's previous color
 - ALLOW_MULTIPLE_COLOR_CHANGES - if set to True, device will react to every knob state change,
 if set to False, device will react only to first knob state change

2. Copy vcopernicus_light_show package to your devices, and run them
> python code.py