# tools/antgen/regenerate_all.py
# 一键重建全部数据集并刷新 public/data/manifest.json
# 清单格式与 web 端 data-sys._loadAvailableDatasets 完全一致:
#   [{name, path, description}, ...]
# Web 端无需任何改动：重新加载页面即看到新数据集。

import json
import os

from generate import simulate, write_csvs

# 数据集注册表：要新增/替换数据集，改这里然后运行本脚本
DATASETS = [
    dict(mode="two_random", seed=42, steps=8000, k=5,
         name="ant_v3a_s42_n8000_k5",
         description="v3a: persistent heading, 2 random planes"),
    dict(mode="all_three", seed=42, steps=8000, k=5,
         name="ant_v3b_s42_n8000_k5",
         description="v3b: persistent heading, all 3 planes"),
]

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "public", "data")


def main():
    manifest = []
    for ds in DATASETS:
        path, pattern = simulate(ds["mode"], ds["seed"], ds["steps"], ds["k"])
        write_csvs(path, pattern, OUT_DIR, ds["name"])
        manifest.append({
            "name": ds["name"],
            "path": f"data/{ds['name']}_path.csv",
            "description": ds["description"],
        })
        print(f"[ok] {ds['name']}: {len(path)} points, {len(pattern)} cells")
    manifest_path = os.path.join(OUT_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"[ok] manifest -> {manifest_path} ({len(manifest)} entries)")


if __name__ == "__main__":
    main()
