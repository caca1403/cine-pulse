"""Stable JSON CLI for the Python provider API, shared by APK and diagnostics."""
import argparse
import json
import sys
from resolve import dispatch_with_budget


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--params-json', required=True)
    parser.add_argument('--budget', type=int, default=30)
    options = parser.parse_args()
    params = json.loads(options.params_json)
    args = dict(params)
    args.setdefault('titles', [params[f't{i}'] for i in range(6) if params.get(f't{i}')])
    result = dispatch_with_budget(params.get('provider', ''), args, options.budget)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
