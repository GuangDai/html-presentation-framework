"""Illustrate three transforms of the same two-channel sample."""
from io import StringIO
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse
import numpy as np


def inverse_root(covariance):
    values, vectors = np.linalg.eigh(covariance)
    return (vectors * values**-.5) @ vectors.T


def draw():
    rng = np.random.default_rng(247)
    points = rng.normal(size=(112, 2))
    points -= points.mean(axis=0)
    uncorrelated = points @ inverse_root(np.cov(points.T))
    source = uncorrelated @ np.array([[1.72, .89], [0, .52]]) + [2.0, 1.2]
    centered = source - source.mean(axis=0)
    covariance = np.cov(centered.T)
    standardized = centered / np.sqrt(np.diag(covariance))
    whitened = centered @ inverse_root(covariance)
    np.testing.assert_allclose(np.diag(np.cov(standardized.T)), [1, 1])
    assert np.corrcoef(standardized.T)[0, 1] > .8
    np.testing.assert_allclose(np.cov(whitened.T), np.eye(2), atol=1e-12)
    selected = np.argmin(np.linalg.norm(centered - [2.4, 1.30], axis=1))

    plt.rcParams.update({'svg.fonttype': 'path', 'svg.hashsalt': 'cwgen-whitening'})
    figure, axes = plt.subplots(1, 3, figsize=(17.68, 2.94))
    figure.subplots_adjust(left=.025, right=.975, bottom=.16, top=.94, wspace=.14)
    panels = (centered, standardized, whitened)
    x_limit, y_limit = np.maximum([4.2, 3.25], np.abs(np.vstack(panels)).max(axis=0) + .12)
    for axis, values in zip(axes, panels):
        axis.set_aspect('equal', adjustable='box')
        axis.set_xlim(-x_limit, x_limit)
        axis.set_ylim(-y_limit, y_limit)
        axis.set_xticks([-4, -2, 0, 2, 4])
        axis.set_yticks([-2, 0, 2])
        axis.tick_params(length=0, labelsize=12, pad=3, labelcolor='#475569')
        axis.grid(color='#e3ebf4', linewidth=.75)
        axis.axhline(0, color='#a1aec0', linewidth=1.1)
        axis.axvline(0, color='#a1aec0', linewidth=1.1)
        for side in axis.spines.values():
            side.set_color('#cbd5e1')
        vals, basis = np.linalg.eigh(np.cov(values.T))
        angle = np.degrees(np.arctan2(basis[1, -1], basis[0, -1]))
        axis.add_patch(Ellipse((0, 0), 4*np.sqrt(vals[1]), 4*np.sqrt(vals[0]), angle=angle,
                               facecolor='#eff6ff', edgecolor='#1d4ed8', linewidth=1.6, alpha=.88, zorder=2))
        axis.scatter(values[:, 0], values[:, 1], s=16, color='#2563eb', alpha=.56, linewidths=0, zorder=3)
        x, y = values[selected]
        axis.annotate('', xy=(x, y), xytext=(0, 0), arrowprops={
            'arrowstyle': '->', 'color': '#c2410c', 'lw': 2.2, 'shrinkB': 3,
        }, zorder=5)
        axis.scatter([x], [y], s=37, color='#c2410c', zorder=6)

    buffer = StringIO()
    figure.savefig(buffer, format='svg', metadata={'Date': None, 'Title': 'Centering, standardizing and whitening'})
    plt.close(figure)
    target = Path(__file__).with_name('whitening_comparison.svg')
    target.write_text('\n'.join(line.rstrip() for line in buffer.getvalue().splitlines()) + '\n', encoding='utf-8')


if __name__ == '__main__':
    draw()
