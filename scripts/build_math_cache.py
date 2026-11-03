#!/usr/bin/env python3
"""
============================================================================
@file scripts/build_math_cache.py
@description Scans all decks (`decks/*/content.js` and `decks/*/visuals.js`)
             for inline `$latex$`, `chainLatex`, `chainDim`, and `svgTex(...)`
             expressions, compiles any missing TeX formulas to vector SVG via
             `latex` + `dvisvgm --no-fonts`, and writes complete offline caches
             to `decks/*/math-cache.js`.
============================================================================
"""

import json
import os
import re
import subprocess
import tempfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DECKS_DIR = ROOT_DIR / 'decks'


def load_existing_cache(cache_file: Path) -> dict:
    if not cache_file.exists():
        return {}
    raw = cache_file.read_text(encoding='utf-8')
    if '=' not in raw:
        return {}
    rhs = raw.split('=', 1)[1].strip().rstrip(';').strip()
    # Handle chained assignment like window.PresentationMathSvgs = window.AURORA_MATH_SVGS = {...}
    while rhs.startswith('window.'):
        rhs = rhs.split('=', 1)[1].strip()
    try:
        return json.loads(rhs)
    except Exception:
        return {}


def extract_formulas_from_deck(deck_dir: Path) -> set:
    formulas = set()
    content_file = deck_dir / 'content.js'
    visuals_file = deck_dir / 'visuals.js'

    if content_file.exists():
        c_text = content_file.read_text(encoding='utf-8')
        # Extract JS string literals from content.js using node or regex
        # Use node to evaluate content.js safely and walk all strings!
        node_script = f"""
        global.window = {{}};
        require({json.dumps(str(content_file))});
        const data = window.PresentationContent || window.AuroraContent;
        const out = [];
        function walk(obj, keyName) {{
          if (!obj) return;
          if (typeof obj === 'string') {{
            if (keyName === 'chainDim' || keyName === 'chainLatex') {{
              out.push({{ type: 'raw', val: obj }});
            }} else {{
              const matches = [...obj.matchAll(/\\$([^$]+)\\$/g)];
              for (const m of matches) out.push({{ type: 'inline', val: m[1].trim() }});
            }}
          }} else if (Array.isArray(obj)) {{
            for (const item of obj) walk(item, keyName);
          }} else if (typeof obj === 'object') {{
            for (const [k, v] of Object.entries(obj)) walk(v, k);
          }}
        }}
        walk(data, '');
        console.log(JSON.stringify(out));
        """
        res = subprocess.run(['node', '-e', node_script], capture_output=True, text=True, check=True)
        items = json.loads(res.stdout.strip())
        for item in items:
            formulas.add(item['val'])

    if visuals_file.exists():
        v_text = visuals_file.read_text(encoding='utf-8')
        node_vis_script = f"""
        global.window = {{}};
        require({json.dumps(str(visuals_file))});
        const vis = window.PresentationVisuals || window.AuroraVisuals || {{}};
        const out = [];
        for (const svg of Object.values(vis)) {{
          if (typeof svg !== 'string') continue;
          const matches = [...svg.matchAll(/data-latex="([^"]+)"/g)];
          for (const m of matches) {{
            out.push(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
          }}
        }}
        console.log(JSON.stringify(out));
        """
        # Make sure aurora visuals are loaded first if component-showcase references them
        aurora_vis = DECKS_DIR / 'aurora' / 'visuals.js'
        if deck_dir.name != 'aurora' and aurora_vis.exists():
            node_vis_script = f"global.window = {{}}; require({json.dumps(str(aurora_vis))});\n" + node_vis_script
        res = subprocess.run(['node', '-e', node_vis_script], capture_output=True, text=True, check=True)
        for f in json.loads(res.stdout.strip()):
            formulas.add(f)

    return formulas


def compile_latex_to_svg(latex_str: str, uid_prefix: str) -> str:
    tex_doc = r"""\documentclass[12pt]{article}
\usepackage{amsmath,amssymb,amsfonts,bm}
\pagestyle{empty}
\begin{document}
$\textstyle """ + latex_str + r"""$
\end{document}
"""
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_path = Path(tmpdir) / 'eq.tex'
        dvi_path = Path(tmpdir) / 'eq.dvi'
        svg_path = Path(tmpdir) / 'eq.svg'
        tex_path.write_text(tex_doc, encoding='utf-8')

        subprocess.run(
            ['latex', '-interaction=nonstopmode', '-halt-on-error', 'eq.tex'],
            cwd=tmpdir, capture_output=True, text=True, check=True
        )
        subprocess.run(
            ['dvisvgm', '--no-fonts', '--exact', '-o', 'eq.svg', 'eq.dvi'],
            cwd=tmpdir, capture_output=True, text=True, check=True
        )
        svg = svg_path.read_text(encoding='utf-8')
        # Strip XML header and doctype
        svg = re.sub(r'<\?xml[^>]*\?>\s*', '', svg)
        svg = re.sub(r'<!DOCTYPE[^>]*>\s*', '', svg)
        # Add class="offline-tex-svg" fill="currentColor" to <svg>
        svg = re.sub(
            r'<svg\b',
            '<svg class="offline-tex-svg" fill="currentColor"',
            svg,
            count=1
        )
        # Prefix all id="..." and xlink:href="#..." to avoid DOM ID collisions
        svg = re.sub(r"\bid='([^']+)'", lambda m: f"id='{uid_prefix}_{m.group(1)}'", svg)
        svg = re.sub(r'\bid="([^"]+)"', lambda m: f'id="{uid_prefix}_{m.group(1)}"', svg)
        svg = re.sub(r"xlink:href='#([^']+)'", lambda m: f"xlink:href='#{uid_prefix}_{m.group(1)}'", svg)
        svg = re.sub(r'xlink:href="#([^"]+)"', lambda m: f'xlink:href="#{uid_prefix}_{m.group(1)}"', svg)
        return svg.strip()


def main():
    master_cache = load_existing_cache(DECKS_DIR / 'aurora' / 'math-cache.js')
    print(f'[build_math_cache] Loaded {len(master_cache)} existing cached formulas.')

    all_needed = set()
    deck_names = ['aurora', 'component-showcase', 'paper-template']
    for dname in deck_names:
        ddir = DECKS_DIR / dname
        if ddir.exists():
            fset = extract_formulas_from_deck(ddir)
            print(f'[build_math_cache] Deck "{dname}" uses {len(fset)} unique TeX formulas.')
            all_needed |= fset

    missing = sorted(f for f in all_needed if f not in master_cache)
    print(f'[build_math_cache] Compiling {len(missing)} new TeX formulas via latex + dvisvgm...')

    for idx, expr in enumerate(missing, start=len(master_cache) + 1):
        svg = compile_latex_to_svg(expr, f'k_new_{idx}')
        master_cache[expr] = svg
        print(f'  + Compiled [{idx}]: {expr}')

    # Write unified cache to all decks so every deck works 100% offline
    js_payload = (
        "// Pre-compiled Computer Modern TeX vector SVGs for 100% offline rendering\n"
        "window.PresentationMathSvgs = window.AURORA_MATH_SVGS = "
        + json.dumps(master_cache, ensure_ascii=False)
        + ";\n"
    )
    for dname in deck_names:
        ddir = DECKS_DIR / dname
        if ddir.exists():
            (ddir / 'math-cache.js').write_text(js_payload, encoding='utf-8')
            print(f'[build_math_cache] Updated {ddir / "math-cache.js"} ({len(master_cache)} total formulas).')


if __name__ == '__main__':
    main()
