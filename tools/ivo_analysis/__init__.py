"""Statistical analysis engine for IVO customer mapping.

Replaces the former Node tools (csv-profiler.js, data-comparer.js,
mapping-suggester.js, stats.js). The workbench server invokes this package as a
subprocess and reads the files it writes; see cli.py for the command contract.
"""

__version__ = "0.1.0"
