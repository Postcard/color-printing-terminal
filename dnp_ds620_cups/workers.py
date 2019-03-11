import threading
import logging
import time
import json
import tempfile
import io
import requests

import cups
import boto3

import settings

logger = logging.getLogger(__name__)
logging.getLogger('boto3').setLevel(logging.CRITICAL)
logging.getLogger('botocore').setLevel(logging.CRITICAL)


class StoppableThreadMixin(object):

    def __init__(self, *args, **kwargs):
        super(StoppableThreadMixin, self).__init__(*args, **kwargs)
        self._stop = threading.Event()

    def stop(self):
        self._stop.set()

    def stopped(self):
        return self._stop.isSet()


class PrinterNotFoundException(Exception):
    pass


def get_sqs_resource():
    return boto3.resource(
        'sqs',
        settings.AWS_SQS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)


class CUPSWorker(StoppableThreadMixin, threading.Thread):

    def __init__(self, queue_name, *args, **kwargs):
        super(CUPSWorker, self).__init__(*args, **kwargs)
        sqs_resource = get_sqs_resource()
        self.queue = sqs_resource.get_queue_by_name(QueueName=queue_name)
        print("printer configured")

    def _print(self, file_path):
        conn = cups.Connection()
        printers = conn.getPrinters()
        printer = printers.get(settings.PRINTER_NAME)
        if not printer:
            raise PrinterNotFoundException()
        conn.printFile(settings.PRINTER_NAME, file_path, 'poster', {'PageSize': 'w288h432'})

    def handle_print_job(self, print_job):
        portrait = print_job['portrait']
        picture_url = portrait['picture_1280']
        code = portrait['code']
        place = portrait.get('place')
        place_name = place['name'] if place else None
        event = portrait.get('event')
        event_name = event['name'] if event else None
        taken_str = portrait['taken_str']
        context = {
            'picture_url': picture_url,
            'code': code,
            'place_name': place_name,
            'event_name': event_name,
            'taken_str': taken_str,
        }
        r = requests.get(picture_url)
        with tempfile.NamedTemporaryFile() as f:
            f.write(r.content)
            self._print(f.name)

    def run(self):
        while True:
            if self.stopped():
                logger.info("Bye Bye from cups worker")
                break
            else:
                try:
                    for message in self.queue.receive_messages(MaxNumberOfMessages=10):
                        print("new print received")
                        print_job = json.loads(message.body)
                        self.handle_print_job(print_job)
                        message.delete()
                except Exception as e:
                    logger.exception(e.message)
            time.sleep(0.5)
