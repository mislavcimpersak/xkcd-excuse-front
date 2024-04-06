from io import BytesIO
import base64
from js import fetchData

from PIL import Image, ImageDraw, ImageFont


# since base excuse image is fixed, this values are also constant
IMAGE_WIDTH = 413
# Y text coordinates
WHO_TEXT_Y = 12
LEGIT_TEXT_Y = 38
WHY_TEXT_Y = 85
WHAT_TEXT_Y = 222


async def _get_text_font(size: int) -> ImageFont:
    """
    Loads font and sets font size for text on image

    :param size: font size

    :returns: ImageFont object with desired font size set
    """
    data = await fetchData("/xkcd-script.ttf")
    buffer = BytesIO(bytes(data))
    return ImageFont.truetype(buffer, size)

async def _get_blank_image() -> Image:
    """
    Loads font and sets font size for text on image

    :param size: font size

    :returns: ImageFont object with desired font size set
    """
    data = await fetchData("/blank_excuse.png")
    buffer = BytesIO(bytes(data))
    return Image.open(buffer)

def _check_user_input_not_empty(
    errors: list, text: str, error_code: int) -> list:
    """
    Checks if user input size can actually fit in image.
    If not, add an error to existing list of errors.

    :param errors: list of errors
    :param text: user's input
    :param error_code: internal error code

    :returns: list of errors
    """
    if not text or text.strip() == '':
        errors.append({
            'code': error_code,
            'message': 'This field is required.'
        })
    return errors

def _check_user_input_size(errors: list, max_width: float, text: str,
    text_font: ImageFont, error_code: int) -> list:
    """
    Checks if user input size can actually fit in image.
    If not, add an error to existing list of errors.

    :param errors: list of errors
    :param max_width: max size of text
    :param text: user's input
    :param text_font: font to be displayed on image
    :param error_code: internal error code

    :returns: list of errors
    """
    if text_font.getlength(text) > max_width:
        errors.append({
            'code': error_code,
            'message': 'Text too long.'
        })
    return errors



async def get_excuse_image(who: str, why: str, what: str):
    """
    Load excuse template and write on it.
    If there are errors (non-existant text, some text too long),
    return list of errors.

    :param who: who's excuse
    :param why: what is the excuse
    :param what: what are they saying

    :returns: pillow Image object with excuse written on it
    """
    errors = []

    errors = _check_user_input_not_empty(errors, who, 1010)
    errors = _check_user_input_not_empty(errors, why, 1020)
    errors = _check_user_input_not_empty(errors, what, 1030)

    who = 'The #1  {} excuse'.format(who).upper()
    legit = 'for legitimately slacking off:'.upper()
    why = '"{}."'.format(why).upper()
    what = '{}!'.format(what).upper()

    who_font = await _get_text_font(24)
    legit_font = await _get_text_font(24)
    why_font = await _get_text_font(22)
    what_font = await _get_text_font(18)

    errors = _check_user_input_size(errors, IMAGE_WIDTH, who, who_font, 1011)
    errors = _check_user_input_size(errors, IMAGE_WIDTH, why, why_font, 1021)
    errors = _check_user_input_size(errors, 135, what, what_font, 1031)

    if errors:
        return errors

    # in the beginning this is an image without an excuse
    image = (await _get_blank_image()).convert('RGBA')
    draw = ImageDraw.Draw(image, 'RGBA')

    draw.text((_get_text_x_position(IMAGE_WIDTH, who, who_font), WHO_TEXT_Y),
        who, fill=(0, 0, 0, 200), font=who_font)
    draw.text((_get_text_x_position(IMAGE_WIDTH, legit, legit_font), LEGIT_TEXT_Y),
        legit, fill=(0, 0, 0, 200), font=legit_font)
    draw.text((_get_text_x_position(IMAGE_WIDTH, why, why_font), WHY_TEXT_Y),
        why, fill=(0, 0, 0, 200), font=why_font)
    draw.text((_get_text_x_position(IMAGE_WIDTH, what, what_font, 24), WHAT_TEXT_Y),
        what, fill=(0, 0, 0, 200), font=what_font)

    buffer = BytesIO()
    image.save(buffer, format="png")
    return base64.b64encode(buffer.getvalue()).decode()


def _get_text_x_position(image_width: int, text: str, text_font: ImageFont, offset: int=None) -> float:
    """
    Calculate starting X coordinate for given text and text size.

    :param text: user's text
    :param text_font:
    :param offset: how much to move from center of the image to the right

    :returns: text's X coordinate
    """
    offset = 0 if offset is None else offset
    return image_width - (image_width / 2 + text_font.getlength(text) / 2) - offset



get_excuse_image
