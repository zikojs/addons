import { writeFileSync, existsSync, mkdirSync } from 'fs'
import * as Lucide from 'lucide'
import { 
  children2component,
  camel2hyphencase
 } from './utils/index.js'

const defaultProps = (IconName) => JSON.stringify(
  {
    viewBox: "0 0 24 24",
    fill: "none",
    width: 24,
    height: 24,
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-label": camel2hyphencase(IconName)
  },
  null,
  9
).replace(/\n\}/, '\n    }')

const DUPLICATED = [
  // 'ArrowDownAz', 'ArrowDownZa', 'ArrowUpAz', 'ArrowUpZa',
  // 'Axis3d', 'FileAxis3d', 'Grid2x2', 'Grid2x2X', 'Grid3x3',
  // 'Move3d', 'Rotate3d', 'Scale3d',
  // 'Grid2x2Check', 'Grid2x2Plus' //Why ?
]

const createIconComponent = (IconName, items, tagNames) => {
  return `
import { tags } from 'ziko/dom';

const { svg, i, ${tagNames} } = tags;

export const ${IconName} = (props) => i(
  svg(
    {
    ...${defaultProps(IconName)},
    "role" : "img",
    ...props
    },
    ${items}
  )
)

export default ${IconName};
`.trimStart()
}

function generate() {
  const NOT_ICONS = ['createElement', 'creatIcons', 'default', 'icons']

  const Icons = [
    ...new Set(
      Object.keys(Lucide).filter(
        n => ![...NOT_ICONS, ...DUPLICATED].includes(n)
      )
    )
  ]

  const iconsDir = './generated-src/icons'

  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true })
  }

  const _exports = new Set()

  for (let i = 0; i < Icons.length; i++) {
    const result = children2component(Lucide[Icons[i]])

    if (result === -1) continue

    const [items, tags] = result

    const tagNames = [...tags].join(', ')
    const children = items.join(',\n\t')

    _exports.add(
      `export { ${Icons[i]} } from './icons/${Icons[i]}.js'`
    )

    writeFileSync(
      `${iconsDir}/${Icons[i]}.js`,
      createIconComponent(Icons[i], children, tagNames)
    )
  }

  writeFileSync(
    './generated-src/index.js',
    [..._exports].join('\n')
  )
}

generate()