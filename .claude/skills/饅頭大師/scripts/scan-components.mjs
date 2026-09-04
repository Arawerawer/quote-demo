#!/usr/bin/env node
/**
 * 掃描 components/ 底下所有 .vue 檔，重新產生 references/components.md 的元件明細段落。
 *
 * 用法：node .claude/skills/饅頭大師/scripts/scan-components.mjs
 *
 * 只覆寫 <!-- COMPONENTS:START --> 與 <!-- COMPONENTS:END --> 之間的內容，
 * 檔案開頭的反查索引（INDEX 區塊）與手寫的避坑註記會保留。
 *
 * 這是靠正規表示式的粗略解析，不是完整的 Vue SFC parser。
 * 產出結果是「重新校對用的草稿」，複雜元件仍需人工確認。
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const skillDir = resolve(scriptDir, '..')
const projectRoot = resolve(skillDir, '..', '..', '..')
const componentsDir = join(projectRoot, 'components')
const catalogPath = join(skillDir, 'references', 'components.md')

const START_MARK = '<!-- COMPONENTS:START'
const END_MARK = '<!-- COMPONENTS:END -->'

/** 遞迴收集所有 .vue 檔 */
async function collectVueFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectVueFiles(full)))
    } else if (entry.name.endsWith('.vue')) {
      files.push(full)
    }
  }

  return files
}

/**
 * 由檔案路徑推導元件標籤名。
 * components/UI/Form/Input.vue -> UIFormInput
 * components/UI/Grid/Grid.vue  -> UIGrid（Nuxt 會去除重複的相鄰片段）
 */
function resolveComponentName(filePath) {
  const rel = relative(componentsDir, filePath).replace(/\.vue$/, '')
  const segments = rel.split(sep)

  const deduped = []
  for (const segment of segments) {
    if (deduped[deduped.length - 1] !== segment) deduped.push(segment)
  }

  return deduped.join('')
}

/** 抓 <script setup> 區塊內容 */
function extractScript(source) {
  const match = source.match(/<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/)
  return match ? match[1] : ''
}

/**
 * 從指定起點取出配對的括號內容。
 * 解析泛型 <...> 時要跳過箭頭函式的 `=>`，否則 `() => void` 的 `>` 會被誤判成結尾。
 */
function matchBalanced(text, startIndex, open, close) {
  const isGeneric = open === '<'
  let depth = 0

  for (let i = startIndex; i < text.length; i += 1) {
    const char = text[i]

    if (isGeneric && char === '=' && text[i + 1] === '>') {
      i += 1 // 整個 `=>` 一起跳過
      continue
    }

    if (char === open) depth += 1
    else if (char === close) {
      depth -= 1
      if (depth === 0) return text.slice(startIndex + 1, i)
    }
  }
  return ''
}

/** 解析 defineProps 的泛型內容與 withDefaults 的預設值 */
function parseProps(script) {
  const propsIndex = script.search(/defineProps\s*</)
  if (propsIndex === -1) return []

  const genericStart = script.indexOf('<', propsIndex + 'defineProps'.length)
  const body = matchBalanced(script, genericStart, '<', '>')
  if (!body.trim()) return []

  const inner = body.replace(/^\s*\{/, '').replace(/\}\s*$/, '')
  const defaults = parseDefaults(script)

  const props = []
  // 逐行掃，只取頂層 `名稱: 型別` 這種宣告
  let depth = 0
  let buffer = ''

  const flush = () => {
    const line = buffer.trim().replace(/,$/, '')
    buffer = ''
    if (!line || line.startsWith('//')) return

    const match = line.match(/^(\w+)(\?)?\s*:\s*([\s\S]+)$/)
    if (!match) return

    const [, name, optional, type] = match
    props.push({
      name,
      optional: Boolean(optional),
      type: type.trim(),
      default: defaults[name],
    })
  }

  for (const char of inner) {
    if (char === '{' || char === '(' || char === '[') depth += 1
    if (char === '}' || char === ')' || char === ']') depth -= 1

    if ((char === '\n' || char === ';') && depth === 0) {
      flush()
      continue
    }
    buffer += char
  }
  flush()

  return props
}

/** 解析 withDefaults 第二個參數裡的預設值 */
function parseDefaults(script) {
  const index = script.indexOf('withDefaults')
  if (index === -1) return {}

  const callBody = matchBalanced(script, script.indexOf('(', index), '(', ')')
  // 取最後一個 { ... }，即第二個參數
  const lastBrace = callBody.lastIndexOf('{')
  if (lastBrace === -1) return {}

  const defaultsBody = matchBalanced(callBody, lastBrace, '{', '}')
  const result = {}

  let depth = 0
  let buffer = ''

  const flush = () => {
    const line = buffer.trim().replace(/,$/, '')
    buffer = ''
    const match = line.match(/^(\w+)\s*:\s*([\s\S]+)$/)
    if (match) result[match[1]] = match[2].trim()
  }

  for (const char of defaultsBody) {
    if (char === '{' || char === '(' || char === '[') depth += 1
    if (char === '}' || char === ')' || char === ']') depth -= 1
    if (char === '\n' && depth === 0) {
      flush()
      continue
    }
    buffer += char
  }
  flush()

  return result
}

/** 解析 defineModel */
function parseModel(script) {
  const index = script.search(/defineModel\s*</)
  if (index === -1) {
    if (/defineModel\s*\(/.test(script))
      return { type: '未指定型別', options: '' }
    return null
  }

  const genericStart = script.indexOf('<', index + 'defineModel'.length)
  const type = matchBalanced(script, genericStart, '<', '>').trim()

  const parenStart = script.indexOf('(', genericStart)
  const options = matchBalanced(script, parenStart, '(', ')').trim()

  return { type, options }
}

/** 解析 defineEmits 泛型 */
function parseEmits(script) {
  const index = script.search(/defineEmits\s*</)
  if (index === -1) return []

  const genericStart = script.indexOf('<', index + 'defineEmits'.length)
  const body = matchBalanced(script, genericStart, '<', '>')

  return body
    .replace(/^\s*\{/, '')
    .replace(/\}\s*$/, '')
    .split('\n')
    .map((line) => line.trim().replace(/[,;]$/, ''))
    .filter((line) => line && !line.startsWith('//'))
}

/** 從 template 抓 slot 名稱 */
function parseSlots(source) {
  const templateMatch = source.match(/<template>([\s\S]*)<\/template>/)
  if (!templateMatch) return []

  const template = templateMatch[1]
  const slots = new Set()

  for (const match of template.matchAll(/<slot\b([^>]*?)\/?>/g)) {
    const nameMatch = match[1].match(/\bname="([^"]+)"/)
    slots.add(nameMatch ? nameMatch[1] : 'default')
  }

  return [...slots]
}

/** 解析單一元件 */
function parseComponent(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const script = extractScript(source)

  return {
    name: resolveComponentName(filePath),
    path: relative(projectRoot, filePath).split(sep).join('/'),
    props: parseProps(script),
    model: parseModel(script),
    emits: parseEmits(script),
    slots: parseSlots(source),
  }
}

/** 分組：以 components/ 下的第一層＋第二層目錄為組名 */
function groupKey(path) {
  const parts = path.split('/').slice(1, -1) // 去掉 components 與檔名
  if (parts.length === 0) return '根層'
  if (parts[0] === 'Showcase') return 'Showcase'
  return parts.join('/')
}

function formatProps(props) {
  if (props.length === 0) return '- Props：無'

  const parts = props.map((prop) => {
    const required = prop.optional ? '' : '（必填）'
    const fallback =
      prop.default !== undefined ? `（${prop.default}）` : required
    return `\`${prop.name}: ${prop.type}\`${fallback}`
  })

  return `- Props：${parts.join('、')}`
}

function formatComponent(component) {
  const lines = [
    `### \`<${component.name}>\` — \`${component.path}\``,
    '',
    formatProps(component.props),
  ]

  if (component.model) {
    const options = component.model.options
      ? ` — 選項 \`${component.model.options}\``
      : ''
    lines.push(`- v-model：\`${component.model.type}\`${options}`)
  }

  if (component.emits.length > 0) {
    lines.push(`- Emits：${component.emits.map((e) => `\`${e}\``).join('、')}`)
  }

  if (component.slots.length > 0) {
    lines.push(`- Slots：${component.slots.map((s) => `\`${s}\``).join('、')}`)
  }

  lines.push('- 用途：（待補）')
  lines.push('')

  return lines.join('\n')
}

async function main() {
  const files = (await collectVueFiles(componentsDir)).sort()
  const components = files.map(parseComponent)

  const groups = new Map()
  for (const component of components) {
    const key = groupKey(component.path)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(component)
  }

  const sections = [...groups.entries()].map(([name, list]) => {
    const body = list.map(formatComponent).join('\n')
    return `## ${name}（${list.length}）\n\n${body}`
  })

  const generated = [
    `<!-- COMPONENTS:START 由 scan-components.mjs 產生，共 ${components.length} 個元件 -->`,
    '',
    '> ⚠️ 本段為腳本自動產生的草稿：用途說明與避坑註記需人工補回。',
    '',
    sections.join('\n---\n\n'),
    END_MARK,
  ].join('\n')

  const catalog = readFileSync(catalogPath, 'utf8')
  const startIndex = catalog.indexOf(START_MARK)
  const endIndex = catalog.indexOf(END_MARK)

  if (startIndex === -1 || endIndex === -1) {
    console.error(
      `找不到 ${START_MARK} / ${END_MARK} 標記，中止以免覆寫整份目錄。`,
    )
    process.exit(1)
  }

  const updated =
    catalog.slice(0, startIndex) +
    generated +
    catalog.slice(endIndex + END_MARK.length)

  writeFileSync(catalogPath, updated, 'utf8')

  console.log(`掃描完成：${components.length} 個元件`)
  for (const [name, list] of groups) {
    console.log(`  ${name}：${list.length}`)
  }
  console.log(`\n已更新 ${relative(projectRoot, catalogPath)}`)
  console.log('請人工補回各元件的「用途」與避坑註記。')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
