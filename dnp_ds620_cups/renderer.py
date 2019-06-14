from jinja2 import Environment, PackageLoader
import settings


JINJA_ENV = Environment(
    loader=PackageLoader('dnp_ds620_cups', 'templates')
)


def render(print_job):
    portrait = print_job['portrait']
    picture_url = portrait[settings.IMAGE_TO_PRINT]
    taken_str = portrait['taken_str']

    place = portrait.get('place')
    place_name = place['name'] if place else None

    event = portrait.get('event')
    event_name = event['name'] if event else None

    template = JINJA_ENV.get_template('photomaton.html')
    return template.render({
        'picture_url': picture_url,
        'place_name': place_name,
        'event_name': event_name,
        'taken_str': taken_str,
        'css_url': 'file://%s/templates/photomaton.css' % settings.PROJECT_PATH,
        'logo_url': 'https://figure-production.s3.amazonaws.com/media/images/1552411221704.png'
    })

