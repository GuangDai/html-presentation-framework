"""Render the four ETT trajectory examples used on slide 9."""
import argparse
import csv
import json
from io import StringIO
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager, ticker
from matplotlib.lines import Line2D
import numpy as np

ROOT = Path(__file__).resolve().parent
EXAMPLES = [
    ('ETTh1', 'FlowTS', 'OT'),
    ('ETTh1', 'Diffusion-TS', 'LULL'),
    ('ETTh2', 'FlowTS', 'MUFL'),
    ('ETTh2', 'Diffusion-TS', 'HULL'),
]
HISTORY = '#8795a7'
TRUTH = '#172438'
CW = '#1d4ed8'
WITHOUT_CW = '#b45322'


def render(font_path):
    regular = font_manager.FontProperties(fname=font_path)
    plt.rcParams.update({'svg.fonttype': 'path', 'svg.hashsalt': 'cwgen-ett-forecast'})
    series = ROOT / 'forecast_examples'
    index = {(r['dataset'], r['backbone']): r for r in json.loads((series / 'index.json').read_text())}
    fig, axes = plt.subplots(2, 2, figsize=(18.16, 8.55), sharex=True, facecolor='white')
    fig.subplots_adjust(left=.077, right=.981, bottom=.11, top=.875, wspace=.19, hspace=.48)
    legend = [
        Line2D([], [], color=HISTORY, lw=2.0, label='历史'),
        Line2D([], [], color=TRUTH, lw=2.2, label='真实值'),
        Line2D([], [], color=CW, lw=2.4, label='CW'),
        Line2D([], [], color=WITHOUT_CW, lw=2.1, ls=(0, (5, 2.7)), label='w/o CW'),
    ]
    fig.legend(handles=legend, loc='upper center', bbox_to_anchor=(.5, .973), ncol=4, frameon=False,
               prop=regular.copy(), labelcolor='#26364d', handlelength=2.3, columnspacing=2.7)
    legend_box = fig.legends[0]
    for text in legend_box.get_texts():
        text.set_fontsize(17)
    scores = []
    for ax, (dataset, backbone, variable) in zip(axes.flat, EXAMPLES):
        row = index[dataset, backbone]
        col = row['columns'].index(variable)
        with np.load(series / row['file'], allow_pickle=False) as arrays:
            assert arrays['Raw'].shape == arrays['Full'].shape == (100, 192, len(row['columns']))
            assert arrays['history'].shape == (168, len(row['columns']))
            assert arrays['truth'].shape == (192, len(row['columns']))
            scale = float(arrays['scaler_scale'][col])
            offset = float(arrays['scaler_mean'][col])
            history = arrays['history'][:, col].astype(np.float64) * scale + offset
            truth = arrays['truth'][:, col].astype(np.float64) * scale + offset
            cw = arrays['Full'][:, :, col].mean(axis=0, dtype=np.float64) * scale + offset
            without = arrays['Raw'][:, :, col].mean(axis=0, dtype=np.float64) * scale + offset
        err_cw, err_without = cw - truth, without - truth
        mse_cw, mse_without = np.mean(err_cw**2), np.mean(err_without**2)
        mae_cw, mae_without = np.mean(np.abs(err_cw)), np.mean(np.abs(err_without))
        assert mse_cw < mse_without and mae_cw < mae_without, (dataset, backbone, variable)
        scores.append((dataset, backbone, variable, mse_cw, mse_without, mae_cw, mae_without))
        past = np.arange(-len(history), 0)
        future = np.arange(len(truth))
        ax.axvspan(0, 192, facecolor='#f4f7fc', zorder=0)
        ax.grid(axis='y', color='#dbe4ef', linewidth=.85, zorder=1)
        ax.axvline(0, color='#94a3b8', linewidth=1.1, ls=(0, (3, 3)), zorder=2)
        ax.plot(past, history, color=HISTORY, lw=1.55, zorder=3)
        ax.plot(future, truth, color=TRUTH, lw=1.95, zorder=4)
        ax.plot(future, without, color=WITHOUT_CW, lw=2.05, ls=(0, (5, 2.7)), zorder=5)
        ax.plot(future, cw, color=CW, lw=2.15, zorder=6)
        ax.set_title(f'{dataset}    {backbone}    {variable}', loc='left',
                     fontsize=20, fontweight='bold', color=TRUTH, pad=12)
        ax.set_xlim(-168, 192)
        ax.set_xticks([-168, -84, 0, 96, 192])
        ax.tick_params(axis='x', labelbottom=True)
        ax.yaxis.set_major_locator(ticker.MaxNLocator(nbins=4, min_n_ticks=3))
        ax.tick_params(axis='both', length=0, pad=7, color='#64748b', labelcolor='#475569', labelsize=14)
        for edge in ('top', 'right', 'left'):
            ax.spines[edge].set_visible(False)
        ax.spines['bottom'].set_color('#c8d4e2')
        ax.margins(y=.12)
    fig.supxlabel('相对预测起点（小时）', y=.017, fontsize=17, fontproperties=regular, color='#475569')
    fig.supylabel('原始数值', x=.018, fontsize=17, fontproperties=regular, color='#475569')
    svg = StringIO()
    fig.savefig(svg, format='svg', metadata={'Title': 'ETTh1 / ETTh2 forecasts', 'Date': None})
    plt.close(fig)
    (ROOT / 'forecast_comparison.svg').write_text(
        '\n'.join(line.rstrip() for line in svg.getvalue().splitlines()) + '\n', encoding='utf-8',
    )
    with (series / 'selected_window_metrics.csv').open('w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, lineterminator='\n')
        writer.writerow(('dataset', 'backbone', 'variable', 'mse_cw', 'mse_without_cw', 'mae_cw', 'mae_without_cw'))
        writer.writerows(scores)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font', help='Path to a Chinese font file (default uses fontconfig resolution)')
    args = parser.parse_args()
    default = font_manager.findfont('Noto Sans CJK SC', fallback_to_default=False) if not args.font else args.font
    render(default)
