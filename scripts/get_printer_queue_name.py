import sys
import os

import figure

figure.api_base = os.environ["API_HOST"]
figure.token = os.environ["TOKEN"]

if __name__ == '__main__':
    printer = figure.Printer.get(os.environ["RESIN_DEVICE_UUID"])
    sqs_queue = printer.get('sqs_queue_name')
    print(sqs_queue)
    sys.exit()
