/**
 * 压缩 public/assets 下的 PNG：按用途缩小尺寸并转为 WebP。
 * 用法：npm run optimize:images
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(__dirname, '../public/assets')
const WEBP_QUALITY = 80

/** 按相对路径决定最长边上限（像素） */
function maxEdgeFor(relPath) {
  const name = path.basename(relPath).toLowerCase()
  const dir = path.dirname(relPath).replace(/\\/g, '/')

  // 顶部小图标：界面约 40px
  if (['pause.png', 'continue.png', 'double_speed.png', 'origin_speed.png'].includes(name)) {
    return 128
  }

  // 侧边栏：显示宽约 180
  if (name.startsWith('sidebar')) {
    return 360
  }

  // 按钮
  if (['select_btn.png', 'select_btn2.png', 'back_btn.png', 'level_btn.png'].includes(name)) {
    return 512
  }

  // 基地 / 路径砖
  if (['monstor_home.png', 'player_home.png', 'slate.png'].includes(name)) {
    return 256
  }

  // 背景 / 面板
  if (
    ['menu_bg.png', 'game_bg.png', 'game_bg1.png', 'background.png', 'panel.png', 'dialog_bg.png'].includes(
      name,
    )
  ) {
    return 1280
  }

  // 炮管细长图：限制最长边
  if (name === 'cannon_barrel.png') {
    return 512
  }

  // 塔 / 怪 / 子弹
  if (dir === 'towers' || dir === 'monsters' || dir === 'bullets') {
    return 256
  }

  // 默认
  return 1024
}

async function collectPngs(dir, base = dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectPngs(full, base)))
    } else if (entry.name.toLowerCase().endsWith('.png')) {
      files.push({ full, rel: path.relative(base, full) })
    }
  }
  return files
}

async function optimizeOne({ full, rel }) {
  const maxEdge = maxEdgeFor(rel)
  const outPath = full.replace(/\.png$/i, '.webp')

  const image = sharp(full)
  const meta = await image.metadata()
  const w = meta.width || 0
  const h = meta.height || 0
  const longest = Math.max(w, h)

  let pipeline = sharp(full)
  if (longest > maxEdge) {
    pipeline = pipeline.resize({
      width: w >= h ? maxEdge : undefined,
      height: h > w ? maxEdge : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  await pipeline.webp({ quality: WEBP_QUALITY, alphaQuality: 90 }).toFile(outPath)
  await fs.unlink(full)

  const outStat = await fs.stat(outPath)
  return {
    rel,
    from: `${w}x${h}`,
    maxEdge,
    outBytes: outStat.size,
  }
}

async function main() {
  const pngs = await collectPngs(ASSETS_DIR)
  if (pngs.length === 0) {
    console.log('没有找到 PNG，可能已经优化过了。')
    return
  }

  let totalBefore = 0
  for (const { full } of pngs) {
    totalBefore += (await fs.stat(full)).size
  }

  console.log(`开始优化 ${pngs.length} 张 PNG…`)
  const results = []
  for (const item of pngs) {
    const before = (await fs.stat(item.full)).size
    const result = await optimizeOne(item)
    results.push({ ...result, before })
    const saved = ((1 - result.outBytes / before) * 100).toFixed(0)
    console.log(
      `  ${result.rel}: ${result.from} → max ${result.maxEdge} | ${(before / 1024).toFixed(0)}KB → ${(result.outBytes / 1024).toFixed(0)}KB (−${saved}%)`,
    )
  }

  const totalAfter = results.reduce((s, r) => s + r.outBytes, 0)
  console.log(
    `\n完成：${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB（节省 ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%）`,
  )
  console.log('请确认代码中的 .png 引用已改为 .webp')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
