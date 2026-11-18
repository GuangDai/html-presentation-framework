"""Re-score the archived CW-Gen Raw vs Full tests. Requires NumPy."""
import argparse
import csv
import gzip
import json
from collections import defaultdict
from itertools import product
from math import isclose
from pathlib import Path
from statistics import mean

import numpy as np

DATASETS = ('ETTh1', 'ETTh2', 'Weather', 'Weather_deduplicated_segmented')
BACKBONES = ('FlowTS', 'Diffusion-TS')
METHODS = ('Raw', 'Full')
METRICS = ('mse', 'mae', 'crps_v', 'spatial_vs', 'common_scale_mse', 'common_scale_mae')
KEYS = ('dataset', 'backbone', 'method')


def recompute(root, output):
    output.mkdir(parents=True)
    counts = dict(tests=0, method_evaluations=0, origin_channel_rows=0, scalar_targets=0)
    splits = {}
    weather_truth = {}
    max_difference = dict(mse=0.0, mae=0.0)
    with (
        (output / 'main_metrics.csv').open('w', encoding='utf-8', newline='') as scores,
        gzip.open(output / 'errors_by_origin_channel.csv.gz', 'wt', encoding='utf-8', newline='') as details,
    ):
        aggregate = csv.writer(scores, lineterminator='\n')
        breakdown = csv.writer(details, lineterminator='\n')
        aggregate.writerow(KEYS + ('seed_count', 'origin_count', 'draw_count', 'horizon', 'channel_count') + METRICS)
        breakdown.writerow(KEYS + ('origin', 'channel', 'target_count', 'sse', 'sae'))
        for dataset, backbone in product(DATASETS, BACKBONES):
            is_weather = dataset.startswith('Weather')
            n, horizon, d = (54, 192, 21) if is_weather else (15, 192, 7)
            n_seeds = 10
            sums = {method: np.zeros((2, n, d), dtype=np.float64) for method in METHODS}
            metrics = {method: defaultdict(list) for method in METHODS}
            for seed in range(n_seeds):
                task = f'evaluate.P.{dataset}.{backbone}.s{seed:02d}'
                directory = root / task
                record = json.loads((directory / 'metrics.json').read_text())
                assert (record['dataset'], record['backbone'], record['seed']) == (dataset, backbone, seed), task
                assert record['status'] == 'completed' and record['draws'] == 100, task
                identity = {
                    'origins': record['origins'], 'channels': record['value_columns_with_source_units'],
                    'data_git_blob': record['data_git_blob'],
                }
                assert splits.setdefault(dataset, identity) == identity and len(identity['channels']) == d, task
                counts['tests'] += 1
                with np.load(directory / 'samples.npz', allow_pickle=False) as arrays:
                    truth = arrays['truth'].astype(np.float64)
                    origins = arrays['origins']
                    assert truth.shape == (n, horizon, d) and np.isfinite(truth).all(), task
                    assert origins.tolist() == identity['origins'] and len(np.unique(origins)) == n, task
                    if is_weather:
                        source_scale = arrays['scaler_scale']
                        source_mean = arrays['scaler_mean']
                        common_scale = arrays['common_scale']
                        assert np.all(source_scale > 0) and np.all(common_scale > 0), task
                        physical_truth = truth * source_scale + source_mean
                        if dataset == 'Weather':
                            weather_truth[backbone, seed] = (origins, physical_truth, common_scale)
                        else:
                            old_origins, old_truth, old_scale = weather_truth[backbone, seed]
                            assert np.array_equal(origins, old_origins) and np.array_equal(common_scale, old_scale), task
                            np.testing.assert_allclose(physical_truth, old_truth, atol=2e-4, rtol=1e-6)
                    for method in METHODS:
                        samples = arrays[method]
                        assert samples.shape == (n, 100, horizon, d) and np.isfinite(samples).all(), (task, method)
                        error = samples.mean(axis=1, dtype=np.float64) - truth
                        squared, absolute = np.square(error), np.abs(error)
                        saved = record['arms'][method]
                        arm_metrics = metrics[method]
                        for key, actual, expected in (
                            ('mse', float(squared.mean()), saved['MSE_ensemble_mean']),
                            ('mae', float(absolute.mean()), saved['MAE_ensemble_mean']),
                        ):
                            assert isclose(actual, expected, rel_tol=1e-11, abs_tol=1e-12), (task, method, key, actual, expected)
                            max_difference[key] = max(max_difference[key], abs(actual - expected))
                            arm_metrics[key].append(actual)
                        arm_metrics['crps_v'].append(saved['CRPS_V'])
                        arm_metrics['spatial_vs'].append(float(np.mean(saved['spatial_fair_VS_per_origin'])))
                        if is_weather:
                            ratio = source_scale / common_scale
                            arm_metrics['common_scale_mse'].append(float((squared * ratio**2).mean()))
                            arm_metrics['common_scale_mae'].append(float((absolute * ratio).mean()))
                        sums[method][0] += squared.sum(axis=1)
                        sums[method][1] += absolute.sum(axis=1)
                        counts['method_evaluations'] += 1
                        del samples

            for method in METHODS:
                arm_metrics = metrics[method]
                aggregate.writerow((
                    dataset, backbone, method, n_seeds, n, 100, horizon, d,
                    *[mean(arm_metrics[key]) if arm_metrics[key] else '' for key in METRICS],
                ))
                sse, sae = sums[method]
                breakdown.writerows(
                    (dataset, backbone, method, origin, channel, n_seeds * horizon, sse[i, j], sae[i, j])
                    for i, origin in enumerate(splits[dataset]['origins'])
                    for j, channel in enumerate(splits[dataset]['channels'])
                )
                counts['origin_channel_rows'] += n * d
                counts['scalar_targets'] += n * d * horizon * n_seeds
    assert counts['tests'] == 80 and counts['method_evaluations'] == 160
    (output / 'audit.json').write_text(json.dumps({
        **counts, 'max_absolute_difference_from_saved': max_difference,
        'source_run': root.name, 'datasets': splits,
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({**counts, 'max_absolute_difference_from_saved': max_difference}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('run_root', type=Path, help='Directory containing the 80 evaluate.P.* runs')
    parser.add_argument('output', type=Path, help='New directory for the metrics and audit')
    args = parser.parse_args()
    recompute(args.run_root, args.output)
