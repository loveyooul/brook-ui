import { readdirSync, statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, '..')
const outputPath = `${root}/src/server/static.ts`
const StaticDir = '/dist'

function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

export const bundleStatic = () => {
  let content = '// tslint:disable;\n';

  content += 'interface StaticFile { type: string; value: Uint8Array; }\n'
  content += 'const m:Record<string, StaticFile> = {} as Record<string, StaticFile>;'

  const handle = (path: string) => {
    const pathStat = statSync(path)
  
    if (pathStat.isDirectory()) {
      readdirSync(path).forEach((f) => {
        const p = `${path}/${f}`
        const s = statSync(p)
        const bunFile = Bun.file(p)

  
        if (s.isFile()) {
          const text = readFileSync(p)
          const arrayBuffer = toArrayBuffer(text)
  
          const b = new Uint8Array(arrayBuffer)

          content += `m['${p.replace(root, '')}'] = { type: '${bunFile.type}', value: new Uint8Array([`
  
          for (let i = 0; i < b.length; ++i) content += `${b[i]},`
  
          content += `]),};`
  
          return
        }
  
        handle(p)
      })
    }
  }

  handle(`${root}${StaticDir}`)

  content += 'export default m;'

  Bun.write(outputPath, content)
}

bundleStatic()
