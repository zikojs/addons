import { writeFileSync, existsSync, mkdirSync } from 'fs'
import * as Lucide from 'lucide'
import { children2component } from './utils/index.js'

const defaultProps = JSON.stringify(
  {
    viewBox: "0 0 24 24",
    fill: "none",
    width: 24,
    height: 24,
    stroke: "green",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  },
  null,
  9
)

const DUPLICATED = [
  'ArrowDownAz', 'ArrowDownZa', 'ArrowUpAz', 'ArrowUpZa',
  'Axis3d','FileAxis3d','Grid2x2','Grid2x2X','Grid3x3',
  'Move3d','Rotate3d','Scale3d',
  'Grid2x2Check','Grid2x2Plus' //Why ?
]

const generate_component = (Icon_name, items) => {
  return `
import { tags } from 'ziko/dom';
const { svg } = tags;
export const ${Icon_name} = (props) => 
    svg(
        {
            ...${defaultProps.slice(0, -2)}
        },
        ...props
    },
    ${items}
)
export default ${Icon_name};
`.trimStart()
}

function generate() {
  const NOT_ICONS = ['createElement', 'creatIcons', 'default', 'icons']
  const Icons = [
    ...new Set(Object.keys(Lucide).filter(n => ![...NOT_ICONS, ...DUPLICATED].includes(n)))
  ]

  // ✅ ensure folder exists
  const iconsDir = './generated-src/icons'
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true })
  }

  const _exports = new Set()

  for (let i = 0; i < Icons.length; i++) {
    let items = children2component(Lucide[Icons[i]])
    if (items === -1) continue

    items = items.join(',\n\t')
    _exports.add(`export { ${Icons[i]} } from './icons/${Icons[i]}.js'`)

    writeFileSync(`${iconsDir}/${Icons[i]}.js`, generate_component(Icons[i], items))
  }

  writeFileSync('./generated-src/index.js', [..._exports].join('\n'))
}

generate()
