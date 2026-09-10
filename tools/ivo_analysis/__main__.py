"""Entry point for `python -m ivo_analysis`."""

import sys

from .cli import main

if __name__ == "__main__":
    sys.exit(main())
