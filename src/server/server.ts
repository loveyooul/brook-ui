import staticFiles from './static.ts'
import { getIp } from './utils/helper.ts';
import { BrookStartDTO, brook } from './brook/index.ts';
import { isUrlMatchPattern, parsePathParams } from './utils/url.ts';

const IndexPath = '/dist/index.html'

export const server = () => {
  Bun.serve({
    port: 8866,
    async fetch(req) {
      const url = new URL(req.url)
      const path = url.pathname;

      if (path.startsWith('/api')) {

        if (req.method === 'POST' && isUrlMatchPattern(path, '/api/start/:key')) {
          const o = parsePathParams('/api/start/:key', path)
          const body = await req.json() as BrookStartDTO

          await brook.start(o.key, body)

          return Response.json({
            data: true,
            code: 0,
          })
        }

        if (req.method === 'POST' && isUrlMatchPattern(path, '/api/stop/:key')) {
          const o = parsePathParams('/api/stop/:key', path)

          await brook.stop(o.key)

          return Response.json({
            data: true,
            code: 0,
          })
        }

        if (req.method === 'POST' && isUrlMatchPattern(path, '/api/remove/:key')) {
          const o = parsePathParams('/api/remove/:key', path)

          await brook.remove(o.key)

          return Response.json({
            data: true,
            code: 0,
          })
        }

        if (req.method === 'POST' && path === '/api/add') {
          brook.add()

          return Response.json({
            data: true,
            code: 0,
          })
        }

        if (req.method === 'GET' && path === '/api/ip') {
          return Response.json({
            data: getIp(),
            code: 0,
          })
        }

        if (req.method === 'GET' && path === '/api/list') {
          return Response.json({
            data: await brook.getBrookList(),
            code: 0,
          })
        }

        if (req.method === 'POST' && isUrlMatchPattern(path, '/api/log/:key')) {
          const o = parsePathParams('/api/log/:key', path)

          return Response.json({
            data: await brook.readLog(o.key),
            code: 0,
          })
        }

        if (req.method === 'POST' && isUrlMatchPattern(path, '/api/link/:key')) {
          const o = parsePathParams('/api/link/:key', path)

          return Response.json({
            data: brook.getLink(o.key),
            code: 0,
          })
        }

        if (req.method === 'POST' && isUrlMatchPattern(path, '/api/mb/:key')) {
          const o = parsePathParams('/api/mb/:key', path)

          return Response.json({
            data: await brook.getMb(o.key),
            code: 0,
          })
        }
      }

      const resourcePath = `/dist${path}`

      if (path === '/' || !staticFiles[resourcePath]) {
        const htmldata = staticFiles[IndexPath]

        return new Response(htmldata.value, { headers: { 'content-type': htmldata.type }});
      }

      const fileData = staticFiles[resourcePath]

      return new Response(fileData.value, { headers: { 'content-type': fileData.type }});
    },
    error (e) {
      return Response.json({
        message: e?.message || e,
        data: null,
        code: 1
      })
    }
  });
}
