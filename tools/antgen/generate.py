# tools/antgen/generate.py
# 3D 兰顿蚂蚁数据生成器（v3 机制：持久朝向 + 独立 2D 世界驱动）
# 确定性：相同参数 = 相同字节输出，可随时重新生成替换
#
# 用法:
#   python generate.py --mode two_random --seed 42 --steps 8000 --k 5 \
#       --out ../../public/data --name ant_v3a
#
# 输出:
#   <out>/<name>_path.csv     主蚂蚁轨迹 (x,y,z)，Web 端直接使用
#   <out>/<name>_pattern.csv  访问过的 3D 格 (x,y,z,color)，渲染素材

import argparse
import csv
import os
import random

RANGE = 64
SIZE = 2 * RANGE + 1

DU = [(1, 0), (0, -1), (-1, 0), (0, 1)]
WORLD_DELTA = [
    [(1, 0, 0), (0, -1, 0), (-1, 0, 0), (0, 1, 0)],   # xy: u->x, v->y
    [(1, 0, 0), (0, 0, -1), (-1, 0, 0), (0, 0, 1)],   # xz: u->x, v->z
    [(0, 1, 0), (0, 0, -1), (0, -1, 0), (0, 0, 1)],   # yz: u->y, v->z
]
PROJ = [lambda x, y, z: (x, y),
        lambda x, y, z: (x, z),
        lambda x, y, z: (y, z)]


def simulate(mode, seed, steps, k_crawl):
    """返回 (path, pattern)。path: [(x,y,z)] 世界坐标轨迹；
    pattern: [(x,y,z,color)] 访问过的格子及最终颜色。"""
    random.seed(seed)
    grids = [[[0] * SIZE for _ in range(SIZE)] for _ in range(3)]
    final_grid = bytearray(SIZE ** 3)
    visited = bytearray(SIZE ** 3)
    headings = [random.randint(0, 3) for _ in range(3)]  # 持久朝向，仅初始化一次

    cx = cy = cz = RANGE
    path = [(0, 0, 0)]
    for _ in range(steps):
        planes = [0, 1, 2] if mode == "all_three" else random.sample([0, 1, 2], 2)
        drive = [0, 0, 0]
        for p in planes:
            grid = grids[p]
            u, v = PROJ[p](cx, cy, cz)
            u = min(max(u, 0), SIZE - 1)
            v = min(max(v, 0), SIZE - 1)
            d = headings[p]
            for kk in range(k_crawl):
                color = grid[u][v]
                d = (d + (1 if color == 0 else -1)) % 4
                grid[u][v] ^= 1
                du, dv = DU[d]
                u = min(max(u + du, 0), SIZE - 1)
                v = min(max(v + dv, 0), SIZE - 1)
                if kk == 0:
                    dx, dy, dz = WORLD_DELTA[p][d]
                    drive[0] += dx
                    drive[1] += dy
                    drive[2] += dz
            headings[p] = d
        i = (cx * SIZE + cy) * SIZE + cz
        visited[i] = 1
        final_grid[i] ^= 1
        cx = min(max(cx + drive[0], 0), SIZE - 1)
        cy = min(max(cy + drive[1], 0), SIZE - 1)
        cz = min(max(cz + drive[2], 0), SIZE - 1)
        path.append((cx - RANGE, cy - RANGE, cz - RANGE))

    pattern = []
    for i in range(SIZE ** 3):
        if visited[i]:
            pattern.append((i // (SIZE * SIZE) - RANGE,
                            (i // SIZE) % SIZE - RANGE,
                            i % SIZE - RANGE,
                            final_grid[i]))
    return path, pattern


def write_csvs(path, pattern, out_dir, name):
    os.makedirs(out_dir, exist_ok=True)
    path_file = os.path.join(out_dir, f"{name}_path.csv")
    pat_file = os.path.join(out_dir, f"{name}_pattern.csv")
    with open(path_file, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["x", "y", "z"])
        w.writerows(path)
    with open(pat_file, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["x", "y", "z", "color"])
        w.writerows(pattern)
    return path_file, pat_file


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["two_random", "all_three"], required=True)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--steps", type=int, default=8000)
    ap.add_argument("--k", type=int, default=5, help="每只蚂蚁每次迭代的爬行步数")
    ap.add_argument("--out", default="../../public/data", help="输出目录")
    ap.add_argument("--name", default=None, help="文件前缀，默认含全部参数")
    args = ap.parse_args()
    name = args.name or f"ant_{args.mode}_s{args.seed}_n{args.steps}_k{args.k}"
    path, pattern = simulate(args.mode, args.seed, args.steps, args.k)
    pf, cf = write_csvs(path, pattern, args.out, name)
    print(f"[{name}] path={len(path)} points -> {pf}")
    print(f"[{name}] pattern={len(pattern)} cells -> {cf}")


if __name__ == "__main__":
    main()
