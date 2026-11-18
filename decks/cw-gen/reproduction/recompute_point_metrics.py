"""Re-score the saved CW-Gen P evaluations. Requires NumPy."""
import argparse
import csv
import gzip
import json
from itertools import product
from math import isclose
from pathlib import Path

import numpy as np

DATASETS = ('ETTh1', 'ETTh2', 'Weather', 'Weather_deduplicated_segmented')
BACKBONES = ('FlowTS', 'Diffusion-TS')
METHOD_FIELDS = ('dataset', 'backbone', 'seed', 'method')
POINT_FIELDS = METHOD_FIELDS + ('origin', 'channel', 'time_steps', 'sse', 'sae')
RUN_FIELDS = METHOD_FIELDS + (
    'origin_count', 'draw_count', 'horizon', 'channel_count', 'mse', 'mae',
    'crps_v', 'spatial_vs', 'common_scale_mse', 'common_scale_mae',
)


def recompute(root, output):
    output.mkdir(parents=True)
    counts = dict(tests=0, methods=0, origin_channel_rows=0, scalar_targets=0)
    identities = []
    weather_truth = {}
    max_difference = dict(mse=0.0, mae=0.0)
    with (
        (output / 'metrics_by_seed.csv').open('w', encoding='utf-8', newline='') as seeds,
        gzip.open(output / 'errors_by_origin_channel.csv.gz', 'wt', encoding='utf-8', newline='') as detailed,
    ):
        aggregate = csv.writer(seeds, lineterminator='\n')
        breakdown = csv.writer(detailed, lineterminator='\n')
        aggregate.writerow(RUN_FIELDS)
        breakdown.writerow(POINT_FIELDS)
        for dataset, backbone, seed in product(DATASETS, BACKBONES, range(10)):
            task = f'evaluate.P.{dataset}.{backbone}.s{seed:02d}'
            directory = root / task
            record = json.loads((directory / 'metrics.json').read_text())
            assert (record['dataset'], record['backbone'], record['seed']) == (dataset, backbone, seed), task
            assert record['status'] == 'completed' and record['draws'] == 100, task
            is_weather = dataset.startswith('Weather')
            methods = ['Raw', 'Full']
            if dataset != 'Weather_deduplicated_segmented':
                methods.append('Gaussian')
            if dataset == 'Weather':
                methods.append('Diag')
            assert set(record['arms']) == set(methods), task
            columns = record['value_columns_with_source_units']
            n, horizon, d = (54, 192, 21) if is_weather else (15, 192, 7)
            assert len(columns) == d, task
            counts['tests'] += 1
            identities.append({
                'task': task, 'origins': record['origins'], 'channels': columns,
                'data_git_blob': record['data_git_blob'], 'sample_git_blob': record['sample_git_blob'],
                'checkpoints': record['frozen_checkpoint_git_blobs'],
                'fid_status': record['FID_status'],
            })
            with np.load(directory / 'samples.npz', allow_pickle=False) as arrays:
                truth = arrays['truth'].astype(np.float64)
                origins = arrays['origins']
                assert truth.shape == (n, horizon, d) and np.isfinite(truth).all(), task
                assert origins.tolist() == record['origins'] and len(np.unique(origins)) == n, task
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
                for method in methods:
                    samples = arrays[method]
                    assert samples.shape == (n, 100, horizon, d) and np.isfinite(samples).all(), (task, method)
                    error = samples.mean(axis=1, dtype=np.float64) - truth
                    squared, absolute = np.square(error), np.abs(error)
                    mse, mae = float(squared.mean()), float(absolute.mean())
                    saved = record['arms'][method]
                    for key, actual, expected in (
                        ('mse', mse, saved['MSE_ensemble_mean']),
                        ('mae', mae, saved['MAE_ensemble_mean']),
                    ):
                        assert isclose(actual, expected, rel_tol=1e-11, abs_tol=1e-12), (task, method, key, actual, expected)
                        max_difference[key] = max(max_difference[key], abs(actual - expected))
                    common_mse = common_mae = ''
                    if is_weather:
                        ratio = source_scale / common_scale
                        common_mse = float((squared * ratio**2).mean())
                        common_mae = float((absolute * ratio).mean())
                    aggregate.writerow((
                        dataset, backbone, seed, method, n, 100, horizon, d, mse, mae,
                        saved['CRPS_V'], float(np.mean(saved['spatial_fair_VS_per_origin'])), common_mse, common_mae,
                    ))
                    sse, sae = squared.sum(axis=1), absolute.sum(axis=1)
                    breakdown.writerows(
                        (dataset, backbone, seed, method, int(origin), columns[channel],
                         horizon, sse[index, channel], sae[index, channel])
                        for index, origin in enumerate(origins) for channel in range(d)
                    )
                    counts['methods'] += 1
                    counts['origin_channel_rows'] += n * d
                    counts['scalar_targets'] += n * d * horizon
                    del samples
    assert counts['tests'] == 80 and counts['methods'] == 240
    (output / 'audit.json').write_text(json.dumps({
        **counts, 'max_absolute_difference_from_saved': max_difference,
        'source_run': root.name, 'evaluations': identities,
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({**counts, 'max_absolute_difference_from_saved': max_difference}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('run_root', type=Path, help='Directory containing the 80 evaluate.P.* runs')
    parser.add_argument('output', type=Path, help='New directory for the metrics and audit')
    args = parser.parse_args()
    recompute(args.run_root, args.output)
