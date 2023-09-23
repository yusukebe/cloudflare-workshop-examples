import { Hono } from 'hono'
import { Router } from 'itty-router'
import { run, bench, group } from 'mitata'

const regExp = new RegExp(/\/posts\/([^\/]+)/)

const appFetch = {
  fetch: async (req: Request) => {
    const url = new URL(req.url)
    const match = url.pathname.match(regExp)
    if (match) {
      const id = match[1]
      const page = url.searchParams.get('page')
      return new Response(`${page} of ${id}`)
    }
    return new Response('Not Found', {
      status: 404,
    })
  },
}

const appHono = new Hono()
appHono.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  const page = c.req.query('page')
  return c.text(`${page} of ${id}`)
})

const ittyRouter = Router()
ittyRouter.get('/posts/:id', ({ params, query }) => {
  const { page } = query
  return new Response(`${page} of ${params.id}`)
})
ittyRouter.all(
  '*',
  () =>
    new Response('Not Found', {
      status: 404,
    })
)
const ittyApp = {
  fetch: (req: Request) => ittyRouter.handle(req),
}

bench('noop', () => {})

group({ name: 'Get /posts/123?page=1' }, () => {
  const request = new Request('http://localhost/posts/123?page=1')
  bench('fetch', async () => {
    await appFetch.fetch(request)
  })

  bench('Hono', async () => {
    await appHono.fetch(request)
  })

  bench('itty-router', async () => {
    await ittyApp.fetch(request)
  })
})

await run()
