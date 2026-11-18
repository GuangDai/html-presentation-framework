"""Refresh the CW and w/o CW slide table from the aggregate CSV."""
import argparse
import csv
import json
from io import StringIO
from itertools import product
from math import isfinite
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATASETS = ('ETTh1', 'ETTh2', 'Weather', 'Weather_deduplicated_segmented')
MODELS = ('FlowTS', 'Diffusion-TS')
METHODS = ('Full', 'Raw')
DISPLAY_DATASET = {'Weather': 'Weather 原版', 'Weather_deduplicated_segmented': 'Weather 去重分段版'}
METRICS = ('mse', 'mae', 'crps_v', 'spatial_vs', 'common_scale_mse', 'common_scale_mae')
MARKER_START = '  // Begin generated reproduction tables.\n'
MARKER_END = '  // End generated reproduction tables.\n'


def build():
    with (ROOT / 'main_metrics.csv').open(encoding='utf-8', newline='') as source:
        rows = list(csv.DictReader(source))
    records = {(r['dataset'], r['backbone'], r['method']): r for r in rows}
    if len(rows) != 16 or set(records) != set(product(DATASETS, MODELS, METHODS)):
        raise ValueError('Expected one aggregate row per dataset, model and method')

    tables = {model: [] for model in MODELS}
    summary = StringIO(newline='')
    writer = csv.writer(summary, lineterminator='\n')
    writer.writerow(('dataset', 'backbone', 'metric', 'cw', 'without_cw', 'delta_cw_minus_without', 'relative_change_pct'))
    for model, dataset in product(MODELS, DATASETS):
        display = [DISPLAY_DATASET.get(dataset, dataset)]
        for metric in METRICS:
            if metric.startswith('common_scale') and not dataset.startswith('Weather'):
                continue
            cw, without = (float(records[dataset, model, method][metric]) for method in METHODS)
            if not (isfinite(cw) and isfinite(without) and without > 0):
                raise ValueError(f'Invalid metric for {dataset} {model} {metric}')
            writer.writerow((dataset, model, metric, cw, without, cw - without, 100 * (cw / without - 1)))
            if metric in ('mse', 'mae'):
                display.extend([f'{without:.3f}', f'{cw:.3f}'])
        tables[model].append(display)

    path = ROOT.parent / 'visuals.js'
    original = path.read_text(encoding='utf-8')
    before, remainder = original.split(MARKER_START, 1)
    _, after = remainder.split(MARKER_END, 1)
    lines = ['  const reproductionTables = {']
    for model, rows in tables.items():
        lines.append(f'    {json.dumps(model)}: [')
        lines.extend(f'      {json.dumps(row, ensure_ascii=False)},' for row in rows)
        lines.append('    ],')
    lines.extend(['  };', ''])
    return path, original, before + MARKER_START + '\n'.join(lines) + MARKER_END + after, summary.getvalue()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify the table and summary against main_metrics.csv')
    args = parser.parse_args()
    path, original, updated, summary = build()
    summary_path = ROOT / 'paired_summary.csv'
    if args.check:
        if original != updated or summary_path.read_bytes() != summary.encode('utf-8'):
            raise SystemExit('Slide tables or summaries differ from main_metrics.csv')
    else:
        path.write_text(updated, encoding='utf-8')
        summary_path.write_bytes(summary.encode('utf-8'))
