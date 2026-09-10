"""Command dispatch for the analysis engine.

Flags mirror the Node tools this package replaces so the workbench server's call
sites keep the same shape. Each subcommand writes its artifacts to --out and
prints a short human-readable summary to stdout, except score-one, which prints
a JSON object for the server to parse.
"""

import argparse
import sys


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="ivo_analysis", description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    profile = sub.add_parser("profile", help="Profile a source CSV against its connector schema.")
    profile.add_argument("--data", required=True)
    profile.add_argument("--schema")
    profile.add_argument("--out", required=True)
    profile.add_argument("--label", default="")

    compare = sub.add_parser("compare", help="Compare a paired ERP and IVO export.")
    compare.add_argument("--source", required=True)
    compare.add_argument("--dest", required=True)
    compare.add_argument("--out", required=True)
    compare.add_argument("--source-label", default="")
    compare.add_argument("--dest-label", default="")

    score = sub.add_parser("score", help="Generate a mapping proposal.")
    score.add_argument("--erp-schema", required=True)
    score.add_argument("--erp-profile", required=True)
    score.add_argument("--ivo-reference", required=True)
    score.add_argument("--comparison")
    score.add_argument("--execution-evidence")
    score.add_argument("--approved")
    score.add_argument("--reset")
    score.add_argument("--out", required=True)
    score.add_argument("--label", default="")

    score_one = sub.add_parser("score-one", help="Score one source/destination field pair.")
    score_one.add_argument("--erp-schema", required=True)
    score_one.add_argument("--erp-profile", required=True)
    score_one.add_argument("--ivo-reference", required=True)
    score_one.add_argument("--source-field", required=True)
    score_one.add_argument("--dest-field", required=True)

    aggregate = sub.add_parser("aggregate", help="Aggregate a multi-tenant IVO corpus.")
    aggregate.add_argument("--corpus", required=True)
    aggregate.add_argument("--object", required=True)
    aggregate.add_argument("--out", required=True)
    aggregate.add_argument("--exclude-tenant", action="append", default=[])

    fit = sub.add_parser("fit", help="Fit scoring weights from approved mappings.")
    fit.add_argument("--observations", required=True)
    fit.add_argument("--out", required=True)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    print(f"ivo_analysis: '{args.command}' is not implemented yet.", file=sys.stderr)
    return 1
