#!/bin/bash

echo "Installing DNP DS 620"

lpadmin \
    -p 'DP_DS620' \
    -v 'gutenprint53+usb://dnp-ds620/DS6C89017423' \
    -m 'gutenprint.5.3://dnp-ds620/expert' \
    -o 'ColorModel=Gray' \
    -o 'StpQuality='${QUALITY:-Standard} \
    -o 'Duplex=DuplexNoTumble' \
    -o 'StpBrightness='${BRIGHTNESS:-700} \
    -o 'StpContrast='${CONTRAST:-1100} \
    -o 'StpImageType=Photo' \
    -E

lpadmin \
    -p 'Xerox_Phaser_7100N' \
    -v 'usb://Xerox/Phaser%207100N?serial=026552' \
    -P '/usr/share/ppd/Xerox_Phaser_7100N.ppd' \
    -o 'ColorModel=Gray' \
    -o 'StpQuality='${QUALITY:-Standard} \
    -o 'Duplex=DuplexNoTumble' \
    -o 'StpBrightness='${BRIGHTNESS:-700} \
    -o 'StpContrast='${CONTRAST:-1100} \
    -o 'StpImageType=Photo' \
    -E

lpoptions -p DP_DS620 -l

export SQS_QUEUE_NAME="$(python get_printer_queue_name.py)"

echo 'there'
env

python -m dnp_ds620_cups &
npm start
