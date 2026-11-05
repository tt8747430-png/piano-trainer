# R32: each score layout described in one line under the layout tiles, en and ru.
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
CHANGES = {
    'en': (
        """      about:
        'Page view: on A4 pages, as it prints. Vertical scroll: line under line, scrolled down. Panorama: the whole song in one line, scrolled across.',
    },""",
        """      // The layout chosen, said in one line under the tiles (R32).
      describe: {
        page: 'Printed A4 pages, as the score will print.',
        vertical: 'Systems down the screen at full width.',
        panorama: 'One continuous system that scrolls sideways.',
      },
    },""",
    ),
    'ru': (
        """      about:
        'Страницы: на листах A4, как в печати. Прокрутка вниз: строка под строкой. Панорама: вся песня одной строкой, с прокруткой вбок.',
    },""",
        """      describe: {
        page: 'Страницы A4 — так, как ноты будут напечатаны.',
        vertical: 'Системы одна под другой во всю ширину экрана.',
        panorama: 'Одна непрерывная система с прокруткой вбок.',
      },
    },""",
    ),
}
for lang, (old, new) in CHANGES.items():
    path = ROOT / f'src/shared/i18n/locales/{lang}/music.ts'
    text = path.read_text()
    assert old in text, lang
    path.write_text(text.replace(old, new))
