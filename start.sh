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

# Activate alsamixer sound
amixer set Master 50%

# lpoptions -p DP_DS620 -l

# Query queue name for both scripts (because only pyton's sdk have the printer discovery feature)
export SQS_QUEUE_NAME="$(python scripts/get_printer_queue_name.py)"

python -m dnp_ds620_cups &
npm start
