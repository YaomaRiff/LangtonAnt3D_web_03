#!/usr/bin/env node
// snapshot.mjs
// 生成当前项目的 Markdown 快照：A. 目录树 + B. 文件内容（按相对路径排序）
// 默认只收集：.js,.mjs,.json,.css,.html；强制排除 package-lock.json
// 用法：node tools/snapshot.mjs --root . --out snapshot.md
// 可选：--ext ".js,.mjs,.json,.css,.html" --ignore "node_modules,.git,dist,build,.cache" --maxSize 200000

import fs from 'fs';
import path from 'path';

const CWD = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map(s => {
    const m = s.match(/^--([^=]+)=(.+)$/);
    return m ? [m[1], m[2]] : [s.replace(/^--/, ''), true];
  })
);

const ROOT = path.resolve(CWD, args.root && args.root !== true ? args.root : '.');
const OUT  = path.resolve(CWD, args.out  && args.out  !== true ? args.out  : 'snapshot.md');

const DEFAULT_EXT = '.js,.ts,.mjs,.json,.css,.html,.frag,.vert';
const EXT_LIST = String(args.ext || DEFAULT_EXT).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

const DEFAULT_IGNORE = 'node_modules,.git,.hg,.svn,dist,build,out,.cache,.parcel-cache,.turbo,.next,.nuxt,.DS_Store';
const IGNORE_DIRS = new Set(String(args.ignore || DEFAULT_IGNORE).split(',').map(s => s.trim()).filter(Boolean));

// 强制排除的文件（不随 --ignore 变化）
const FORCE_EXCLUDE_FILES = new Set(['package-lock.json']);

const MAX_SIZE = Number(args.maxSize || 200000); // 单文件最大读取字节
const MAX_FILES = Number(args.maxFiles || 2000); // 最大文件数保护
const SNAP_TIME = new Date().toISOString().replace('T', ' ').slice(0, 19);

const LANG_MAP = new Map(Object.entries({
  js:'javascript', mjs:'javascript', json:'json', css:'css', html:'html'
}));

const statSafe = p => { try { return fs.statSync(p); } catch { return null; } };

function rel(p) { return path.relative(ROOT, p).replaceAll('\\', '/'); }

function shouldIgnoreDirent(name) {
  return IGNORE_DIRS.has(name) || name === '.DS_Store';
}

function hasAllowedExt(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ext && EXT_LIST.includes(ext);
}

function* walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (IGNORE_DIRS.has(it.name)) continue;
      yield* walk(p);
    } else if (it.isFile()) {
      if (FORCE_EXCLUDE_FILES.has(it.name)) continue;      // 强排除
      if (hasAllowedExt(it.name)) yield p;
    }
  }
}

function makeTree(dir, prefix = '') {
  // 只展示允许后缀的文件；目录若空则不展示
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => !shouldIgnoreDirent(d.name))
    .sort((a,b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  const lines = [];
  items.forEach((it, idx) => {
    const last = idx === items.length - 1;
    const pointer = last ? '└─ ' : '├─ ';
    const p = path.join(dir, it.name);

    if (it.isDirectory()) {
      const subtree = makeTree(p, prefix + (last ? '   ' : '│  '));
      if (subtree.length) {
        lines.push(prefix + pointer + it.name + '/');
        lines.push(...subtree);
      }
    } else if (it.isFile()) {
      if (FORCE_EXCLUDE_FILES.has(it.name)) return;
      if (hasAllowedExt(it.name)) lines.push(prefix + pointer + it.name);
    }
  });
  return lines;
}

function readFileSmart(p) {
  const st = statSafe(p);
  if (!st) return { truncated:false, body:'' };
  if (st.size <= MAX_SIZE) {
    return { truncated:false, body: fs.readFileSync(p, 'utf8') };
  }
  const fd = fs.openSync(p, 'r');
  const slice = Math.min(MAX_SIZE, st.size);
  const buf = Buffer.alloc(slice);
  fs.readSync(fd, buf, 0, slice, 0);
  fs.closeSync(fd);
  const notice = `/* NOTE: file too large (${st.size} bytes). Showing first ${slice} bytes. */\n`;
  return { truncated:true, body: notice + buf.toString('utf8') };
}

function fenceLang(p) {
  const ext = path.extname(p).toLowerCase().replace('.', '');
  return LANG_MAP.get(ext) || '';
}

// -------- 主流程 --------
(function main() {
  if (!statSafe(ROOT)?.isDirectory()) {
    console.error(`[snapshot] Root not found or not a directory: ${ROOT}`);
    process.exit(1);
  }

  // 收集文件
  const files = [];
  let count = 0;
  for (const p of walk(ROOT)) {
    files.push(p);
    count++;
    if (count >= MAX_FILES) break;
  }

  // 目录树
  const treeLines = [ path.basename(ROOT) + '/', ...makeTree(ROOT) ];

  // 文件正文（按相对路径排序）
  files.sort((a,b) => rel(a).localeCompare(rel(b)));
  const chunks = files.map(absPath => {
    const rp = rel(absPath);
    const { truncated, body } = readFileSmart(absPath);
    const lang = fenceLang(absPath);
    const title = `### ${rp}${truncated ? ' (truncated)' : ''}`;
    return [
      title,
      '',
      '```' + (lang ? lang : ''),
      body.replace(/\uFEFF/g, ''), // 去 BOM
      '```',
      ''
    ].join('\n');
  });

  // 生成 Markdown
  const md = [
    `# Project Snapshot`,
    `- Root: \`${rel(ROOT) || '.'}\``,
    `- Created: ${SNAP_TIME}`,
    `- Files: ${files.length} (ext=[${EXT_LIST.join(', ')}], maxSize=${MAX_SIZE}B)`,
    `- Force-Excluded: package-lock.json`,
    '',
    '---',
    '## A. Directory Tree',
    '```text',
    treeLines.join('\n'),
    '```',
    '',
    '---',
    '## B. Files (selected types only)',
    '',
    chunks.join('\n')
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, md, 'utf8');

  console.log(`[snapshot] Done: ${rel(OUT)} (${files.length} files)`);
})();
