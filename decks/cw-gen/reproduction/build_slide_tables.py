"""Summarize the point-metric CSV and refresh the CW-Gen slide table data."""
import argparse
import csv
import json
from itertools import product
from io import StringIO
from math import isfinite
from pathlib import Path
from statistics import mean, stdev

ROOT = Path(__file__).resolve().parent
MAIN_DATASETS = ('ETTh1', 'ETTh2', 'Weather', 'Weather_deduplicated_segmented')
MODELS = ('FlowTS', 'Diffusion-TS')
DISPLAY_DATASET = {'Weather': 'Weather 原版', 'Weather_deduplicated_segmented': 'Weather 去重分段版'}
METRICS = ('mse', 'mae', 'crps_v', 'spatial_vs', 'common_scale_mse', 'common_scale_mae')
MARKER_START = '  // Begin generated reproduction tables.\n'
MARKER_END = '  // End generated reproduction tables.\n'


def paired_results(records, dataset, backbone, baseline, metric):
    baseline_scores = [float(records[dataset, backbone, s, baseline][metric]) for s in range(10)]
    full_scores = [float(records[dataset, backbone, s, 'Full'][metric]) for s in range(10)]
    deltas = [full - base for base, full in zip(baseline_scores, full_scores)]
    if not all(map(isfinite, (*baseline_scores, *full_scores))):
        raise ValueError(f'Non-finite values for {(dataset, backbone, baseline, metric)}')
    base_mean, full_mean = mean(baseline_scores), mean(full_scores)
    return {
        'baseline_mean': base_mean, 'full_mean': full_mean, 'delta': full_mean - base_mean,
        'delta_pct': 100 * (full_mean / base_mean - 1), 'paired_delta_sd': stdev(deltas),
        'full_lower_seeds': sum(delta < 0 for delta in deltas), 'paired_seeds': len(deltas),
    }


def build():
    with (ROOT / 'metrics_by_seed.csv').open(encoding='utf-8', newline='') as source:
        rows = list(csv.DictReader(source))
    records = {(x['dataset'], x['backbone'], int(x['seed']), x['method']): x for x in rows}
    if len(rows) != 240 or len(records) != 240:
        raise ValueError('Expected 240 distinct method-level results')
    comparisons = [
        ('main', 'Raw', MAIN_DATASETS),
        ('covariance', 'Diag', ('Weather',)),
        ('gaussian', 'Gaussian', MAIN_DATASETS[:3]),
    ]
    tables = {name: [] for name, _, _ in comparisons}
    summaries = []
    for name, baseline, datasets in comparisons:
        for dataset, backbone in product(datasets, MODELS):
            display = [DISPLAY_DATASET.get(dataset, dataset), backbone]
            for metric in METRICS:
                if metric.startswith('common_scale') and not dataset.startswith('Weather'):
                    continue
                result = paired_results(records, dataset, backbone, baseline, metric)
                summaries.append({
                    'comparison': name, 'dataset': dataset, 'backbone': backbone,
                    'baseline': baseline, 'metric': metric, **result,
                })
                if metric not in ('mse', 'mae'):
                    continue
                base, full, delta = (result[key] for key in ('baseline_mean', 'full_mean', 'delta_pct'))
                if name == 'main':
                    display.extend([f'{base:.3f}', f'{full:.3f}', f'{delta:+.1f}%'])
                else:
                    display.append(f'{base:.3f} → {full:.3f}')
            tables[name].append(display)
    summary = StringIO(newline='')
    writer = csv.DictWriter(summary, fieldnames=list(summaries[0]), lineterminator='\n')
    writer.writeheader()
    writer.writerows(summaries)
    visuals = ROOT.parent / 'visuals.js'
    script = visuals.read_text(encoding='utf-8')
    before, remainder = script.split(MARKER_START, 1)
    _, after = remainder.split(MARKER_END, 1)
    lines = ['  const reproductionTables = {']
    for name, rows in tables.items():
        lines.append(f'    {name}: [')
        lines.extend(f'      {json.dumps(row, ensure_ascii=False)},' for row in rows)
        lines.append('    ],')
    lines.extend(['  };', ''])
    updated = before + MARKER_START + '\n'.join(lines) + MARKER_END + after
    return visuals, script, updated, summary.getvalue()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify that slides already use the CSV results')
    args = parser.parse_args()
    path, original, updated, summary = build()
    summary_path = ROOT / 'paired_summary.csv'
    if args.check:
        if original != updated or summary_path.read_bytes() != summary.encode('utf-8'):
            raise SystemExit('Slide tables or paired summaries differ from metrics_by_seed.csv')
    else:
        path.write_text(updated, encoding='utf-8')
        summary_path.write_bytes(summary.encode('utf-8'))
